# Changelog

## 1.1.1

- Minor internal fixes.

## 1.1.0

**Faster region loading.**

Previously, opening a game's region list walked *every* page of that game's
public server list, doing one rate-limited `gamejoin.roblox.com` lookup per
server. On popular games that meant thousands of requests and a load time of
several minutes.

- **Scan cap** — region loading now stops after `RR_MAX_SERVERS_SCAN` servers
  (default **300**) instead of resolving the entire server list. The first few
  hundred servers already cover every region for the vast majority of games.
  Set to `0` in `regionSelector.js` to restore the old unlimited behaviour.
- **Per-region early exit** — when you open a single region (e.g. `singapore`),
  loading stops as soon as `RR_REGION_ENOUGH` servers (default **20**) for that
  region have been found, instead of scanning the rest of the game.
- **Fewer blocking re-renders** — the region list now re-renders once per batch
  of resolved servers rather than after every single server, so the load loop
  is no longer stalled rebuilding the DOM between each lookup.

**New: Recommended regions.**

- A highlighted **★ RECOMMENDED** group now appears at the top of the region
  list, showing the **3 regions closest to your location**, nearest first
  (e.g. from Singapore: Singapore → Japan → …; from Japan: Japan → Singapore → …).
- Only regions that currently have servers are recommended, and each entry keeps
  the normal click-to-open and quick-play (`>_`) behaviour.
- Count is configurable via `RR_RECOMMENDED_COUNT` in `regionSelector.js`.

No change to permissions, the geo fallback (still `geojs.io`, no token needed),
or how server regions are resolved. US datacenters continue to be listed
per-location (California, Virginia, Illinois, Texas, Florida, New York,
Washington), not lumped into a single "US" entry.

## 1.0.1

- Initial public release.
