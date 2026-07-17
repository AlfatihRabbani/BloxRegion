# Changelog

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
