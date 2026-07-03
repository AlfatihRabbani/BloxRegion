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

**Pick your Roblox server region — terminal-style.**

![Firefox 128+](https://img.shields.io/badge/Firefox-128%2B-FF7139?logo=firefox-browser&logoColor=white)
![MV3](https://img.shields.io/badge/Manifest-V3-blue)
![License MIT](https://img.shields.io/badge/License-MIT-00ff9c)
![Status](https://img.shields.io/badge/status-active-00ff9c)

</div>

---

```bash
root@bloxregion:~$ help
>> commands: help, list, home, refresh, credits, contacts, version, exit,
   <country> (singapore, brazil, ...),
   <continent> (asia, europe, north america, oceania, south america)
```

## Features

- **Free** — no membership, no upgrade screen, no Robux gate. Click region, join server.
- **Terminal UI** — monospace, neon green, blinking cursor, traffic-light header. Designed by [Kanezama](https://github.com/).
- **Type-to-navigate** — type `singapore`, `brazil`, `california` to open a region. Type `asia`, `europe`, `north america` to aggregate every server in that continent.
- **Quick-play chips** — click any region/continent badge in the terminal to open instantly.
- **Geo fallback** — when the bundled IP map misses (Roblox keeps allocating new datacenter blocks like `128.116.0.0/16`), BloxRegion queries `geojs.io` from the background script. New ranges resolve automatically.
- **Header spoof via dNR** — outbound `User-Agent` / `Origin` / `Referer` rewritten to a Roblox client signature so `gamejoin.roblox.com` returns the real datacenter IP.

## Commands

| Command | Effect |
|---|---|
| `help` / `?` | Show command list |
| `list` / `ls` | Print every known region + indexed server count |
| `home` / `clear` | Return to the boot screen |
| `refresh` / `reload` | Re-fetch server list |
| `credits` | Show credits |
| `contacts` | Show contact links |
| `version` / `ver` | Show installed version |
| `exit` / `quit` | Close the panel |
| `<country>` | e.g. `singapore`, `germany`, `brazil` — open that region |
| `<region code>` | e.g. `SG`, `US-CA`, `DE` — open that region |
| `<continent>` | `asia`, `europe`, `north america`, `south america`, `oceania`, `africa` — aggregate all servers |

## Requirements

- **Firefox 128+** — needs `scripting.executeScript({world:'MAIN'})` and `declarativeNetRequest.modifyHeaders`.
- Browse a Roblox game page (`https://www.roblox.com/games/<id>/...`).
- Allow `*.roblox.com` and `*.geojs.io` host access in `about:addons` → BloxRegion → Permissions.

## How it works

```
 ┌─ content script (regionSelector.js) ──────────────────────────┐
 │  1. Fetch public server list for current game                 │
 │  2. For each server → POST gamejoin.roblox.com/join-game-...  │
 │     (dNR rewrites UA + Origin + Referer to Roblox client)     │
 │  3. Pull UdmuxEndpoints[0].Address → real datacenter IP       │
 │  4. Look up IP in bundled regionList.json                     │
 │     └─ miss? → ask background to query geojs.io               │
 │  5. Group servers by resolved region in left panel            │
 └───────────────────────────────────────────────────────────────┘

 ┌─ background script (background.js) ──────────────────┐
 │  • Installs dNR session rules at startup             │
 │  • Handles ipwho/geojs IP-geo lookups (CSP-safe)     │
 │  • Routes Roblox launch via scripting.executeScript  │
 └──────────────────────────────────────────────────────┘
```

## Project layout

```
.
├── manifest.json        # Firefox MV3 manifest
├── background.js        # dNR rules, geo lookup, game launcher
├── regionSelector.js    # terminal UI + region resolver
├── json/
│   ├── rules.json       # static dNR rule (UA / Origin / Referer)
│   ├── regionRules.json # secondary dNR ruleset
│   └── countries.json   # bundled IP → region map
├── icons/               # extension icons
├── README.md
└── LICENSE
```

## Credits

| Role         | Person                                                                 |
|--------------|------------------------------------------------------------------------|
| UI Designer  | Kanezama                                                               |
| Main Coder   | [AlfatihRabbani](https://github.com/AlfatihRabbani)                    |

Inspired by RoRegion Chrome extension 

## Contact

- GitHub: [AlfatihRabbani](https://github.com/AlfatihRabbani)
- LinkedIn: [fatih-rabbani](https://www.linkedin.com/in/fatih-rabbani-50a39037b/)

## License

[MIT](./LICENSE).

## Disclaimer

Not affiliated with Roblox Corporation. Modifying request headers may violate Roblox's Terms of Service. Use at your own risk — the maintainer accepts no responsibility for account actions taken by Roblox.
