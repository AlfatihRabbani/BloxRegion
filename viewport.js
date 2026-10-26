/*
 * BloxRegion — ViewPort (an easter egg)
 *
 * A small retro window with the player's avatar: the head follows the cursor and the
 * torso turns slightly toward it, like the player in Minecraft's inventory. Typing
 * "ViewPort" into BloxRegion's search field opens it; it then stays on every roblox.com
 * page, wherever it was dragged, until its X is pressed. The state lives in storage, so
 * every open tab agrees.
 *
 * The avatar is Roblox's bust render, cut at the neck into a head layer and a torso
 * layer that are turned separately in 3D.
 */
(() => {
	'use strict';

	if (window.top !== window || window.__brViewport) return;
	window.__brViewport = true;

	const KEY = 'brViewport';          // { open, x, y }
	const USER_KEY = 'brViewportUser'; // { id, name, bust } of the last signed-in player
	const R = 92;                      // avatar layers are drawn at 92×92 and shown at 2×
	const P = 14;                      // the torso layer reaches this far past the frame (sides, below)
	const SRC = 150;                   // size of the bust render that is measured

	// 5×8 pixel font for usernames. Each glyph is its character followed by eight base-32
	// digits, one per row (5 bits, leftmost pixel first); row 7 holds descenders.
	const FONT_DATA = 'Aehhvhhh0Buhhuhhu0Cehggghe0Duhhhhhu0Evgguggv0Fvgguggg0Gehgnhhf0Hhhhvhhh0Ie44444e0J72222ic0Khikokih0Lggggggv0Mhrllhhh0Nhhpljhh0Oehhhhhe0Puhhuggg0Qehhhlid0Ruhhukih0Sfgge11u0Tv4444440Uhhhhhhe0Vhhhhha40Whhhllla0Xhha4ahh0Yhha44440Zv1248gv0a00e1fhf0bggmphhu0c00egghe0d11djhhf0e00ehvge0f698s8880g00fhhf1ehggmphhh0i40c444e0j206222ickggikoki0lc44444e0m00qllhh0n00mphhh0o00ehhhe0p00uhhuggq00fhhf11r00mpggg0s00ege1u0t88s88960u00hhhjd0v00hhha40w00hhlla0x00ha4ah0y00hhhf1ez00v248v00ehjlphe014c4444e02eh1248v03v2421he0426aiv2205vgu11he0668guhhe07v12488808ehhehhe09ehhf12c0_0000000v.00000cc0?eh124040-000e0000 00000000';
	const FONT = new Map();
	for (let i = 0; i + 9 <= FONT_DATA.length; i += 9) {
		FONT.set(FONT_DATA[i], [...FONT_DATA.slice(i + 1, i + 9)].map(d => parseInt(d, 32)));
	}

	// Draws text in the pixel font; the canvas is shown at `scale`× with crisp pixels.
	function pixelText(text, scale) {
		const glyphs = [...text].map(ch => FONT.get(ch) || FONT.get('?'));
		const canvas = document.createElement('canvas');
		canvas.width = Math.max(1, glyphs.length * 6 - 1);
		canvas.height = 8;
		const ctx = canvas.getContext('2d');
		ctx.fillStyle = '#fff';
		glyphs.forEach((rows, i) => rows.forEach((bits, y) => {
			for (let x = 0; x < 5; x++) if (bits & (16 >> x)) ctx.fillRect(i * 6 + x, y, 1, 1);
		}));
		canvas.style.width = canvas.width * scale + 'px';
		canvas.style.height = canvas.height * scale + 'px';
		return canvas;
	}

	function closeGlyph() {
		const canvas = document.createElement('canvas');
		canvas.width = canvas.height = 7;
		const ctx = canvas.getContext('2d');
		ctx.fillStyle = '#fff';
		for (let i = 0; i < 7; i++) {
			ctx.fillRect(i, i, 1, 1);
			ctx.fillRect(6 - i, i, 1, 1);
		}
		return canvas;
	}

	const sleep = ms => new Promise(r => setTimeout(r, ms));
	const store = {
		get(keys) {
			return new Promise(resolve => {
				try { chrome.storage.local.get(keys, v => resolve(v || {})); } catch (e) { resolve({}); }
			});
		},
		set(obj) { try { chrome.storage.local.set(obj); } catch (e) {} }
	};

	// ---------------------------------------------------------------------------
	// The player and their avatar
	// ---------------------------------------------------------------------------

	// The signed-in player, null when signed out, undefined when it can't be told (some
	// roblox.com sites can't reach the users API).
	async function currentUser() {
		const meta = document.querySelector('meta[name="user-data"]');
		const id = meta ? Number(meta.getAttribute('data-userid')) : 0;
		const name = meta ? meta.getAttribute('data-name') : '';
		if (id && name) return { id, name };
		try {
			const res = await fetch('https://users.roblox.com/v1/users/authenticated', { credentials: 'include' });
			if (res.status === 401) return null;
			const d = res.ok ? await res.json() : null;
			if (d && d.id) return { id: d.id, name: d.name || '' };
		} catch (e) {}
		return undefined;
	}

	async function bustUrl(userId) {
		for (let attempt = 0; attempt < 4; attempt++) {
			try {
				const res = await fetch(`https://thumbnails.roblox.com/v1/users/avatar-bust?userIds=${encodeURIComponent(userId)}&size=${SRC}x${SRC}&format=Png&isCircular=false`, { credentials: 'omit' });
				const d = res.ok ? await res.json() : null;
				const t = d && d.data && d.data[0];
				if (t && t.state === 'Completed' && /^https:\/\/[a-z0-9.-]+\.rbxcdn\.com\//i.test(t.imageUrl || '')) return t.imageUrl;
				// Renders that are still being made come back as Pending for a moment.
				if (!t || t.state !== 'Pending') return null;
			} catch (e) {
				return null;
			}
			await sleep(1500);
		}
		return null;
	}

	function loadImage(url) {
		return new Promise((resolve, reject) => {
			const img = new Image();
			img.crossOrigin = 'anonymous';
			img.addEventListener('load', () => resolve(img));
			img.addEventListener('error', reject);
			img.src = url;
		});
	}

	// Finds the top of the head, the neck (the narrowest row between head and shoulders)
	// and the head's horizontal centre. Typical bust proportions if the image can't be read.
	function measure(img) {
		const fallback = { top: SRC * 0.1, neck: SRC * 0.53, cx: SRC / 2 };
		try {
			const canvas = document.createElement('canvas');
			canvas.width = canvas.height = SRC;
			const ctx = canvas.getContext('2d', { willReadFrequently: true });
			ctx.drawImage(img, 0, 0, SRC, SRC);
			const alpha = ctx.getImageData(0, 0, SRC, SRC).data;
			const left = new Array(SRC).fill(-1), right = new Array(SRC).fill(-1);
			for (let y = 0; y < SRC; y++) {
				for (let x = 0; x < SRC; x++) {
					if (alpha[(y * SRC + x) * 4 + 3] > 40) {
						if (left[y] < 0) left[y] = x;
						right[y] = x;
					}
				}
			}
			const width = y => (left[y] < 0 ? 0 : right[y] - left[y] + 1);
			let top = 0;
			while (top < SRC && !width(top)) top++;
			let neck = -1;
			for (let y = Math.round(SRC * 0.3); y < Math.round(SRC * 0.8); y++) {
				if (width(y) && (neck < 0 || width(y) <= width(neck))) neck = y;
			}
			if (top >= SRC || neck - top < SRC * 0.15) return fallback;
			let sum = 0, n = 0;
			for (let y = top; y < neck; y++) {
				if (width(y)) {
					sum += (left[y] + right[y]) / 2;
					n++;
				}
			}
			return { top, neck, cx: n ? sum / n : SRC / 2 };
		} catch (e) {
			return fallback;
		}
	}

	// Frames head and shoulders like the inventory view: the head fills a bit over half.
	function frameOf(m) {
		const side = Math.min(SRC, Math.max(SRC * 0.55, (m.neck - m.top) / 0.56));
		const y0 = Math.min(SRC - side, Math.max(0, m.top - side * 0.08));
		const x0 = Math.min(SRC - side, Math.max(0, m.cx - side / 2));
		return { x0, y0, side, neck: (m.neck - y0) / side, cx: (m.cx - x0) / side };
	}

	// ---------------------------------------------------------------------------
	// Window
	// ---------------------------------------------------------------------------

	const V = {
		el: null, bar: null, nameSlot: null, head: null, torso: null, stage: null,
		x: null, y: null, pivot: null, neck: 0.64, cx: 0.5,
		target: { yaw: 0, pitch: 0, body: 0 }, cur: { yaw: 0, pitch: 0, body: 0 }, raf: 0,
		user: null, token: 0, drawn: false
	};

	function mount(animate) {
		if (V.el) return;
		document.getElementById('br-viewport')?.remove();
		const close = document.createElement('button');
		close.type = 'button';
		close.className = 'brv-close';
		close.title = 'Close';
		close.setAttribute('aria-label', 'Close ViewPort');
		close.append(closeGlyph());
		close.addEventListener('click', () => {
			unmount();
			save({ open: false });
		});
		const nameSlot = document.createElement('span');
		nameSlot.className = 'brv-name';
		const bar = document.createElement('div');
		bar.className = 'brv-bar';
		bar.append(nameSlot, close);

		const torso = document.createElement('canvas');
		const head = document.createElement('canvas');
		torso.className = 'brv-torso';
		head.className = 'brv-head';
		head.width = head.height = R;
		torso.width = R + 2 * P;
		torso.height = R + P;
		// Turn around the frame's bottom centre.
		torso.style.transformOrigin = `50% ${(R / (R + P) * 100).toFixed(1)}%`;
		const stage = document.createElement('div');
		stage.className = 'brv-stage';
		stage.append(torso, head);
		const body = document.createElement('div');
		body.className = 'brv-body';
		body.append(stage);

		const el = document.createElement('div');
		el.id = 'br-viewport';
		// Pops in when it's opened, not each time a page loads with it already open.
		if (animate) el.className = 'is-opening';
		el.setAttribute('role', 'dialog');
		el.append(bar, body);
		Object.assign(V, { el, bar, nameSlot, head, torso, stage, pivot: null, drawn: false });
		bar.addEventListener('pointerdown', startDrag);
		document.body.append(el);
		place(V.x, V.y);
		document.addEventListener('pointermove', onPointer, { passive: true });
		window.addEventListener('resize', onResize);
		showUser(V.user);
		loadAvatar();
	}

	function unmount() {
		if (!V.el) return;
		V.el.remove();
		V.el = null;
		V.token++;
		cancelAnimationFrame(V.raf);
		V.raf = 0;
		document.removeEventListener('pointermove', onPointer);
		window.removeEventListener('resize', onResize);
	}

	function showUser(user) {
		if (!V.el) return;
		const name = user ? user.name : 'Guest';
		// The title holds about 12 characters at 2×; longer names are shortened.
		const fit = name.length > 12 ? name.slice(0, 10) + '..' : name;
		V.nameSlot.textContent = '';
		V.nameSlot.append(pixelText(fit, 2));
		V.el.setAttribute('aria-label', 'ViewPort, ' + name);
		V.bar.title = name;
	}

	// Paints the avatar (or, without one, a plain blocky figure) into the two layers.
	function drawAvatar(img, frame) {
		const head = V.head.getContext('2d');
		const torso = V.torso.getContext('2d');
		const TW = R + 2 * P, TH = R + P;
		head.clearRect(0, 0, R, R);
		torso.clearRect(0, 0, TW, TH);
		if (!img) {
			V.neck = 0.6;
			V.cx = 0.5;
			torso.fillStyle = '#4b4b56';
			torso.fillRect(P + R * 0.16, R * 0.6, R * 0.68, R * 0.4 + P);
			head.fillStyle = '#8a8a96';
			head.fillRect(R * 0.3, R * 0.14, R * 0.4, R * 0.44);
			head.fillStyle = '#2a2a32';
			head.fillRect(R * 0.39, R * 0.3, R * 0.06, R * 0.06);
			head.fillRect(R * 0.55, R * 0.3, R * 0.06, R * 0.06);
		} else {
			const k = img.naturalWidth / SRC;
			const neckPx = Math.round(frame.neck * R);
			for (const ctx of [head, torso]) {
				ctx.imageSmoothingEnabled = true;
				ctx.imageSmoothingQuality = 'high';
			}
			head.drawImage(img, frame.x0 * k, frame.y0 * k, frame.side * k, frame.side * k, 0, 0, R, R);
			// The head keeps two rows of neck so no gap opens up when it turns.
			head.clearRect(0, neckPx + 2, R, R);
			// The torso covers more than the frame, so turning it shows more shirt instead of
			// its edges: whatever of that area the render has, then its edges stretched outward.
			const unit = frame.side / R; // source pixels per canvas pixel
			const sx = frame.x0 - P * unit, sy = frame.y0;
			const ix0 = Math.max(0, sx), iy0 = Math.max(0, sy);
			const ix1 = Math.min(SRC, sx + TW * unit), iy1 = Math.min(SRC, sy + TH * unit);
			const dx0 = Math.round((ix0 - sx) / unit), dx1 = Math.round((ix1 - sx) / unit), dy1 = Math.round((iy1 - sy) / unit);
			torso.drawImage(img, ix0 * k, iy0 * k, (ix1 - ix0) * k, (iy1 - iy0) * k, dx0, Math.round((iy0 - sy) / unit), dx1 - dx0, dy1 - Math.round((iy0 - sy) / unit));
			if (dx0 > 0) torso.drawImage(V.torso, dx0, 0, 1, TH, 0, 0, dx0, TH);
			if (dx1 < TW) torso.drawImage(V.torso, dx1 - 1, 0, 1, TH, dx1, 0, TW - dx1, TH);
			if (dy1 < TH) torso.drawImage(V.torso, 0, dy1 - 1, TW, 1, 0, dy1, TW, TH - dy1);
			torso.clearRect(0, 0, TW, neckPx);
			V.neck = frame.neck;
			V.cx = frame.cx;
		}
		V.drawn = true;
		V.head.style.transformOrigin = `${(V.cx * 100).toFixed(1)}% ${(V.neck * 100).toFixed(1)}%`;
		V.pivot = null;
		render();
	}

	async function loadAvatar() {
		const token = ++V.token;
		const cached = (await store.get([USER_KEY]))[USER_KEY];
		if (cached && cached.id && token === V.token) {
			V.user = { id: cached.id, name: cached.name };
			showUser(V.user);
			if (cached.bust) await showBust(cached.bust, token);
		}
		const user = await currentUser();
		if (token !== V.token) return;
		if (!user) {
			if (user === null || !V.drawn) {
				V.user = null;
				showUser(null);
				drawAvatar();
			}
			return;
		}
		V.user = user;
		showUser(user);
		const bust = await bustUrl(user.id);
		if (token !== V.token) return;
		if (bust && (!V.drawn || !cached || cached.bust !== bust || cached.id !== user.id)) await showBust(bust, token);
		if (token !== V.token) return;
		if (!V.drawn) drawAvatar();
		store.set({ [USER_KEY]: { id: user.id, name: user.name, bust: bust || null } });
	}

	async function showBust(url, token) {
		try {
			const img = await loadImage(url);
			if (token === V.token && V.el) drawAvatar(img, frameOf(measure(img)));
		} catch (e) {}
	}

	// ---------------------------------------------------------------------------
	// Looking at the cursor
	// ---------------------------------------------------------------------------

	function onPointer(e) {
		if (!V.el) return;
		if (!V.pivot) {
			const r = V.stage.getBoundingClientRect();
			// Roughly between the eyes: a little above the middle of the head.
			V.pivot = { x: r.left + r.width * V.cx, y: r.top + r.height * V.neck * 0.62 };
		}
		// Minecraft's inventory model: atan of the offset, the head turning further than the body.
		const f = Math.atan((e.clientX - V.pivot.x) / 90);
		const g = Math.atan((e.clientY - V.pivot.y) / 90);
		V.target.yaw = f * 22;
		V.target.pitch = -g * 12;
		V.target.body = f * 8;
		if (!V.raf) V.raf = requestAnimationFrame(tick);
	}

	function tick() {
		V.raf = 0;
		if (!V.el) return;
		let moving = false;
		for (const k of ['yaw', 'pitch', 'body']) {
			const d = V.target[k] - V.cur[k];
			V.cur[k] = Math.abs(d) < 0.05 ? V.target[k] : V.cur[k] + d * 0.25;
			if (V.cur[k] !== V.target[k]) moving = true;
		}
		render();
		if (moving) V.raf = requestAnimationFrame(tick);
	}

	function render() {
		if (!V.el) return;
		const { yaw, pitch, body } = V.cur;
		// Each layer's vanishing point is its own pivot: the head turns on the neck.
		V.torso.style.transform = `perspective(520px) rotateY(${body.toFixed(2)}deg)`;
		V.head.style.transform = `translateX(${(yaw * 0.06).toFixed(2)}px) perspective(420px) rotateY(${yaw.toFixed(2)}deg) rotateX(${pitch.toFixed(2)}deg)`;
	}

	// ---------------------------------------------------------------------------
	// Position, dragging and the shared state
	// ---------------------------------------------------------------------------

	function place(x, y) {
		if (!V.el) return;
		const w = V.el.offsetWidth || 196, h = V.el.offsetHeight || 236;
		if (typeof x !== 'number' || typeof y !== 'number') {
			// Centred in the space left of the BloxRegion window (min(1160px, 100vw - 40px)
			// wide, centred), or against the edge when there's no room beside it.
			const gutter = (innerWidth - Math.min(1160, innerWidth - 40)) / 2;
			x = Math.max(12, Math.round((gutter - w) / 2));
			y = Math.max(16, Math.round((innerHeight - h) * 0.3));
		}
		V.x = Math.round(Math.min(Math.max(0, innerWidth - w), Math.max(0, x)));
		V.y = Math.round(Math.min(Math.max(0, innerHeight - h), Math.max(0, y)));
		V.el.style.left = V.x + 'px';
		V.el.style.top = V.y + 'px';
		V.pivot = null;
	}

	function startDrag(e) {
		if (e.button !== 0 || e.target.closest('.brv-close')) return;
		e.preventDefault();
		const bar = V.bar;
		const from = { x: e.clientX, y: e.clientY, left: V.x, top: V.y };
		bar.setPointerCapture(e.pointerId);
		V.el.classList.add('is-dragging');
		const move = ev => place(from.left + ev.clientX - from.x, from.top + ev.clientY - from.y);
		const end = () => {
			bar.removeEventListener('pointermove', move);
			bar.removeEventListener('pointerup', end);
			bar.removeEventListener('pointercancel', end);
			if (!V.el) return;
			V.el.classList.remove('is-dragging');
			save({ open: true, x: V.x, y: V.y });
		};
		bar.addEventListener('pointermove', move);
		bar.addEventListener('pointerup', end);
		bar.addEventListener('pointercancel', end);
	}

	function onResize() {
		place(V.x, V.y);
	}

	let saved = {};
	function save(patch) {
		saved = Object.assign({}, saved, patch);
		store.set({ [KEY]: saved });
	}

	function apply(state, animate) {
		saved = state && typeof state === 'object' ? state : {};
		if (!saved.open) {
			unmount();
			return;
		}
		V.x = saved.x;
		V.y = saved.y;
		if (V.el) place(V.x, V.y);
		else mount(animate);
	}

	try {
		chrome.storage.onChanged.addListener((changes, area) => {
			if (area === 'local' && changes[KEY]) apply(changes[KEY].newValue, true);
		});
		// Lets the background script tell after an update whether this page runs the new version.
		chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
			if (msg && msg.action === 'brAlive?') sendResponse({ alive: true });
		});
	} catch (e) {}

	function start() {
		store.get([KEY]).then(v => apply(v[KEY]));
	}
	if (document.body) start();
	else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
