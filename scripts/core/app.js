import { CANVAS_PROP, TOOL_IDS } from "../shared/constants.js";
import canvas from "./canvas/canvas.js";
import layerManager from "./canvas/layer/manager.js";
import Database, { dbOperations } from "./memory/database.js";
import { project } from "./projects.js";
import toolsManager from "./toolbox/manager.js";

const stateMenuElem = document.getElementById('state');

class APPManager {
    constructor() {
        this.state = {
            erase: false,
            fillrule: 'evenodd',
            clip: false,
            fill: false
        }

        this.keybinding = new Map();

        this.#addEventListener();
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
        }
        await project.init();

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

        layers?.forEach((layer) => {
            layerManager.createLayer(layer.id, layer.name, layer.order);
        });
        if (layerManager.layers.size === 0) {
            layerManager.createLayer();
        }
    }


    #addEventListener() {
        stateMenuElem.addEventListener('click', e => {
            const elem = e.target;
            this.toggleState(elem.id);
        })

        addEventListener('keydown', (e) => {
            // e.preventDefault();
            let keyBind = '';

            if (e.ctrlKey) keyBind += 'ctrl+';
            if (e.shiftKey) keyBind += 'shift+';
            if (e.altKey) keyBind += 'alt+'
            keyBind += e.key;

            this.keybinding.get(keyBind.toLowerCase())?.()
        })
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
                console.log(this.state[id])
                this.state[id] = !this.state[id];
                console.log(this.state[id] === true ? './images/tools/fill.svg' : './images/tools/stroke.svg')
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