import { app, BrowserWindow } from "electron";
import { fileURLToPath } from "url";
import { join } from "path";
import { exec } from "child_process";
import fs from "fs";
import * as path from "path";
let mainWindow;
let intervalId;
const TIMER_FILE_PATH = path.join(app.getPath("userData"), "timer.json");
const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, "..");
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
        const fileContent = fs.readFileSync(TIMER_FILE_PATH, "utf-8");
        if (fileContent.trim() === "") {
            // 파일이 비어 있으면 기본 값을 반환
            console.log("Timer JSON file is empty, returning default state.");
            return { seconds: 0 };
        }
        try {
            return JSON.parse(fileContent);
        }
        catch (error) {
            console.error("Error parsing JSON:", error);
            return { seconds: 0 }; // 기본 값 반환
        }
    }
    return { seconds: 0 }; // 파일이 없을 경우 기본 값 반환
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
function stopTimer() {
    clearInterval(intervalId);
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
    console.log("Timer file path:", TIMER_FILE_PATH);
    mainWindow.loadFile(path.join(__dirname, "index.html"));
    mainWindow.on("closed", () => {
        mainWindow = null;
    });
    startTimer();
}
app.on("ready", createWindow);
app.on("window-all-closed", () => {
    stopTimer();
    if (process.platform !== "darwin") {
        app.quit();
    }
});
app.on("activate", () => {
    if (mainWindow === null) {
        createWindow();
    }
});
app.on("before-quit", () => {
    saveTimerState(timerState);
});
