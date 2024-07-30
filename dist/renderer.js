"use strict";
let startTime = 0;
let intervalId;
function startTracking() {
    startTime = Date.now();
    intervalId = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        document.getElementById("time").innerText = `Time Elapsed: ${Math.floor(elapsedTime / 1000)} seconds`;
    }, 1000);
}
function stopTracking() {
    clearInterval(intervalId);
    const totalTime = Date.now() - startTime;
    alert(`Total time spent coding: ${Math.floor(totalTime / 1000)} seconds`);
}
document.getElementById("startBtn").addEventListener("click", startTracking);
document.getElementById("stopBtn").addEventListener("click", stopTracking);
