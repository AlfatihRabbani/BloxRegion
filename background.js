// The only things the content script runs in the page itself (MAIN world), where Roblox's
// own scripts live. executeScript sends each function's source, so they must be
// self-contained arrow functions.
const BR_PAGE_CALLS = {
  csrf: () => {
    try {
      const x = window.Roblox && window.Roblox.XsrfToken;
      const token = x && x.getToken && x.getToken();
      return typeof token === 'string' && token ? token : null;
    } catch (e) {
      return null;
    }
  },
  join: (placeId, gameId) => {
    try {
      const launcher = window.Roblox && window.Roblox.GameLauncher;
      if (!launcher || !launcher.joinGameInstance) return false;
      launcher.joinGameInstance(placeId, gameId);
      return true;
    } catch (e) {
      return false;
    }
  }
};

async function rrInstallSessionDnrRules() {
  try {
    if (!chrome.declarativeNetRequest?.updateSessionRules) return;
    const existing = await chrome.declarativeNetRequest.getSessionRules();
    const removeRuleIds = existing.map(r => r.id);
    await chrome.declarativeNetRequest.updateSessionRules({
      removeRuleIds,
      addRules: [{
        id: 1001,
        priority: 1,
        action: {
          type: 'modifyHeaders',
          requestHeaders: [
            { header: 'user-agent', operation: 'set', value: 'Roblox/WinInet' },
            { header: 'origin', operation: 'set', value: 'https://www.roblox.com' },
            { header: 'referer', operation: 'set', value: 'https://www.roblox.com/' }
          ]
        },
        condition: {
          urlFilter: 'gamejoin.roblox.com/v1/join-game-instance',
          resourceTypes: ['xmlhttprequest']
        }
      }]
    });
  } catch (e) {}
}

chrome.runtime.onStartup.addListener(rrInstallSessionDnrRules);
rrInstallSessionDnrRules();

chrome.runtime.onInstalled.addListener(async (details) => {
  rrInstallSessionDnrRules();
  chrome.storage.local.get('regionSelectorEnabled', (res) => {
    if (res.regionSelectorEnabled === undefined) {
      chrome.storage.local.set({ regionSelectorEnabled: true });
    }
  });
  if (details.reason === 'install') {
    chrome.tabs.query({ url: '*://www.roblox.com/*games/*' }, (tabs) => {
      for (const tab of tabs) chrome.tabs.reload(tab.id);
    });
  } else if (details.reason === 'update') {
    brAttachToOpenTabs();
  }
});

// After an update, open Roblox pages still show the old version's button and ViewPort,
// which no longer respond. Firefox may already have run the new content scripts there;
// where it hasn't, run them now rather than reloading pages the player has open (they
// may be mid-launch).
async function brAttachToOpenTabs() {
  let tabs = [];
  try { tabs = await chrome.tabs.query({ url: '*://*.roblox.com/*' }); } catch (e) { return; }
  for (const tab of tabs) {
    const running = await chrome.tabs.sendMessage(tab.id, { action: 'brAlive?' }).then(r => !!(r && r.alive), () => false);
    if (running) continue;
    try {
      await chrome.scripting.insertCSS({ target: { tabId: tab.id }, files: ['bloxregion.css', 'viewport.css'] });
      await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['avatar3d.js', 'animations.js', 'viewport.js', 'regionSelector.js'] });
    } catch (e) {}
  }
}

const rrIpRegionCache = new Map();
const rrIpInflight = new Map();

const RR_US_STATE_TO_CODE = {
  'alabama':'AL','alaska':'AK','arizona':'AZ','arkansas':'AR','california':'CA','colorado':'CO',
  'connecticut':'CT','delaware':'DE','florida':'FL','georgia':'GA','hawaii':'HI','idaho':'ID',
  'illinois':'IL','indiana':'IN','iowa':'IA','kansas':'KS','kentucky':'KY','louisiana':'LA',
  'maine':'ME','maryland':'MD','massachusetts':'MA','michigan':'MI','minnesota':'MN','mississippi':'MS',
  'missouri':'MO','montana':'MT','nebraska':'NE','nevada':'NV','new hampshire':'NH','new jersey':'NJ',
  'new mexico':'NM','new york':'NY','north carolina':'NC','north dakota':'ND','ohio':'OH','oklahoma':'OK',
  'oregon':'OR','pennsylvania':'PA','rhode island':'RI','south carolina':'SC','south dakota':'SD',
  'tennessee':'TN','texas':'TX','utah':'UT','vermont':'VT','virginia':'VA','washington':'WA',
  'west virginia':'WV','wisconsin':'WI','wyoming':'WY','district of columbia':'DC'
};

async function rrLookupIpRegion(ip) {
  if (!ip) return null;
  if (rrIpRegionCache.has(ip)) return rrIpRegionCache.get(ip);
  if (rrIpInflight.has(ip)) return rrIpInflight.get(ip);
  const p = (async () => {
    try {
      const res = await fetch(`https://get.geojs.io/v1/ip/geo/${ip}.json`);
      if (!res.ok) { rrIpRegionCache.set(ip, null); return null; }
      const data = await res.json();
      if (!data || !data.country_code) { rrIpRegionCache.set(ip, null); return null; }
      let regionCode = null;
      if (data.country_code === 'US' && data.region) {
        regionCode = RR_US_STATE_TO_CODE[String(data.region).toLowerCase()] || null;
      }
      const lat = data.latitude != null ? parseFloat(data.latitude) : null;
      const lon = data.longitude != null ? parseFloat(data.longitude) : null;
      const out = {
        country: data.country_code,
        region: regionCode,
        latitude: Number.isFinite(lat) ? lat : null,
        longitude: Number.isFinite(lon) ? lon : null
      };
      rrIpRegionCache.set(ip, out);
      return out;
    } catch (e) {
      rrIpRegionCache.set(ip, null);
      return null;
    } finally {
      rrIpInflight.delete(ip);
    }
  })();
  rrIpInflight.set(ip, p);
  return p;
}

// Approximate location of the player, used to order regions before the first
// server lookup reports where Roblox itself places them.
let brSelfGeo = null;
async function brLookupSelfGeo() {
  if (brSelfGeo) return brSelfGeo;
  try {
    const res = await fetch('https://get.geojs.io/v1/ip/geo.json');
    if (!res.ok) return null;
    const data = await res.json();
    const la = parseFloat(data && data.latitude);
    const lo = parseFloat(data && data.longitude);
    if (!Number.isFinite(la) || !Number.isFinite(lo)) return null;
    brSelfGeo = { la, lo };
    return brSelfGeo;
  } catch (e) {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Updates. New versions are published to GitHub and then to Firefox Add-ons;
// Firefox installs them. This only reads version info (never code), so users
// can see what's new and apply a downloaded update at a good moment.
// ---------------------------------------------------------------------------

const BR_REPO = 'AlfatihRabbani/BloxRegion';
const BR_AMO_ID = 'fatihmuhammad849@gmail.com';
const BR_AMO_PAGE = 'https://addons.mozilla.org/firefox/addon/bloxregion/';
const BR_UPDATE_TTL = 6 * 60 * 60 * 1000;

function brCompareVersions(a, b) {
  const pa = String(a || '0').split('.').map(n => parseInt(n, 10) || 0);
  const pb = String(b || '0').split('.').map(n => parseInt(n, 10) || 0);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const d = (pa[i] || 0) - (pb[i] || 0);
    if (d) return d > 0 ? 1 : -1;
  }
  return 0;
}

async function brFetchJson(url) {
  const res = await fetch(url, { headers: { Accept: 'application/json' }, cache: 'no-store' });
  if (!res.ok) throw new Error(url + ' ' + res.status);
  return res.json();
}

async function brCheckForUpdate(force) {
  const installed = chrome.runtime.getManifest().version;
  const stored = await chrome.storage.local.get(['brUpdateInfo', 'brPendingUpdate']);
  let info = stored.brUpdateInfo;
  const fresh = info && info.installed === installed && Date.now() - info.checkedAt < BR_UPDATE_TTL;
  if (force || !fresh) {
    const next = { installed, latest: null, notes: '', releaseUrl: `https://github.com/${BR_REPO}/releases`, amoVersion: null, amoUrl: BR_AMO_PAGE, checkedAt: Date.now() };
    try {
      const rel = await brFetchJson(`https://api.github.com/repos/${BR_REPO}/releases/latest`);
      next.latest = String(rel.tag_name || '').replace(/^v/i, '') || null;
      next.notes = String(rel.body || '').slice(0, 4000);
      if (rel.html_url) next.releaseUrl = rel.html_url;
    } catch (e) {
      // Keep the last known release if GitHub is unreachable or rate-limited.
      if (info && info.latest) Object.assign(next, { latest: info.latest, notes: info.notes, releaseUrl: info.releaseUrl });
    }
    try {
      const amo = await brFetchJson(`https://addons.mozilla.org/api/v5/addons/addon/${encodeURIComponent(BR_AMO_ID)}/`);
      next.amoVersion = (amo.current_version && amo.current_version.version) || null;
      if (amo.url) next.amoUrl = amo.url;
    } catch (e) {
      if (info) next.amoVersion = info.amoVersion;
    }
    info = next;
    await chrome.storage.local.set({ brUpdateInfo: info });
  }
  let pending = stored.brPendingUpdate || null;
  if (pending && brCompareVersions(pending, installed) <= 0) {
    pending = null;
    await chrome.storage.local.remove('brPendingUpdate');
  }
  // ready: Firefox already downloaded it · store: live on Firefox Add-ons · review: on GitHub, awaiting Mozilla
  let state = 'current';
  if (pending) state = 'ready';
  else if (info.amoVersion && brCompareVersions(info.amoVersion, installed) > 0) state = 'store';
  else if (info.latest && brCompareVersions(info.latest, installed) > 0) state = 'review';
  const target = state === 'ready' ? pending : state === 'store' ? info.amoVersion : state === 'review' ? info.latest : installed;
  return { ...info, installed, state, target };
}

async function brBroadcast(message) {
  let tabs = [];
  try { tabs = await chrome.tabs.query({}); } catch (e) { return; }
  for (const tab of tabs) chrome.tabs.sendMessage(tab.id, message).catch(() => {});
}

// Firefox found and downloaded a new version. Because this listener exists, Firefox holds
// it rather than installing it: it's installed when the player types /update (or when
// Firefox restarts, which always applies a held update).
chrome.runtime.onUpdateAvailable.addListener(async (details) => {
  await chrome.storage.local.set({ brPendingUpdate: details.version });
  brBroadcast({ action: 'brUpdateReady', version: details.version });
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {

  if (message.action === 'brUpdateInfo') {
    brCheckForUpdate(!!message.force)
      .then(info => sendResponse({ success: true, info }))
      .catch(() => sendResponse({ success: false }));
    return true;
  }

  // Only ever from /update: restarting the add-on installs the update Firefox is holding.
  if (message.action === 'brApplyUpdate') {
    chrome.storage.local.get('brPendingUpdate').then(({ brPendingUpdate }) => {
      sendResponse({ success: !!brPendingUpdate });
      if (brPendingUpdate) setTimeout(() => chrome.runtime.reload(), 150);
    });
    return true;
  }

  if (message.action === 'brSelfGeo') {
    brLookupSelfGeo().then(geo => sendResponse(geo ? { success: true, la: geo.la, lo: geo.lo } : { success: false }));
    return true;
  }

  if (message.action === 'rrLookupIpRegion') {
    (async () => {
      try {
        const data = await rrLookupIpRegion(message.ip);
        sendResponse({ success: !!data, data });
      } catch (e) {
        sendResponse({ success: false, data: null });
      }
    })();
    return true;
  }

  if (message.action === 'brPage') {
    const func = Object.hasOwn(BR_PAGE_CALLS, message.call) ? BR_PAGE_CALLS[message.call] : null;
    if (!func || !sender.tab) {
      sendResponse({ success: false });
      return false;
    }
    chrome.scripting.executeScript({
      target: { tabId: sender.tab.id },
      world: 'MAIN',
      func,
      args: Array.isArray(message.args) ? message.args : [],
    })
      .then((results) => sendResponse({ success: true, result: results && results[0] ? results[0].result : null }))
      .catch((error) => sendResponse({ success: false, error: error.message }));
    return true;
  }

  return false;
});
