import app from "./app.js";
import Canvas from "./canvas/canvas.js";
import layerManager from "./canvas/layer/manager.js";
import Database, { dbOperations } from "./memory/database.js";
import { v4 as uuid } from "uuid";
// project manager
const homePage = document.getElementById('homePage');
const createProjectsForm = document.getElementById('createProjects');
const newProjectBtn = document.getElementById('newProjectBtn');
const cancelCreateBtn = document.getElementById('cancelCreate');
const projectForm = document.getElementById('projectForm');
const projectsContainer = document.getElementById('projects');
const menu = document.getElementById('menu');

createProjectsForm.style.display = 'none';


export default class Project {
    constructor() {
        this.#addEventListener();
    }

    #addEventListener() {
        newProjectBtn.addEventListener('click', function () {
            createProjectsForm.style.display = 'block';
            document.getElementById('projectName').focus();
        });

        cancelCreateBtn.addEventListener('click', function () {
            createProjectsForm.style.display = 'none';
            projectForm.reset();
        });


        projectForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const projectName = document.getElementById('projectName').value;
            const projectWidth = document.getElementById('projectWidth').value;
            const projectHeight = document.getElementById('projectHeight').value;

            const projectId = uuid();
            const thumbnail = await Canvas.createPreviewCanvas(Canvas.createCanvas(projectWidth, projectHeight));
            const url = URL.createObjectURL(thumbnail);
            const newProject = this.createProjectElement(projectId, projectName, url);;

            projectsContainer.appendChild(newProject);

            createProjectsForm.style.display = 'none';
            projectForm.reset();

            await dbOperations.createProject({
                id: projectId,
                name: projectName,
                width: projectWidth,
                height: projectHeight,
                thumbnail
            });

            URL.revokeObjectURL(url);
            this.openProject(projectId, projectName);
        });


        // delete project
        projectsContainer.addEventListener('click', async (e) => {
            e.preventDefault();
            if (e.target.closest('.delete')) {
                const projectItem = e.target.closest('.project-item');
                const projectName = projectItem.querySelector('.project-name').textContent;
                const id = projectItem.dataset.projectId;

                if (confirm(`Are you sure you want to delete "${projectName}"?`)) {
                    await dbOperations.deleteProject(id);
                    projectItem.remove();
                }
            }
        });


        projectsContainer.addEventListener('click', (e) => {
            if (!(e.target.closest('.delete') || e.target.closest('.project-name')) && e.target.closest('.project-item')) {
                const projectItem = e.target.closest('.project-item');
                const projectName = projectItem.querySelector('.project-name').textContent;

                const projectId = projectItem.dataset.projectId;
                this.openProject(projectId, projectName);
            }
        });

        // Rename project
        projectsContainer.addEventListener('blur', (e) => {
            if (e.target.classList.contains('project-name')) {
                const projectItem = e.target.closest('.project-item');
                const projectId = projectItem.dataset.projectId;
                const newName = e.target.textContent.trim();
                if (newName === '') {
                    e.target.textContent = 'Untitled Project';
                }

                dbOperations.updateProject(projectId, {
                    name: e.target.textContent
                });

            }
        }, true);


        projectsContainer.addEventListener('keydown', (e) => {
            if (e.target.classList.contains('project-name') && e.key === 'Enter') {
                e.preventDefault();
                e.target.blur();
            }
        });

        menu.addEventListener('click', _ => { homePage.style.display = 'block'; layerManager.init(); });
    }

    async init() {
        const currentProject = Database.getCurrentProjectID();
        if (currentProject) {
            homePage.style.display = 'none';
            const project = await dbOperations.getProject(currentProject);
            if (project) {
                this.openProject(project.id, project.name);
            } else {
                homePage.style.display = 'block';
            }
        }

        // Load existing projects on startup
        const projects = await dbOperations.getAllProjects();
        projects.forEach(project => {
            const url = URL.createObjectURL(project.thumbnail);
            const projectElement = this.createProjectElement(project.id, project.name, url);
            projectsContainer.appendChild(projectElement);
            setTimeout(() => {
                URL.revokeObjectURL(url);
            }, 100)
        })
        app.unloading = false;
    }

    createProjectElement(id, name, imgSrc) {
        const projectDiv = document.createElement('div');
        projectDiv.className = 'project-item';
        projectDiv.dataset.projectId = id;

        projectDiv.innerHTML = `
            <button class="delete" title="Delete Project" aria-label="Delete Project">
                <img src="./images/icons/delete.svg" alt="Delete">
            </button>
            <div class="project-thumbnail">
                <img src="${imgSrc}" style="background-color: white;" alt="Project Thumbnail" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
            </div>
            <div class="project-name" contenteditable="true">${name}</div>
        `;

        return projectDiv;
    }


    async openProject(id, name) {
        homePage.style.display = 'none';
        localStorage.setItem('current-project', id);
        await app.init();
    }
}

export const project = new Project();