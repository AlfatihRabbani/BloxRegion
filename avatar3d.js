/*
 * BloxRegion — 3D avatar for the ViewPort
 *
 * Loads the player's 3D avatar from Roblox (the OBJ, MTL and textures behind Roblox's
 * own 3D viewer) and draws it with a small WebGL renderer, posed like the player in
 * Minecraft's inventory: the head looks at the cursor, the body turns part of the way and
 * the legs stay planted, each piece moving whole. The last avatar loaded is kept in
 * storage, ready for the next page. viewport.js keeps the 2D bust if anything here fails.
 */
(() => {
	'use strict';

	if (window.top !== window || window.__brAvatar3d) return;

	const sleep = ms => new Promise(r => setTimeout(r, ms));
	const DEG = Math.PI / 180;

	// ---------------------------------------------------------------------------
	// Fetching
	// ---------------------------------------------------------------------------

	// The avatar's 3D render: a JSON file on the CDN naming the OBJ, MTL and textures.
	async function modelUrl(userId) {
		for (let attempt = 0; attempt < 6; attempt++) {
			const res = await fetch(`https://thumbnails.roblox.com/v1/users/avatar-3d?userId=${encodeURIComponent(userId)}`, { credentials: 'include' });
			if (!res.ok) return null;
			const d = await res.json();
			if (d && d.state === 'Completed' && /^https:\/\/[a-z0-9.-]+\.rbxcdn\.com\//i.test(d.imageUrl || '')) return d.imageUrl;
			// Renders are made on demand and come back as Pending for a moment.
			if (!d || d.state !== 'Pending') return null;
			await sleep(1500 + attempt * 500);
		}
		return null;
	}

	// Files are addressed by hash: current ones live on tr.rbxcdn.com, older ones on
	// t0–t7.rbxcdn.com, picked by XOR-ing the hash's characters.
	function cdnUrls(hash) {
		const xor = n => {
			let i = 31;
			for (let t = 0; t < Math.min(n, hash.length); t++) i ^= hash.charCodeAt(t);
			return `https://t${i % 8}.rbxcdn.com/${hash}`;
		};
		return [...new Set([`https://tr.rbxcdn.com/${hash}`, xor(32), xor(hash.length)])];
	}
	// A file hash from the 3D JSON or an MTL line (which may carry options and a path).
	const cleanHash = v => {
		const hash = String(v || '').trim().split(/\s+/).pop().split(/[\\/]/).pop();
		return /^[A-Za-z0-9._-]{8,200}$/.test(hash) ? hash : null;
	};
	// The texture an MTL line points at: one of the render's listed textures when the line
	// contains it, otherwise whatever hash the line ends with.
	function textureHash(value, known) {
		const v = String(value || '');
		for (const hash of known) if (v.includes(hash)) return hash;
		return cleanHash(v);
	}

	const warn = (...args) => console.warn('[BloxRegion] 3D avatar:', ...args);

	async function cdn(hash, read) {
		let why = 'not found';
		for (const url of cdnUrls(hash)) {
			try {
				const res = await fetch(url, { credentials: 'omit' });
				if (res.ok) return await read(res);
				why = 'HTTP ' + res.status;
			} catch (e) {
				why = (e && e.message) || String(e);
			}
		}
		throw new Error(why);
	}
	const cdnText = hash => cdn(hash, res => res.text());
	// Textures are kept as their bytes: they're decoded when drawn (see decodeImage), and
	// stored with the avatar for the next page.
	const cdnBytes = hash => cdn(hash, res => res.arrayBuffer());

	// The CDN's content types aren't always image types; name the format from its bytes.
	function imageType(bytes) {
		const b = new Uint8Array(bytes, 0, Math.min(12, bytes.byteLength));
		if (b[0] === 0x89 && b[1] === 0x50) return 'image/png';
		if (b[0] === 0xff && b[1] === 0xd8) return 'image/jpeg';
		if (b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50) return 'image/webp';
		if (b[0] === 0x47 && b[1] === 0x49) return 'image/gif';
		return 'image/png';
	}

	// Firefox counts any image an add-on makes as foreign to the page, even one from a data:
	// URL: WebGL refuses it ("The operation is insecure") and a canvas it's drawn on can't be
	// read. A bitmap decoded from bytes the add-on fetched itself is the page's to use.
	function decodeImage(bytes) {
		return createImageBitmap(new Blob([bytes], { type: imageType(bytes) }), { premultiplyAlpha: 'none' });
	}

	// ---------------------------------------------------------------------------
	// Parsing
	// ---------------------------------------------------------------------------

	function parseMtl(text) {
		const mats = {};
		let cur = null;
		for (const raw of text.split(/\r?\n/)) {
			const line = raw.trim();
			if (!line || line[0] === '#') continue;
			const i = line.indexOf(' ');
			const key = (i < 0 ? line : line.slice(0, i)).toLowerCase();
			const val = i < 0 ? '' : line.slice(i + 1).trim();
			if (key === 'newmtl') cur = mats[val] = {};
			else if (cur) cur[key] = val;
		}
		return mats;
	}

	// Triangles grouped by object and material, interleaved as
	// position (3), normal (3), uv (2), colour (4). Works in short slices so a big avatar
	// never holds up the page.
	//
	// Each triangle also gets the piece it belongs to: the connected mesh (head, hair, an
	// arm...), with vertices at the same spot counted as one, since files often repeat them
	// along seams and hard edges.
	const STRIDE = 12;
	async function parseObj(text) {
		const P = [], N = [], T = [], C = [];
		const groups = new Map();
		let name = '', material = '', group = null, hasAlpha = false;
		const corner = [];
		const spot = new Map(), spotOf = [], parent = [];
		const find = i => {
			while (parent[i] !== i) i = parent[i] = parent[parent[i]];
			return i;
		};
		const weld = v => {
			if (spotOf[v] === undefined) {
				// To the millimetre, packed into one exact number (±65 studs on each axis).
				const q = k => Math.min(131071, Math.max(0, Math.round(P[v * 3 + k] * 1000) + 65536));
				const key = (q(0) * 131072 + q(1)) * 131072 + q(2);
				let id = spot.get(key);
				if (id === undefined) {
					spot.set(key, id = parent.length);
					parent.push(id);
				}
				spotOf[v] = id;
			}
			return spotOf[v];
		};
		let pos = 0, lines = 0, deadline = performance.now() + 8;
		while (pos < text.length) {
			let end = text.indexOf('\n', pos);
			if (end < 0) end = text.length;
			const line = text.slice(pos, end).trim();
			pos = end + 1;
			if (++lines % 512 === 0 && performance.now() > deadline) {
				await sleep(0);
				deadline = performance.now() + 8;
			}
			const c0 = line.charCodeAt(0), c1 = line.charCodeAt(1);
			if (c0 === 118 && c1 === 32) { // v
				const p = line.split(/\s+/);
				P.push(+p[1], +p[2], +p[3]);
				if (p.length >= 7) {
					const a = p.length >= 8 ? +p[7] : 1;
					if (a < 1) hasAlpha = true;
					C.push(+p[4], +p[5], +p[6], a);
				} else {
					C.push(1, 1, 1, 1);
				}
			} else if (c0 === 118 && c1 === 116) { // vt
				const p = line.split(/\s+/);
				T.push(+p[1], +p[2]);
			} else if (c0 === 118 && c1 === 110) { // vn
				const p = line.split(/\s+/);
				N.push(+p[1], +p[2], +p[3]);
			} else if ((c0 === 111 || c0 === 103) && c1 === 32) { // o, g
				name = line.slice(2).trim();
				group = null;
			} else if (line.startsWith('usemtl ')) {
				material = line.slice(7).trim();
				group = null;
			} else if (c0 === 102 && c1 === 32) { // f
				if (!group) {
					const key = name + '\u0000' + material;
					group = groups.get(key);
					if (!group) groups.set(key, group = { name, material, data: [], pieces: [], alpha: false });
				}
				const toks = line.slice(2).trim().split(/\s+/);
				corner.length = 0;
				for (const tok of toks) {
					const [vs, ts, ns] = tok.split('/');
					let v = parseInt(vs, 10), t = parseInt(ts, 10), n = parseInt(ns, 10);
					v = v < 0 ? P.length / 3 + v : v - 1;
					t = Number.isNaN(t) ? -1 : t < 0 ? T.length / 2 + t : t - 1;
					n = Number.isNaN(n) ? -1 : n < 0 ? N.length / 3 + n : n - 1;
					corner.push(v, t, n);
				}
				if (corner[0] < 0 || corner[0] * 3 + 2 >= P.length) continue;
				const root = find(weld(corner[0]));
				for (let k = 3; k < corner.length; k += 3) {
					if (corner[k] >= 0 && corner[k] * 3 + 2 < P.length) {
						const other = find(weld(corner[k]));
						if (other !== root) parent[other] = find(root);
					}
				}
				for (let k = 1; k + 1 < corner.length / 3; k++) {
					emit(group, P, N, T, C, corner, 0, k, k + 1);
					group.pieces.push(spotOf[corner[0]]);
				}
				if (hasAlpha) for (let k = 0; k < corner.length; k += 3) if (C[corner[k] * 4 + 3] < 1) group.alpha = true;
			}
		}
		// Pieces numbered 0, 1, 2... across all groups.
		const number = new Int32Array(parent.length).fill(-1);
		let pieces = 0;
		const pieceOf = p => {
			const root = find(p);
			if (number[root] < 0) number[root] = pieces++;
			return number[root];
		};
		return [...groups.values()].filter(g => g.data.length).map(g => ({
			name: g.name, material: g.material, alpha: g.alpha, data: new Float32Array(g.data),
			pieces: Int32Array.from(g.pieces, pieceOf)
		}));
	}

	// One triangle, with a flat normal where the file has none.
	function emit(group, P, N, T, C, corner, a, b, c) {
		const idx = [a, b, c];
		let fn = null;
		if (idx.some(i => corner[i * 3 + 2] < 0 || corner[i * 3 + 2] * 3 + 2 >= N.length)) {
			const p = idx.map(i => corner[i * 3] * 3);
			const ux = P[p[1]] - P[p[0]], uy = P[p[1] + 1] - P[p[0] + 1], uz = P[p[1] + 2] - P[p[0] + 2];
			const vx = P[p[2]] - P[p[0]], vy = P[p[2] + 1] - P[p[0] + 1], vz = P[p[2] + 2] - P[p[0] + 2];
			const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
			const len = Math.hypot(nx, ny, nz) || 1;
			fn = [nx / len, ny / len, nz / len];
		}
		const d = group.data;
		for (const i of idx) {
			const v = corner[i * 3], t = corner[i * 3 + 1], n = corner[i * 3 + 2];
			d.push(P[v * 3], P[v * 3 + 1], P[v * 3 + 2]);
			if (fn) d.push(fn[0], fn[1], fn[2]);
			else d.push(N[n * 3], N[n * 3 + 1], N[n * 3 + 2]);
			if (t >= 0 && t * 2 + 1 < T.length) d.push(T[t * 2], T[t * 2 + 1]);
			else d.push(0, 0);
			d.push(C[v * 4], C[v * 4 + 1], C[v * 4 + 2], C[v * 4 + 3]);
		}
	}

	// ---------------------------------------------------------------------------
	// Finding the head
	// ---------------------------------------------------------------------------

	function bounds(data) {
		const b = { min: [Infinity, Infinity, Infinity], max: [-Infinity, -Infinity, -Infinity], sum: [0, 0, 0], n: 0 };
		for (let i = 0; i < data.length; i += STRIDE) {
			for (let k = 0; k < 3; k++) {
				const v = data[i + k];
				if (v < b.min[k]) b.min[k] = v;
				if (v > b.max[k]) b.max[k] = v;
				b.sum[k] += v;
			}
			b.n++;
		}
		b.center = b.sum.map(s => s / Math.max(1, b.n));
		return b;
	}

	// Which way each piece moves: it turns with the head, turns with the body, or stays put
	// with the legs. Pieces move whole, so nothing bends.
	const LEGS = 0, BODY = 1, HEAD = 2;

	// Works out where the neck and hips are, to frame head and shoulders and to sort the
	// pieces into head, body and legs.
	async function analyse(groups) {
		for (const g of groups) g.box = bounds(g.data);
		const all = { min: [0, 1, 2].map(k => Math.min(...groups.map(g => g.box.min[k]))), max: [0, 1, 2].map(k => Math.max(...groups.map(g => g.box.max[k]))) };
		const height = all.max[1] - all.min[1];
		// How wide the avatar is at each height.
		const bins = 96, lo = new Array(bins).fill(Infinity), hi = new Array(bins).fill(-Infinity);
		const binOf = y => Math.max(0, Math.min(bins - 1, Math.floor((y - all.min[1]) / height * bins)));
		const perBin = bins / height;
		for (const g of groups) {
			const d = g.data;
			for (let i = 0; i < d.length; i += STRIDE) {
				let b = ((d[i + 1] - all.min[1]) * perBin) | 0;
				if (b >= bins) b = bins - 1;
				if (d[i] < lo[b]) lo[b] = d[i];
				if (d[i] > hi[b]) hi[b] = d[i];
			}
		}
		await sleep(0);
		const width = b => hi[b] - lo[b]; // -Infinity where a slice has no vertices
		const named = groups.filter(g => /(^|[^a-z])head\d*$/i.test(g.name));
		let neck, headBox;
		if (named.length) {
			neck = Math.min(...named.map(g => g.box.min[1]));
			headBox = { min: [0, 1, 2].map(k => Math.min(...named.map(g => g.box.min[k]))), max: [0, 1, 2].map(k => Math.max(...named.map(g => g.box.max[k]))) };
		} else {
			// Unnamed parts: the neck is the narrowest slice between the shoulders and the head.
			let best = -1;
			for (let b = Math.floor(bins * 0.55); b < Math.floor(bins * 0.9); b++) {
				if (width(b) > 0 && (best < 0 || width(b) < width(best))) best = b;
			}
			neck = all.min[1] + height * (best < 0 ? 0.78 : best / bins);
			const top = Math.min(all.max[1], neck + height * 0.25);
			headBox = { min: [all.min[0], neck, all.min[2]], max: [all.max[0], top, all.max[2]] };
		}
		const headH = Math.max(headBox.max[1] - neck, height * 0.08);
		const pivot = [(headBox.min[0] + headBox.max[0]) / 2, neck, (headBox.min[2] + headBox.max[2]) / 2];

		// The hips: just below the hands (the lowest slice, above the feet, about as wide as
		// the shoulders with the arms beside them), within reason.
		const neckBin = binOf(neck);
		let shoulders = 0;
		for (let b = Math.floor(neckBin * 0.75); b < neckBin; b++) shoulders = Math.max(shoulders, width(b));
		let hands = neckBin;
		for (let b = neckBin - 1; b >= Math.floor(bins * 0.2); b--) if (shoulders > 0 && width(b) >= shoulders * 0.8) hands = b;
		const below = neck - all.min[1];
		const hips = Math.min(Math.max(all.min[1] + height * hands / bins, all.min[1] + below * 0.3), all.min[1] + below * 0.65);
		// Where the legs are side to side: whatever is well below the hands.
		const legs = { lo: Infinity, hi: -Infinity }, knees = all.min[1] + (hips - all.min[1]) * 0.8;
		for (const g of groups) {
			const d = g.data;
			for (let i = 0; i < d.length; i += STRIDE) {
				if (d[i + 1] < knees) {
					if (d[i] < legs.lo) legs.lo = d[i];
					if (d[i] > legs.hi) legs.hi = d[i];
				}
			}
		}
		await sleep(0);

		// Each piece's extent: x0, x1, y0, y1.
		let count = 0;
		for (const g of groups) for (const piece of g.pieces) count = Math.max(count, piece + 1);
		const box = new Float64Array(count * 4);
		for (let k = 0; k < count; k++) box.set([Infinity, -Infinity, Infinity, -Infinity], k * 4);
		for (const g of groups) {
			const d = g.data;
			for (let t = 0, i = 0; t < g.pieces.length; t++) {
				const b = g.pieces[t] * 4;
				for (let end = i + 3 * STRIDE; i < end; i += STRIDE) {
					const x = d[i], y = d[i + 1];
					if (x < box[b]) box[b] = x;
					if (x > box[b + 1]) box[b + 1] = x;
					if (y < box[b + 2]) box[b + 2] = y;
					if (y > box[b + 3]) box[b + 3] = y;
				}
			}
		}
		// The head and what's on it (hair down the back too); the legs, below the hips and
		// between the hands; everything else is the body.
		const joint = new Uint8Array(count);
		let heads = 0;
		for (let k = 0; k < count; k++) {
			const [x0, x1, y0, y1] = box.subarray(k * 4, k * 4 + 4);
			const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
			let j = BODY;
			if (cy >= neck || (y1 >= neck + headH * 0.5 && cy >= neck - headH * 1.2)) j = HEAD;
			else if (cy < hips && y1 < hips + (neck - hips) * 0.5 && cx >= legs.lo && cx <= legs.hi) j = LEGS;
			if (j === HEAD) heads++;
			joint[k] = j;
		}
		await sleep(0);
		// Each group split by where its pieces go, copying runs of triangles at a time.
		const parts = [];
		const T = 3 * STRIDE;
		for (const g of groups) {
			const size = [0, 0, 0];
			for (const piece of g.pieces) size[joint[piece]]++;
			const out = size.map(n => n ? new Float32Array(n * T) : null), at = [0, 0, 0];
			for (let t = 0; t < g.pieces.length;) {
				const j = joint[g.pieces[t]];
				let end = t + 1;
				while (end < g.pieces.length && joint[g.pieces[end]] === j) end++;
				out[j].set(g.data.subarray(t * T, end * T), at[j]);
				at[j] += (end - t) * T;
				t = end;
			}
			for (const j of [LEGS, BODY, HEAD]) if (out[j]) parts.push({ name: g.name, material: g.material, alpha: g.alpha, data: out[j], joint: j });
		}

		// Head and shoulders, like the inventory view: from mid-chest to just over the head.
		const bottom = neck - headH * 1.1, top = neck + headH * 1.35;
		return {
			parts,
			axis: [pivot[0], pivot[2]],
			neck,
			// No separate head (one piece from head to body): the body turns all the way.
			headless: !heads,
			view: { center: [pivot[0], (bottom + top) / 2, pivot[2]], height: top - bottom },
			headAt: (top - (neck + headH * 0.5)) / (top - bottom)
		};
	}

	// ---------------------------------------------------------------------------
	// Matrices (column-major, as WebGL wants them)
	// ---------------------------------------------------------------------------

	const M = {
		identity: () => [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
		mul(a, b) {
			const o = new Array(16);
			for (let c = 0; c < 4; c++) {
				for (let r = 0; r < 4; r++) {
					o[c * 4 + r] = a[r] * b[c * 4] + a[4 + r] * b[c * 4 + 1] + a[8 + r] * b[c * 4 + 2] + a[12 + r] * b[c * 4 + 3];
				}
			}
			return o;
		},
		translate: (x, y, z) => [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1],
		rotY(t) {
			const c = Math.cos(t), s = Math.sin(t);
			return [c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1];
		},
		rotX(t) {
			const c = Math.cos(t), s = Math.sin(t);
			return [1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1];
		},
		// Rotation about a point.
		about(p, r) {
			return M.mul(M.translate(p[0], p[1], p[2]), M.mul(r, M.translate(-p[0], -p[1], -p[2])));
		},
		perspective(fovy, aspect, near, far) {
			const f = 1 / Math.tan(fovy / 2), nf = 1 / (near - far);
			return [f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) * nf, -1, 0, 0, 2 * far * near * nf, 0];
		},
		lookAt(eye, at, up) {
			const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
			const norm = v => { const l = Math.hypot(...v) || 1; return v.map(x => x / l); };
			const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
			const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
			const z = norm(sub(eye, at)), x = norm(cross(up, z)), y = cross(z, x);
			return [x[0], y[0], z[0], 0, x[1], y[1], z[1], 0, x[2], y[2], z[2], 0, -dot(x, eye), -dot(y, eye), -dot(z, eye), 1];
		},
		normal3: m => [m[0], m[1], m[2], m[4], m[5], m[6], m[8], m[9], m[10]]
	};

	// ---------------------------------------------------------------------------
	// Renderer
	// ---------------------------------------------------------------------------

	const VERT = `
attribute vec3 aPos; attribute vec3 aNrm; attribute vec2 aUv; attribute vec4 aCol;
uniform mat4 uViewProj; uniform mat4 uModel; uniform mat3 uNormal;
varying vec3 vNrm; varying vec3 vPos; varying vec2 vUv; varying vec4 vCol;
void main() {
	vec4 w = uModel * vec4(aPos, 1.0);
	vPos = w.xyz; vNrm = uNormal * aNrm; vUv = vec2(aUv.x, 1.0 - aUv.y); vCol = aCol;
	gl_Position = uViewProj * w;
}`;
	// Like Roblox's viewer: Kd × vertex colour × texture, matte; texture alpha only cuts out
	// for materials that ask for it.
	const FRAG = `
precision mediump float;
uniform sampler2D uMap; uniform bool uHasMap; uniform bool uCutout;
uniform vec3 uKd; uniform float uOpacity; uniform vec3 uEye;
varying vec3 vNrm; varying vec3 vPos; varying vec2 vUv; varying vec4 vCol;
void main() {
	vec4 base = vec4(uKd, 1.0) * vCol;
	if (uHasMap) {
		vec4 t = texture2D(uMap, vUv);
		if (uCutout) base = t * vCol; else base.rgb *= t.rgb;
	}
	if (uCutout && base.a < 0.5) discard;
	vec3 n = normalize(vNrm);
	if (dot(n, uEye - vPos) < 0.0) n = -n;
	vec3 key = normalize(vec3(-0.45, 0.7, -0.6)), fill = normalize(vec3(0.7, 0.15, -0.45));
	vec3 light = mix(vec3(0.3, 0.3, 0.33), vec3(0.62, 0.63, 0.67), 0.5 + 0.5 * n.y)
		+ vec3(1.0, 0.97, 0.92) * max(dot(n, key), 0.0) * 0.72
		+ vec3(0.6, 0.68, 0.85) * max(dot(n, fill), 0.0) * 0.24;
	gl_FragColor = vec4(base.rgb * light, uCutout ? 1.0 : uOpacity);
}`;

	function compile(gl) {
		const shader = (type, src) => {
			const s = gl.createShader(type);
			gl.shaderSource(s, src);
			gl.compileShader(s);
			if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || 'shader');
			return s;
		};
		const prog = gl.createProgram();
		const shaders = [shader(gl.VERTEX_SHADER, VERT), shader(gl.FRAGMENT_SHADER, FRAG)];
		for (const sh of shaders) gl.attachShader(prog, sh);
		gl.linkProgram(prog);
		// They go with the program now.
		for (const sh of shaders) gl.deleteShader(sh);
		if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) || 'link');
		const loc = {};
		for (const a of ['aPos', 'aNrm', 'aUv', 'aCol']) loc[a] = gl.getAttribLocation(prog, a);
		for (const u of ['uViewProj', 'uModel', 'uNormal', 'uMap', 'uHasMap', 'uCutout', 'uKd', 'uOpacity', 'uEye']) loc[u] = gl.getUniformLocation(prog, u);
		return { prog, loc };
	}

	const CONTEXT = { antialias: true, alpha: false, preserveDrawingBuffer: false, powerPreference: 'low-power' };
	// A canvas keeps the first context it hands out, so every caller asks the same way.
	const context = canvas => canvas.getContext('webgl2', CONTEXT) || canvas.getContext('webgl', CONTEXT);

	function createRenderer(canvas, model, onLost) {
		const gl = context(canvas);
		if (!gl) throw new Error('WebGL unavailable');
		const webgl2 = typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext;
		const { prog, loc } = compile(gl);
		let lost = false;
		const onContextLost = e => {
			e.preventDefault();
			lost = true;
			if (onLost) onLost();
		};
		canvas.addEventListener('webglcontextlost', onContextLost);

		const textures = new Map(); // hash -> WebGLTexture, once decoded
		const items = model.parts.map(part => {
			const info = model.materials[part.material] || {};
			const kd = (info.kd || '1 1 1').split(/\s+/).slice(0, 3).map(Number);
			const buf = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, buf);
			gl.bufferData(gl.ARRAY_BUFFER, part.data, gl.STATIC_DRAW);
			const d = info.d !== undefined ? parseFloat(info.d) : 1;
			return {
				buf, count: part.data.length / STRIDE, joint: part.joint,
				kd: kd.every(Number.isFinite) ? kd : [1, 1, 1],
				map: textureHash(info.map_kd, model.textures || []),
				cutout: info.rbx_alphamode === 'transparent' || part.alpha,
				opacity: Number.isFinite(d) ? d : 1
			};
		});
		// Opaque first, then anything see-through; by joint within those, to switch less.
		items.sort((a, b) => (a.opacity < 1) - (b.opacity < 1) || a.joint - b.joint);

		let frameRequested = null;
		const hashes = [...new Set(items.map(i => i.map).filter(Boolean))];
		let loadedCount = 0;
		const loads = hashes.map(async hash => {
			const bytes = model.images && model.images[hash];
			if (!bytes) return;
			let img;
			try {
				img = await decodeImage(bytes);
			} catch (e) {
				return warn('texture', hash, 'did not decode:', e.message);
			}
			if (lost) return img.close();
			const { width, height } = img;
			const tex = gl.createTexture();
			gl.bindTexture(gl.TEXTURE_2D, tex);
			// Bitmaps ignore UNPACK_FLIP_Y, so V is flipped in the shader instead.
			gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
			try {
				gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
			} catch (e) {
				gl.deleteTexture(tex);
				return warn('texture', hash, 'could not be uploaded:', e.message);
			} finally {
				img.close();
			}
			const pot = n => (n & (n - 1)) === 0;
			if (webgl2 || (pot(width) && pot(height))) {
				gl.generateMipmap(gl.TEXTURE_2D);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
			} else {
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			}
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			textures.set(hash, tex);
			loadedCount++;
			if (frameRequested) frameRequested();
		});
		// Ready once every texture is decoded, so it never shows up bare; that's quick, as the
		// bytes are already here (see load), but a stuck one doesn't hold it back for long.
		const ready = Promise.race([Promise.all(loads), new Promise(r => setTimeout(r, 1500))]).then(() => {
			console.info(`[BloxRegion] 3D avatar: ${items.length} parts, ${loadedCount}/${hashes.length} textures`);
		});

		// Camera: in front of the avatar (Roblox avatars face −Z), a little above, framing
		// head and shoulders.
		const fov = 30 * DEG;
		const { center, height } = model.view;
		const dist = (height / 2) / Math.tan(fov / 2) * 1.04;
		const eye = [center[0], center[1] + dist * 0.06, center[2] - dist];
		const proj = M.perspective(fov, canvas.width / canvas.height, dist * 0.05, dist * 20);
		const viewProj = M.mul(proj, M.lookAt(eye, center, [0, 1, 0]));

		function render(pose) {
			if (lost) return;
			gl.viewport(0, 0, canvas.width, canvas.height);
			gl.clearColor(0, 0, 0, 1);
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
			gl.enable(gl.DEPTH_TEST);
			gl.disable(gl.CULL_FACE);
			gl.useProgram(prog);
			gl.uniformMatrix4fv(loc.uViewProj, false, viewProj);
			gl.uniform3fv(loc.uEye, eye);
			gl.uniform1i(loc.uMap, 0);

			// Like the inventory: the head looks at the cursor (turning and nodding on the neck),
			// the body (torso and arms) turns part of the way and breathes, and the legs stay
			// where they stand.
			const [ax, az] = model.axis;
			const breathe = Math.sin(pose.time * 2.1) * model.view.height * 0.004;
			const turn = model.headless ? pose.yaw : pose.body;
			const body = M.mul(M.translate(0, breathe, 0), M.about([ax, 0, az], M.rotY(turn * DEG)));
			const head = M.mul(body, M.about([ax, model.neck, az], M.mul(M.rotY((pose.yaw - turn) * DEG), M.rotX(pose.pitch * DEG))));
			const joints = [M.identity(), body, head];
			let joint = -1;

			for (const item of items) {
				if (item.joint !== joint) {
					joint = item.joint;
					gl.uniformMatrix4fv(loc.uModel, false, joints[joint]);
					gl.uniformMatrix3fv(loc.uNormal, false, M.normal3(joints[joint]));
				}
				gl.uniform3fv(loc.uKd, item.kd);
				const tex = item.map && textures.get(item.map);
				gl.uniform1i(loc.uHasMap, tex ? 1 : 0);
				gl.uniform1i(loc.uCutout, item.cutout ? 1 : 0);
				gl.uniform1f(loc.uOpacity, item.opacity);
				if (tex) {
					gl.activeTexture(gl.TEXTURE0);
					gl.bindTexture(gl.TEXTURE_2D, tex);
				}
				const see = item.opacity < 1 && !item.cutout;
				if (see) {
					gl.enable(gl.BLEND);
					gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
					gl.depthMask(false);
				}
				gl.bindBuffer(gl.ARRAY_BUFFER, item.buf);
				const attr = (name, size, offset) => {
					if (loc[name] < 0) return;
					gl.enableVertexAttribArray(loc[name]);
					gl.vertexAttribPointer(loc[name], size, gl.FLOAT, false, STRIDE * 4, offset * 4);
				};
				attr('aPos', 3, 0);
				attr('aNrm', 3, 3);
				attr('aUv', 2, 6);
				attr('aCol', 4, 8);
				gl.drawArrays(gl.TRIANGLES, 0, item.count);
				if (see) {
					gl.disable(gl.BLEND);
					gl.depthMask(true);
				}
			}
		}

		return {
			render,
			ready,
			// Called when a texture arrives, so the caller can draw a fresh frame.
			onChange(fn) { frameRequested = fn; },
			// Frees what this avatar put on the GPU. The canvas can take another one; `release`
			// also gives up the canvas's context, for when it's going away.
			destroy(release) {
				if (lost) return;
				lost = true;
				canvas.removeEventListener('webglcontextlost', onContextLost);
				if (release) {
					const ext = gl.getExtension('WEBGL_lose_context');
					if (ext) ext.loseContext();
					return;
				}
				for (const item of items) gl.deleteBuffer(item.buf);
				for (const tex of textures.values()) gl.deleteTexture(tex);
				gl.deleteProgram(prog);
			}
		};
	}

	// ---------------------------------------------------------------------------
	// Entry point
	// ---------------------------------------------------------------------------

	// Loads a player's avatar: { url, model, complete }, or throws. `knownUrl` skips the API
	// lookup. `complete` says every texture arrived.
	async function load(userId, knownUrl) {
		const url = knownUrl || await modelUrl(userId);
		if (!url) throw new Error('no 3D avatar');
		const res = await fetch(url, { credentials: 'omit' });
		if (!res.ok) throw new Error('3D avatar unavailable');
		const meta = await res.json();
		const objHash = cleanHash(meta && meta.obj), mtlHash = cleanHash(meta && meta.mtl);
		if (!objHash || !mtlHash) throw new Error('3D avatar incomplete');
		const textures = (Array.isArray(meta.textures) ? meta.textures : []).map(cleanHash).filter(Boolean);
		// Everything at once: the OBJ, the MTL and the textures.
		const images = {}, fetching = new Map();
		const fetchTexture = hash => {
			if (!fetching.has(hash)) {
				fetching.set(hash, cdnBytes(hash).then(bytes => { images[hash] = bytes; }, e => warn('texture', hash, 'failed:', e.message)));
			}
		};
		textures.forEach(fetchTexture);
		const [objText, mtlText] = await Promise.all([cdnText(objHash), cdnText(mtlHash)]);
		const materials = parseMtl(mtlText);
		// Any texture the MTL uses that the list left out.
		for (const info of Object.values(materials)) {
			const hash = info.map_kd && textureHash(info.map_kd, textures);
			if (hash) fetchTexture(hash);
		}
		const groups = await parseObj(objText);
		if (!groups.length) throw new Error('empty avatar');
		const model = await analyse(groups);
		model.materials = materials;
		model.textures = textures;
		await Promise.all(fetching.values());
		model.images = images;
		return { url, model, complete: Object.keys(images).length === fetching.size };
	}

	// The last avatar loaded is kept, parsed and with its textures, in the add-on's storage:
	// the next page draws it from there at once instead of downloading and parsing it again
	// while the page itself is loading. (Firefox stores typed arrays as they are.)
	const CACHE_KEY = 'brAvatar3d';
	const CACHE_FORMAT = 3;

	// The kept avatar if it's this player's: { url, model, recalled: true }, or null.
	function recall(userId) {
		return new Promise(resolve => {
			try {
				chrome.storage.local.get(CACHE_KEY, v => {
					const c = v && v[CACHE_KEY];
					const ok = !!c && c.format === CACHE_FORMAT && c.user === userId && typeof c.url === 'string' &&
						!!c.model && Array.isArray(c.model.parts) && c.model.parts.every(p => ArrayBuffer.isView(p.data) && p.data.BYTES_PER_ELEMENT === 4);
					resolve(ok ? { url: c.url, model: c.model, recalled: true } : null);
				});
			} catch (e) {
				resolve(null);
			}
		});
	}

	function remember(userId, loaded) {
		try {
			chrome.storage.local.set({ [CACHE_KEY]: { format: CACHE_FORMAT, user: userId, url: loaded.url, model: loaded.model } });
		} catch (e) {}
	}

	// Drops the kept avatar, so the next load asks Roblox for the current one.
	function forget() {
		try { chrome.storage.local.remove(CACHE_KEY); } catch (e) {}
	}

	// Whether `canvas` can draw the avatar (asked the same way the renderer asks, so it's the
	// same context).
	function supported(canvas) {
		try {
			return !!context(canvas);
		} catch (e) {
			return false;
		}
	}

	// Any CDN image, fetched and decoded the same way as textures (for the 2D bust).
	async function fetchImage(url) {
		const res = await fetch(url, { credentials: 'omit' });
		if (!res.ok) throw new Error('HTTP ' + res.status);
		return decodeImage(await res.arrayBuffer());
	}

	window.__brAvatar3d = { load, recall, remember, forget, modelUrl, createRenderer, supported, fetchImage };
})();
