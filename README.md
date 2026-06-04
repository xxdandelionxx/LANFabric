# 📜 LANFabric
A lightweight, high-performance, self-hosted deployment hub designed to distribute fully standalone (not quite, Python still required clientside) offline Minecraft environments over local area networks (LAN)

Perfect for environments with restricted, firewalled, or completely absent internet connectivity (like computer studies classes or remote areas). It transforms any device (PC or Android via Termux) into a mobile data-center capable of provisioning clients instantly.

---

## 🚀 Core Features

*   **Dual-Realm Architecture:** Asynchronous Node.js Express server running in parallel with a custom, interactive CLI terminal.
*   **Memory-Efficient Streaming:** Uses native Node.js data streams (`fs.createReadStream`) to pipe huge client archives without RAM spikes or leaks.
*   **Smart Automation:** Python automation backend (`downloader.py`) that fetches clean assets dynamically and packages them on-the-fly.
*   **Dynamic Web Interface:** Automatically scans storage directories to render a modern, dark-themed update catalog for local browser clients.
*   **DevOps Management:** Built-in dynamic index tracking (`fetch`), automated installation (`download`), and clean file uninstallation (`uninstall`) with protection against bad arguments.

---

## 🛠️ Technology Stack

*   **Backend & Server:** Node.js (Express, Readline, Child Process)
*   **Automation:** Python 3 (Minecraft-Launcher-Lib, Shutil, Urllib)
*   **Cross-Platform Core:** Fully compliant with Windows, might be good on Linux as well (including Termux on Android)

---

## 📦 Installation & Setup

1. Clone the repository to your host server device:
   ```bash
   git clone https://github.com/xxdandelionxx/LANFabric.git
   cd LANFabric
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Configure your Python virtual environment and modules:
   ```bash
   python -m venv .venv
   # Activate it (Windows: .venv\Scripts\activate | Linux: source .venv/bin/activate)
   pip install -r requirements.txt
   ```

4. Fire up the deployment hub:
   ```bash
   npm start
   ```

---

## 🎮 Terminal Commands

Inside the interactive LANFabric `>>>` console, you can run:
*   `help` - Displays all available server commands
*   `fetch` - Show installed MC versions and their MC-V Indexes
*   `download [version]` - Pre-install a specific Minecraft version via Python backend
*   `uninstall [version/index]` - Delete a version by its name or MC-V Index number
*   `cache` - Checks for any cache left on your hardware and automatically cleans it up
*   `cls` - Clears console
*   `exit` - Safely shuts down the update engine

---

## 🛡️ License & Educational Disclaimer

This project was built entirely for educational purposes to demonstrate asynchronous runtime orchestration, file streams, and cross-runtime integration between Node.js and Python. No copyright files or binaries are distributed directly via this repository; everything is fetched dynamically via scripts.
