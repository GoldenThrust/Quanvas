import { activeMetaData, rootElem } from "../../shared/main.js";
import settings from "../../shared/settings.js";
import { lerp, random } from "../../utils/random.js";
import { canvas } from "../../shared/main.js";

export default class Canvas {
    constructor(canvas) {
        const { width, height } = rootElem.getBoundingClientRect();

        this.previousPosition = { x: 0, y: 0 };
        this.initialPosition = { x: 0, y: 0 };

        this.canvas = canvas;

        this.ctx = this.canvas.getContext('2d');

        this.canvas.width = width;
        this.canvas.height = height;

        this.currentPathProp = {
            path: null,
            settings: null,
            metadata: false,
            points: []
        };

        this.path = new Set();

        this.isDrawing = false;
        this.flush = true;
        this.memorizePath = [];

        this.#eventlistener();
    }

    createPath() {
        this.currentPathProp.path = new Path2D();
    }


    #eventlistener() {
        this.canvas.addEventListener('mousedown', (e) => {
            if (!['L', 'K'].includes(activeMetaData.selectedTool[0]))
                this.#flushDrawing();
            this.createPath();
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            this.initialPosition.x = x;
            this.initialPosition.y = y;
            this.previousPosition.x = x;
            this.previousPosition.y = y;

            this.isDrawing = true;
            console.log('mousedown')
        });

        this.canvas.addEventListener('mousemove', (e) => {
            if (this.isDrawing) {
                const rect = this.canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                this.draw(x, y, activeMetaData, settings);

                this.previousPosition.x = x;
                this.previousPosition.y = y;
            }
        });

        this.canvas.addEventListener('mouseup', () => this.#flushDrawing());
        this.canvas.addEventListener('mouseleave', () => this.#flushDrawing());
    }

    #flushDrawing(flush) {
        if (!this.currentPathProp || !this.currentPathProp.metadata) return;
        this.draw(this.previousPosition.x, this.previousPosition.y, activeMetaData, settings);

        if (this.currentPathProp.metadata?.selectedTool?.[0] === 'L' && this.flush) {
            this.memorizePath.push({ x: this.previousPosition.x, y: this.previousPosition.y });
            this.flush = false;
        }

        if (flush !== undefined) this.flush = flush;

        if (this.flush) {
            this.isDrawing = false;
            const layer = canvas.get(activeMetaData.selectedLayer);

            if (layer && typeof layer.drawPath === 'function') {
                const fillFlag = !!this.currentPathProp.settings?.fill;
                layer.drawPath(this.currentPathProp.path, fillFlag);
            }

            this.currentPathProp.points = Array.from(this.memorizePath);
            this.#clear();
            this.path.add(this.currentPathProp);

            // reset current path container; next createPath will replace it
            this.currentPathProp = { path: null, settings: null, metadata: false, points: [] };
            this.memorizePath = [];
            console.log('Path added. Total paths:', this.path.size);
        }

        this.flush = true;
    }

    releasePath() {
        this.#flushDrawing(true);
    }

    #clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    #moveToInitialPosition(line = false) {
        this.#clear();
        this.createPath();
        this.ctx.moveTo(this.initialPosition.x, this.initialPosition.y)
        this.currentPathProp.path.moveTo(this.initialPosition.x, this.initialPosition.y);
    }

    #moveToPreviousPosition(line = true) {
        this.ctx.lineTo(this.previousPosition.x, this.previousPosition.y);
        this.currentPathProp.path?.lineTo?.(this.previousPosition.x, this.previousPosition.y);
    }

    #drawline() {
        this.#clear();
        this.createPath()
        if (this.memorizePath.length) {
            this.ctx.moveTo(this.memorizePath[0].x, this.memorizePath[0].y);
            this.currentPathProp.path.moveTo(this.memorizePath[0].x, this.memorizePath[0].y);
        } else {
            this.memorizePath.push({ x: this.initialPosition.x, y: this.initialPosition.y })
            this.#moveToInitialPosition();
        }
    }

    draw(x, y, activeMetaData, settings) {
        // console.clear();
        this.currentPathProp.metadata = activeMetaData;
        this.currentPathProp.settings = settings;

        const drawGPath = ['P', 'L'].includes(activeMetaData.selectedTool[0]);
        if (drawGPath)
            this.ctx.beginPath();
        if (!settings.erase) {
            switch (activeMetaData.selectedTool) {
                case 'P-pen':
                    this.#pen(x, y);
                    break;
                case 'P-brush':
                    this.#brush(x, y);
                    break;
                case 'R-rectangle':
                    this.#rectangle(x, y);
                    break;
                case 'R-roundrectangle':
                    this.#roundRectangle(x, y);
                    break;
                case 'C-circle':
                    this.#circle(x, y);
                    break;
                case 'C-ellipse':
                    this.#ellipse(x, y);
                    break;
                case 'L-line':
                    this.#line(x, y);
                    break;
                case 'L-arcto':
                    this.#arcTo(x, y);
                    break;
                case 'K-bezier':
                    this.#bezier(x, y);
                    break;
                case 'K-quadratic':
                    this.#quadratic(x, y);
                    break;
                default:
                    this.#eraser(x, y);
                    break;
            }

            this.ctx.fillStyle = 'red';
            this.ctx.strokeStyle = 'yellow';


            if (settings.fill && !drawGPath) {
                this.ctx.fill(this.currentPathProp.path);
            }
            if (drawGPath)
                this.ctx.stroke();
            else
                this.ctx.stroke(this.currentPathProp.path);

            if (activeMetaData.selectedTool[0] === 'P') {
                this.memorizePath.push({ x, y });
            }
        } else {
            this.#eraser(x, y);
            this.memorizePath.push({ x, y });
        }
    }

    #pen(x, y) {
        this.#moveToPreviousPosition();
        this.ctx.lineTo(x, y);
        this.currentPathProp.path.lineTo(x, y);
    }

    #brush(x, y) {
        this.#moveToPreviousPosition();
        const path = this.currentPathProp.path;
        const dX = this.previousPosition.x - x;
        const dY = this.previousPosition.y - y;
        const radius = Math.hypot(dX, dY);
        if (radius <= 0) {
            // nothing to interpolate, draw a small dot
            this.ctx.beginPath();
            this.ctx.arc(x, y, 0.5, 0, Math.PI * 2);
            path?.arc?.(x, y, 0.5, 0, Math.PI * 2);
            return;
        }

        const stepDX = dX / radius;
        const stepDY = dY / radius;
        for (let i = 0; i < Math.floor(radius); i++) {
            for (let j = 0; j < 2; j++) {
                const xs = (x + (stepDX * i)) + random(-5, 5);
                const ys = (y + (stepDY * i)) + random(-5, 5);
                // path.moveTo(x + (stepDX * i), (y + (stepDY * i)));
                this.ctx.arc(xs, ys, 0.5, 0, Math.PI * 2)
                path.arc(xs, ys, 0.5, 0, Math.PI * 2);
            }
        }
        // path.arc(x, y, 2, 0, Math.PI * 2);
    }

    #paint(x, y) {
        this.#moveToPreviousPosition(x, y);
        const path = this.currentPathProp.path;
        const dX = this.previousPosition.x - x;
        const dY = this.previousPosition.y - y;
        const radius = Math.hypot(dX, dY);
        const stepDX = dX / radius;
        const stepDY = dY / radius;

        const cut = 5;
        const spread = Math.PI * 2;

        for (let i = 0; i < radius; i++) {
            for (let j = 0; j < cut; j++) {
                const alpha = lerp(
                    spread / 2,
                    -spread / 2,
                    cut === 1 ? 0.5 : j / (cut - 1)
                );

                // path.moveTo((x + (stepDX * i)) + Math.cos(alpha) * (10), (y + (stepDY * i)) + Math.sin(alpha) * (10));
                path.arc((x + (stepDX * i)) + Math.cos(alpha) * (10), (y + (stepDY * i)) + Math.sin(alpha) * (10), 1, 0, Math.PI * 2);

            }
        }


        // path.arc(x, y, 2, 0, Math.PI * 2);
    }

    // rebuild() {
    //     this.path.forEach((path) => {
    //         this.draw(path.x, path.y, path.activeMetaData, path.settings)
    //     })
    // }

    #rectangle(x, y) {
        this.#moveToInitialPosition();
        const path = this.currentPathProp.path;
        path.rect(this.initialPosition.x, this.initialPosition.y, x - this.initialPosition.x, y - this.initialPosition.y);
    }

    #roundRectangle(x, y) {
        this.#moveToInitialPosition();
        const path = this.currentPathProp.path;
        path.roundRect(this.initialPosition.x, this.initialPosition.y, x - this.initialPosition.x, y - this.initialPosition.y, 10);
    }

    #circle(x, y) {
        this.#clear();
        this.createPath()
        const radius = Math.hypot(x - this.initialPosition.x, y - this.initialPosition.y);
        this.currentPathProp.path?.arc?.(this.initialPosition.x, this.initialPosition.y, radius, 0, Math.PI * 2);
    }
    #ellipse(x, y) {
        this.#clear();
        this.createPath()
        const radiusX = Math.abs(x - this.initialPosition.x);
        const radiusY = Math.abs(y - this.initialPosition.y);
        // const rotation = Math.atan2(y - this.initialPosition.y, x - this.initialPosition.x);
        this.currentPathProp.path?.ellipse?.(this.initialPosition.x, this.initialPosition.y, radiusX, radiusY, 0, 0, Math.PI * 2);
    }

    #line(x, y) {
        this.#drawline();
        this.memorizePath.forEach(({ x, y }) => {
            this.ctx.lineTo(x, y);
            this.currentPathProp.path?.lineTo?.(x, y);
        })
        this.ctx.lineTo(x, y);
        // this.currentPathProp.path.lineTo(x, y);
    }

    #arcTo(x, y) {
        this.#drawline();
        const path = [...this.memorizePath, { x, y }];
        const count = path.length - 1;
        for (let i = 1; i < count; i++) {
            const p = path[i - 1];
            const cp = path[i];
            const p2 = path[i + 1];
            const radius = Math.hypot(p.x - cp.x, p.y - cp.y) / 4;
            this.ctx.arcTo(cp.x, cp.y, p2.x, p2.y, radius);
            this.currentPathProp.path?.arcTo?.(cp.x, cp.y, p2.x, p2.y, radius);

        }

        this.ctx.lineTo(x, y);
        // this.currentPathProp.path?.lineTo?.(x, y);
    }

    #bezier(x, y) {
        this.#moveToInitialPosition();
        const path = this.currentPathProp.path;
        const cp1x = this.initialPosition.x + (x - this.initialPosition.x) / 3;
        const cp1y = this.initialPosition.y;
        const cp2x = this.initialPosition.x + (x - this.initialPosition.x) * 2 / 3;
        const cp2y = y;
        path?.bezierCurveTo?.(cp1x, cp1y, cp2x, cp2y, x, y);
    }

    #quadratic(x, y) {
        this.#moveToInitialPosition();
        const path = this.currentPathProp.path;
        const cpX = (this.initialPosition.x + x) / 2;
        const cpY = this.initialPosition.y;
        path?.quadraticCurveTo?.(cpX, cpY, x, y);
    }


    #eraser(x, y) {
        const layer = canvas.get(activeMetaData.selectedLayer);
        const dX = this.previousPosition.x - x;
        const dY = this.previousPosition.y - y;
        const radius = Math.hypot(dX, dY);
        if (radius <= 0) {
            layer?.ctx?.clearRect?.(x, y, 5, 5);
            return;
        }

        const stepDX = dX / radius;
        const stepDY = dY / radius;
        for (let i = 0; i < Math.floor(radius); i++) {
            const xs = (x + (stepDX * i));
            const ys = (y + (stepDY * i));
            layer?.ctx?.clearRect?.(xs, ys, 5, 5);
        }
    }
}