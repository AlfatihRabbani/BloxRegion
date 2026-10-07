# Changelog

## 2.0

- **Liquid Glass redesign** — BloxRegion now opens in a frosted-glass window
  inspired by Apple's Liquid Glass: translucent panels with rim lighting, a
  blurred backdrop of the game's artwork, and a sidebar of regions with flags,
  live server counts and estimated ping. Follows Roblox's light or dark theme
  automatically.
- **Smoother, spring-based motion** — the window, views, sidebar selection,
  sort control and cards all move on real spring curves. Regions glide into
  place as they come online instead of the list being rebuilt, and counts
  update without flicker. Respects "reduce motion".
- **Fixed: Roblox's Play button stuck loading** — after Roblox's latest page
  update, the Play button could stay on a spinner and couldn't be clicked while
  BloxRegion was installed. The BloxRegion button now sits beside Play without
  touching it.
- **Faster scanning** — server lists are fetched ahead while servers are being
  resolved, concurrency adapts to Roblox's rate limits, Roblox's datacenter
  ranges are bundled (no large download before scanning starts), and nothing
  waits on the page's language settings anymore. About twice as fast in
  testing, and much faster when the tab is in the background.
- **Instant re-opens** — resolved servers are remembered for 45 minutes, so
  refreshing or coming back to a game shows its regions immediately and only
  new servers are looked up.
- **Nearest regions first** — your approximate location is known before the
  first server resolves, so the "Nearest to you" regions, distance-sorted
  continents and ping estimates appear right away. Ping estimates are also
  more realistic.
- **Overview** — live stats (servers indexed, regions online, scan progress and
  speed) and the three nearest regions as cards with one-click **Join best**.
- **Server cards** — player count with a capacity bar, player avatars, region
  and estimated ping, FPS, and a Join button. Sort by best ping, most players
  or fewest players; more cards load as you scroll, and newly found servers
  appear on their own.
- **Friends** — a new Friends entry at the top of the sidebar shows which of
  your Roblox friends are playing, grouped by the server they're in: friends in
  this game first, then friends in other games, each with the server's region
  and estimated ping and a Join button. Friends who are online but not in a game
  are listed too. Servers with friends in them are marked in the region list and
  on server cards ("with Alex & Sam").
- **Command palette** — type `/` in the search field (or press `/` anywhere)
  to see every command with a short description; keep typing to narrow it down
  (`/h` → `/help`, `/home`), and matching regions and continents appear too.
  Use the arrow keys and Enter, Tab to complete, or click. New commands:
  `/friends`, `/nearest` (open the closest region) and `/join` (join the best
  server near you). Plain text still filters the region list. Click a
  continent's header to see all of its servers.
- BloxRegion briefly pauses scanning when you press Play or Join, so it never
  competes with Roblox while the game launches.
- Clear messages when you're signed out of Roblox or a security token can't be
  obtained, instead of empty counts.
- Still zero errors and zero warnings in the Firefox add-on validator.

## 1.1.7

- **★ Recommended regions** — the three regions closest to your location are
  pinned at the top of the list, nearest first, so the best-ping choice is one
  click away. The order stays stable while servers load.
- **Server region on every card** — each server card now shows `region: <name>`
  above the ping, so you can see where a server is before joining.
- **Your Roblox username in the terminal** — the prompt, title bar, and
  breadcrumbs now show `<yourname>@bloxregion` instead of `root@bloxregion`.
- **Header renamed** to "Server Region".
- **Live indexing count** — the boot line "Indexed N servers across M regions"
  updates in real time as servers resolve.
- **Terminal typing animation** — command output types out like a real terminal
  (the echoed command appears instantly; only the output animates).
- **`version` command** — type `version` (or `ver`) to see the installed
  version.
- **Works with ad blockers** — fixed region counts getting stuck at 0 when
  uBlock Origin (or similar) is active. The CSRF token is now read from the
  page instead of a request that ad blockers block.
- Rendering internals reworked to pass the Firefox add-on validator with zero
  errors and zero warnings.
