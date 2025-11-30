import { CANVAS_PROP } from "../../../shared/constants.js";
import { rootElem } from "../../../shared/domElem.js";
import { dbOperations } from "../../memory/database.js";
import layerManager from "./manager.js";

export default class Layer {
    constructor(id, name, order, layerElem) {
        const { width: lWidth, height: lHeight } = layerElem.getBoundingClientRect();

        this.previousPosition = { x: 0, y: 0 };
        this.initialPosition = { x: 0, y: 0 };

        this.id = id;
        this.name = name;
        this.isDrawing = false;
        this.data = new Map();

        this.canvas = document.createElement('canvas');

        this.layerCanvas = this.canvas.cloneNode();
        this.canvas.dataset.id = id;
        this.canvas.style.zIndex = order;
        this.layerCanvas.dataset.id = id;

        rootElem.appendChild(this.canvas);

        this.layer = layerElem;

        this.ctx = this.canvas.getContext('2d');
        this.lctx = this.layerCanvas.getContext('2d');

        this.canvas.width = CANVAS_PROP.width;
        this.canvas.height = CANVAS_PROP.height;
        this.layerCanvas.width = lWidth;
        this.layerCanvas.height = lHeight;

        this.nameElem = document.createElement('span');
        this.nameElem.contentEditable = true;
        this.nameElem.classList.add('layer-name');
        this.nameElem.innerText = this.name;
        this.nameElem.style.zIndex = 1;


        layerElem.appendChild(this.nameElem);
        layerElem.appendChild(this.layerCanvas);
        this.#addEventListener();
    }

    #addEventListener() {
        this.nameElem.addEventListener('blur', () => {
            layerManager.renameLayer(this.id, this.nameElem.innerText);
        });

        this.nameElem.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.nameElem.blur();
            }
        });
    }

    drawPath(path, fill, clip) {
        if (clip) {
            this.ctx.clip(path);
            if (!fill) this.ctx.stroke(path);
        } else {
            if (fill) {
                this.ctx.fill(path);
            }
            this.ctx.stroke(path);
        }

        this.lctx.clearRect(0, 0, this.layerCanvas.width, this.layerCanvas.height);
        this.lctx.drawImage(this.canvas, 0, 0, this.layerCanvas.width, this.layerCanvas.height);
    }

    addData(path, data) {
        const mData = { ...data };
        mData['path'] = path;
        this.data.set(data.id, mData);
    }

    clear() {
        this.canvas.width = CANVAS_PROP.width;
        this.canvas.height = CANVAS_PROP.height;
    }

    clearData() {
        this.data.clear();
    }

    setName(id, name) {
        console.log('Renaming layer', id, 'to', name);
        this.name = name;
        this.nameElem.innerText = this.name;
        dbOperations.updateLayer(id, {
            name
        })
    }
}