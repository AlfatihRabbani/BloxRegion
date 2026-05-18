const rrLaunchGameInstance = (placeId, instanceId) => {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (isMobile) {
    const url = instanceId
      ? `https://www.roblox.com/games/start?placeid=${placeId}&gameId=${instanceId}`
      : `https://www.roblox.com/games/start?placeid=${placeId}`;
    const a = document.createElement('a');
    a.href = url; a.rel = 'noopener noreferrer';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  } else {
    try {
      if (window.Roblox?.GameLauncher?.joinGameInstance) {
        window.Roblox.GameLauncher.joinGameInstance(placeId, instanceId);
      } else {
        throw new Error('GameLauncher unavailable');
      }
    } catch (err) {
      window.location.href = instanceId
        ? `roblox://placeId=${placeId}&gameInstanceId=${instanceId}`
        : `roblox://placeId=${placeId}`;
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
  chrome.tabs.query({ url: '*://www.roblox.com/*games/*' }, (tabs) => {
    for (const tab of tabs) chrome.tabs.reload(tab.id);
  });
});

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

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {

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

  if (message.action === 'checkRoRegionPermission') {
    sendResponse({ granted: true });
    return false;
  }

  if (message.action === 'requestRoRegionPermission') {
    sendResponse({ granted: true });
    return false;
  }

  if (message.action === 'injectScript') {
    const { codeToInject } = message;
    chrome.scripting.executeScript({
      target: { tabId: sender.tab.id },
      world: 'MAIN',
      func: (code) => {
        try {
          const script = document.createElement('script');
          script.textContent = code;
          document.documentElement.appendChild(script);
          script.remove();
        } catch (error) {}
      },
      args: [codeToInject],
    })
      .then(() => sendResponse({ success: true }))
      .catch((error) => sendResponse({ success: false, error: error.message }));
    return true;
  }

  if (message.action === 'enableServerJoinHeaders') {
    chrome.declarativeNetRequest.updateEnabledRulesets({ enableRulesetIds: ['ruleset_2'] });
    return false;
  }
  if (message.action === 'disableServerJoinHeaders') {
    chrome.declarativeNetRequest.updateEnabledRulesets({ disableRulesetIds: ['ruleset_2'] });
    return false;
  }

  if (message.action === 'RR_LAUNCH_GAME') {
    (async () => {
      try {
        const { placeId } = message;
        await chrome.scripting.executeScript({
          target: { tabId: sender.tab.id },
          func: rrLaunchGameInstance,
          args: [parseInt(placeId), ''],
          world: 'MAIN',
        });
        sendResponse({ success: true });
      } catch (err) {
        sendResponse({ success: false, error: err.message });
      }
    })();
    return true;
  }

  if (message.action === 'RR_LAUNCH_GAME_MOBILE') {
    (async () => {
      try {
        const { placeId } = message;
        const inner = encodeURIComponent(
          `https://www.roblox.com/games/start?placeid=${placeId}`
        );
        const deepLink = `https://ro.blox.com/Ebh5?is_retargeting=false&pid=experiencestart_mobileweb&af_dp=${inner}&af_web_dp=${inner}&deep_link_value=${inner}`;
        sendResponse({ success: true, deepLink });
      } catch (err) {
        sendResponse({ success: false, error: err.message });
      }
    })();
    return true;
  }

  return false;
});
