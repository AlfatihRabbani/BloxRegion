# Changelog

## 1.1.6

- The boot screen's "Indexed N servers across M regions" line now updates
  live as servers resolve, instead of only refreshing when you reopen home.
- Terminal command output now types out like a real terminal at 80 words per
  minute (`RR_TYPE_WPM`), with a per-line time cap (`RR_TYPE_MAX_MS`) so long
  outputs like `list` stay fast.
- The boot banner now shows the real installed version (was hardcoded
  "v1.0").

## 1.1.5

(1.1.4 was consumed by an AMO upload and could not be reused; identical
content shipped as 1.1.5.)

- Region scanning is unlimited by default again. The scan cap introduced in
  1.1.1 traded away too many servers on large games — regions that should
  show 1000+ servers showed single digits, because rate-limited lookups
  consumed the budget. Full counts are back, at the cost of the original
  longer load time. The fast partial mode is still available by setting
  `RR_MAX_SERVERS_SCAN` (e.g. 800) in `regionSelector.js`.
- Opening a single region no longer stops early by default
  (`RR_REGION_ENOUGH = 0`).
- The ★ RECOMMENDED list now always shows the three regions nearest to you,
  nearest first, instead of the three nearest regions that happened to load
  first — no more far-away regions appearing there during loading. Counts
  fill in live.
- New `version` terminal command (aliases: `ver`, `-v`) prints the installed
  extension version, read live from the manifest.

## 1.1.3

- Fixed region counts collapsing to a handful of servers (e.g. Singapore
  showing 6 instead of 1000+). The scan cap was counting every *listed*
  server, but Roblox lists near-empty servers first and those are filtered
  out before region resolution — so the whole budget was spent on servers
  that never got counted. The cap now only counts servers that pass the
  player filters and actually get resolved.
- Raised the single-region fetch target from 20 to 100 servers
  (`RR_REGION_ENOUGH`) so opening a region shows a proper list.

## 1.1.2

- Reworked terminal and list rendering to build DOM nodes directly instead of
  assigning dynamic HTML strings, clearing all 12 AMO validator warnings
  ("Unsafe assignment to innerHTML").

## 1.1.1

- Minor internal fixes.
- Raised the server scan cap from 300 to 800 (`RR_MAX_SERVERS_SCAN`) so larger
  games index more servers per load.

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
