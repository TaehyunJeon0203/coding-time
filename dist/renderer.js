"use strict";
const { ipcRenderer } = require("electron");
function saveProjects(projects) {
    localStorage.setItem("projects", JSON.stringify(projects));
}
function loadProjects() {
    const savedProjects = localStorage.getItem("projects");
    return savedProjects ? JSON.parse(savedProjects) : [];
}
function renderProjects(projects) {
    const projectsContainer = document.getElementById("projects");
    if (!projectsContainer)
        return;
    projectsContainer.innerHTML = "";
    projects.forEach((project) => {
        const projectElement = document.createElement("div");
        const projectName = document.createElement("span");
        projectName.textContent = project.name;
        const launchButton = document.createElement("button");
        launchButton.textContent = "open in VSCode";
        launchButton.addEventListener("click", () => {
            ipcRenderer.send("launch-project", project.path);
        });
        projectElement.appendChild(projectName);
        projectElement.appendChild(launchButton);
        projectsContainer.appendChild(projectElement);
    });
}
const projects = loadProjects();
renderProjects(projects);
document.getElementById("addProject")?.addEventListener("click", () => {
    const projectNameInput = document.getElementById("projectName");
    const projectPathInput = document.getElementById("projectPath");
    const projectName = projectNameInput.value.trim();
    const projectPath = projectPathInput.value.trim();
    if (projectName && projectPath) {
        projects.push({ name: projectName, path: projectPath });
        saveProjects(projects);
        renderProjects(projects);
        projectNameInput.value = "";
        projectPathInput.value = "";
    }
    else {
        alert("프로젝트 이름과 경로를 입력해 주세요");
    }
});
const timerDisplay = document.getElementById("timerDisplay");
ipcRenderer.on("update-timer", (event, seconds) => {
    if (timerDisplay) {
        timerDisplay.textContent = `${seconds}초`;
    }
});
