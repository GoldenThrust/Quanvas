export default class Canvas {
    constructor(id, rootElem, layerElem) {
        const { width, height } = rootElem.getBoundingClientRect();
        const { width: lWidth, height: lHeight } = layerElem.getBoundingClientRect();

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
        this.#eventlistener();
    }

    #eventlistener() {
        this.canvas.addEventListener('mousedown', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            this.ctx.lineCap = 'round';
            this.ctx.lineJoin = 'round';
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
            this.isDrawing = true;
        });

        this.canvas.addEventListener('mousemove', (e) => {
            if (this.isDrawing) {
                const rect = this.canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                this.draw(x, y);

                this.lctx.drawImage(this.canvas, 0, 0, this.layerCanvas.width, this.layerCanvas.height)
            }
        });

        this.canvas.addEventListener('mouseup', () => {
            this.isDrawing = false;
        });

    }

    draw(x, y) {
        this.ctx.lineWidth = 20;
        this.ctx.lineTo(x, y);
        this.ctx.stroke();
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    destroy() {

    }
}