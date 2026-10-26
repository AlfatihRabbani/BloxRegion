# Changelog

## Unreleased

- **ViewPort: textures** — shirts, faces, hair and accessories now show their
  textures instead of plain colours.
- **ViewPort: turns as one** — head, torso and arms turn toward the cursor
  together, so nothing looks cut off at the neck.
- **ViewPort: stays put between pages** — it appears the moment a page starts
  loading, showing your avatar as you left it, and carries on live once the
  page is ready, instead of reloading each time.

## 2.3

- There's something new hiding in the search field. It follows you around
  roblox.com once you find it.
- **Fixed: region lists missing their last servers** — when a scan finished
  while a region was open, the servers found in its last moments could stay
  out of the list (and its count) until something else changed. They now
  always show up.
- **Snappier window** — opening BloxRegion, switching regions and `/list` do
  far less work: flags are drawn once and shared instead of rebuilt from
  dozens of shapes in every row and card, the window is laid out once per
  click instead of several times, animations no longer blur (which Firefox
  has to repaint every frame), and `/list` fades in line by line. Hovering
  cards and the counting stats while scanning are cheaper too.
- **Lighter in big games** — an open region builds cards only for what's on
  screen plus what you scroll into, instead of every server it finds. After
  a refresh in a busy region, that's a few dozen cards and avatar lookups
  instead of thousands.
- **Updates only when you say so** — BloxRegion no longer installs updates on
  its own. Firefox still downloads them in the background; BloxRegion holds
  them until you type `/update` (or press **Update now**). Firefox does apply
  a downloaded update when it restarts; turn off automatic updates for
  BloxRegion in `about:addons` to stop downloads altogether.
- **Updates no longer reload your Roblox tabs** — when BloxRegion updates,
  open game pages switch to the new version in place.
- **Friends: only servers you can join** — friends who hide their server, or
  who are in a full or private one, are no longer listed (or counted). Full
  servers are checked again after a minute in case a spot opens up.
- Joining a server and reading Roblox's security token now
  call Roblox's page functions directly instead of injecting script text into
  the page.
- Removed leftover code and files from older versions (an unused rule set
  and a 157 KB country outline file), so the add-on download is smaller.

## 2.2

- **Much smoother** — the window no longer uses live full-screen blur. The
  frosted backdrop is now the game's artwork blurred once and kept still, so
  Firefox doesn't have to redraw a heavy blur on every frame. Same look, far
  less work for your graphics card.
- **Real-time server lists** — while a region (or continent) is open, newly
  scanned servers slide into the list in sorted order as they're found, with a
  short highlight, and the cards around them glide aside. A green dot next to
  the server count shows the list is still updating.
- Lighter while scanning: the region list only re-measures itself when its
  order actually changes, off-screen server cards skip rendering, the progress
  bar and live indicator no longer repaint constantly, and the server cache is
  written to disk less often.

## 2.1

- **13 new server locations** — the region finder now lists Roblox's newest
  datacenters: Jakarta (Indonesia), Kuala Lumpur (Malaysia), Tel Aviv (Israel),
  Istanbul (Türkiye), Athens (Greece), Warsaw (Poland), Milan (Italy), Zürich
  (Switzerland), Cape Town (South Africa), Querétaro (Mexico), Lima (Peru),
  Buenos Aires (Argentina) and Santiago (Chile). Servers there are placed in the
  right city instantly, with flags and ping estimates. Some of these are still
  rolling out on Roblox's side, so they may show few or no servers for now.
- More of Roblox's own datacenter ranges are recognised instantly (extra blocks
  in Los Angeles, Chicago, Atlanta, Ashburn, New York, London, Paris, Frankfurt
  and Tokyo), so fewer servers need a slower lookup.
- Istanbul is grouped under Europe.

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
- **Update notices** — BloxRegion now tells you when a new version is out:
  a dot on the globe button, an Update badge in the sidebar, and a card on the
  Overview with what's new. Firefox installs updates from Firefox Add-ons on its
  own; if one arrives while BloxRegion is open, it waits and offers **Restart to
  update** instead of interrupting you. `/update` checks right away.
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
