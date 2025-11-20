import { activeMetaData, rootElem } from "../../shared/main.js";
import settings from "../../shared/settings.js";
import { lerp, random } from "../../utils/random.js";
import { canvas } from "../../shared/main.js";
import { calculateNormal, calculateTangent, getNormal } from "../../utils/vector.js";

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
        this.pointsCount = 0;

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
        // this.canvas.addEventListener('mouseleave', () => this.#flushDrawing());
    }

    #reset() {
        this.#clear();
        this.isDrawing = false;
        this.currentPathProp = { path: null, settings: null, metadata: false, points: [] };
        this.memorizePath = [];
        this.pointsCount = 0;
    }

    #flushDrawing(flush) {
        if (!this.currentPathProp || !this.currentPathProp.metadata) return;
        this.draw(this.previousPosition.x, this.previousPosition.y, activeMetaData, settings);
        this.pointsCount++;

        if (['K', 'L'].includes(activeMetaData.selectedTool[0]) && this.flush) {
            this.memorizePath.push({ x: this.previousPosition.x, y: this.previousPosition.y });
            this.#createCurve();
            this.flush = false;
        }

        if (flush !== undefined) this.flush = flush;

        if (this.flush) {
            const layer = canvas.get(activeMetaData.selectedLayer);

            if (layer && typeof layer.drawPath === 'function') {
                const fillFlag = !!this.currentPathProp.settings?.fill;
                layer.drawPath(this.currentPathProp.path, fillFlag, this.currentPathProp.metadata.selectedTool);
            }

            this.currentPathProp.points = Array.from(this.memorizePath);
            this.path.add(this.currentPathProp);
            this.#reset()
            console.log('Path added. Total paths:', this.path.size);
        }

        this.flush = true;
    }

    releasePath() {
        if ((['L',].includes(activeMetaData.selectedTool[0]) && this.memorizePath.length < 2) || (['P', 'K'].includes(activeMetaData.selectedTool[0]) && this.memorizePath.length < 3)) return this.#reset();
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

    #moveToPreviousPosition() {
        if (this.currentPathProp.settings.fill) {
            this.ctx.lineTo(this.previousPosition.x, this.previousPosition.y);
            this.currentPathProp.path?.lineTo?.(this.previousPosition.x, this.previousPosition.y);
        } else {
            this.ctx.moveTo(this.previousPosition.x, this.previousPosition.y);
            this.currentPathProp.path?.moveTo?.(this.previousPosition.x, this.previousPosition.y);
        }
    }

    #createCurve() {
        const mLen = this.memorizePath.length;
        if (activeMetaData.selectedTool === 'K-quadratic') {
            this.memorizePath[mLen - 1]['type'] = this.pointsCount % 2 === 1 ? 'quad' : 'point';
        } else if (activeMetaData.selectedTool === 'K-bezier') {
            this.memorizePath.push({ x: this.previousPosition.x, y: this.previousPosition.y, type: 'corner' });
            this.memorizePath.push({ x: this.previousPosition.x, y: this.previousPosition.y, type: 'corner' });
            // const handle = this.#computeHandle(this.memorizePath?.[mLen - 6], this.memorizePath?.[mLen - 9], this.memorizePath?.[mLen - 3]);
            // if (this.pointsCount === 3 && handle) {
            //     const { prev, next } = handle;
            //     this.memorizePath[mLen - 7] = prev;
            //     this.memorizePath[mLen - 5] = next;
            // }
        }

        console.log(this.memorizePath.length);
    }

    #computeHandle(p, pPrev, pNext) {
        console.log(p, pPrev, pNext);
        if (!(p && pPrev && pNext)) return;

        const { ux, uy } = calculateTangent(pPrev, pNext);
        const k = 0.25;

        const lenPrev = Math.hypot(p.x - pPrev.x, p.y - pPrev.y);
        const lenNext = Math.hypot(p.x - pNext.x, p.y - pNext.y);

        const len = k * Math.min(lenPrev, lenNext);

        return { prev: { x: p.x - ux * len, y: p.y - uy * len, type: 'corner' }, next: { x: p.x + ux * len, y: p.y + uy * len, type: 'corner' } };
    }

    #drawline() {
        this.#clear();
        this.createPath()
        if (this.memorizePath.length) {
            this.ctx.moveTo(this.memorizePath[0].x, this.memorizePath[0].y);
            this.currentPathProp.path.moveTo(this.memorizePath[0].x, this.memorizePath[0].y);
        } else {
            this.memorizePath.push({ x: this.initialPosition.x, y: this.initialPosition.y })
            this.#createCurve();
            this.#moveToInitialPosition();
        }
    }

    draw(x, y, activeMetaData, settings) {
        // console.clear();
        this.currentPathProp.metadata = activeMetaData;
        this.currentPathProp.settings = settings;

        const drawGPath = ['P', 'L', 'K'].includes(activeMetaData.selectedTool[0]);
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

            // this.ctx.fillStyle = 'red';
            // this.ctx.strokeStyle = 'yellow';


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
        const tangent = calculateTangent({ x, y }, this.previousPosition);
        const normal = calculateNormal(tangent);
        const stepDX = tangent.ux;
        const stepDY = tangent.uy;
        const randomNess = 1;
        const density = 1;
        const pebbleSize = 0.1;

        for (let i = 0; i < Math.floor(tangent.L); i++) {
            for (let j = 0; j < density; j++) {
                const xs = (x + (stepDX * i)) + random(-randomNess, randomNess);
                const ys = (y + (stepDY * i)) + random(-randomNess, randomNess);

                if (!this.currentPathProp.settings.fill) {
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
        console.clear();
        this.#drawline();
        const count = this.memorizePath.length;
        this.memorizePath[count - 1] = { x, y, type: 'corner' }

        const handle = this.#computeHandle(this.memorizePath?.[count - 3], this.memorizePath?.[count - 6], { x, y });

        if (handle) {
            const { prev, next } = handle;
            console.log('handle')
            this.memorizePath[count - 4] = prev;
            this.memorizePath[count - 2] = next;
        }

        const path = this.memorizePath;

        for (let i = 1; i < count - 2; i += 3) {
            const cp1 = path[i];
            const cp2 = path[i + 1];
            const p = path[i + 2];
            this.ctx.bezierCurveTo?.(cp1.x, cp1.y, cp2.x, cp2.y, p.x, p.y);
            this.currentPathProp.path?.bezierCurveTo?.(cp1.x, cp1.y, cp2.x, cp2.y, p.x, p.y);
            // this.ctx.circle(cp1.x, cp1.y - 10, 'red', `${i} C1 ${Math.round(cp1.x)} ${Math.round(cp1.y)}`);
            // this.ctx.circle(cp2.x, cp2.y - 20, 'green', `${i} C2 ${Math.round(cp2.x)} ${Math.round(cp2.y)}`);
            // this.ctx.circle(p.x, p.y, 'blue', `${i} P ${Math.round(p.x)} ${Math.round(p.y)}`);
        }

        this.ctx.bezierCurveTo?.(path[count - 2].x, path[count - 2].y, path[count - 1].x, path[count - 1].y, x, y);

        // this.ctx.circle(path[0].x, path[0].y, 'black', `P ${Math.round(path[0].x)} ${Math.round(path[0].y)}`);
        // this.ctx.circle(path[count - 2].x, path[count - 2].y - 10, 'cyan', `C1 ${Math.round(path[count - 2].x)} ${Math.round(path[count - 2].y)}`);
        // this.ctx.circle(path[count - 1].x, path[count - 1].y - 20, 'magenta', `C2 ${Math.round(path[count - 1].x)} ${Math.round(path[count - 1].y)}`);
        // this.ctx.circle(x, y, 'yellow', `P ${Math.round(x)} ${Math.round(y)}`);
    }

    #quadratic(x, y) {
        this.#drawline();
        const path = this.memorizePath;
        const count = path.length - 1;
        for (let i = 1; i < count; i += 2) {
            const p = path[i + 1];
            const cp = path[i];
            this.ctx.quadraticCurveTo?.(cp.x, cp.y, p.x, p.y);
            this.currentPathProp.path?.quadraticCurveTo?.(cp.x, cp.y, p.x, p.y);
            this.ctx.circle(p.x, p.y, p.cp ? 'purple' : 'maroon')
        }

        this.ctx.quadraticCurveTo?.(path[count].x, path[count].y, x, y);
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