/*
 * BloxRegion — 3D avatar for the ViewPort
 *
 * Loads the player's 3D avatar from Roblox (the OBJ, MTL and textures behind Roblox's
 * own 3D viewer) and draws it with a small WebGL renderer. The head is drawn on its own
 * so it can turn toward the cursor while the body turns less, like the player model in
 * Minecraft's inventory. viewport.js keeps the 2D bust if anything here fails.
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
	const cleanHash = v => {
		const hash = String(v || '').trim().split(/\s+/).pop().split(/[\\/]/).pop();
		return /^[A-Za-z0-9_-]{8,200}$/.test(hash) ? hash : null;
	};

	async function cdnText(hash) {
		for (const url of cdnUrls(hash)) {
			try {
				const res = await fetch(url, { credentials: 'omit' });
				if (res.ok) return await res.text();
			} catch (e) {}
		}
		throw new Error('CDN file unavailable');
	}

	function cdnImage(hash) {
		const urls = cdnUrls(hash);
		return new Promise((resolve, reject) => {
			const next = () => {
				const url = urls.shift();
				if (!url) return reject(new Error('texture unavailable'));
				const img = new Image();
				img.crossOrigin = 'anonymous';
				img.addEventListener('load', () => resolve(img));
				img.addEventListener('error', next);
				img.src = url;
			};
			next();
		});
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
	const STRIDE = 12;
	async function parseObj(text) {
		const P = [], N = [], T = [], C = [];
		const groups = new Map();
		let name = '', material = '', group = null, hasAlpha = false;
		const corner = [];
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
					if (!group) groups.set(key, group = { name, material, data: [], alpha: false });
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
				for (let k = 1; k + 1 < corner.length / 3; k++) emit(group, P, N, T, C, corner, 0, k, k + 1);
				if (hasAlpha) for (let k = 0; k < corner.length; k += 3) if (C[corner[k] * 4 + 3] < 1) group.alpha = true;
			}
		}
		return [...groups.values()].filter(g => g.data.length).map(g => ({ name: g.name, material: g.material, alpha: g.alpha, data: new Float32Array(g.data) }));
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

	// Splits the avatar into head (with whatever sits on it) and body, and works out where
	// the neck is and how to frame head and shoulders.
	function analyse(groups) {
		for (const g of groups) g.box = bounds(g.data);
		const all = { min: [0, 1, 2].map(k => Math.min(...groups.map(g => g.box.min[k]))), max: [0, 1, 2].map(k => Math.max(...groups.map(g => g.box.max[k]))) };
		const height = all.max[1] - all.min[1];
		const named = groups.filter(g => /(^|[^a-z])head\d*$/i.test(g.name));
		let neck, headBox;
		if (named.length) {
			neck = Math.min(...named.map(g => g.box.min[1]));
			headBox = { min: [0, 1, 2].map(k => Math.min(...named.map(g => g.box.min[k]))), max: [0, 1, 2].map(k => Math.max(...named.map(g => g.box.max[k]))) };
		} else {
			// Unnamed parts: the neck is the narrowest slice between the shoulders and the head.
			const bins = 96, lo = new Array(bins).fill(Infinity), hi = new Array(bins).fill(-Infinity);
			for (const g of groups) {
				for (let i = 0; i < g.data.length; i += STRIDE) {
					const b = Math.min(bins - 1, Math.floor((g.data[i + 1] - all.min[1]) / height * bins));
					lo[b] = Math.min(lo[b], g.data[i]);
					hi[b] = Math.max(hi[b], g.data[i]);
				}
			}
			let best = -1;
			for (let b = Math.floor(bins * 0.55); b < Math.floor(bins * 0.9); b++) {
				const w = hi[b] - lo[b];
				if (w > 0 && (best < 0 || w < hi[best] - lo[best])) best = b;
			}
			neck = all.min[1] + height * (best < 0 ? 0.78 : best / bins);
			const top = Math.min(all.max[1], neck + height * 0.25);
			headBox = { min: [all.min[0], neck, all.min[2]], max: [all.max[0], top, all.max[2]] };
		}
		const headH = Math.max(headBox.max[1] - neck, height * 0.08);
		const pivot = [(headBox.min[0] + headBox.max[0]) / 2, neck, (headBox.min[2] + headBox.max[2]) / 2];

		// What turns with the head: the head itself and anything mostly above the neck
		// (hats, hair, face accessories). Unnamed meshes are split triangle by triangle.
		const parts = [];
		for (const g of groups) {
			if (named.length) {
				const head = named.includes(g) || (g.box.center[1] > neck - headH * 0.15 && g.box.max[1] > neck + headH * 0.3);
				parts.push({ ...g, head });
			} else {
				const up = [], down = [];
				for (let i = 0; i < g.data.length; i += STRIDE * 3) {
					const cy = (g.data[i + 1] + g.data[i + STRIDE + 1] + g.data[i + STRIDE * 2 + 1]) / 3;
					const out = cy > neck ? up : down;
					for (let k = 0; k < STRIDE * 3; k++) out.push(g.data[i + k]);
				}
				if (up.length) parts.push({ ...g, data: new Float32Array(up), head: true });
				if (down.length) parts.push({ ...g, data: new Float32Array(down), head: false });
			}
		}

		// Head and shoulders, like the inventory view: from mid-chest to just over the head.
		const bottom = neck - headH * 1.1, top = neck + headH * 1.35;
		return {
			parts,
			pivot,
			axis: [pivot[0], pivot[2]],
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
	vPos = w.xyz; vNrm = uNormal * aNrm; vUv = aUv; vCol = aCol;
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
		gl.attachShader(prog, shader(gl.VERTEX_SHADER, VERT));
		gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, FRAG));
		gl.linkProgram(prog);
		if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) || 'link');
		const loc = {};
		for (const a of ['aPos', 'aNrm', 'aUv', 'aCol']) loc[a] = gl.getAttribLocation(prog, a);
		for (const u of ['uViewProj', 'uModel', 'uNormal', 'uMap', 'uHasMap', 'uCutout', 'uKd', 'uOpacity', 'uEye']) loc[u] = gl.getUniformLocation(prog, u);
		return { prog, loc };
	}

	function createRenderer(canvas, model, onLost) {
		const opts = { antialias: true, alpha: false, preserveDrawingBuffer: false, powerPreference: 'low-power' };
		const gl = canvas.getContext('webgl2', opts) || canvas.getContext('webgl', opts);
		if (!gl) throw new Error('WebGL unavailable');
		const webgl2 = typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext;
		const { prog, loc } = compile(gl);
		let lost = false;
		canvas.addEventListener('webglcontextlost', e => {
			e.preventDefault();
			lost = true;
			if (onLost) onLost();
		});

		const textures = new Map(); // hash -> WebGLTexture, once loaded
		const items = model.parts.map(part => {
			const info = model.materials[part.material] || {};
			const kd = (info.kd || '1 1 1').split(/\s+/).slice(0, 3).map(Number);
			const buf = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, buf);
			gl.bufferData(gl.ARRAY_BUFFER, part.data, gl.STATIC_DRAW);
			const d = info.d !== undefined ? parseFloat(info.d) : 1;
			return {
				buf, count: part.data.length / STRIDE, head: part.head,
				kd: kd.every(Number.isFinite) ? kd : [1, 1, 1],
				map: cleanHash(info.map_kd),
				cutout: info.rbx_alphamode === 'transparent' || part.alpha,
				opacity: Number.isFinite(d) ? d : 1
			};
		});
		// Opaque first, then anything see-through.
		items.sort((a, b) => (a.opacity < 1) - (b.opacity < 1));

		let frameRequested = null;
		for (const hash of new Set(items.map(i => i.map).filter(Boolean))) {
			cdnImage(hash).then(img => {
				if (lost) return;
				const tex = gl.createTexture();
				gl.bindTexture(gl.TEXTURE_2D, tex);
				gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
				try {
					gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
				} catch (e) {
					return; // a texture the CDN didn't allow us to read: colours only
				}
				const pot = n => (n & (n - 1)) === 0;
				if (webgl2 || (pot(img.width) && pot(img.height))) {
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
				if (frameRequested) frameRequested();
			}, () => {});
		}

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

			// The body turns about its vertical axis and breathes; the head turns on the neck.
			const [ax, az] = model.axis;
			const breathe = Math.sin(pose.time * 2.1) * model.view.height * 0.004;
			const body = M.mul(M.translate(0, breathe, 0), M.about([ax, 0, az], M.rotY(pose.body * DEG)));
			const head = M.mul(body, M.about(model.pivot, M.mul(M.rotY((pose.yaw - pose.body) * DEG), M.rotX(pose.pitch * DEG))));

			for (const item of items) {
				const m = item.head ? head : body;
				gl.uniformMatrix4fv(loc.uModel, false, m);
				gl.uniformMatrix3fv(loc.uNormal, false, M.normal3(m));
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
			// Called when a texture arrives, so the caller can draw a fresh frame.
			onChange(fn) { frameRequested = fn; },
			destroy() {
				lost = true;
				const ext = gl.getExtension('WEBGL_lose_context');
				if (ext) ext.loseContext();
			}
		};
	}

	// ---------------------------------------------------------------------------
	// Entry point
	// ---------------------------------------------------------------------------

	// Loads a player's avatar: { url, model }, or throws. `knownUrl` skips the API lookup.
	async function load(userId, knownUrl) {
		const url = knownUrl || await modelUrl(userId);
		if (!url) throw new Error('no 3D avatar');
		const res = await fetch(url, { credentials: 'omit' });
		if (!res.ok) throw new Error('3D avatar unavailable');
		const meta = await res.json();
		const objHash = cleanHash(meta && meta.obj), mtlHash = cleanHash(meta && meta.mtl);
		if (!objHash || !mtlHash) throw new Error('3D avatar incomplete');
		const [objText, mtlText] = await Promise.all([cdnText(objHash), cdnText(mtlHash)]);
		const groups = await parseObj(objText);
		if (!groups.length) throw new Error('empty avatar');
		const model = analyse(groups);
		model.materials = parseMtl(mtlText);
		return { url, model };
	}

	function supported() {
		try {
			const c = document.createElement('canvas');
			return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
		} catch (e) {
			return false;
		}
	}

	window.__brAvatar3d = { load, modelUrl, createRenderer, supported };
})();
