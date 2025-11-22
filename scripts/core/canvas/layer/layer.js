import { rootElem } from "../../../shared/domElem.js";

export default class Layer {
    constructor(id, layerElem) {
        const { width, height } = rootElem.getBoundingClientRect();
        const { width: lWidth, height: lHeight } = layerElem.getBoundingClientRect();

        this.previousPosition = { x: 0, y: 0 };
        this.initialPosition = { x: 0, y: 0 };

        this.canvas = document.createElement('canvas');

        this.layerCanvas = this.canvas.cloneNode();
        this.canvas.dataset.id = id.unique;

        rootElem.appendChild(this.canvas);
        layerElem.appendChild(this.layerCanvas);

        this.layer = layerElem;

        this.ctx = this.canvas.getContext('2d');
        this.lctx = this.layerCanvas.getContext('2d');


        this.canvas.width = width;
        this.canvas.height = height;
        this.layerCanvas.width = lWidth;
        this.layerCanvas.height = lHeight;

        const span = document.createElement('span');
        span.innerText = `Layer ${id.name}`;

        layerElem.appendChild(span);
        this.id = id.unique;
        this.name = id.name;
        this.isDrawing = false;
        this.data = new Set();
    }

    drawPath(path, fill) {
        if (fill) {
            this.ctx.fill(path);
        }
        this.ctx.stroke(path);
        this.lctx.clearRect(0, 0, this.layerCanvas.width, this.layerCanvas.height);
        this.lctx.drawImage(this.canvas, 0, 0, this.layerCanvas.width, this.layerCanvas.height);
    }

    addData(data) {
        this.data.add(data);
    }
}