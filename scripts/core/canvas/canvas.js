import { CANVAS_PROP } from "../../shared/constants.js";
import { random } from "../../utils/random.js";
import { calculateTangent } from "../../utils/vector.js";
import app from "../app.js";
import toolsManager from "../toolbox/manager.js";
import layerManager from "./layer/manager.js";

export default class Canvas {
    constructor() {
        this.previousPosition = { x: 0, y: 0 };
        this.initialPosition = { x: 0, y: 0 };

        this.canvas = document.getElementById('canvas');
        this.offScreenCanvas = new OffscreenCanvas(CANVAS_PROP.width, CANVAS_PROP.height);

        this.ctx = this.canvas.getContext('2d');
        this.offScreenCtx = this.offScreenCanvas.getContext('2d');

        this.canvas.width = CANVAS_PROP.width;
        this.canvas.height = CANVAS_PROP.height;

        this.path = null;

        this.isDrawing = false;
        this.flush = true;
        this.points = [];
        this.pointsCount = 0;
        this.state = app.state;
        this.activeTool = null;
        this.layer = null;

        this.#addEventlistener();
    }

    createPath() {
        this.path = new Path2D();
    }


    #addEventlistener() {
        this.canvas.addEventListener('mousedown', (e) => {
            if (!['L', 'K'].includes(this.activeTool[0]))
                this.#flushDrawing();
            this.createPath();
            const rect = this.canvas.getBoundingClientRect();
            const x = (e.clientX - rect.left) / CANVAS_PROP.scale;
            const y = (e.clientY - rect.top) / CANVAS_PROP.scale;

            this.initialPosition.x = x;
            this.initialPosition.y = y;
            this.previousPosition.x = x;
            this.previousPosition.y = y;

            this.isDrawing = true;
        });

        this.canvas.addEventListener('mousemove', (e) => {
            if (this.isDrawing) {
                const rect = this.canvas.getBoundingClientRect();

                const x = (e.clientX - rect.left) / CANVAS_PROP.scale;
                const y = (e.clientY - rect.top) / CANVAS_PROP.scale;

                this.draw(x, y);

                this.previousPosition.x = x;
                this.previousPosition.y = y;
            }
        });

        this.canvas.addEventListener('mouseup', () => this.#flushDrawing());
        // this.canvas.addEventListener('mouseleave', () => this.#flushDrawing());
    }

    reset() {
        this.#clear();
        this.isDrawing = false;
        this.path = null;
        this.points = [];
        this.pointsCount = 0;
    }

    #flushDrawing(flush) {
        console.log('flushing drawing');
        if (this.path === null) return;

        this.draw(this.previousPosition.x, this.previousPosition.y);
        this.pointsCount++;

        if (['K', 'L'].includes(this.activeTool[0]) && this.flush && !flush) {
            this.points.push({ x: this.previousPosition.x, y: this.previousPosition.y });
            this.#createCurve();
            this.flush = false;
        }

        if (flush !== undefined) this.flush = flush;

        if (this.flush) {
            if (['R', 'C'].includes(this.activeTool[0])) this.points.push({ x: this.previousPosition.x, y: this.previousPosition.y });

            layerManager.saveDrawing(this.path, this.points, this.state);

            this.reset()
        }

        this.flush = true;
    }

    flushToPath(data) {
        const { points, type, layerId, state } = data;

        this.createPath();
        for (let i = 0; i < points.length; i++) {
            if (i == 0) {
                this.initialPosition.x = points[0].x;
                this.initialPosition.y = points[0].y;
            }

            this.previousPosition.x = points[Math.max(0, i - 1)].x;
            this.previousPosition.y = points[Math.max(0, i - 1)].y;
            this.points.push({ x: points[i].x, y: points[i].y });
            this.draw(points[i].x, points[i].y, state, type, layerManager.getLayer(layerId));
        }

        layerManager.saveDrawingIn(layerId, this.path, points, state);
        this.reset();
    }

    releasePath() {
        if (this.activeTool === null) this.activeTool = toolsManager.activeToolId;
        if ((['L',].includes(this.activeTool[0]) && this.points.length < 2) || (['P', 'K'].includes(this.activeTool[0]) && this.points.length < 3)) return this.reset();
        this.#flushDrawing(true);
    }

    #clear() {
        this.canvas.width = CANVAS_PROP.width;
        this.canvas.height = CANVAS_PROP.height;
    }

    #clearOffScreen() {
        this.offScreenCanvas.width = CANVAS_PROP.width;
        this.offScreenCanvas.height = CANVAS_PROP.height;
    }

    saveOffScreen() {
        this.#clearOffScreen();

        layerManager.layers.forEach(layer => {
            this.offScreenCtx.drawImage(layer.canvas, 0, 0);
        });
    }


    #moveToInitialPosition(addPoint = true) {
        if (!this.points.length && addPoint)
            this.points.push({ x: this.initialPosition.x, y: this.initialPosition.y });
        this.#clear();
        this.createPath();
        this.ctx.moveTo(this.initialPosition.x, this.initialPosition.y)
        this.path.moveTo(this.initialPosition.x, this.initialPosition.y);
    }

    #moveToPreviousPosition() {
        if (this.state.fill || this.state.clip) {
            this.ctx.lineTo(this.previousPosition.x, this.previousPosition.y);
            this.path?.lineTo?.(this.previousPosition.x, this.previousPosition.y);
        } else {
            this.ctx.moveTo(this.previousPosition.x, this.previousPosition.y);
            this.path?.moveTo?.(this.previousPosition.x, this.previousPosition.y);
        }
    }

    #createCurve() {
        if (this.activeTool === 'K-bezier') {
            this.points.push({ x: this.previousPosition.x, y: this.previousPosition.y });
            this.points.push({ x: this.previousPosition.x, y: this.previousPosition.y });
        }
    }

    #computeHandle(p, pPrev, pNext) {
        if (!(p && pPrev && pNext)) return;

        const { ux, uy } = calculateTangent(pPrev, pNext);
        const k = 0.25;

        const lenPrev = Math.hypot(p.x - pPrev.x, p.y - pPrev.y);
        const lenNext = Math.hypot(p.x - pNext.x, p.y - pNext.y);

        const len = k * Math.min(lenPrev, lenNext);

        return { prev: { x: p.x - ux * len, y: p.y - uy * len }, next: { x: p.x + ux * len, y: p.y + uy * len } };
    }

    #drawline() {
        this.#clear();
        this.createPath()
        if (this.points.length) {
            this.ctx.moveTo(this.points[0].x, this.points[0].y);
            this.path.moveTo(this.points[0].x, this.points[0].y);
        } else {
            this.#moveToInitialPosition(false);
        }
    }

    draw(x, y, state = null, activeToolId = null, layer = null) {
        app.isDirty = true;
        this.state = state ?? app.state;
        this.activeTool = activeToolId ?? toolsManager.activeToolId;
        this.layer = layer ?? layerManager.getActiveLayer();

        const drawGPath = ['P', 'L', 'K'].includes(this.activeTool[0]);
        if (drawGPath)
            this.ctx.beginPath();
        if (!this.state.erase) {
            switch (this.activeTool) {
                case 'P-pen':
                    this.#pen(x, y);
                    break;
                case 'P-chalk':
                    this.#chalk(x, y);
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

            // this.ctx.fillStyle = 'red';
            // this.ctx.strokeStyle = 'yellow';



            if (this.state.fill && !drawGPath) {
                this.ctx.fill(this.path);
            }
            if (drawGPath)
                this.ctx.stroke();
            else
                this.ctx.stroke(this.path);

            if (this.activeTool[0] === 'P') {
                this.points.push({ x, y });
            }

            // if (state.clip) {
            //     this.ctx.clip(this.path);
            // }
        } else {
            this.#eraser(x, y);
            this.points.push({ x, y });
        }
    }

    #pen(x, y) {
        this.#moveToPreviousPosition();
        this.ctx.lineTo(x, y);
        this.path.lineTo(x, y);
    }

    #chalk(x, y) {
        this.#moveToPreviousPosition();
        const path = this.path;
        const tangent = calculateTangent({ x, y }, this.previousPosition);
        // const normal = calculateNormal(tangent);
        const stepDX = tangent.ux;
        const stepDY = tangent.uy;
        const randomNess = 1;
        const density = 1;
        const pebbleSize = 0.1;

        for (let i = 0; i < Math.floor(tangent.L); i++) {
            for (let j = 0; j < density; j++) {
                const xs = (x + (stepDX * i)) + random(-randomNess, randomNess);
                const ys = (y + (stepDY * i)) + random(-randomNess, randomNess);

                if (!this.state.fill) {
                    path.moveTo(xs, ys);
                }
                this.ctx.moveTo(xs, ys);
                this.ctx.arc(xs, ys, pebbleSize, 0, Math.PI * 2);
                path.arc(xs, ys, pebbleSize, 0, Math.PI * 2);
            }
        }
    }


    #rectangle(x, y) {
        this.#moveToInitialPosition();
        this.path.rect(this.initialPosition.x, this.initialPosition.y, x - this.initialPosition.x, y - this.initialPosition.y);
    }

    #roundRectangle(x, y) {
        this.#moveToInitialPosition();
        this.path.roundRect(this.initialPosition.x, this.initialPosition.y, x - this.initialPosition.x, y - this.initialPosition.y, 10);
    }

    #circle(x, y) {
        this.#clear();
        this.createPath()
        const radius = Math.hypot(x - this.initialPosition.x, y - this.initialPosition.y);
        this.path?.arc?.(this.initialPosition.x, this.initialPosition.y, radius, 0, Math.PI * 2);
        if (!this.points.length) this.points.push({ x: this.initialPosition.x, y: this.initialPosition.y });
    }
    #ellipse(x, y) {
        this.#clear();
        this.createPath()
        const radiusX = Math.abs(x - this.initialPosition.x);
        const radiusY = Math.abs(y - this.initialPosition.y);
        // const rotation = Math.atan2(y - this.initialPosition.y, x - this.initialPosition.x);
        this.path?.ellipse?.(this.initialPosition.x, this.initialPosition.y, radiusX, radiusY, 0, 0, Math.PI * 2);
        if (!this.points.length) this.points.push({ x: this.initialPosition.x, y: this.initialPosition.y });
    }

    #line(x, y) {
        this.#drawline();
        this.points.forEach(({ x, y }) => {
            this.ctx.lineTo(x, y);
            this.path?.lineTo?.(x, y);
        })
        this.ctx.lineTo(x, y);
        // this.path.lineTo(x, y);
    }

    #arcTo(x, y) {
        this.#drawline();
        const points = [...this.points, { x, y }];
        const count = points.length - 1;
        for (let i = 1; i < count; i++) {
            const p = points[i - 1];
            const cp = points[i];
            const p2 = points[i + 1];
            const radius = Math.hypot(p.x - cp.x, p.y - cp.y) / 4;
            this.ctx.arcTo(cp.x, cp.y, p2.x, p2.y, radius);
            if (count !== i + 1)
                this.path?.arcTo?.(cp.x, cp.y, p2.x, p2.y, radius);
            else
                this.path?.lineTo(cp.x, cp.y);
        }

        this.ctx.lineTo(x, y);
    }

    #bezier(x, y) {
        this.#drawline();
        const count = this.points.length;
        this.points[count - 1] = { x, y }

        const handle = this.#computeHandle(this.points?.[count - 3], this.points?.[count - 6], { x, y });

        if (handle && !app.unloading) {
            const { prev, next } = handle;
            this.points[count - 4] = prev;
            this.points[count - 2] = next;
        }

        for (let i = 1; i < count - 2; i += 3) {
            const cp1 = this.points[i];
            const cp2 = this.points[i + 1];
            const p = this.points[i + 2];
            this.ctx.bezierCurveTo?.(cp1.x, cp1.y, cp2.x, cp2.y, p.x, p.y);
            this.path?.bezierCurveTo?.(cp1.x, cp1.y, cp2.x, cp2.y, p.x, p.y);
        }

        this.ctx.bezierCurveTo?.(this.points[count - 2]?.x, this.points[count - 2]?.y, this.points[count - 1]?.x, this.points[count - 1]?.y, x, y);
    }


    #quadratic(x, y) {
        this.#drawline();
        const count = this.points.length - 1;
        for (let i = 1; i < count; i += 2) {
            const p = this.points[i + 1];
            const cp = this.points[i];
            this.ctx.quadraticCurveTo?.(cp.x, cp.y, p.x, p.y);
            this.path?.quadraticCurveTo?.(cp.x, cp.y, p.x, p.y);
            this.ctx.circle(p.x, p.y, p.cp ? 'purple' : 'maroon')
        }


        if (this.points[count]?.x) {
            this.ctx.quadraticCurveTo?.(this.points[count].x, this.points[count].y, x, y);
        }
    }


    #eraser(x, y) {
        const layer = this.layer;
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

    static createCanvas(width, height) {
        const offscreenCanvas = new OffscreenCanvas(width, height);
        const ctx = offscreenCanvas.getContext('2d');
        return offscreenCanvas;
    }

    static async createPreviewCanvas(offscreenCanvas) {
        return await offscreenCanvas.convertToBlob();
    }
}

export const canvas = new Canvas();