const express = require('express');
const fs = require('fs');
const os = require('os');
const path = require('path');
const readline = require('readline');
const { spawn } = require('child_process');

const app = express();
const PORT = 3000;
const VERSIONS_DIR = path.join(__dirname, 'versions');
const CACHE_DIR = path.join(__dirname, 'client_build');

if (!fs.existsSync(VERSIONS_DIR)) {
    fs.mkdirSync(VERSIONS_DIR);
}

app.get('/', (req, res) => {
    let files = [];
    try {
        if (fs.existsSync(VERSIONS_DIR)) {
            files = fs.readdirSync(VERSIONS_DIR).filter(f => f.endsWith('.zip'));
        }
    } catch (err) {
        console.log(`[Web Error] Could not read versions directory: ${err.message}`);
    }

    let versionLinks = '';
    if (files.length === 0) {
        versionLinks = '<p style="color: #888;">No versions available on the server yet. Use the terminal to download some!</p>';
    } else {
        files.forEach(file => {
            const versionName = file.replace('.zip', '');
            versionLinks += `
                <li style="margin: 10px 0;">
                    <a href="/download/${versionName}" style="color: #4caf50; font-size: 18px; text-decoration: none; font-weight: bold;">
                        📦 Download Minecraft ${versionName}
                    </a>
                </li>`;
        });
    }

    const htmlPage = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>LANFabric</title>
        <meta charset="utf-8">
    </head>
    <body style="background-color: #121212; color: #ffffff; font-family: sans-serif; padding: 40px; max-width: 600px; margin: 0 auto;">
        <h1 style="border-bottom: 2px solid #4caf50; padding-bottom: 10px; color: #4caf50;">LANFabric Update Center</h1>
        <p style="color: #b0b0b0;">Connect to this server from any device in the local network to get your offline Minecraft client instantly.</p>
        <h3 style="margin-top: 30px; color: #f5f5f5">Available Downloads:</h3>
        <ul style="list-style-type: none; padding-left: 0;">
            ${versionLinks}
        </ul>
        <footer style="margin-top: 50px; font-size: 12px; color: #555; text-align: center; border-top: 1px solid #222; padding-top: 20px;">
            LANFabric Engine &bull; Handcrafted by <a href="https://github.com/xxdandelionxx" target="_blank" rel="noopener noreferrer">@xxdandelionxx</a>
        </footer>
    </body>
    </html>
    `;

    res.status(200).send(htmlPage);
})

app.get('/download/:version', (req, res) => {
    const fileName = `${req.params.version}.zip`;
    const filePath = path.join(VERSIONS_DIR, fileName);

    if (!fs.existsSync(filePath)) {
        return res.status(404).send("Version not found!");
    }

    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    res.setHeader('Content-Type', 'application/zip');

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
})

function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const net of interfaces[name]) {
            if (net.family === 'IPv4' && !net.internal) {
                return net.address;
            }
        }
    }
    return '127.0.0.1'; // in case there's no network
}

app.listen(PORT, () => {
    const localIP = getLocalIP();

    console.log(`[LANFabric] Active on port ${PORT}`);
    console.log(`[LANFabric] Link: http://${localIP}:${PORT}`);
    console.log(`-------------------------------------------`);

    rl.prompt();
})

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '>>>'
});

rl.on('line', (line) => {
    const input = line.trim().split(' ');
    const command = input[0].toLowerCase();
    const args = input.slice(1);

    switch (command) {
        case 'fetch':
            const files = fs.readdirSync(VERSIONS_DIR).filter(f => f.endsWith('.zip'));
            if (files.length === 0) {
                console.log('No Minecraft versions installed yet. Use "download"');
            } else {
                console.log('--- INSTALLED MINECRAFT VERSIONS ---');
                files.forEach((file, index) => {
                    console.log(`[Index: ${index + 1}] -> ${file.replace('.zip', '')}`);
                });
                console.log('--------------------------------------');
            }
            break;

        case 'download':
            if (args.length === 0) {
                console.log('Usage: download [version] (e.g., download 1.12.2)');
            } else {
                const versionToDownload = args[0];
                console.log(`[LANFabric] Invoking Python downloader for version: ${versionToDownload}`);
                console.log('[LANFabric] This may take a few seconds before info appears here...')
                //console.log(`[PLACEHOLDER]`);
                const pythonProcess = spawn('python', ['downloader.py', versionToDownload]);
                pythonProcess.stdout.on('data', (data) => {
                    process.stdout.write(`[downloader.py] ${data}`);
                });

                pythonProcess.stderr.on('data', (data) => {
                    process.stderr.write(`!! [downloader.py] ${data}`);
                });

                pythonProcess.on('close', (code) => {
                    console.log(`[LANFabric] Python downloader finished with code ${code}`);
                    if (code === 0) {
                        console.log(`[LANFabric] ${versionToDownload} is now available for download\n`);
                    } else {
                        console.log(`!! [LANFabric] Something terrible has happened. Check Python logs above\n`);
                    }
                    rl.prompt();
                })
            }
            break;
        
        case 'uninstall':
            if (args.length === 0) {
                console.log('Usage: uninstall [version/index]');
            } else {
                const target = args[0];
                const filesList = fs.readdirSync(VERSIONS_DIR).filter(f => f.endsWith('.zip'));

                let fileToDelete = '';

                if (/^\d+$/.test(target)) {
                    const targetIndex = parseInt(target, 10) - 1;
                    if (filesList[targetIndex]) {
                        fileToDelete = filesList[targetIndex];
                    }
                } else if (filesList.includes(`${target}.zip`)) {
                    fileToDelete = `${target}.zip`;
                }

                if (fileToDelete) {
                    fs.unlinkSync(path.join(VERSIONS_DIR, fileToDelete));
                    console.log(`[LANFabric] Uninstalled and deleted ${fileToDelete}`);
                } else {
                    console.log(`!! [LANFabric] Version or Index ${target} not found`);
                }
            }
            break;
        
        case 'cls':
            process.stdout.write('\u001Bc\u001B[3J');
            break;
        
        case 'cache':
            console.log('[LANFabric] Cleaning temporary files cache...');
            const cacheDir = path.join(__dirname, 'client_build');
            
            try {
                if (fs.existsSync(cacheDir)) {
                    fs.rmSync(cacheDir, { recursive: true, force: true });
                    fs.mkdirSync(cacheDir); 
                    console.log('[LANFabric] Cache folder is completely empty!');
                } else {
                    fs.mkdirSync(cacheDir);
                    console.log('[LANFabric] Cache folder did not exist. Created empty one.');
                }
            } catch (err) {
                console.log(`!! [LANFabric] Could not clear cache: ${err.message}`);
            }
            break;
        
        case 'help':
            console.log('--- AVAILABLE COMMANDS ---');
            console.log('fetch              - Show installed MC versions and their MC-V Indexes');
            console.log('download [version] - Pre-install a specific Minecraft version via Python');
            console.log('uninstall [v/idx]  - Delete a version by its name or MC-V Index number');
            console.log('cache              - Checks for any cache left on your hardware and automatically cleans it up')
            console.log('cls                - Clears console')
            console.log('exit               - Turn off LANFabric server');
            console.log('--------------------------');
            break;
        
        case 'exit':
            console.log('Shutting down LANFabric server...');
            process.exit(0);
            break;

        default:
            console.log(`Unknown command: "${command}". Type "help" for a list of available commands`)
            break;
    }
    rl.prompt();
}).on('close', () => {
    console.log('\nLANFabric console closed.');
    process.exit(0);
})