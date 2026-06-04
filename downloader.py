from string import Template
import os
import sys
import shutil
import minecraft_launcher_lib as mll

if len(sys.argv) < 2:
    print("[downloader.py] Error: no version specified!")
    sys.exit(1)

VERSION = sys.argv[1]

TARGET_DIR = "./client_build"
ZIP_DIR = "./versions"

current_max = 0

def set_progress(progress: int):
    if current_max != 0:
        print(f"[downloader.py] {progress}/{current_max}")

def set_max(new_max: int):
    global current_max
    current_max = new_max

callback = {
    "setProgress": set_progress,
    "setMax": set_max
}

print(f"[downloader.py] {VERSION} download enqueued, please wait...")
try:
    mll.install.install_minecraft_version(VERSION, TARGET_DIR, callback)
except Exception as e:
    raise

print(f"[downloader.py] Generating starter files...")

client_run_path = os.path.join(TARGET_DIR, "run.py")
run_code = Template("""import minecraft_launcher_lib as mll
import sys
import uuid
import subprocess
import tkinter as tk
from tkinter import simpledialog

root = tk.Tk()
root.withdraw()
optionsUser = "Player"

try:
    with open("runoptions.txt", "r") as file:
        content = file.read()
        optionsUser = content
        print(optionsUser)
except FileNotFoundError:
    with open("runoptions.txt", "w") as file:
        file.write("Player")
except PermissionError:
    print("Permission error! Cannot read from run options file!")
except Exception as e:
    print("Something terrible has happened. Exception will be raised.")
    raise

username = simpledialog.askstring("Minecraft Launch Configurator", "Please enter your nickname you want to go by:", initialvalue=optionsUser)
if username == None:
    sys.exit()
elif username == "":
    username = "Player"
else:
    try:
        with open("runoptions.txt", "w") as file:
            file.write(username)
    except Exception:
        print("Oof...")
print(f"user: {username}")

# offline session options
options = {
    "username": username,
    "uuid": str(uuid.uuid3(uuid.NAMESPACE_DNS, username)),
    "token": ""
}

launch_command = mll.command.get_minecraft_command("$version", ".", options)

runtime_name = mll.runtime.get_version_runtime_information("$version", ".")["name"]

java_exe_path = mll.runtime.get_executable_path(runtime_name, ".")

launch_command[0] = java_exe_path

print(f"Launching Minecraft $version for {username}...")
subprocess.run(launch_command)
""")

final_code = run_code.substitute(
    version=VERSION
)

with open(client_run_path, "w", encoding="utf-8") as file:
    file.write(final_code)

print("[downloader.py] Packing build into a .ZIP archive")

if not os.path.exists(ZIP_DIR):
    os.makedirs(ZIP_DIR)

shutil.make_archive(os.path.join(ZIP_DIR, VERSION), "zip", TARGET_DIR)
print(f"[downloader.py] {VERSION} is ready for distribution to clients")

print(f"[downloader.py] Cleaning up temporarily files...")
shutil.rmtree(TARGET_DIR)
os.makedirs(TARGET_DIR)
print(f"[downloader.py] Finished")