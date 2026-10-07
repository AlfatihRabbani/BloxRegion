/*
 * BloxRegion 2.0 — content script
 *
 * Scans every public server of the current Roblox experience, resolves each one to
 * its datacenter, and presents them in a Liquid Glass window opened from a button
 * next to Roblox's Play button.
 *
 * Rendering never uses innerHTML, and nothing here touches DOM that Roblox's React
 * tree owns: the launcher is inserted beside the Play button's React root, never
 * inside it.
 */
(() => {
	'use strict';

	if (window.top !== window || window.__bloxRegion2) return;
	const placeMatch = location.pathname.match(/\/games\/(\d+)/);
	if (!placeMatch) return;
	window.__bloxRegion2 = true;
	const placeId = placeMatch[1];

	const VERSION = (() => {
		try { return chrome.runtime.getManifest().version; } catch (e) { return '2.0'; }
	})();
	const REDUCED_MOTION = (() => {
		try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; }
	})();

	// ---------------------------------------------------------------------------
	// Region data
	// ---------------------------------------------------------------------------

	const DEFAULT_REGIONS = ['SG', 'DE', 'FR', 'JP', 'BR', 'NL', 'US-CA', 'US-VA', 'US-IL', 'US-TX', 'US-FL', 'US-NY', 'US-WA', 'AU', 'GB', 'IN'];

	const REGIONS = {
		'SG': { city: 'Singapore', la: 1.3521, lo: 103.8198 },
		'JP': { city: 'Tokyo', la: 35.6895, lo: 139.6917 },
		'IN': { city: 'Mumbai', la: 19.076, lo: 72.8777 },
		'HK': { city: 'Hong Kong', la: 22.3193, lo: 114.1694 },
		'KR': { city: 'Seoul', la: 37.5665, lo: 126.978 },
		'AU': { city: 'Sydney', la: -33.8688, lo: 151.2093 },
		'DE': { city: 'Frankfurt', la: 50.1109, lo: 8.6821 },
		'FR': { city: 'Paris', la: 48.8566, lo: 2.3522 },
		'NL': { city: 'Amsterdam', la: 52.3676, lo: 4.9041 },
		'GB': { city: 'London', la: 51.5074, lo: -0.1278 },
		'IE': { city: 'Dublin', la: 53.3498, lo: -6.2603 },
		'PL': { city: 'Warsaw', la: 52.2297, lo: 21.0122 },
		'BR': { city: 'São Paulo', la: -23.5505, lo: -46.6333 },
		'US-CA': { city: 'Los Angeles', la: 34.0522, lo: -118.2437 },
		'US-VA': { city: 'Ashburn', la: 39.0438, lo: -77.4874 },
		'US-IL': { city: 'Chicago', la: 41.8781, lo: -87.6298 },
		'US-TX': { city: 'Dallas', la: 32.7767, lo: -96.797 },
		'US-FL': { city: 'Miami', la: 25.7617, lo: -80.1918 },
		'US-NY': { city: 'New York', la: 40.7128, lo: -74.006 },
		'US-WA': { city: 'Seattle', la: 47.6062, lo: -122.3321 },
		'US-GA': { city: 'Atlanta', la: 33.749, lo: -84.388 },
		'US-NJ': { city: 'Secaucus', la: 40.7895, lo: -74.0565 },
		'US-OR': { city: 'Boardman', la: 45.8399, lo: -119.7006 },
		'US-OH': { city: 'Columbus', la: 39.9612, lo: -82.9988 }
	};

	// Roblox's own datacenter blocks (128.116.x.0/24). Bundled so the common case
	// resolves instantly instead of waiting on a multi-megabyte IP map download.
	const ROBLOX_SUBNETS = {
		'1': ['US-CA', 'Los Angeles', 34.0522, -118.2437],
		'5': ['DE', 'Frankfurt', 50.1155, 8.6842],
		'13': ['FR', 'Paris', 48.8534, 2.3488],
		'21': ['NL', 'Amsterdam', 52.374, 4.8897],
		'22': ['US-GA', 'Atlanta', 33.749, -84.388],
		'31': ['GB', 'London', 51.5085, -0.1257],
		'32': ['US-NY', 'New York', 40.7143, -74.006],
		'33': ['GB', 'London', 51.513, -0.08],
		'44': ['DE', 'Frankfurt', 50.1155, 8.6842],
		'45': ['US-FL', 'Miami', 25.7743, -80.1937],
		'46': ['SG', 'Singapore', 1.2897, 103.8501],
		'48': ['US-IL', 'Chicago', 41.85, -87.65],
		'50': ['SG', 'Singapore', 1.2897, 103.8501],
		'51': ['AU', 'Sydney', -33.8678, 151.2073],
		'53': ['US-VA', 'Ashburn', 39.0437, -77.4875],
		'54': ['SG', 'Singapore', 1.2897, 103.8501],
		'55': ['JP', 'Tokyo', 35.6895, 139.6917],
		'56': ['US-VA', 'Leesburg', 39.1157, -77.5636],
		'63': ['US-CA', 'Los Angeles', 34.0522, -118.2437],
		'86': ['BR', 'São Paulo', -23.5505, -46.6333],
		'95': ['US-TX', 'Dallas', 32.7831, -96.8067],
		'97': ['SG', 'Singapore', 1.2897, 103.8501],
		'104': ['IN', 'Mumbai', 19.0728, 72.8826],
		'115': ['US-WA', 'Seattle', 47.6062, -122.3321],
		'127': ['US-FL', 'Miami', 25.7743, -80.1937]
	};
	const REMOTE_IP_MAP = 'https://raw.githubusercontent.com/RoRegion/Storage/refs/heads/main/regionList.json';

	const US_STATES = {
		AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California', CO: 'Colorado', CT: 'Connecticut',
		DE: 'Delaware', FL: 'Florida', GA: 'Georgia', HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa',
		KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine', MD: 'Maryland', MA: 'Massachusetts', MI: 'Michigan',
		MN: 'Minnesota', MS: 'Mississippi', MO: 'Missouri', MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire',
		NJ: 'New Jersey', NM: 'New Mexico', NY: 'New York', NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio',
		OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina', SD: 'South Dakota',
		TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont', VA: 'Virginia', WA: 'Washington', WV: 'West Virginia',
		WI: 'Wisconsin', WY: 'Wyoming', DC: 'Washington, D.C.'
	};

	const CONTINENTS = ['Asia', 'Europe', 'North America', 'South America', 'Oceania', 'Africa'];
	const CONTINENT_OF = {};
	[
		['Asia', 'SG JP IN HK KR TW CN ID MY TH PH VN AE SA IL TR QA BH KW PK BD LK KZ'],
		['Europe', 'DE FR NL GB IE PL ES IT SE NO FI DK BE AT CH PT CZ RO HU GR UA BG RS HR SK LT LV EE LU IS'],
		['North America', 'US CA MX PR CR PA GT'],
		['South America', 'BR AR CL CO PE VE UY EC PY BO'],
		['Oceania', 'AU NZ'],
		['Africa', 'ZA EG NG KE MA GH TN']
	].forEach(([name, list]) => list.split(' ').forEach(cc => { CONTINENT_OF[cc] = name; }));

	const displayNames = (() => {
		try { return new Intl.DisplayNames(['en'], { type: 'region' }); } catch (e) { return null; }
	})();
	function countryName(cc) {
		if (cc === 'US') return 'United States';
		if (cc === 'GB') return 'United Kingdom';
		try { return (displayNames && displayNames.of(cc)) || cc; } catch (e) { return cc; }
	}

	// ---------------------------------------------------------------------------
	// State
	// ---------------------------------------------------------------------------

	const S = {
		servers: new Map(),     // id -> server, in list order
		placeOf: new Map(),     // id -> { c: regionCode, l: { la, lo } | null }
		counts: Object.create(null),
		byRegion: new Map(),    // regionCode -> server[]
		unresolved: 0,
		dynRegions: new Map(),  // regions we only learned about from the IP map
		userLoc: null,
		userLocSrc: null,
		user: null,
		csrf: null,
		authError: null,        // null | 'auth' | 'csrf'
		jobCache: new Map(),    // id -> [code, la, lo, city, savedAt]
		jobCacheDirty: false,
		jobIndex: [],
		subnetCache: new Map(), // subnet -> [code, city, la, lo, savedAt]
		subnetDirty: false
	};

	const SCAN_MIN = 3;
	const SCAN_START = 8;
	const SCAN_MAX = 16;
	const SCAN = {
		run: 0,
		active: false,
		pagesDone: true,
		queue: [],
		listed: 0,
		done: 0,
		conc: SCAN_START,
		okStreak: 0,
		coolUntil: 0,
		pausedUntil: 0,
		lastBackoff: 0,
		startedAt: 0,
		endedAt: 0,
		waiters: []
	};

	const JOB_TTL = 45 * 60 * 1000;
	const SUBNET_TTL = 14 * 24 * 60 * 60 * 1000;
	const GEO_LOC_TTL = 12 * 60 * 60 * 1000;
	const JOB_KEY = 'brJobs:' + placeId;

	const UI = {
		root: null,
		closing: false,
		view: null,
		selKey: 'overview',
		search: '',
		sort: 'best',
		rows: new Map(),
		sections: new Map(),
		sideReady: false
	};

	// ---------------------------------------------------------------------------
	// Small utilities
	// ---------------------------------------------------------------------------

	const sleep = ms => new Promise(r => setTimeout(r, ms));
	// Skip no-op writes so per-tick updates don't churn the DOM.
	const setText = (el, text) => {
		if (el.textContent !== text) el.textContent = text;
	};
	const fmt = n => (n || 0).toLocaleString('en-US');

	const store = {
		get(keys) {
			return new Promise(resolve => {
				try { chrome.storage.local.get(keys, v => resolve(v || {})); } catch (e) { resolve({}); }
			});
		},
		set(obj) { try { chrome.storage.local.set(obj); } catch (e) {} },
		remove(keys) { try { chrome.storage.local.remove(keys); } catch (e) {} }
	};

	function sendMsg(msg) {
		return new Promise(resolve => {
			try {
				chrome.runtime.sendMessage(msg, res => {
					void chrome.runtime.lastError;
					resolve(res);
				});
			} catch (e) { resolve(null); }
		});
	}
	const runInPage = code => sendMsg({ action: 'injectScript', codeToInject: code });

	function h(tag, props, ...kids) {
		const el = document.createElement(tag);
		if (props) {
			for (const key of Object.keys(props)) {
				const v = props[key];
				if (v == null || v === false) continue;
				if (key === 'class') el.className = v;
				else if (key === 'text') el.textContent = v;
				else if (key.startsWith('on') && typeof v === 'function') el.addEventListener(key.slice(2), v);
				else el.setAttribute(key, v === true ? '' : String(v));
			}
		}
		for (const kid of kids.flat(Infinity)) {
			if (kid == null || kid === false) continue;
			el.append(typeof kid === 'object' ? kid : String(kid));
		}
		return el;
	}

	const SVGNS = 'http://www.w3.org/2000/svg';
	function svgEl(tag, attrs) {
		const el = document.createElementNS(SVGNS, tag);
		if (attrs) for (const key of Object.keys(attrs)) el.setAttribute(key, String(attrs[key]));
		return el;
	}

	const ICONS = {
		globe: [['circle', { cx: 12, cy: 12, r: 9 }], ['path', { d: 'M3 12h18' }], ['path', { d: 'M12 3c2.6 2.6 3.9 5.6 3.9 9s-1.3 6.4-3.9 9c-2.6-2.6-3.9-5.6-3.9-9S9.4 5.6 12 3z' }]],
		search: [['circle', { cx: 11, cy: 11, r: 6.5 }], ['path', { d: 'M16 16l4.5 4.5' }]],
		close: [['path', { d: 'M6.5 6.5l11 11M17.5 6.5l-11 11' }]],
		refresh: [['path', { d: 'M19.5 11.5a7.5 7.5 0 1 1-2.2-5.3' }], ['path', { d: 'M19.5 4.5v5h-5' }]],
		play: [['path', { d: 'M8 5.4v13.2a1 1 0 0 0 1.52.85l10.6-6.6a1 1 0 0 0 0-1.7L9.52 4.55A1 1 0 0 0 8 5.4z' }]],
		house: [['path', { d: 'M4.5 10.4L12 4.5l7.5 5.9v8.1a1 1 0 0 1-1 1h-4v-5.2h-5v5.2h-4a1 1 0 0 1-1-1z' }]],
		star: [['path', { d: 'M12 3.8l2.45 4.97 5.48.8-3.97 3.86.94 5.46L12 16.3l-4.9 2.58.94-5.46L4.07 9.57l5.48-.8z' }]],
		people: [['circle', { cx: 9, cy: 8.5, r: 3.2 }], ['path', { d: 'M3.5 19c.6-3.2 2.8-5 5.5-5s4.9 1.8 5.5 5' }], ['path', { d: 'M15.5 5.6a3 3 0 0 1 0 5.8' }], ['path', { d: 'M17.5 14.2c1.6.6 2.7 2.2 3 4.8' }]],
		server: [['rect', { x: 4, y: 4.5, width: 16, height: 6.5, rx: 2 }], ['rect', { x: 4, y: 13, width: 16, height: 6.5, rx: 2 }], ['path', { d: 'M8 7.75h.01M8 16.25h.01' }]],
		bolt: [['path', { d: 'M13 3.5L5.5 13.5h5.5L10.5 20.5 18.5 10.5H13z' }]],
		chevron: [['path', { d: 'M9.5 6.5l5.5 5.5-5.5 5.5' }]],
		layers: [['path', { d: 'M12 4.5l8 4-8 4-8-4z' }], ['path', { d: 'M4 12.5l8 4 8-4' }], ['path', { d: 'M4 16.5l8 4 8-4' }]],
		terminal: [['rect', { x: 3.5, y: 4.5, width: 17, height: 15, rx: 3 }], ['path', { d: 'M7.5 9.5l3 2.5-3 2.5M12.5 15h4' }]],
		info: [['circle', { cx: 12, cy: 12, r: 9 }], ['path', { d: 'M12 11v5.5M12 7.8h.01' }]],
		warn: [['path', { d: 'M10.3 4.6L3.2 17.2a2 2 0 0 0 1.7 3h14.2a2 2 0 0 0 1.7-3L13.7 4.6a2 2 0 0 0-3.4 0z' }], ['path', { d: 'M12 9.5v4.5M12 17h.01' }]]
	};
	const FILLED_ICONS = new Set(['play', 'star']);

	function icon(name) {
		const filled = FILLED_ICONS.has(name);
		const svg = svgEl('svg', filled
			? { viewBox: '0 0 24 24', class: 'br-icon is-filled', fill: 'currentColor', 'aria-hidden': 'true' }
			: { viewBox: '0 0 24 24', class: 'br-icon', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.8', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'aria-hidden': 'true' });
		for (const [tag, attrs] of ICONS[name] || []) svg.appendChild(svgEl(tag, attrs));
		return svg;
	}

	// Flags are drawn as inline SVG (Roblox's CSP blocks third-party flag images).
	const H3 = (a, b, c) => [['rect', { width: 30, height: 6.7, fill: a }], ['rect', { y: 6.65, width: 30, height: 6.7, fill: b }], ['rect', { y: 13.3, width: 30, height: 6.7, fill: c }]];
	const V3 = (a, b, c) => [['rect', { width: 10.05, height: 20, fill: a }], ['rect', { x: 10, width: 10.05, height: 20, fill: b }], ['rect', { x: 20, width: 10, height: 20, fill: c }]];
	const UNION = (s) => [
		['path', { d: `M0 0L${30 * s} ${20 * s}M${30 * s} 0L0 ${20 * s}`, stroke: '#fff', 'stroke-width': 4 * s }],
		['path', { d: `M0 0L${30 * s} ${20 * s}M${30 * s} 0L0 ${20 * s}`, stroke: '#C8102E', 'stroke-width': 1.6 * s }],
		['path', { d: `M${15 * s} 0v${20 * s}M0 ${10 * s}h${30 * s}`, stroke: '#fff', 'stroke-width': 6 * s }],
		['path', { d: `M${15 * s} 0v${20 * s}M0 ${10 * s}h${30 * s}`, stroke: '#C8102E', 'stroke-width': 3.4 * s }]
	];
	const FLAGS = {
		SG: [['rect', { width: 30, height: 10, fill: '#EF3340' }], ['rect', { y: 10, width: 30, height: 10, fill: '#fff' }], ['circle', { cx: 6.6, cy: 5, r: 3.4, fill: '#fff' }], ['circle', { cx: 7.9, cy: 5, r: 3.15, fill: '#EF3340' }],
			['circle', { cx: 10.6, cy: 3.3, r: 0.55, fill: '#fff' }], ['circle', { cx: 12.1, cy: 4.4, r: 0.55, fill: '#fff' }], ['circle', { cx: 11.5, cy: 6.2, r: 0.55, fill: '#fff' }], ['circle', { cx: 9.7, cy: 6.2, r: 0.55, fill: '#fff' }], ['circle', { cx: 9.1, cy: 4.4, r: 0.55, fill: '#fff' }]],
		DE: H3('#000', '#DD0000', '#FFCE00'),
		NL: H3('#AE1C28', '#fff', '#21468B'),
		IN: [...H3('#FF9933', '#fff', '#138808'), ['circle', { cx: 15, cy: 10, r: 2.3, fill: 'none', stroke: '#000080', 'stroke-width': 0.7 }]],
		FR: V3('#0055A4', '#fff', '#EF4135'),
		IT: V3('#009246', '#fff', '#CE2B37'),
		IE: V3('#169B62', '#fff', '#FF883E'),
		MX: [...V3('#006847', '#fff', '#CE1126'), ['circle', { cx: 15, cy: 10, r: 1.8, fill: '#8C6A3A' }]],
		JP: [['rect', { width: 30, height: 20, fill: '#fff' }], ['circle', { cx: 15, cy: 10, r: 6, fill: '#BC002D' }]],
		PL: [['rect', { width: 30, height: 10, fill: '#fff' }], ['rect', { y: 10, width: 30, height: 10, fill: '#DC143C' }]],
		ES: [['rect', { width: 30, height: 20, fill: '#AA151B' }], ['rect', { y: 5, width: 30, height: 10, fill: '#F1BF00' }]],
		SE: [['rect', { width: 30, height: 20, fill: '#006AA7' }], ['path', { d: 'M11 0v20M0 10h30', stroke: '#FECC00', 'stroke-width': 3.6 }]],
		BR: [['rect', { width: 30, height: 20, fill: '#009C3B' }], ['path', { d: 'M15 2.4L27.4 10 15 17.6 2.6 10z', fill: '#FFDF00' }], ['circle', { cx: 15, cy: 10, r: 4.6, fill: '#002776' }], ['path', { d: 'M10.6 9.2c3-.7 6.2-.2 8.9 1.3', stroke: '#fff', 'stroke-width': 0.8, fill: 'none' }]],
		US: (() => {
			const out = [['rect', { width: 30, height: 20, fill: '#fff' }]];
			for (let i = 0; i < 13; i += 2) out.push(['rect', { y: i * 20 / 13, width: 30, height: 20 / 13, fill: '#B22234' }]);
			out.push(['rect', { width: 12.6, height: 20 * 7 / 13, fill: '#3C3B6E' }]);
			for (let r = 0; r < 4; r++) for (let c = 0; c < 5; c++) out.push(['circle', { cx: 1.5 + c * 2.4 + (r % 2) * 1.2, cy: 1.6 + r * 2.5, r: 0.45, fill: '#fff' }]);
			return out;
		})(),
		GB: [['rect', { width: 30, height: 20, fill: '#012169' }], ...UNION(1)],
		AU: [['rect', { width: 30, height: 20, fill: '#012169' }], ...UNION(0.5), ['circle', { cx: 7.5, cy: 15, r: 1.6, fill: '#fff' }],
			['circle', { cx: 22.5, cy: 4.4, r: 0.9, fill: '#fff' }], ['circle', { cx: 19.4, cy: 9.6, r: 0.9, fill: '#fff' }], ['circle', { cx: 25.6, cy: 8.6, r: 0.9, fill: '#fff' }], ['circle', { cx: 22.5, cy: 16, r: 0.9, fill: '#fff' }], ['circle', { cx: 24, cy: 11.8, r: 0.5, fill: '#fff' }]],
		NZ: [['rect', { width: 30, height: 20, fill: '#012169' }], ...UNION(0.5), ['circle', { cx: 22.5, cy: 4.6, r: 1, fill: '#CC142B' }], ['circle', { cx: 19.6, cy: 9.4, r: 1, fill: '#CC142B' }], ['circle', { cx: 25.4, cy: 8.6, r: 1, fill: '#CC142B' }], ['circle', { cx: 22.5, cy: 15.6, r: 1, fill: '#CC142B' }]],
		HK: [['rect', { width: 30, height: 20, fill: '#DE2910' }], ['circle', { cx: 15, cy: 10, r: 4.4, fill: '#fff' }], ['circle', { cx: 15, cy: 10, r: 1.3, fill: '#DE2910' }]],
		KR: [['rect', { width: 30, height: 20, fill: '#fff' }], ['circle', { cx: 15, cy: 10, r: 4.8, fill: '#0047A0' }], ['path', { d: 'M10.2 10a4.8 4.8 0 0 1 9.6 0 2.4 2.4 0 0 1-4.8 0 2.4 2.4 0 0 0-4.8 0z', fill: '#CD2E3A' }],
			['path', { d: 'M4.5 5.2l2.6-1.9M5.1 6.1l2.6-1.9M22.9 3.3l2.6 1.9M22.3 4.2l2.6 1.9M4.5 14.8l2.6 1.9M5.1 13.9l2.6 1.9M22.9 16.7l2.6-1.9M22.3 15.8l2.6-1.9', stroke: '#000', 'stroke-width': 0.6 }]],
		CA: [['rect', { width: 30, height: 20, fill: '#fff' }], ['rect', { width: 7.5, height: 20, fill: '#D80621' }], ['rect', { x: 22.5, width: 7.5, height: 20, fill: '#D80621' }], ['path', { d: 'M15 4.6l1.1 2.2 1.5-.5-.5 2.8 1.6-.8-.3 1.5 1.4.4-2.5 1.9-.2 1.5h-1.5v2.2h-1.2v-2.2h-1.5l-.2-1.5-2.5-1.9 1.4-.4-.3-1.5 1.6.8-.5-2.8 1.5.5z', fill: '#D80621' }]],
		AE: [...H3('#00732F', '#fff', '#000'), ['rect', { width: 8, height: 20, fill: '#FF0000' }]]
	};

	function flag(code, size) {
		const cc = String(code || '').slice(0, 2).toUpperCase();
		const wrap = h('span', { class: 'br-flag' + (size ? ' is-' + size : ''), 'aria-hidden': 'true' });
		const shapes = FLAGS[cc];
		if (shapes) {
			const svg = svgEl('svg', { viewBox: '0 0 30 20', preserveAspectRatio: 'xMidYMid slice' });
			for (const [tag, attrs] of shapes) svg.appendChild(svgEl(tag, attrs));
			wrap.append(svg);
		} else {
			let hash = 0;
			for (const ch of cc) hash = (hash * 31 + ch.charCodeAt(0)) % 360;
			wrap.classList.add('is-code');
			wrap.style.background = `linear-gradient(135deg, hsl(${hash} 68% 56%), hsl(${(hash + 40) % 360} 70% 42%))`;
			wrap.textContent = cc || '?';
		}
		return wrap;
	}

	// ---------------------------------------------------------------------------
	// Motion: real spring curves expressed as CSS linear() easings
	// ---------------------------------------------------------------------------

	const MOTION = (() => {
		let supported = false;
		try { supported = CSS.supports('transition-timing-function', 'linear(0, 0.5 50%, 1)'); } catch (e) {}
		if (!supported) return null;
		function spring(stiffness, damping) {
			const dt = 1 / 600;
			let x = 0, v = 0, t = 0;
			const xs = [0];
			while (t < 2.5) {
				const a = -stiffness * (x - 1) - damping * v;
				v += a * dt;
				x += v * dt;
				t += dt;
				xs.push(x);
				if (t > 0.05 && Math.abs(x - 1) < 0.0015 && Math.abs(v) < 0.02) break;
			}
			const points = [];
			const steps = 40;
			for (let i = 0; i <= steps; i++) {
				const idx = Math.min(xs.length - 1, Math.round((i / steps) * (xs.length - 1)));
				points.push(+xs[idx].toFixed(4));
			}
			points[0] = 0;
			points[steps] = 1;
			return { easing: 'linear(' + points.join(', ') + ')', ms: Math.round(t * 1000) };
		}
		return { smooth: spring(210, 25), bouncy: spring(320, 21) };
	})();

	function applyMotion(el) {
		if (!MOTION) return;
		el.style.setProperty('--br-spring', MOTION.smooth.easing);
		el.style.setProperty('--br-spring-dur', MOTION.smooth.ms + 'ms');
		el.style.setProperty('--br-bouncy', MOTION.bouncy.easing);
		el.style.setProperty('--br-bouncy-dur', MOTION.bouncy.ms + 'ms');
	}

	function restartAnimation(el, cls) {
		el.classList.remove(cls);
		void el.offsetWidth;
		el.classList.add(cls);
	}

	function currentTheme() {
		const b = document.body;
		if (b && b.classList.contains('dark-theme')) return 'dark';
		if (b && b.classList.contains('light-theme')) return 'light';
		try { return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; } catch (e) { return 'dark'; }
	}
	function applyTheme(el) {
		const dark = currentTheme() === 'dark';
		el.classList.toggle('br-dark', dark);
		el.classList.toggle('br-light', !dark);
	}

	function trackShine(e) {
		const target = e.target && e.target.closest && e.target.closest('.br-shine, #br-launch');
		if (!target) return;
		const r = target.getBoundingClientRect();
		target.style.setProperty('--mx', (e.clientX - r.left) + 'px');
		target.style.setProperty('--my', (e.clientY - r.top) + 'px');
	}

	// ---------------------------------------------------------------------------
	// Regions, distance and ping estimates
	// ---------------------------------------------------------------------------

	const regionMemo = new Map();
	function regionInfo(code) {
		let info = regionMemo.get(code);
		if (info) return info;
		const base = REGIONS[code] || S.dynRegions.get(code) || {};
		const cc = code.slice(0, 2);
		const isUS = code.startsWith('US-');
		const state = isUS ? (US_STATES[code.slice(3)] || code.slice(3)) : null;
		const country = countryName(cc);
		info = {
			code,
			cc,
			state,
			country,
			city: base.city || (isUS ? state : country),
			la: typeof base.la === 'number' ? base.la : null,
			lo: typeof base.lo === 'number' ? base.lo : null,
			continent: CONTINENT_OF[cc] || 'Other'
		};
		regionMemo.set(code, info);
		return info;
	}
	const regionTitle = code => regionInfo(code).city;
	function regionPlace(code) {
		const r = regionInfo(code);
		if (r.state) return r.state + ', US';
		return r.city === r.country ? '' : r.country;
	}
	function regionFullName(code) {
		const place = regionPlace(code);
		return place ? regionTitle(code) + ', ' + place : regionTitle(code);
	}
	const regionSearchText = code => {
		const r = regionInfo(code);
		return [code, r.city, r.country, r.state, r.continent].filter(Boolean).join(' ').toLowerCase();
	};

	function distanceKm(a, b) {
		const rad = d => d * Math.PI / 180;
		const dLa = rad(b.la - a.la), dLo = rad(b.lo - a.lo);
		const x = Math.sin(dLa / 2) ** 2 + Math.cos(rad(a.la)) * Math.cos(rad(b.la)) * Math.sin(dLo / 2) ** 2;
		return 6371 * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
	}
	function regionDistance(code) {
		const r = regionInfo(code);
		if (!S.userLoc || r.la == null) return NaN;
		return distanceKm(S.userLoc, r);
	}
	// Rough round-trip estimate: ~10 ms of overhead plus fibre distance.
	const estPing = km => Math.round(10 + km / 70);
	const regionPing = code => {
		const d = regionDistance(code);
		return Number.isFinite(d) ? estPing(d) : NaN;
	};
	function serverPing(server) {
		const p = S.placeOf.get(server.id);
		if (!p || !S.userLoc) return NaN;
		if (p.l) return estPing(distanceKm(S.userLoc, p.l));
		return p.c ? regionPing(p.c) : NaN;
	}
	function pingTier(ms) {
		if (!Number.isFinite(ms)) return '';
		return ms < 80 ? 'good' : ms < 150 ? 'mid' : 'bad';
	}

	function allRegionCodes() {
		const set = new Set(DEFAULT_REGIONS);
		for (const code of Object.keys(S.counts)) set.add(code);
		return [...set];
	}
	function nearestCodes(n) {
		if (!S.userLoc) return [];
		return allRegionCodes()
			.map(code => [code, regionDistance(code)])
			.filter(([, d]) => Number.isFinite(d))
			.sort((a, b) => a[1] - b[1])
			.slice(0, n)
			.map(([code]) => code);
	}
	function sortCodes(codes) {
		return codes.slice().sort((a, b) => {
			const ca = S.counts[a] || 0, cb = S.counts[b] || 0;
			if ((ca > 0) !== (cb > 0)) return ca > 0 ? -1 : 1;
			const da = regionDistance(a), db = regionDistance(b);
			if (Number.isFinite(da) && Number.isFinite(db) && da !== db) return da - db;
			return regionTitle(a).localeCompare(regionTitle(b));
		});
	}
	function continentGroups() {
		const map = new Map();
		for (const code of allRegionCodes()) {
			const name = regionInfo(code).continent;
			if (!map.has(name)) map.set(name, []);
			map.get(name).push(code);
		}
		const minDist = codes => Math.min(...codes.map(regionDistance).filter(Number.isFinite));
		const total = codes => codes.reduce((n, c) => n + (S.counts[c] || 0), 0);
		return [...map.entries()].sort((a, b) => {
			if (a[0] === 'Other') return 1;
			if (b[0] === 'Other') return -1;
			const da = minDist(a[1]), db = minDist(b[1]);
			if (Number.isFinite(da) && Number.isFinite(db) && da !== db) return da - db;
			return total(b[1]) - total(a[1]) || a[0].localeCompare(b[0]);
		});
	}
	function continentServers(name) {
		const out = [];
		for (const [code, list] of S.byRegion) if (regionInfo(code).continent === name) out.push(...list);
		return out;
	}
	const resolvedCount = () => Object.values(S.counts).reduce((a, b) => a + b, 0);
	const onlineRegions = () => Object.keys(S.counts).filter(c => S.counts[c] > 0).length;

	// ---------------------------------------------------------------------------
	// Persistent caches (servers keep their datacenter for their whole lifetime)
	// ---------------------------------------------------------------------------

	async function loadCaches() {
		const v = await store.get([JOB_KEY, 'brJobIndex', 'brSubnets', 'brUserLoc']);
		const now = Date.now();
		const jobs = v[JOB_KEY];
		if (jobs && typeof jobs === 'object') {
			for (const id of Object.keys(jobs)) {
				const e = jobs[id];
				if (Array.isArray(e) && now - e[4] < JOB_TTL) S.jobCache.set(id, e);
			}
		}
		const subnets = v.brSubnets;
		if (subnets && typeof subnets === 'object') {
			for (const key of Object.keys(subnets)) {
				const e = subnets[key];
				if (Array.isArray(e) && now - e[4] < SUBNET_TTL) S.subnetCache.set(key, e);
			}
		}
		S.jobIndex = Array.isArray(v.brJobIndex) ? v.brJobIndex : [];
		const loc = v.brUserLoc;
		if (loc && typeof loc.la === 'number' && typeof loc.lo === 'number' && (loc.src === 'roblox' || now - loc.t < GEO_LOC_TTL)) {
			setUserLoc(loc.la, loc.lo, loc.src, false);
		}
	}

	let saveTimer = 0;
	function queueSave() {
		if (!saveTimer) saveTimer = setTimeout(saveCaches, 3000);
	}
	function saveCaches() {
		clearTimeout(saveTimer);
		saveTimer = 0;
		const now = Date.now();
		if (S.jobCacheDirty) {
			S.jobCacheDirty = false;
			const jobs = {};
			for (const [id, e] of S.jobCache) if (now - e[4] < JOB_TTL) jobs[id] = e;
			// Keep caches for the six most recent experiences only.
			const prev = S.jobIndex || [];
			const keep = [{ p: placeId, t: now }, ...prev.filter(x => x && x.p !== placeId && now - x.t < JOB_TTL).slice(0, 5)];
			const keepSet = new Set(keep.map(x => x.p));
			const drop = prev.filter(x => x && !keepSet.has(x.p)).map(x => 'brJobs:' + x.p);
			S.jobIndex = keep;
			store.set({ [JOB_KEY]: jobs, brJobIndex: keep });
			if (drop.length) store.remove(drop);
		}
		if (S.subnetDirty) {
			S.subnetDirty = false;
			const subnets = {};
			for (const [key, e] of S.subnetCache) subnets[key] = e;
			store.set({ brSubnets: subnets });
		}
	}

	function setUserLoc(la, lo, src, persist = true) {
		if (typeof la !== 'number' || typeof lo !== 'number' || !Number.isFinite(la) || !Number.isFinite(lo)) return;
		if (S.userLocSrc === 'roblox' && src !== 'roblox') return;
		const changed = !S.userLoc || Math.abs(S.userLoc.la - la) > 0.01 || Math.abs(S.userLoc.lo - lo) > 0.01 || S.userLocSrc !== src;
		S.userLoc = { la, lo };
		S.userLocSrc = src;
		if (!changed) return;
		if (persist) store.set({ brUserLoc: { la, lo, src, t: Date.now() } });
		scheduleUpdate();
	}

	async function ensureUserLoc() {
		if (S.userLoc) return;
		const res = await sendMsg({ action: 'brSelfGeo' });
		if (res && res.success) setUserLoc(res.la, res.lo, 'geo');
	}

	async function loadUser() {
		try {
			const res = await fetch('https://users.roblox.com/v1/users/authenticated', { credentials: 'include' });
			if (!res.ok) return;
			const d = await res.json();
			if (!d || !d.id) return;
			S.user = { id: d.id, name: d.name, displayName: d.displayName || d.name, avatar: null };
			scheduleUpdate();
			const t = await fetch(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${encodeURIComponent(d.id)}&size=60x60&format=Png&isCircular=true`, { credentials: 'omit' });
			if (!t.ok) return;
			const td = await t.json();
			const url = td && td.data && td.data[0] && td.data[0].imageUrl;
			if (url) {
				S.user.avatar = url;
				scheduleUpdate();
			}
		} catch (e) {}
	}

	// ---------------------------------------------------------------------------
	// CSRF token (layered so ad blockers that block auth.roblox.com don't break it)
	// ---------------------------------------------------------------------------

	function readMetaCsrf() {
		const meta = document.querySelector('meta[name="csrf-token"]');
		return meta ? (meta.getAttribute('data-token') || meta.getAttribute('content') || null) : null;
	}
	function readMainWorldCsrf() {
		return new Promise(resolve => {
			const code = "try{var t=(window.Roblox&&Roblox.XsrfToken&&Roblox.XsrfToken.getToken&&Roblox.XsrfToken.getToken())||'';var d=document.getElementById('__br_xsrf')||document.createElement('div');d.id='__br_xsrf';d.setAttribute('data-token',t);d.style.display='none';document.documentElement.appendChild(d);}catch(e){}";
			runInPage(code).then(() => {
				setTimeout(() => {
					const el = document.getElementById('__br_xsrf');
					const token = el ? el.getAttribute('data-token') : null;
					if (el) el.remove();
					resolve(token || null);
				}, 60);
			});
		});
	}
	let csrfPending = null;
	async function getCsrf() {
		if (S.csrf) return S.csrf;
		if (!csrfPending) {
			csrfPending = (async () => {
				let token = readMetaCsrf();
				if (!token) token = await readMainWorldCsrf();
				if (!token) {
					try {
						const res = await fetch('https://auth.roblox.com/v2/logout', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' } });
						token = res.headers.get('x-csrf-token');
					} catch (e) {}
				}
				S.csrf = token || null;
				return S.csrf;
			})();
		}
		try { return await csrfPending; } finally { csrfPending = null; }
	}

	// ---------------------------------------------------------------------------
	// IP -> region
	// ---------------------------------------------------------------------------

	let remoteMapPromise = null;
	function loadRemoteMap() {
		if (!remoteMapPromise) {
			remoteMapPromise = fetch(REMOTE_IP_MAP).then(r => (r.ok ? r.json() : null)).catch(() => null);
		}
		return remoteMapPromise;
	}

	const subnetInflight = new Map();
	async function locateIp(address) {
		const parts = String(address).split('.');
		if (parts.length !== 4) return null;
		if (parts[0] === '128' && parts[1] === '116') {
			const b = ROBLOX_SUBNETS[parts[2]];
			if (b) return { code: b[0], city: b[1], la: b[2], lo: b[3] };
		}
		const subnet = parts.slice(0, 3).join('.') + '.0';
		const cached = S.subnetCache.get(subnet);
		if (cached) return { code: cached[0], city: cached[1], la: cached[2], lo: cached[3] };
		if (subnetInflight.has(subnet)) return subnetInflight.get(subnet);

		const pending = (async () => {
			let out = null;
			const map = await loadRemoteMap();
			const e = map && map[subnet];
			if (e && Array.isArray(map._c)) {
				let cc = (map._c[e.co] || [])[1];
				if (cc === 'SP') cc = 'SG';
				if (cc) {
					const state = cc === 'US' && e.r != null && Array.isArray(map._r) ? String(map._r[e.r] || '').replace(/-\d+$/, '') : '';
					out = {
						code: state ? 'US-' + state : cc,
						city: Array.isArray(map._ci) ? map._ci[e.ci] || null : null,
						la: typeof e.la === 'number' ? e.la : null,
						lo: typeof e.lo === 'number' ? e.lo : null
					};
				}
			}
			if (!out) {
				const res = await sendMsg({ action: 'rrLookupIpRegion', ip: address });
				if (res && res.success && res.data && res.data.country) {
					const cc = res.data.country === 'SP' ? 'SG' : res.data.country;
					out = {
						code: cc === 'US' && res.data.region ? 'US-' + res.data.region : cc,
						city: null,
						la: typeof res.data.latitude === 'number' ? res.data.latitude : null,
						lo: typeof res.data.longitude === 'number' ? res.data.longitude : null
					};
				}
			}
			if (out) {
				S.subnetCache.set(subnet, [out.code, out.city, out.la, out.lo, Date.now()]);
				S.subnetDirty = true;
				queueSave();
			}
			return out;
		})();
		subnetInflight.set(subnet, pending);
		try { return await pending; } finally { subnetInflight.delete(subnet); }
	}

	// ---------------------------------------------------------------------------
	// Scanner: a page producer feeding a pool of workers with adaptive concurrency
	// ---------------------------------------------------------------------------

	const passesFilter = s => {
		const playing = s.playing || 0;
		const max = s.maxPlayers || Infinity;
		return !(max > 9 && playing < 5);
	};

	function applyResolution(server, code, la, lo, city) {
		if (S.placeOf.has(server.id)) return;
		const l = typeof la === 'number' && typeof lo === 'number' ? { la, lo } : null;
		S.placeOf.set(server.id, { c: code || '??', l });
		if (!code || code === '??') {
			S.unresolved++;
			return;
		}
		S.counts[code] = (S.counts[code] || 0) + 1;
		let list = S.byRegion.get(code);
		if (!list) S.byRegion.set(code, list = []);
		list.push(server);
		if (!REGIONS[code] && !S.dynRegions.has(code) && l) {
			S.dynRegions.set(code, { city: city || null, la: l.la, lo: l.lo });
			regionMemo.delete(code);
		}
	}

	let warnedNoEndpoint = false;
	async function resolveServer(server, run) {
		if (!S.csrf && !(await getCsrf())) {
			S.authError = 'csrf';
			return 'auth';
		}
		let res = null;
		for (let attempt = 0; attempt < 3; attempt++) {
			try {
				res = await fetch('https://gamejoin.roblox.com/v1/join-game-instance', {
					method: 'POST',
					credentials: 'include',
					headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'X-Csrf-Token': S.csrf },
					body: JSON.stringify({ placeId: Number(placeId), isTeleport: false, gameId: server.id, gameJoinAttemptId: crypto.randomUUID() })
				});
			} catch (e) {
				return 'fail';
			}
			if (res.status === 403) {
				const fresh = res.headers.get('x-csrf-token');
				if (fresh && fresh !== S.csrf) {
					S.csrf = fresh;
					continue;
				}
			}
			break;
		}
		if (run !== SCAN.run) return 'stale';
		if (res.status === 429) return 'limited';
		if (res.status === 401) {
			S.authError = 'auth';
			return 'auth';
		}
		if (!res.ok) return 'fail';
		let data;
		try { data = await res.json(); } catch (e) { return 'fail'; }
		const js = data && data.joinScript;
		if (js && js.SessionId) {
			try {
				const session = JSON.parse(js.SessionId);
				setUserLoc(session.Latitude, session.Longitude, 'roblox');
			} catch (e) {}
		}
		const address = js && js.UdmuxEndpoints && js.UdmuxEndpoints[0] && js.UdmuxEndpoints[0].Address;
		if (!address) {
			if (!warnedNoEndpoint) {
				warnedNoEndpoint = true;
				console.warn('[BloxRegion] join response had no UdmuxEndpoints (status ' + (data && data.status) + ')');
			}
			return 'fail';
		}
		const loc = await locateIp(address);
		if (run !== SCAN.run) return 'stale';
		if (!loc) return 'fail';
		applyResolution(server, loc.code, loc.la, loc.lo, loc.city);
		S.jobCache.set(server.id, [loc.code, loc.la, loc.lo, loc.city, Date.now()]);
		S.jobCacheDirty = true;
		queueSave();
		return 'ok';
	}

	function notifyWork() {
		const waiters = SCAN.waiters;
		SCAN.waiters = [];
		for (const wake of waiters) wake();
	}
	function waitWork(ms) {
		return new Promise(resolve => {
			const timer = setTimeout(done, ms);
			function done() {
				clearTimeout(timer);
				resolve();
			}
			SCAN.waiters.push(done);
		});
	}

	// AIMD: a 429 trims concurrency by 30% (at most once per 700 ms) and backs off only the
	// worker that hit it; a burst of 429s pauses everyone briefly.
	const recentLimits = [];
	async function onRateLimited() {
		const now = Date.now();
		if (now - SCAN.lastBackoff > 700) {
			SCAN.conc = Math.max(SCAN_MIN, Math.floor(SCAN.conc * 0.7));
			SCAN.lastBackoff = now;
		}
		SCAN.okStreak = 0;
		recentLimits.push(now);
		while (recentLimits.length && now - recentLimits[0] > 1000) recentLimits.shift();
		if (recentLimits.length >= 3) SCAN.coolUntil = Math.max(SCAN.coolUntil, now + 800 + Math.random() * 400);
		await sleep(500 + Math.random() * 500);
	}

	async function pageProducer(run) {
		let cursor = '';
		let failures = 0;
		let backoff = 1500;
		while (run === SCAN.run && !S.authError) {
			const hold = SCAN.pausedUntil - Date.now();
			if (hold > 0) {
				await sleep(Math.min(hold, 500));
				continue;
			}
			let res = null;
			try {
				const url = `https://games.roblox.com/v1/games/${placeId}/servers/Public?excludeFullGames=true&sortOrder=Asc&limit=100` + (cursor ? '&cursor=' + encodeURIComponent(cursor) : '');
				res = await fetch(url, { credentials: 'include', headers: { 'Accept': 'application/json' } });
			} catch (e) {}
			if (run !== SCAN.run) return;
			if (!res || res.status === 429 || res.status >= 500) {
				if (++failures > 6) break;
				await sleep(backoff);
				backoff = Math.min(backoff * 2, 16000);
				continue;
			}
			if (!res.ok) break;
			failures = 0;
			backoff = 1500;
			let page;
			try { page = await res.json(); } catch (e) { break; }
			if (run !== SCAN.run) return;
			const now = Date.now();
			for (const server of (page && page.data) || []) {
				if (!server || !server.id || S.servers.has(server.id) || !passesFilter(server)) continue;
				S.servers.set(server.id, server);
				SCAN.listed++;
				const hit = S.jobCache.get(server.id);
				if (hit && now - hit[4] < JOB_TTL) {
					applyResolution(server, hit[0], hit[1], hit[2], hit[3]);
					SCAN.done++;
				} else {
					SCAN.queue.push(server);
				}
			}
			notifyWork();
			scheduleUpdate();
			cursor = page && page.nextPageCursor;
			if (!cursor) break;
			// Listing is cheap; only slow down when the resolver queue is far behind.
			await sleep(SCAN.queue.length > 400 ? 400 : 90);
		}
		SCAN.pagesDone = true;
		notifyWork();
	}

	async function scanWorker(run, slot) {
		while (run === SCAN.run) {
			if (S.authError) return;
			if (slot >= SCAN.conc) {
				if (SCAN.pagesDone && !SCAN.queue.length) return;
				await waitWork(250);
				continue;
			}
			const hold = Math.max(SCAN.coolUntil, SCAN.pausedUntil) - Date.now();
			if (hold > 0) {
				await sleep(Math.min(hold, 400));
				continue;
			}
			const server = SCAN.queue.shift();
			if (!server) {
				if (SCAN.pagesDone) return;
				await waitWork(500);
				continue;
			}
			if (S.placeOf.has(server.id)) continue;
			const result = await resolveServer(server, run);
			if (run !== SCAN.run || result === 'stale') return;
			if (result === 'limited') {
				SCAN.queue.unshift(server);
				await onRateLimited();
				continue;
			}
			if (result === 'auth') {
				SCAN.queue.unshift(server);
				scheduleUpdate();
				return;
			}
			if (result !== 'ok') applyResolution(server, '??');
			SCAN.done++;
			if (result === 'ok' && ++SCAN.okStreak >= SCAN.conc * 2 && SCAN.conc < SCAN_MAX) {
				SCAN.conc++;
				SCAN.okStreak = 0;
				notifyWork();
			}
			scheduleUpdate();
		}
	}

	async function startScan() {
		const run = ++SCAN.run;
		S.servers.clear();
		S.placeOf.clear();
		S.byRegion.clear();
		S.counts = Object.create(null);
		S.unresolved = 0;
		S.authError = null;
		Object.assign(SCAN, {
			active: true, pagesDone: false, queue: [], listed: 0, done: 0,
			conc: SCAN_START, okStreak: 0, coolUntil: 0, startedAt: Date.now(), endedAt: 0
		});
		notifyWork();
		if (UI.view && UI.view.reset) UI.view.reset();
		scheduleUpdate();
		const workers = [pageProducer(run)];
		for (let slot = 0; slot < SCAN_MAX; slot++) workers.push(scanWorker(run, slot));
		await Promise.all(workers);
		if (run !== SCAN.run) return;
		SCAN.active = false;
		SCAN.endedAt = Date.now();
		saveCaches();
		scheduleUpdate();
	}

	function scanProgress() {
		if (!SCAN.active) return 1;
		if (!SCAN.listed) return 0.02;
		return Math.max(0.02, Math.min(1, SCAN.done / SCAN.listed) * (SCAN.pagesDone ? 1 : 0.9));
	}

	// Don't compete with Roblox for gamejoin while the player is actually launching.
	function pauseForLaunch(ms) {
		SCAN.pausedUntil = Math.max(SCAN.pausedUntil, Date.now() + ms);
	}
	document.addEventListener('click', e => {
		const t = e.target && e.target.closest && e.target.closest('[data-testid="play-button"], .btn-common-play-game-lg, .rbx-public-game-server-join, .game-server-join-btn, .rbx-game-server-join');
		if (t && !t.closest('#br-root')) pauseForLaunch(12000);
	}, true);

	// ---------------------------------------------------------------------------
	// Joining
	// ---------------------------------------------------------------------------

	function joinServer(serverId, code) {
		pauseForLaunch(15000);
		runInPage(`(function(){try{var L=window.Roblox&&Roblox.GameLauncher;if(L&&L.joinGameInstance){L.joinGameInstance(${Number(placeId)},${JSON.stringify(String(serverId))});}}catch(e){}})();`);
		toast(code ? 'Launching Roblox · ' + regionTitle(code) : 'Launching Roblox…', 'play');
		setTimeout(closeWindow, 500);
	}

	function joinBest(code) {
		const open = (S.byRegion.get(code) || []).filter(s => !(s.maxPlayers && (s.playing || 0) >= s.maxPlayers));
		if (!open.length) {
			toast(SCAN.active ? `Still looking for ${regionTitle(code)} servers…` : `No open servers in ${regionTitle(code)}`, 'info');
			return;
		}
		let best = null, bestScore = -Infinity;
		for (const s of open) {
			const ping = serverPing(s);
			const pingFactor = Number.isFinite(ping) ? Math.max(0, 1 - ping / 1000) : 0;
			const fps = Math.max(0, Math.min(1, (s.fps || 0) / 60));
			const score = 0.6 * pingFactor + 0.4 * fps + (s.playing || 0) * 1e-4;
			if (score > bestScore) {
				bestScore = score;
				best = s;
			}
		}
		joinServer(best.id, code);
	}

	// ---------------------------------------------------------------------------
	// Launcher button next to Play
	// ---------------------------------------------------------------------------

	const RING_LEN = 2 * Math.PI * 16;
	let launchArc = null;

	function buildLauncher() {
		const btn = h('button', { id: 'br-launch', type: 'button', class: 'br-scope', title: 'BloxRegion — choose a server region', 'aria-label': 'Open BloxRegion server regions' });
		applyTheme(btn);
		applyMotion(btn);
		const ring = svgEl('svg', { class: 'br-launch-ring', viewBox: '0 0 36 36', 'aria-hidden': 'true' });
		ring.appendChild(svgEl('circle', { class: 'br-ring-track', cx: 18, cy: 18, r: 16 }));
		launchArc = svgEl('circle', { class: 'br-ring-arc', cx: 18, cy: 18, r: 16, 'stroke-dasharray': RING_LEN.toFixed(2), 'stroke-dashoffset': RING_LEN.toFixed(2) });
		ring.appendChild(launchArc);
		btn.append(h('span', { class: 'br-launch-glyph' }, icon('globe'), ring));
		btn.addEventListener('click', e => {
			e.preventDefault();
			e.stopPropagation();
			openWindow();
		});
		btn.addEventListener('pointermove', trackShine, { passive: true });
		return btn;
	}

	let playSizeObserver = null;
	function syncLauncherSize() {
		const btn = document.getElementById('br-launch');
		const play = document.querySelector('#game-details-play-button-container [data-testid="play-button"], #game-details-play-button-container .btn-common-play-game-lg');
		if (!btn || !play) return;
		if (play.offsetHeight) btn.style.setProperty('--br-play-h', play.offsetHeight + 'px');
		const radius = getComputedStyle(play).borderTopLeftRadius;
		if (radius && radius !== '0px') btn.style.setProperty('--br-play-r', radius);
	}

	function ensureLauncher() {
		const playRoot = document.getElementById('game-details-play-button-container');
		const host = playRoot && playRoot.parentElement;
		if (!host) return;
		let btn = document.getElementById('br-launch');
		if (btn && btn.parentElement === host && btn.previousElementSibling === playRoot) return;
		if (!btn) btn = buildLauncher();
		// Sibling of the React root, never a child of it.
		playRoot.after(btn);
		host.classList.add('br-launch-host');
		syncLauncherSize();
		if (playSizeObserver) playSizeObserver.disconnect();
		playSizeObserver = new ResizeObserver(syncLauncherSize);
		playSizeObserver.observe(playRoot);
		updateLauncher();
	}

	function updateLauncher() {
		const btn = document.getElementById('br-launch');
		if (!btn) return;
		btn.classList.toggle('is-scanning', SCAN.active && !S.authError);
		if (launchArc) launchArc.setAttribute('stroke-dashoffset', (RING_LEN * (1 - scanProgress())).toFixed(2));
	}

	function watchPage() {
		let queued = false;
		const check = () => {
			queued = false;
			ensureLauncher();
		};
		new MutationObserver(() => {
			if (!queued) {
				queued = true;
				requestAnimationFrame(check);
			}
		}).observe(document.body, { childList: true, subtree: true });
		new MutationObserver(() => {
			const btn = document.getElementById('br-launch');
			if (btn) applyTheme(btn);
			if (UI.root) applyTheme(UI.root);
		}).observe(document.body, { attributes: true, attributeFilter: ['class'] });
		ensureLauncher();
	}

	// ---------------------------------------------------------------------------
	// Window
	// ---------------------------------------------------------------------------

	function gameName() {
		const el = document.querySelector('.game-name, h1.game-name');
		const text = el && el.textContent && el.textContent.trim();
		if (text) return text;
		const og = document.querySelector('meta[property="og:title"]');
		return (og && og.getAttribute('content')) || (document.title || '').split('|')[0].trim();
	}
	function gameArt() {
		const og = document.querySelector('meta[property="og:image"]');
		const url = og && og.getAttribute('content');
		return url && /^https:\/\/[a-z0-9.-]+\.rbxcdn\.com\//i.test(url) ? url : null;
	}

	let prevBodyOverflow = '';
	function openWindow() {
		if (UI.root) return;
		const root = h('div', { id: 'br-root', class: 'br-scope', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'BloxRegion' });
		applyTheme(root);
		applyMotion(root);

		const ambient = h('div', { class: 'br-ambient', 'aria-hidden': 'true' });
		const art = gameArt();
		if (art) ambient.append(h('img', { class: 'br-ambient-img', alt: '', src: art, decoding: 'async' }));
		ambient.append(h('div', { class: 'br-orb is-a' }), h('div', { class: 'br-orb is-b' }), h('div', { class: 'br-orb is-c' }));

		const scrim = h('div', { class: 'br-scrim', onclick: closeWindow });
		const win = h('div', { class: 'br-window' }, buildSidebar(), buildMain());
		win.addEventListener('pointermove', trackShine, { passive: true });
		root.append(scrim, ambient, win);
		// Keep keystrokes typed into the window away from the page's own shortcuts.
		root.addEventListener('keydown', e => e.stopPropagation());

		UI.root = root;
		UI.closing = false;
		UI.sideReady = false;
		UI.selKey = 'overview';
		document.body.append(root);
		prevBodyOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		document.addEventListener('keydown', onKey, true);

		renderSidebar();
		showView(overviewView(), false);
		runUpdate();
		requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add('is-open')));
		setTimeout(() => { if (UI.input) UI.input.focus({ preventScroll: true }); }, 180);
	}

	function closeWindow() {
		const root = UI.root;
		if (!root || UI.closing) return;
		UI.closing = true;
		root.classList.remove('is-open');
		root.classList.add('is-closing');
		document.removeEventListener('keydown', onKey, true);
		setTimeout(() => {
			if (UI.view && UI.view.destroy) UI.view.destroy();
			root.remove();
			document.body.style.overflow = prevBodyOverflow;
			Object.assign(UI, { root: null, closing: false, view: null, input: null, sideList: null, pill: null, consoleHost: null, toastEl: null });
			UI.rows.clear();
			UI.sections.clear();
			UI.sideReady = false;
		}, 260);
	}

	function onKey(e) {
		if (!UI.root) return;
		const typing = e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable);
		if (e.key === 'Escape') {
			e.preventDefault();
			if (UI.input && document.activeElement === UI.input && UI.input.value) {
				setSearch('');
			} else if (UI.consoleHost && UI.consoleHost.firstChild) {
				hideConsole();
			} else {
				closeWindow();
			}
		} else if ((e.key === '/' && !typing) || ((e.ctrlKey || e.metaKey) && String(e.key).toLowerCase() === 'k')) {
			e.preventDefault();
			if (UI.input) {
				UI.input.focus();
				UI.input.select();
			}
		}
	}

	// ----- Sidebar ---------------------------------------------------------------

	function buildSidebar() {
		const input = h('input', { type: 'text', placeholder: 'Search or type a command', spellcheck: 'false', autocomplete: 'off', 'aria-label': 'Search regions or run a command' });
		input.addEventListener('input', () => {
			UI.search = input.value.trim().toLowerCase();
			renderSidebar();
		});
		input.addEventListener('keydown', e => {
			if (e.key !== 'Enter') return;
			e.preventDefault();
			const value = input.value.trim();
			if (!value) return;
			setSearch('');
			runCommand(value);
		});
		const list = h('nav', { class: 'br-side-list', 'aria-label': 'Regions' });
		const pill = h('div', { class: 'br-pill is-off', 'aria-hidden': 'true' });
		list.append(pill);

		const avatar = h('span', { class: 'br-avatar' });
		const userName = h('span', { class: 'br-user-name', text: 'Roblox' });
		const userHandle = h('span', { class: 'br-user-handle', text: 'Not signed in' });
		const live = h('span', { class: 'br-live' }, h('span', { class: 'br-live-dot' }), h('span', { text: '' }));

		UI.input = input;
		UI.sideList = list;
		UI.pill = pill;
		UI.foot = { avatar, userName, userHandle, live, liveText: live.lastChild, avatarUrl: null };

		return h('aside', { class: 'br-sidebar' },
			h('div', { class: 'br-side-head' },
				h('div', { class: 'br-appicon' }, icon('globe')),
				h('div', { class: 'br-app-name' }, h('div', { class: 'br-app-title', text: 'BloxRegion' }), h('div', { class: 'br-app-game', text: gameName() })),
				h('span', { class: 'br-ver', text: 'v' + VERSION })),
			h('label', { class: 'br-search' }, icon('search'), input, h('span', { class: 'br-kbd', text: '/' })),
			list,
			h('div', { class: 'br-side-foot' }, avatar, h('span', { class: 'br-user' }, userName, userHandle), live));
	}

	function setSearch(value) {
		if (!UI.input) return;
		UI.input.value = value;
		UI.search = value.trim().toLowerCase();
		renderSidebar();
	}

	function sidebarModel() {
		const q = UI.search;
		const match = code => !q || regionSearchText(code).includes(q);
		const sections = [];
		if (!q || 'overview home'.includes(q)) sections.push({ id: 'nav', items: [{ key: 'overview', nav: true }] });
		const near = nearestCodes(3).filter(match);
		if (near.length) sections.push({ id: 'near', title: 'Nearest to you', rec: true, items: near.map(code => ({ key: 'near:' + code, code })) });
		for (const [name, codes] of continentGroups()) {
			sections.push({ id: 'c:' + name, title: name, continent: name === 'Other' ? null : name, items: sortCodes(codes).filter(match).map(code => ({ key: name + ':' + code, code })) });
		}
		return sections;
	}

	function buildSection(sec) {
		const el = h('section', { class: 'br-sec' });
		if (sec.title) {
			let header;
			if (sec.continent) {
				header = h('button', { type: 'button', class: 'br-sec-h', title: 'Show every server in ' + sec.continent },
					h('span', { text: sec.title }),
					h('span', { class: 'br-sec-more' }, 'All', icon('chevron')));
				header.addEventListener('click', () => showContinent(sec.continent));
			} else {
				header = h('div', { class: 'br-sec-h' + (sec.rec ? ' is-rec' : '') }, sec.rec ? icon('star') : null, h('span', { text: sec.title }));
			}
			el.append(header);
		}
		const body = h('div', { class: 'br-sec-body' });
		el.append(body);
		return { el, body };
	}

	function buildRow(item) {
		if (item.nav) {
			const el = h('button', { type: 'button', class: 'br-row', 'data-key': item.key },
				h('span', { class: 'br-row-icon' }, icon('house')),
				h('span', { class: 'br-row-text' }, h('span', { class: 'br-row-title', text: 'Overview' }), h('span', { class: 'br-row-sub', text: 'Nearest regions and live stats' })));
			el.addEventListener('click', selectOverview);
			return { el, nav: true };
		}
		const code = item.code;
		const count = h('span', { class: 'br-count', text: '0' });
		const sub = h('span', { class: 'br-row-sub' });
		const quick = h('span', { class: 'br-quick', title: 'Join the best ' + regionTitle(code) + ' server', 'aria-hidden': 'true' }, icon('play'));
		const el = h('button', { type: 'button', class: 'br-row is-empty', 'data-key': item.key, 'aria-label': regionFullName(code) },
			flag(code),
			h('span', { class: 'br-row-text' }, h('span', { class: 'br-row-title', text: regionTitle(code) }), sub),
			count,
			quick);
		el.addEventListener('click', e => {
			if (e.target.closest('.br-quick')) {
				e.stopPropagation();
				joinBest(code);
				return;
			}
			selectRegion(code, item.key);
		});
		return { el, code, countEl: count, subEl: sub, lastCount: 0, lastSub: null };
	}

	function updateRow(row) {
		if (row.nav) return;
		const n = S.counts[row.code] || 0;
		if (n !== row.lastCount) {
			row.countEl.textContent = fmt(n);
			if (row.lastCount === 0 && n > 0 && UI.sideReady) restartAnimation(row.countEl, 'is-bump');
			row.el.classList.toggle('is-empty', n === 0);
			row.lastCount = n;
		}
		const place = regionPlace(row.code);
		const ping = regionPing(row.code);
		const key = place + '|' + ping;
		if (key === row.lastSub) return;
		row.lastSub = key;
		row.subEl.textContent = '';
		if (place) row.subEl.append(place);
		if (Number.isFinite(ping)) {
			if (place) row.subEl.append(h('span', { text: '·' }));
			row.subEl.append(h('span', { class: 'br-dot is-' + pingTier(ping) }), '~' + ping + ' ms');
		}
		if (!row.subEl.firstChild) row.subEl.append(regionInfo(row.code).continent);
	}

	function renderSidebar() {
		const list = UI.sideList;
		if (!list) return;
		const model = sidebarModel();
		const animate = UI.sideReady && !REDUCED_MOTION;
		const before = new Map();
		if (animate) {
			for (const [key, row] of UI.rows) if (row.el.offsetParent) before.set(key, row.el.offsetTop);
		}

		const seen = new Set();
		const liveSections = new Set();
		let index = 1; // the selection pill is always the list's first child
		for (const sec of model) {
			liveSections.add(sec.id);
			let section = UI.sections.get(sec.id);
			if (!section) {
				section = buildSection(sec);
				UI.sections.set(sec.id, section);
			}
			section.el.classList.toggle('is-hidden', sec.items.length === 0);
			if (list.children[index] !== section.el) list.insertBefore(section.el, list.children[index] || null);
			index++;
			sec.items.forEach((item, i) => {
				let row = UI.rows.get(item.key);
				if (!row) {
					row = buildRow(item);
					UI.rows.set(item.key, row);
					if (UI.sideReady) row.el.classList.add('is-new');
				}
				updateRow(row);
				if (section.body.children[i] !== row.el) section.body.insertBefore(row.el, section.body.children[i] || null);
				seen.add(item.key);
			});
			while (section.body.children.length > sec.items.length) section.body.lastElementChild.remove();
		}
		for (const [id, section] of UI.sections) {
			if (!liveSections.has(id)) {
				section.el.remove();
				UI.sections.delete(id);
			}
		}
		for (const [key, row] of UI.rows) {
			if (!seen.has(key)) {
				row.el.remove();
				UI.rows.delete(key);
			}
		}

		// FLIP: rows that changed position glide to their new place on a spring.
		if (animate) {
			const moved = [];
			for (const [key, row] of UI.rows) {
				const from = before.get(key);
				if (from == null || !row.el.offsetParent) continue;
				const delta = from - row.el.offsetTop;
				if (Math.abs(delta) < 0.5) continue;
				row.el.style.transition = 'none';
				row.el.style.transform = `translateY(${delta}px)`;
				moved.push(row.el);
			}
			if (moved.length) {
				void list.offsetHeight;
				requestAnimationFrame(() => {
					for (const el of moved) {
						el.style.transition = '';
						el.style.transform = '';
					}
				});
			}
		}
		UI.sideReady = true;
		positionPill(animate);
	}

	function positionPill(animate) {
		const pill = UI.pill;
		if (!pill) return;
		const sel = UI.selKey ? UI.rows.get(UI.selKey) : null;
		for (const [key, row] of UI.rows) row.el.classList.toggle('is-selected', key === UI.selKey);
		if (!sel || !sel.el.offsetParent) {
			pill.classList.add('is-off');
			return;
		}
		const y = sel.el.offsetTop;
		const height = sel.el.offsetHeight;
		if (!animate || pill.classList.contains('is-off')) {
			pill.style.transition = 'none';
			pill.style.transform = `translateY(${y}px)`;
			pill.style.height = height + 'px';
			void pill.offsetHeight;
			pill.style.transition = '';
		} else {
			pill.style.transform = `translateY(${y}px)`;
			pill.style.height = height + 'px';
		}
		pill.classList.remove('is-off');
	}

	function updateFoot() {
		const f = UI.foot;
		if (!f) return;
		if (S.user) {
			setText(f.userName, S.user.displayName);
			setText(f.userHandle, '@' + S.user.name);
			if (S.user.avatar && f.avatarUrl !== S.user.avatar) {
				f.avatarUrl = S.user.avatar;
				const img = h('img', { alt: '', src: S.user.avatar });
				img.addEventListener('load', () => img.classList.add('is-loaded'));
				f.avatar.textContent = '';
				f.avatar.append(img);
			}
		}
		const scanning = SCAN.active && !S.authError;
		f.live.classList.toggle('is-on', scanning);
		setText(f.liveText, S.authError ? 'Paused' : scanning ? 'Scanning' : 'Up to date');
	}

	// ----- Main column ----------------------------------------------------------

	const SORTS = [['best', 'Best ping'], ['most', 'Most players'], ['fewest', 'Fewest']];

	function buildMain() {
		const titleFlag = h('span', { class: 'br-title-flag' });
		const title = h('h2', { class: 'br-title' });
		const subtitle = h('div', { class: 'br-subtitle' });
		const titleWrap = h('div', { class: 'br-title-wrap' }, titleFlag, h('div', { class: 'br-title-text' }, title, subtitle));

		const seg = h('div', { class: 'br-seg is-hidden-soft', role: 'tablist', 'aria-label': 'Sort servers' });
		const thumb = h('span', { class: 'br-seg-thumb', 'aria-hidden': 'true' });
		seg.append(thumb);
		const segOpts = SORTS.map(([key, label]) => {
			const b = h('button', { type: 'button', class: 'br-seg-opt', role: 'tab', text: label });
			b.addEventListener('click', () => setSort(key));
			seg.append(b);
			return [key, b];
		});

		const refreshBtn = h('button', { type: 'button', class: 'br-iconbtn', title: 'Refresh servers', 'aria-label': 'Refresh servers' }, icon('refresh'));
		refreshBtn.addEventListener('click', refresh);
		const closeBtn = h('button', { type: 'button', class: 'br-iconbtn', title: 'Close (Esc)', 'aria-label': 'Close' }, icon('close'));
		closeBtn.addEventListener('click', closeWindow);

		const bar = h('div', { class: 'br-progress-bar' });
		const progress = h('div', { class: 'br-progress is-done', 'aria-hidden': 'true' }, bar);
		const consoleHost = h('div', { class: 'br-console-host' });
		const views = h('div', { class: 'br-views' });
		const toastEl = h('div', { class: 'br-toast', role: 'status', 'aria-live': 'polite' });

		Object.assign(UI, { titleWrap, titleFlag, title, subtitle, seg: { el: seg, thumb, opts: segOpts }, progress, bar, consoleHost, viewsEl: views, toastEl });

		return h('main', { class: 'br-main' },
			h('header', { class: 'br-toolbar' }, titleWrap, h('div', { class: 'br-tools' }, seg, refreshBtn, closeBtn)),
			progress, consoleHost, views, toastEl);
	}

	function setTitle(flagCode, title, subtitle) {
		if (UI.title.textContent !== title) {
			UI.title.textContent = title;
			UI.titleFlag.textContent = '';
			if (flagCode) UI.titleFlag.append(flag(flagCode, 'lg'));
			restartAnimation(UI.titleWrap, 'is-swap');
		}
		if (UI.subtitle.textContent !== subtitle) UI.subtitle.textContent = subtitle;
	}

	function updateProgress() {
		if (!UI.progress) return;
		const running = SCAN.active && !S.authError;
		UI.progress.classList.toggle('is-done', !running);
		UI.bar.style.transform = `scaleX(${running ? scanProgress() : 1})`;
	}

	function placeSegThumb(animate) {
		const seg = UI.seg;
		if (!seg) return;
		for (const [key, b] of seg.opts) {
			b.classList.toggle('is-on', key === UI.sort);
			b.setAttribute('aria-selected', String(key === UI.sort));
		}
		const active = seg.opts.find(([key]) => key === UI.sort);
		if (!active) return;
		const b = active[1];
		if (!animate) seg.thumb.style.transition = 'none';
		seg.thumb.style.width = b.offsetWidth + 'px';
		seg.thumb.style.transform = `translateX(${b.offsetLeft}px)`;
		if (!animate) {
			void seg.thumb.offsetWidth;
			seg.thumb.style.transition = '';
		}
	}

	function setSort(key) {
		if (UI.sort === key) return;
		UI.sort = key;
		placeSegThumb(true);
		if (UI.view && UI.view.resort) UI.view.resort();
	}

	function toast(text, iconName) {
		const t = UI.toastEl;
		if (!t) return;
		t.textContent = '';
		if (iconName) t.append(icon(iconName));
		t.append(h('span', { text }));
		t.classList.add('is-on');
		clearTimeout(UI.toastTimer);
		UI.toastTimer = setTimeout(() => t.classList.remove('is-on'), 2400);
	}

	function refresh() {
		hideConsole();
		toast('Refreshing servers…', 'refresh');
		startScan();
	}

	// ----- Views -----------------------------------------------------------------

	function showView(view, animate = true) {
		const old = UI.view;
		if (old) {
			if (old.destroy) old.destroy();
			old.el.classList.remove('is-active');
			old.el.classList.add('is-leaving');
			setTimeout(() => old.el.remove(), 260);
		}
		UI.view = view;
		UI.viewsEl.append(view.el);
		UI.seg.el.classList.toggle('is-hidden-soft', !view.sortable);
		if (view.sortable) placeSegThumb(false);
		view.update(true);
		if (animate && !REDUCED_MOTION) {
			requestAnimationFrame(() => requestAnimationFrame(() => view.el.classList.add('is-active')));
		} else {
			view.el.classList.add('is-active');
		}
	}

	function selectOverview() {
		UI.selKey = 'overview';
		positionPill(true);
		if (UI.view && UI.view.kind === 'overview') return;
		showView(overviewView());
	}

	function selectRegion(code, key) {
		if (!key) {
			const nearKey = 'near:' + code;
			key = UI.rows.has(nearKey) ? nearKey : regionInfo(code).continent + ':' + code;
		}
		UI.selKey = key;
		positionPill(true);
		if (UI.view && UI.view.kind === 'region' && UI.view.code === code) return;
		showView(serverListView({ kind: 'region', code }));
	}

	function showContinent(name) {
		UI.selKey = null;
		positionPill(true);
		if (UI.view && UI.view.kind === 'continent' && UI.view.name === name) return;
		showView(serverListView({ kind: 'continent', name }));
	}

	function statTile(iconName, label) {
		const value = h('div', { class: 'br-tile-value', text: '0' });
		const sub = h('div', { class: 'br-tile-sub' });
		const el = h('div', { class: 'br-tile br-shine' }, h('div', { class: 'br-tile-label' }, icon(iconName), label), value, sub);
		let shown = 0, target = 0, from = 0, start = 0, raf = 0;
		const step = now => {
			// rAF timestamps can predate performance.now() taken earlier in the same frame.
			const t = Math.max(0, Math.min(1, (now - start) / 650));
			shown = from + (target - from) * (1 - Math.pow(1 - t, 3));
			value.textContent = fmt(Math.round(shown));
			raf = t < 1 ? requestAnimationFrame(step) : 0;
		};
		return {
			el,
			setNumber(n, subText) {
				if (n !== target) {
					from = shown;
					target = n;
					start = performance.now();
					if (!raf) raf = requestAnimationFrame(step);
				}
				if (sub.textContent !== subText) sub.textContent = subText;
			},
			setText(text, subText) {
				if (value.textContent !== text) value.textContent = text;
				if (sub.textContent !== subText) sub.textContent = subText;
			}
		};
	}

	function greeting() {
		const hour = new Date().getHours();
		const part = hour < 5 ? 'Good evening' : hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
		return S.user ? `${part}, ${S.user.displayName}` : part;
	}

	function codeTag(text) {
		return h('span', { class: 'br-code', text });
	}

	function overviewView() {
		const el = h('section', { class: 'br-view' });
		const greet = h('h1');
		const hero = h('div', { class: 'br-hero' }, greet,
			h('p', { text: 'Regions are ordered by distance from you. Browse a region to see its servers, or jump straight into the best one.' }));
		const note = h('div', { class: 'br-note is-warn is-hidden' });
		const tServers = statTile('server', 'Servers indexed');
		const tRegions = statTile('globe', 'Regions online');
		const tScan = statTile('bolt', 'Scan');
		const recNote = h('span');
		const recGrid = h('div', { class: 'br-rec-grid' });
		const chips = h('div', { class: 'br-chips' });
		el.append(hero, note,
			h('div', { class: 'br-stats' }, tServers.el, tRegions.el, tScan.el),
			h('div', { class: 'br-h2' }, h('h2', { text: 'Nearest to you' }), recNote), recGrid,
			h('div', { class: 'br-h2' }, h('h2', { text: 'Continents' })), chips,
			h('div', { class: 'br-note' }, icon('terminal'), h('div', {},
				'Type ', codeTag('help'), ' in the search field for commands like ', codeTag('refresh'), ', ', codeTag('list'), ' and ', codeTag('version'),
				'. Press ', codeTag('/'), ' to search from anywhere, ', codeTag('Esc'), ' to close.')));

		let recKey = null, recCards = [], chipKey = null, chipEls = [], noteKey = null;

		function recCard(code, rank) {
			const pingM = h('span', { class: 'br-metric' });
			const countM = h('span', { class: 'br-metric' });
			const joinLabel = h('span', { text: 'Join best' });
			const join = h('button', { type: 'button', class: 'br-btn is-primary is-wide' }, icon('play'), joinLabel);
			const browse = h('button', { type: 'button', class: 'br-btn', text: 'Browse' });
			join.addEventListener('click', () => joinBest(code));
			browse.addEventListener('click', () => selectRegion(code));
			const card = h('div', { class: 'br-rec br-shine' },
				h('div', { class: 'br-rec-top' }, flag(code, 'lg'), h('span', { class: 'br-rank', text: rank === 0 ? 'Closest' : '#' + (rank + 1) })),
				h('div', {}, h('div', { class: 'br-rec-name', text: regionTitle(code) }), h('div', { class: 'br-rec-sub', text: regionPlace(code) || regionInfo(code).continent })),
				h('div', { class: 'br-metrics' }, pingM, countM),
				h('div', { class: 'br-actions' }, join, browse));
			card.style.animationDelay = rank * 70 + 'ms';
			let last = null;
			return {
				el: card,
				update() {
					const n = S.counts[code] || 0;
					const ping = regionPing(code);
					const key = n + '|' + ping + '|' + SCAN.active;
					if (key === last) return;
					last = key;
					pingM.textContent = '';
					pingM.append(h('span', { class: 'br-dot is-' + pingTier(ping) }), Number.isFinite(ping) ? '~' + ping + ' ms' : '— ms');
					countM.textContent = '';
					countM.append(icon('server'), fmt(n) + (n === 1 ? ' server' : ' servers'));
					join.disabled = n === 0;
					joinLabel.textContent = n > 0 ? 'Join best' : SCAN.active ? 'Scanning…' : 'No servers';
				}
			};
		}

		function update() {
			setText(greet, greeting());
			setTitle(null, 'Overview', gameName());

			const authKey = S.authError || '';
			if (authKey !== noteKey) {
				noteKey = authKey;
				note.textContent = '';
				note.classList.toggle('is-hidden', !S.authError);
				if (S.authError === 'auth') {
					note.append(icon('warn'), h('div', {}, h('b', { text: 'Sign in to Roblox to scan servers. ' }), 'BloxRegion uses your Roblox session to look up which datacenter each server runs in.'));
				} else if (S.authError === 'csrf') {
					note.append(icon('warn'), h('div', {}, h('b', { text: 'Roblox didn’t hand out a security token. ' }), 'Reload the page. If you use an ad blocker, allow roblox.com and try again.'));
				}
			}

			const total = resolvedCount();
			tServers.setNumber(total, SCAN.active ? `of ${fmt(SCAN.listed)} listed so far` : `${fmt(SCAN.listed)} listed${S.unresolved ? ` · ${fmt(S.unresolved)} unknown` : ''}`);
			const near = nearestCodes(1)[0];
			tRegions.setNumber(onlineRegions(), near ? `Closest: ${regionTitle(near)}` : 'Locating you…');
			if (S.authError) {
				tScan.setText('Paused', 'Waiting for Roblox sign-in');
			} else if (SCAN.active) {
				const secs = Math.max(1, (Date.now() - SCAN.startedAt) / 1000);
				tScan.setText(Math.round(scanProgress() * 100) + '%', `${(SCAN.done / secs).toFixed(1)} servers/s`);
			} else {
				const secs = Math.max(0, ((SCAN.endedAt || Date.now()) - SCAN.startedAt) / 1000);
				tScan.setText('Done', `${fmt(SCAN.listed)} servers in ${secs < 10 ? secs.toFixed(1) : Math.round(secs)} s`);
			}

			const nearest = nearestCodes(3);
			const key = nearest.join(',');
			if (key !== recKey) {
				recKey = key;
				recGrid.textContent = '';
				recCards = nearest.map(recCard);
				if (recCards.length) recCards.forEach(c => recGrid.append(c.el));
				else for (let i = 0; i < 3; i++) recGrid.append(h('div', { class: 'br-skel' }));
			}
			recCards.forEach(c => c.update());
			setText(recNote, S.userLoc ? (S.userLocSrc === 'roblox' ? 'Based on where Roblox places you' : 'Based on your approximate location') : 'Finding your location…');

			const groups = continentGroups().filter(([name]) => name !== 'Other');
			const cKey = groups.map(([name]) => name).join(',');
			if (cKey !== chipKey) {
				chipKey = cKey;
				chips.textContent = '';
				chipEls = groups.map(([name], i) => {
					const count = h('span', { class: 'br-chip-count' });
					const chip = h('button', { type: 'button', class: 'br-chip' }, icon('layers'), name, count);
					chip.style.animationDelay = i * 45 + 'ms';
					chip.addEventListener('click', () => showContinent(name));
					chips.append(chip);
					return { name, count };
				});
			}
			const totals = new Map(groups.map(([name, codes]) => [name, codes.reduce((n, c) => n + (S.counts[c] || 0), 0)]));
			for (const c of chipEls) setText(c.count, fmt(totals.get(c.name) || 0));
		}

		return { el, kind: 'overview', sortable: false, update };
	}

	function serverListView(opts) {
		const { kind, code, name } = opts;
		const el = h('section', { class: 'br-view' });
		const grid = h('div', { class: 'br-grid' });
		const emptyTitle = h('b');
		const emptySub = h('span');
		const empty = h('div', { class: 'br-empty is-hidden' }, icon('globe'), emptyTitle, emptySub);
		const sentinel = h('div', { class: 'br-sentinel' });
		el.append(grid, empty, sentinel);

		let list = [];
		let known = new Set();
		let rendered = 0;
		const source = () => (kind === 'region' ? (S.byRegion.get(code) || []) : continentServers(name));

		function sortServers(arr) {
			const keyed = arr.map(s => [s, serverPing(s), s.playing || 0, s.maxPlayers && (s.playing || 0) >= s.maxPlayers ? 1 : 0]);
			const pingOf = v => (Number.isFinite(v) ? v : 1e9);
			keyed.sort((a, b) => {
				if (UI.sort === 'most') return a[3] - b[3] || b[2] - a[2] || pingOf(a[1]) - pingOf(b[1]);
				if (UI.sort === 'fewest') return a[2] - b[2] || pingOf(a[1]) - pingOf(b[1]);
				return pingOf(a[1]) - pingOf(b[1]) || a[3] - b[3] || b[2] - a[2];
			});
			return keyed.map(k => k[0]);
		}

		function renderMore(count) {
			const next = list.slice(rendered, rendered + count);
			if (!next.length) return;
			const frag = document.createDocumentFragment();
			next.forEach((s, i) => frag.append(serverCard(s, i)));
			grid.append(frag);
			rendered += next.length;
		}

		let buildGen = 0;
		function rebuild() {
			list = sortServers(source().slice());
			known = new Set(list.map(s => s.id));
			rendered = 0;
			grid.textContent = '';
			// First screenful now, the rest on the next frame so the view transition never hitches.
			renderMore(9);
			const gen = ++buildGen;
			requestAnimationFrame(() => {
				if (gen === buildGen && rendered < 18) renderMore(18 - rendered);
			});
		}

		const io = new IntersectionObserver(entries => {
			if (entries.some(e => e.isIntersecting)) renderMore(12);
		}, { root: el, rootMargin: '0px 0px 600px 0px' });
		io.observe(sentinel);

		function update(first) {
			if (first) {
				rebuild();
			} else {
				const src = source();
				if (src.length !== known.size) {
					const fresh = src.filter(s => !known.has(s.id));
					const caughtUp = rendered >= list.length;
					for (const s of fresh) {
						known.add(s.id);
						list.push(s);
					}
					if (caughtUp && fresh.length) renderMore(fresh.length);
				}
			}

			const total = list.length;
			empty.classList.toggle('is-hidden', total > 0);
			if (!total) {
				emptyTitle.textContent = SCAN.active ? 'Looking for servers…' : 'No servers here right now';
				emptySub.textContent = SCAN.active ? 'New servers appear here the moment they’re found.' : 'Try another region, or refresh to scan again.';
			}

			if (kind === 'region') {
				const ping = regionPing(code);
				const parts = [regionPlace(code) || regionInfo(code).continent, fmt(total) + (total === 1 ? ' server' : ' servers')];
				if (Number.isFinite(ping)) parts.push('~' + ping + ' ms');
				setTitle(code, regionTitle(code), parts.join(' · '));
			} else {
				const regions = [...S.byRegion.keys()].filter(c => regionInfo(c).continent === name).length;
				setTitle(null, name, `${fmt(total)} servers across ${regions} ${regions === 1 ? 'region' : 'regions'}`);
			}
		}

		return {
			el, kind, code, name, sortable: true, update,
			resort() {
				el.scrollTop = 0;
				rebuild();
			},
			reset() {
				buildGen++;
				list = [];
				known = new Set();
				rendered = 0;
				grid.textContent = '';
			},
			destroy() { io.disconnect(); }
		};
	}

	// ----- Server card ------------------------------------------------------------

	const thumbCache = new Map();
	const thumbWaiting = new Map();
	const thumbQueue = new Set();
	let thumbTimer = 0;

	function requestAvatar(token, img) {
		if (thumbCache.has(token)) {
			const url = thumbCache.get(token);
			if (url) img.src = url;
			return;
		}
		if (!thumbWaiting.has(token)) thumbWaiting.set(token, []);
		thumbWaiting.get(token).push(img);
		thumbQueue.add(token);
		if (!thumbTimer) thumbTimer = setTimeout(flushAvatars, 40);
	}

	async function flushAvatars() {
		thumbTimer = 0;
		const tokens = [...thumbQueue];
		thumbQueue.clear();
		for (let i = 0; i < tokens.length; i += 100) {
			const batch = tokens.slice(i, i + 100);
			try {
				const res = await fetch('https://thumbnails.roblox.com/v1/batch', {
					method: 'POST',
					credentials: 'omit',
					headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
					body: JSON.stringify(batch.map(token => ({ requestId: token + '::AvatarHeadshot:75x75:webp:regular', type: 'AvatarHeadShot', targetId: 0, token, format: 'webp', size: '75x75' })))
				});
				const data = res.ok ? await res.json() : null;
				for (const d of (data && data.data) || []) {
					const token = String(d.requestId || '').split('::')[0];
					const url = d.state === 'Completed' && d.imageUrl ? d.imageUrl : null;
					thumbCache.set(token, url);
					for (const img of thumbWaiting.get(token) || []) if (url) img.src = url;
					thumbWaiting.delete(token);
				}
			} catch (e) {}
		}
	}

	function serverCard(server, index) {
		const playing = server.playing || 0;
		const max = server.maxPlayers || 0;
		const full = max > 0 && playing >= max;
		const place = S.placeOf.get(server.id);
		const code = place && place.c !== '??' ? place.c : null;
		const ping = serverPing(server);
		const tier = pingTier(ping);

		const fill = h('span');
		fill.style.transform = 'scaleX(0)';
		const avatars = h('div', { class: 'br-avatars' });
		const tokens = (server.playerTokens || []).slice(0, 5);
		for (const token of tokens) {
			const img = h('img', { alt: '', decoding: 'async' });
			img.addEventListener('load', () => img.classList.add('is-loaded'));
			avatars.append(h('span', { class: 'br-av' }, img));
			requestAvatar(token, img);
		}
		if (playing > tokens.length && tokens.length) avatars.append(h('span', { class: 'br-av is-more', text: '+' + (playing - tokens.length) }));
		if (!tokens.length) avatars.append(h('span', { class: 'br-empty-av', text: playing ? fmt(playing) + ' playing' : 'No players yet' }));

		const join = h('button', { type: 'button', class: 'br-btn is-primary' }, full ? null : icon('play'), full ? 'Full' : 'Join');
		join.disabled = full;
		join.addEventListener('click', () => joinServer(server.id, code));

		const card = h('article', { class: 'br-card br-shine' },
			h('div', { class: 'br-card-top' },
				h('span', { class: 'br-players' }, icon('people'), fmt(playing), h('small', { text: '/ ' + (max || '?') })),
				h('span', { class: 'br-fps', text: server.fps ? Math.round(server.fps) + ' fps' : '' })),
			h('div', { class: 'br-cap' }, fill),
			avatars,
			h('div', { class: 'br-meta' },
				h('span', { class: 'br-k', text: 'Region' }),
				h('span', { class: 'br-v' }, code ? flag(code, 'sm') : null, code ? regionTitle(code) : 'Unknown'),
				h('span', { class: 'br-k', text: 'Ping' }),
				h('span', { class: 'br-v' + (tier ? ' is-' + tier : ''), text: Number.isFinite(ping) ? '~' + ping + ' ms' : '—' })),
			join);
		card.style.animationDelay = (index < 12 ? index * 32 : 0) + 'ms';
		requestAnimationFrame(() => requestAnimationFrame(() => {
			fill.style.transform = `scaleX(${max ? Math.min(1, playing / max) : 0})`;
		}));
		return card;
	}

	// ----- Commands -----------------------------------------------------------------

	const COMMANDS = [
		['help', 'Show this list'],
		['list', 'Every region with its server count'],
		['refresh', 'Scan all servers again'],
		['home', 'Back to the overview'],
		['version', 'Show the installed version'],
		['credits', 'Who made BloxRegion'],
		['contacts', 'Contact links'],
		['exit', 'Close BloxRegion']
	];

	function resolveCommand(raw) {
		const t = String(raw || '').trim().toLowerCase();
		if (!t) return null;
		if (t === 'help' || t === '?') return { kind: 'help' };
		if (t === 'home' || t === 'clear' || t === 'cls' || t === 'overview') return { kind: 'home' };
		if (t === 'list' || t === 'ls') return { kind: 'list' };
		if (t === 'refresh' || t === 'reload') return { kind: 'refresh' };
		if (t === 'credits') return { kind: 'credits' };
		if (t === 'contacts' || t === 'contact') return { kind: 'contacts' };
		if (t === 'exit' || t === 'quit' || t === 'close') return { kind: 'exit' };
		if (t === 'version' || t === 'ver' || t === '-v' || t === '--version') return { kind: 'version' };
		const continents = { na: 'North America', sa: 'South America', eu: 'Europe', oc: 'Oceania' };
		for (const c of CONTINENTS) continents[c.toLowerCase()] = c;
		if (continents[t]) return { kind: 'continent', value: continents[t] };
		const codes = allRegionCodes();
		const exact = codes.find(c => c.toLowerCase() === t)
			|| codes.find(c => { const r = regionInfo(c); return [r.city, r.country, r.state, regionFullName(c)].filter(Boolean).some(s => s.toLowerCase() === t); })
			|| codes.find(c => regionSearchText(c).includes(t));
		if (exact) return { kind: 'region', value: exact };
		return { kind: 'unknown' };
	}

	function runCommand(raw) {
		const cmd = resolveCommand(raw);
		if (!cmd) return;
		switch (cmd.kind) {
			case 'help':
				showConsole(raw, [
					...COMMANDS.map(([c, d]) => [{ k: c }, d]),
					[{ k: '<region>' }, 'singapore, tokyo, us-ca … opens that region'],
					[{ k: '<continent>' }, 'asia, europe, north america … shows every server there']
				]);
				break;
			case 'version':
				showConsole(raw, [[{ k: 'BloxRegion' }, { b: 'v' + VERSION }, ' — free and open source']]);
				break;
			case 'credits':
				showConsole(raw, [[{ k: 'UI Designer' }, 'Kanezama'], [{ k: 'Main Coder' }, { a: 'AlfatihRabbani', href: 'https://github.com/AlfatihRabbani' }]]);
				break;
			case 'contacts':
				showConsole(raw, [
					[{ k: 'GitHub' }, { a: 'github.com/AlfatihRabbani', href: 'https://github.com/AlfatihRabbani' }],
					[{ k: 'LinkedIn' }, { a: 'linkedin.com/in/fatih-rabbani-50a39037b', href: 'https://www.linkedin.com/in/fatih-rabbani-50a39037b/' }]
				]);
				break;
			case 'list': {
				const codes = allRegionCodes().sort((a, b) => {
					const da = regionDistance(a), db = regionDistance(b);
					if (Number.isFinite(da) && Number.isFinite(db)) return da - db;
					return (S.counts[b] || 0) - (S.counts[a] || 0);
				});
				showConsole(raw, codes.map(c => [{ k: c }, regionFullName(c) + ' — ' + fmt(S.counts[c] || 0) + ((S.counts[c] || 0) === 1 ? ' server' : ' servers')]));
				break;
			}
			case 'refresh':
				refresh();
				break;
			case 'home':
				hideConsole();
				selectOverview();
				break;
			case 'exit':
				closeWindow();
				break;
			case 'region':
				hideConsole();
				selectRegion(cmd.value);
				break;
			case 'continent':
				hideConsole();
				showContinent(cmd.value);
				break;
			default:
				showConsole(raw, [['No region or command matches “' + raw + '”. Type ', { b: 'help' }, ' to see what you can do.']]);
		}
	}

	function showConsole(cmdText, lines) {
		const host = UI.consoleHost;
		if (!host) return;
		host.textContent = '';
		const closeBtn = h('button', { type: 'button', class: 'br-iconbtn br-console-close', 'aria-label': 'Dismiss' }, icon('close'));
		closeBtn.addEventListener('click', hideConsole);
		const card = h('div', { class: 'br-console', role: 'log' }, h('div', { class: 'br-console-head' }, h('span', { class: 'br-console-cmd', text: '› ' + cmdText }), closeBtn));
		// Output resolves word by word, each word fading in from a soft blur.
		let word = 0;
		for (const line of lines) {
			const row = h('div', { class: 'br-line' });
			for (const seg of line) {
				if (seg && seg.k) {
					row.append(h('span', { class: 'br-k', text: seg.k }));
					continue;
				}
				const text = typeof seg === 'string' ? seg : (seg.a || seg.b || '');
				const target = seg && seg.href ? h('a', { href: seg.href, target: '_blank', rel: 'noopener noreferrer' }) : seg && seg.b ? h('b') : h('span');
				for (const part of text.split(/(\s+)/)) {
					if (!part) continue;
					const w = h('span', { class: 'br-w', text: part });
					w.style.animationDelay = Math.min(word++ * 16, 900) + 'ms';
					target.append(w);
				}
				row.append(target);
			}
			card.append(row);
		}
		host.append(card);
	}

	function hideConsole() {
		const host = UI.consoleHost;
		const card = host && host.firstChild;
		if (!card || card.classList.contains('is-leaving')) return;
		card.classList.add('is-leaving');
		setTimeout(() => card.remove(), 200);
	}

	// ---------------------------------------------------------------------------
	// Update loop: coalesced to animation frames, at most ~7 times a second
	// ---------------------------------------------------------------------------

	let updateTimer = 0;
	let lastUpdate = 0;
	function scheduleUpdate() {
		if (updateTimer) return;
		const wait = Math.max(0, 140 - (performance.now() - lastUpdate));
		updateTimer = setTimeout(() => requestAnimationFrame(runUpdate), wait);
	}
	function runUpdate() {
		updateTimer = 0;
		lastUpdate = performance.now();
		updateLauncher();
		if (!UI.root || UI.closing) return;
		renderSidebar();
		updateProgress();
		updateFoot();
		if (UI.view) UI.view.update(false);
	}

	// ---------------------------------------------------------------------------
	// Boot
	// ---------------------------------------------------------------------------

	async function boot() {
		watchPage();
		window.addEventListener('pagehide', saveCaches);
		getCsrf();
		loadUser();
		await loadCaches();
		ensureUserLoc();
		startScan();
	}

	try {
		chrome.storage.local.get({ regionSelectorEnabled: true }, settings => {
			if (settings && settings.regionSelectorEnabled === false) return;
			boot();
		});
	} catch (e) {
		boot();
	}
})();
