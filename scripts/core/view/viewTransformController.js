import { CANVAS_PROP } from "../../shared/constants.js";
import { rootControllerElem, rootElem } from "../../shared/domElem.js";
import { canvas } from "../canvas/canvas.js";

class ViewTransformController {
    constructor(view) {
        this.view = view;
        this.transform = {
            scale: 1,
            translateX: 0,
            translateY: 0
        };
        // this.isDragging = false;
        // this.isSpacePressed = false;

        this.lastMousePos = { x: 0, y: 0 };

        this.#addEventListeners();
        this.#addTransformControlListeners();
    }

    init() {
        const box = rootControllerElem.getBoundingClientRect();

        rootElem.style.width = `${CANVAS_PROP.width}px`;
        rootElem.style.height = `${CANVAS_PROP.height}px`;

        const scaleX = box.width / CANVAS_PROP.width;
        const scaleY = box.height / CANVAS_PROP.height;
        const fitScale = Math.min(scaleX, scaleY);

        if (fitScale < 1) {
            this.transform.scale = fitScale;
            this.transform.translateX = (box.width - CANVAS_PROP.width * fitScale) / 2;
            this.transform.translateY = (box.height - CANVAS_PROP.height * fitScale) / 2;
        } else {
            this.transform.translateX = (box.width - CANVAS_PROP.width) / 2;
            this.transform.translateY = (box.height - CANVAS_PROP.height) / 2;
        }

        this.#updateTransform();

        canvas.reset();
    }

    #addTransformControlListeners() {
        document.getElementById('resetView')?.addEventListener('click', () => this.resetView());
        document.getElementById('fitToScreen')?.addEventListener('click', () => this.fitToScreen());
        document.getElementById('zoomIn')?.addEventListener('click', () => this.zoom(1.25));
        document.getElementById('zoomOut')?.addEventListener('click', () => this.zoom(0.8));
    }

    #addEventListeners() {
        const controller = rootControllerElem;

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
    }


    #updateTransform() {
        const { scale, translateX, translateY } = this.transform;
        const transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
        rootElem.style.transform = transform;
        rootElem.style.transformOrigin = '0 0';

        CANVAS_PROP.scale = scale;
        this.#updateTransformInfo();
    }

    #updateTransformInfo() {
        const scaleInfo = document.getElementById('scaleInfo');

        if (scaleInfo) {
            scaleInfo.textContent = `${Math.round(this.transform.scale * 100)}%`;
        }
    }

    zoom(factor) {
        const rect = rootControllerElem.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        this.zoomAtPoint(centerX, centerY, factor);
    }

    zoomAtPoint(x, y, factor) {
        const oldScale = this.transform.scale;
        this.transform.scale *= factor;

        this.transform.scale = Math.max(0.1, Math.min(10, this.transform.scale));

        const scaleChange = this.transform.scale / oldScale;

        this.transform.translateX = x - (x - this.transform.translateX) * scaleChange;
        this.transform.translateY = y - (y - this.transform.translateY) * scaleChange;

        this.#updateTransform();
    }

    resetView() {
        const box = rootControllerElem.getBoundingClientRect();

        this.transform = {
            scale: 1,
            translateX: (box.width - CANVAS_PROP.width) / 2,
            translateY: (box.height - CANVAS_PROP.height) / 2
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
            translateX: (box.width - CANVAS_PROP.width * fitScale) / 2,
            translateY: (box.height - CANVAS_PROP.height * fitScale) / 2
        };
        this.#updateTransform();
    }
}

const transformController = new ViewTransformController();
export default transformController;