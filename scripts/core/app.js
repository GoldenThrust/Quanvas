import { CANVAS_PROP, TOOL_IDS } from "../shared/constants.js";
import { rootControllerElem, rootElem } from "../shared/domElem.js";
import { canvas } from "./canvas/canvas.js";
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

        this.transform = {
            scale: 1,
            rotation: 0,
            translateX: 0,
            translateY: 0
        }

        this.isDragging = false;
        this.lastMousePos = { x: 0, y: 0 };
        this.isSpacePressed = false;

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
            'ctrl+0': () => this.resetView(),
            'ctrl+1': () => this.fitToScreen(),
            'ctrl+=': () => this.zoom(1.25),
            'ctrl+-': () => this.zoom(0.8),
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

        const box = rootControllerElem.getBoundingClientRect();

        rootElem.style.width = `${CANVAS_PROP.width}px`;
        rootElem.style.height = `${CANVAS_PROP.height}px`;

        // Calculate initial fit-to-screen scale
        const scaleX = box.width / CANVAS_PROP.width;
        const scaleY = box.height / CANVAS_PROP.height;
        const fitScale = Math.min(scaleX, scaleY);

        if (fitScale < 1) {
            this.transform.scale = fitScale;
            this.transform.translateX = (box.width - CANVAS_PROP.width * fitScale) / 2;
            this.transform.translateY = (box.height - CANVAS_PROP.height * fitScale) / 2;
        }

        this.#updateTransform();
        this.#addCanvasEventListeners();
        this.#addTransformControlListeners();
    }


    #addEventListener() {
        stateMenuElem.addEventListener('click', e => {
            const elem = e.target;
            this.toggleState(elem.id);
        })

        addEventListener('keydown', (e) => {
            let keyBind = '';

            if (e.ctrlKey) keyBind += 'ctrl+';
            if (e.shiftKey) keyBind += 'shift+';
            if (e.altKey) keyBind += 'alt+'
            keyBind += e.key;

            if (keyBind === ' ') {
                this.isSpacePressed = true;
                e.preventDefault();
                return;
            }

            this.keybinding.get(keyBind.toLowerCase())?.()
        })

        addEventListener('keyup', (e) => {
            if (e.code === 'Space') {
                this.isSpacePressed = false;
            }
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

    // Transform utility methods
    #updateTransform() {
        const { scale, rotation, translateX, translateY } = this.transform;
        const transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
        rootElem.style.transform = transform;
        rootElem.style.transformOrigin = '0 0';

        CANVAS_PROP.scale = scale;
        // Update info display
        this.#updateTransformInfo();
    }

    #updateTransformInfo() {
        const scaleInfo = document.getElementById('scaleInfo');
        const rotationInfo = document.getElementById('rotationInfo');

        if (scaleInfo) {
            scaleInfo.textContent = `${Math.round(this.transform.scale * 100)}%`;
        }
        if (rotationInfo) {
            rotationInfo.textContent = `${Math.round(this.transform.rotation)}°`;
        }
    }

    #addTransformControlListeners() {
        // Button controls
        document.getElementById('resetView')?.addEventListener('click', () => this.resetView());
        document.getElementById('fitToScreen')?.addEventListener('click', () => this.fitToScreen());
        document.getElementById('zoomIn')?.addEventListener('click', () => this.zoom(1.25));
        document.getElementById('zoomOut')?.addEventListener('click', () => this.zoom(0.8));
    }

    #addCanvasEventListeners() {
        const controller = rootControllerElem;

        // Mouse wheel zoom
        controller.addEventListener('wheel', (e) => {
            e.preventDefault();
            const dx = e.deltaX;
            const dy = e.deltaY;

            if (e.ctrlKey) {
                const rect = controller.getBoundingClientRect();
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const zoomFactor = dy > 0 ? 0.9 : 1.1;
                this.zoomAtPoint(centerX, centerY, zoomFactor);
            } else {
                this.transform.translateX -= dx;
                this.transform.translateY -= dy;
            }

            this.#updateTransform();
        });

        controller.addEventListener('mousedown', (e) => {
            if (this.isSpacePressed || e.button === 1) {
                this.isDragging = true;
                this.lastMousePos = { x: e.clientX, y: e.clientY };
                controller.style.cursor = 'grabbing';
                e.preventDefault();
            }
        });

        controller.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                const deltaX = e.clientX - this.lastMousePos.x;
                const deltaY = e.clientY - this.lastMousePos.y;

                this.transform.translateX += deltaX;
                this.transform.translateY += deltaY;

                this.#updateTransform();

                this.lastMousePos = { x: e.clientX, y: e.clientY };
                e.preventDefault();
            } else if (this.isSpacePressed) {
                controller.style.cursor = 'grab';
            } else {
                controller.style.cursor = 'default';
            }
        });

        controller.addEventListener('mouseup', () => {
            if (this.isDragging) {
                this.isDragging = false;
                controller.style.cursor = this.isSpacePressed ? 'grab' : 'default';
            }
        });

        controller.addEventListener('mouseleave', () => {
            this.isDragging = false;
            controller.style.cursor = 'default';
        });
    }

    // Transform control methods
    zoom(factor) {
        const rect = rootControllerElem.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        this.zoomAtPoint(centerX, centerY, factor);
    }

    zoomAtPoint(x, y, factor) {
        const oldScale = this.transform.scale;
        this.transform.scale *= factor;

        // Limit zoom range
        this.transform.scale = Math.max(0.1, Math.min(10, this.transform.scale));

        const scaleChange = this.transform.scale / oldScale;

        // Adjust translation to zoom toward the point
        this.transform.translateX = x - (x - this.transform.translateX) * scaleChange;
        this.transform.translateY = y - (y - this.transform.translateY) * scaleChange;

        this.#updateTransform();
    }

    resetView() {
        this.transform = {
            scale: 1,
            rotation: 0,
            translateX: 0,
            translateY: 0
        };
        this.#updateTransform();
    }

    fitToScreen() {
        const box = rootControllerElem.getBoundingClientRect();
        const scaleX = box.width / CANVAS_PROP.width;
        const scaleY = box.height / CANVAS_PROP.height;
        const fitScale = Math.min(scaleX, scaleY);

        this.transform = {
            scale: fitScale,
            rotation: 0,
            translateX: (box.width - CANVAS_PROP.width * fitScale) / 2,
            translateY: (box.height - CANVAS_PROP.height * fitScale) / 2
        };
        this.#updateTransform();
    }
}

const app = new APPManager();
export default app;