import { app, BrowserWindow } from "electron";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { exec } from "child_process";
import fs from "fs";
import * as path from "path";
let mainWindow;
let intervalId;
const TIMER_FILE_PATH = path.join(app.getPath("userData"), "timer.json");
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
function isVSCodeRunning() {
    return new Promise((resolve, reject) => {
        exec("ps aux | grep 'Visual Studio Code' | grep -v grep", (err, stdout, stderr) => {
            if (err) {
                reject(err);
            }
            resolve(stdout.length > 0);
        });
    });
}
function saveTimerState(state) {
    fs.writeFileSync(TIMER_FILE_PATH, JSON.stringify(state));
}
function loadTimerState() {
    if (fs.existsSync(TIMER_FILE_PATH)) {
        return JSON.parse(fs.readFileSync(TIMER_FILE_PATH, "utf-8"));
    }
    return { seconds: 0 };
}
let timerState = loadTimerState();
function startTimer() {
    intervalId = setInterval(async () => {
        const vscodeRunning = await isVSCodeRunning();
        if (vscodeRunning) {
            timerState.seconds++;
            saveTimerState(timerState);
            if (mainWindow) {
                mainWindow.webContents.send("update-timer", timerState.seconds);
            }
        }
    }, 1000);
}
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });
    mainWindow.loadFile(path.join(__dirname, "index.html"));
    mainWindow.on("closed", () => {
        mainWindow = null;
    });
}
app.on("ready", createWindow);
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
app.on("activate", () => {
    if (mainWindow === null) {
        createWindow();
    }
});
