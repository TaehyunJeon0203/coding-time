import { ipcRenderer } from "electron";

const timerDisplay = document.getElementById("timerDisplay");

ipcRenderer.on("update-timer", (event, seconds) => {
  if (timerDisplay) {
    timerDisplay.textContent = seconds;
  }
});
