# KeySpell

**A code-typing trainer for Python and C++ — learn the keyboard the way you learn syntax.**

KeySpell is a touch-typing practice app built for programmers. It drills real keywords,
built-in functions and idiomatic one-liners instead of plain prose, so every keystroke you
practise is a keystroke you will actually use in an editor.

It ships in two editions that share exactly the same interface:

| Edition | How to run | Best for |
| --- | --- | --- |
| **Web** | Open `web/index.html` in any modern browser | Zero install, works on any OS |
| **Desktop** | Run the Windows installer (`.exe`) | Classroom lab machines, no browser setup |

### Download

**[⬇ Download the latest release](https://github.com/Lulu1985/KeySpell/releases/latest)**

| File | Size | Description |
| --- | --- | --- |
| `KeySpell-Setup-1.2.0.exe` | ~215 MB | Windows installer, bundles the WebView2 runtime, works offline |
| `KeySpell.exe` | ~8 MB | Portable build, no installation required |

Both files are attached to the GitHub Release (they are too large to live in the
repository itself). See [Installation](#installation) for details.

---

## Features

- **Two languages, 38 modules.** 19 curated module sets for Python and 19 for C++, about
  1,250 words and symbols in total.
- **Everything is categorised.** Python keywords, built-in functions, string methods, list
  methods, dict/set operations, OOP magic methods, file I/O, exceptions and library
  one-liners each live in their own module. C++ covers keywords, types, containers, string
  operations, STL algorithms, math utilities and modern C++ features (`constexpr`,
  `concepts`, `ranges`, `std::format`, ...).
- **Random draw every round**, so you never memorise a fixed sequence.
- **Live metrics**: elapsed time, WPM, accuracy and a combo counter, updated on every key.
- **On-screen keyboard hint** that highlights the next key to press.
- **Star rewards and a result summary** with time, speed, accuracy and best combo.
- **Progress is saved locally** — mastered items, best speed and daily rounds survive
  restarts, reinstalls and in-place upgrades. The desktop edition stores them in a SQLite
  database at `%APPDATA%\KeySpell\keyspell.db`; the web edition falls back to
  `localStorage`.
- **Chinese input-method guard**: the app warns you when a CJK IME would swallow keystrokes.
- **Cat mascot "Cici"** keeps you company.

---

## Installation

### Option 1 — Windows installer (recommended)

1. Download `KeySpell-Setup-1.2.0.exe` from the
   [Releases page](https://github.com/Lulu1985/KeySpell/releases/latest).
2. Double-click it and follow the wizard. Administrator rights are required.
3. Launch **KeySpell** from the Start menu (a desktop shortcut is optional).

The installer bundles the Microsoft Edge WebView2 runtime, so it works **offline** and on
machines that have never opened Edge.

### Option 2 — Portable executable

Download `KeySpell.exe` from the Releases page and double-click it. Nothing is written
outside your user profile.

### Option 3 — Web edition

Open `web/index.html` directly, or serve the folder:

```bash
python -m http.server 8000 --directory web
```

Then browse to <http://127.0.0.1:8000/>.

**System requirements (desktop):** 64-bit Windows 10 or 11. No Python installation is
needed on the target machine.

---

## How to use

1. Pick a module on the home screen — it also shows word count, mastered count and your
   best speed.
2. Type the highlighted word. The app advances automatically when your input is correct.
3. Wrong character? The combo resets and the word stays until you fix it.

| Shortcut | Action |
| --- | --- |
| `Enter` | Submit the current word |
| `Backspace` | Reset the current word |
| `Tab` | Skip to the next word |
| `Esc` | Return to the module list |

---

## Project structure

```
KeySpell/
├─ web/                     Web edition — plain HTML/CSS/JS, no build step
│  ├─ index.html            Markup: home screen, practice view, result dialog
│  ├─ style.css             Theme, mascot, keyboard and star animations
│  ├─ app.js                Practice engine: input handling, WPM, accuracy, storage
│  └─ data.js               Word bank: 19 Python + 19 C++ modules
├─ desktop/                 Desktop edition (Python + pywebview)
│  ├─ main.py               Window bootstrap, local HTTP server, asset decryption
│  ├─ pack_assets.py        Encrypts web/ into secret_assets.py for the build
│  ├─ make_icon.py          Renders app.ico from the mascot artwork
│  ├─ build.ps1             One-command build (Nuitka → KeySpell.exe)
│  ├─ requirements.txt      pywebview, Nuitka, Pillow
│  └─ app.ico               Application icon
├─ installer/               Inno Setup packaging
│  ├─ KeySpell.iss          Installer script (Chinese UI, WebView2 bootstrap)
│  ├─ build_installer.ps1   One-command build (ISCC → setup exe)
│  └─ languages/            Simplified Chinese message catalog
├─ LICENSE
└─ README.md
```

---

## Building from source

### Web edition

Nothing to build. Edit the files in `web/` and reload the browser.

### Desktop executable

```powershell
cd desktop
pip install -r requirements.txt
.\build.ps1
```

`build.ps1` encrypts the web assets, compiles `main.py` with **Nuitka** into a native
`KeySpell.exe`, and copies the result to the repository root. The first run downloads a
C toolchain; later builds take about a minute.

### Installer

```powershell
cd installer
.\build_installer.ps1
```

This reuses the `KeySpell.exe` from the previous step, downloads the WebView2 offline
runtime if it is missing, and compiles `KeySpell-Setup-<version>.exe` with Inno Setup 6
(`winget install JRSoftware.InnoSetup`).

### Distribution notes

- The installer embeds the ~205 MB WebView2 runtime, so the setup file is large by design.
- Binaries are intentionally **not** committed to git; attach them to a GitHub Release.
  GitHub rejects individual files above 100 MB in the repository itself.

---

## Design and implementation notes

- **One code base, two shells.** The desktop build ships the very same `web/` files inside
  the executable, so the interface cannot drift between editions.
- **WebView2 rendering.** `pywebview` hosts the WebView2 control that ships with Windows
  10/11, which keeps the download small and the rendering identical to Edge.
- **Local server, stable origin.** Assets are served from `127.0.0.1` on a fixed port so
  `localStorage` keeps the same origin and progress survives restarts. The server never
  listens on an external interface.
- **SQLite persistence.** The desktop shell exposes `load_state()` / `save_state()` over the
  pywebview bridge; the page reads the saved snapshot on start-up and writes after every
  change. Data lives outside the install directory, so uninstalling keeps your records.
- **Native compilation.** The desktop entry point is compiled with Nuitka to C, so the
  executable contains no Python bytecode and cannot be unpacked with PyInstaller tooling.
- **Encrypted assets.** `pack_assets.py` compresses and encrypts the web resources; they
  are compiled into the binary as constants and decrypted in memory at start-up, leaving no
  readable copies on disk.

---

## Author

**Cici1985**

## License

Released under the [MIT License](LICENSE).
