<div align="center">

```
 ____  _            ____            _
| __ )| | _____  __|  _ \ ___  __ _(_) ___  _ __
|  _ \| |/ _ \ \/ /| |_) / _ \/ _` | |/ _ \| '_ \
| |_) | | (_) >  < |  _ <  __/ (_| | | (_) | | | |
|____/|_|\___/_/\_\|_| \_\___|\__, |_|\___/|_| |_|
                              |___/
```

# BloxRegion

**Pick your Roblox server region, nearest servers first.**

![Firefox 140+](https://img.shields.io/badge/Firefox-140%2B-FF7139?logo=firefox-browser&logoColor=white)
![MV3](https://img.shields.io/badge/Manifest-V3-blue)
![License MIT](https://img.shields.io/badge/License-MIT-0A84FF)
![Status](https://img.shields.io/badge/status-active-30D158)

</div>

---

BloxRegion adds a globe button next to Roblox's **Play** button. It opens a Liquid Glass
window that lists every public server of the game you're viewing, grouped by the
datacenter it runs in, with the regions closest to you at the top.

## Features

- **Free.** No membership, no upgrade screen, no Robux gate. Pick a region and join.
- **Liquid Glass UI.** A frosted-glass window with rim lighting, a blurred backdrop of the game's artwork, and spring-based motion throughout. Follows Roblox's light or dark theme.
- **Nearest first.** Your approximate location is known before the first lookup finishes, so "Nearest to you", distance-sorted continents, and ping estimates show up immediately.
- **Fast scanning.** Server pages are fetched ahead while servers resolve, concurrency adapts to Roblox's rate limits, and Roblox's datacenter ranges are bundled, so scanning starts at once.
- **Instant re-opens.** Resolved servers are remembered for 45 minutes. Refreshing or returning to a game only looks up servers it hasn't seen.
- **Join best.** One click joins the best server in a region, weighing estimated ping and server FPS.
- **Server cards.** Player count with a capacity bar, avatars, region, estimated ping, and FPS. Sort by best ping, most players, or fewest players.
- **Friends.** See which of your friends are playing, grouped by server, in this game and others. Each server shows its region and estimated ping, with a Join button. Servers with friends in them are marked in the region list and on server cards.
- **Command palette.** Type `/` to list every command, then keep typing to narrow it down. Matching regions and continents show up too. Plain text filters the region list.
- **Doesn't get in Roblox's way.** The button sits beside Play without touching Roblox's own UI, and scanning pauses while a game is launching.

## Commands

Press <kbd>/</kbd> anywhere in the window (or type `/` in the search field) to open the command palette. Keep typing to filter, use <kbd>↑</kbd> <kbd>↓</kbd> and <kbd>Enter</kbd> to run, <kbd>Tab</kbd> to complete, and <kbd>Esc</kbd> to close. The slash is optional when you type a full command.

| Command | Effect |
|---|---|
| `/help` | Show the command list |
| `/friends` | See where your friends are playing |
| `/nearest` | Open the region closest to you |
| `/join` | Join the best server near you |
| `/refresh` | Scan all servers again |
| `/home` | Back to the overview |
| `/list` | Every region with its server count |
| `/version` | Show the installed version |
| `/credits` | Show credits |
| `/contacts` | Show contact links |
| `/exit` | Close the window |
| `/<country or city>` | e.g. `/singapore`, `/tokyo`, `/frankfurt`: open that region |
| `/<region code>` | e.g. `/sg`, `/us-ca`, `/de`: open that region |
| `/<continent>` | `/asia`, `/europe`, `/north america`: show every server there |

## Requirements

- **Firefox 140+** (Android 142+).
- You need to be signed in to Roblox. Region lookups and the Friends list use your Roblox session.
- Open a Roblox game page (`https://www.roblox.com/games/<id>/...`).
- Allow `*.roblox.com` and `*.geojs.io` host access in `about:addons` → BloxRegion → Permissions.

## How it works

```
 ┌─ content script (regionSelector.js + bloxregion.css) ────────────┐
 │  1. Page producer lists the game's public servers, 100 per page  │
 │  2. A worker pool POSTs gamejoin.roblox.com/join-game-instance   │
 │     for each server (dNR rewrites UA + Origin + Referer), with   │
 │     concurrency that grows until Roblox rate-limits, then backs  │
 │     off                                                          │
 │  3. UdmuxEndpoints[0].Address → datacenter IP                    │
 │  4. 128.116.x.x → bundled Roblox datacenter table (instant)      │
 │     └─ miss → remote IP map → geojs.io via the background script │
 │  5. Results are cached per server for 45 minutes                 │
 │  6. Regions are ordered by distance from you and rendered in the │
 │     Liquid Glass window                                          │
 └──────────────────────────────────────────────────────────────────┘

 ┌─ background script (background.js) ──────────────────┐
 │  • Installs dNR session rules at startup             │
 │  • geojs.io lookups (server IPs, your approximate    │
 │    location), outside the page's CSP                 │
 │  • Runs Roblox's launcher in the page to join        │
 └──────────────────────────────────────────────────────┘
```

## Project layout

```
.
├── manifest.json        # Firefox MV3 manifest
├── background.js        # dNR rules, geo lookups, game launcher
├── regionSelector.js    # scanner, launcher button and window
├── bloxregion.css       # Liquid Glass styles
├── json/
│   ├── rules.json       # static dNR rule (UA / Origin / Referer)
│   ├── regionRules.json # secondary dNR ruleset
│   └── countries.json   # country outlines
├── icons/               # extension icons
├── CHANGELOG.md
├── README.md
└── LICENSE
```

## Credits

| Role         | Person                                                                 |
|--------------|------------------------------------------------------------------------|
| UI Designer  | Kanezama                                                               |
| Main Coder   | [AlfatihRabbani](https://github.com/AlfatihRabbani)                    |

Inspired by the RoRegion Chrome extension.

## Contact

- GitHub: [AlfatihRabbani](https://github.com/AlfatihRabbani)
- LinkedIn: [fatih-rabbani](https://www.linkedin.com/in/fatih-rabbani-50a39037b/)

## License

[MIT](./LICENSE).

## Disclaimer

Not affiliated with Roblox Corporation. Modifying request headers may violate Roblox's Terms of Service. Use at your own risk. The maintainer accepts no responsibility for account actions taken by Roblox.
