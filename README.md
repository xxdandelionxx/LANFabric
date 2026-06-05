> [!IMPORTANT]
> Clientside is not yet perfectly polished right now and before playing on a client machine, make sure you have **Python 3** and `minecraft_launcher_lib` PyPI package installed.
>
> You can simply install `minecraft_launcher_lib` package like that:
> ```bash
> pip install minecraft_launcher_lib==8.0
> ```

> [!NOTE]
> Currently, LANFabric downloads clean vanilla Minecraft versions directly from Mojang's servers. Support for automated modded runtimes (such as Forge/Fabric loaders) is planned for future major updates
>
> (LANFabric is not associated with Fabric API in any way)

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

## 💻 Client Usage

Once the server is running on a host machine, any client on the same local network can download an offline Minecraft build from your **versions/** folder

### 0. Ensure client machine has Python 3 and `minecraft_launcher_lib` installed
This is currently the only limitation LANFabric has. In order to run `run.py` file inside the downloaded offline Minecraft copy, you need Python 3 and `minecraft_launcher_lib` PyPI packages downloaded. *To be fixed in a future update!*

### 1. Find your host's server IP address
Usually when you start your server with `npm start` it will show your local IP-address that clients can connect to.

If LANFabric shows `127.0.0.1:3000` as your IP, try to make sure you're connected to your network (not just localhost) or exit the program (Ctrl+C or `exit` inside of LANFabric custom terminal) and try,
- **Windows**: `ipconfig` (look for `IPv4 Address`)
- **Linux/Mac**: `ip addr` or `hostname -I`

### 2. Open LANFabric Update Center on the client
On the client computer, open a web browser and go to:

`http://[SERVER_IP]:3000`

Replace [SERVER_IP] with your local IP-address from step 1.

### 3. Download a Minecraft version
- The web interface will show all versions you've installed on the server (using the `download` command)
- Click on the version to download it as ZIP archive

### 4. Launch the game
Extract the downloaded ZIP to a folder on the client machine. Then run this command inside your game directory:
```bash
python run.py
```
*(The* `run.py` *script is included inside each downloaded ZIP archive)*

---

## 🛡️ License & Educational Disclaimer

This project is licensed under **MIT License**, check [LICENSE](LICENSE) file for details.

**Educational Disclaimer**: *This project was built entirely for educational purposes to demonstrate asynchronous runtime orchestration, file streams, and cross-runtime integration between Node.js and Python. No copyright files or binaries are distributed directly via this repository; everything is fetched dynamically via scripts.*
