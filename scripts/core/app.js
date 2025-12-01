import { CANVAS_PROP, TOOL_IDS } from "../shared/constants.js";
import Canvas, { canvas } from "./canvas/canvas.js";
import layerManager from "./canvas/layer/manager.js";
import Database, { dbOperations } from "./memory/database.js";
import history from "./memory/history.js";
import { project } from "./projects.js";
import toolsManager from "./toolbox/manager.js";
import transformController from "./view/viewTransformController.js";

const stateMenuElem = document.getElementById('state');

class APPManager {
    constructor() {
        this.state = {
            erase: false,
            fillrule: 'evenodd',
            clip: false,
            fill: false
        }

        this.isDirty = false;
        this.unloading = true;

        this.keybinding = new Map();

        this.#addEventListener();
        setTimeout(async () => {
            await this.#save();
        }, 5000);
    }

    async init() {
        const defaultKeyBind = {
            'p': () => toolsManager.selectTool('P-pen'),
            'shift+p': () => toolsManager.selectTool('P-chalk'),
            'r': () => toolsManager.selectTool('R-rectangle'),
            'shift+r': () => toolsManager.selectTool('R-roundrectangle'),
            'c': () => toolsManager.selectTool('C-circle'),
            'shift+c': () => toolsManager.selectTool('C-ellipse'),
            'l': () => toolsManager.selectTool('L-line'),
            'shift+l': () => toolsManager.selectTool('L-arcto'),
            'k': () => toolsManager.selectTool('K-quadratic'),
            'shift+k': () => toolsManager.selectTool('K-bezier'),
            'e': () => this.toggleState('erase'),
            'f': () => this.toggleState('fill'),
            'ctrl+shift+c': () => this.toggleState('clip'),
            'escape': () => canvas.releasePath(),
            'ctrl+0': () => this.resetView(),
            'ctrl+1': () => this.fitToScreen(),
            'ctrl+=': () => this.zoom(1.25),
            'ctrl+-': () => this.zoom(0.8),
            'ctrl+s': async () => await this.#save(true),
            'ctrl+z': async () => {
                await history.undo();
                // console.log('History');
                // console.table(history.history);
                // console.log('Redo');
                // console.table(history.redoStack);
            },
            'ctrl+shift+z': async () => {
                await history.redo();
                // console.log('History');
                // console.table(history.history);
                // console.log('Redo');
                // console.table(history.redoStack);
            }
        }

        Object.entries(defaultKeyBind).forEach(([id, cb]) => {
            this.addKeyBind(id, cb);
        })

        toolsManager.selectTool('P-pen');

        const projectId = Database.getCurrentProjectID();
        if (!projectId) return;
        const projectData = await dbOperations.getProject(projectId);
        if (!projectData) {
            await dbOperations.deleteProject(projectId);
            return
        };

        layerManager.project = projectData;
        CANVAS_PROP.width = projectData.width;
        CANVAS_PROP.height = projectData.height;

        const layers = (await dbOperations.getLayersByProject(projectId)).sort((a, b) => a.order - b.order);

        await layers?.forEach(async (layer) => {
            await layerManager.createLayer({ id: layer.id, name: layer.name, order: layer.order, skipHistory: true });
        });

        if (layerManager.layers.size === 0) {
            await layerManager.createLayer({ skipHistory: true });
        }

        transformController.init();
    }


    async #save(notify = false) {
        if (!this.isDirty) return;
        canvas.saveOffScreen();
        const thumbnail = await Canvas.createPreviewCanvas(canvas.offScreenCanvas)
        const projectId = Database.getCurrentProjectID();
        if (!projectId) return;
        dbOperations.updateProject(projectId, { thumbnail });

        if (notify) {
            const saveNotification = document.getElementById('saveNotification');
            saveNotification.classList.add('show');
            setTimeout(() => {
                saveNotification.classList.remove('show');
            }, 2000);
        }
        this.isDirty = false;
    }


    #addEventListener() {
        stateMenuElem.addEventListener('click', e => {
            const elem = e.target;
            this.toggleState(elem.id);
        })

        addEventListener('keydown', (e) => {
            const el = e.target;
            if (
                el.tagName === 'INPUT' ||
                el.tagName === 'TEXTAREA' ||
                el.isContentEditable
            ) {
                return;
            }

            e.preventDefault();
            let keyBind = '';

            if (e.ctrlKey) keyBind += 'ctrl+';
            if (e.shiftKey) keyBind += 'shift+';
            if (e.altKey) keyBind += 'alt+'
            keyBind += e.key;

            this.keybinding.get(keyBind.toLowerCase())?.();
        })

        // addEventListener("beforeunload", (e) => {
        //     if (!this.isDirty) return;
        //     this.#save();
        //     e.preventDefault();
        // });

        addEventListener("visibilitychange", () => {
            if (document.visibilityState === "hidden") {
                this.#save();
            }
        });

        addEventListener("pagehide", () => this.#save());

    }

    addKeyBind(id, cb) {
        this.keybinding.set(id, cb);
    }


    toggleState(id) {
        canvas.releasePath();
        let elem = stateMenuElem.querySelector(`#${id}`);
        if (!TOOL_IDS.includes(id) && this.state[id] === undefined) return;

        switch (id) {
            case 'fillrule':
                this.state[id] = this.state[id] === 'nonzero' ? 'evenodd' : 'nonzero';
                if (this.state[id] === 'evenodd') elem.classList.add('selected');
                else elem.classList.remove('selected');
                break;

            case 'fill':
                this.state[id] = !this.state[id];
                elem.src = this.state[id] === true ? './images/tools/fill.svg' : './images/tools/stroke.svg';
                break;

            default:
                this.state[id] = !this.state[id];
                if (this.state[id]) elem.classList.add('selected');
                else elem.classList.remove('selected');
                break;
        }
    }
}

const app = new APPManager();
export default app;