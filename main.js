import toolsManager from "./scripts/core/toolbox/manager.js";
import layerManager from "./scripts/core/canvas/layer/manager.js";
import app from "./scripts/core/app.js";
import { v4 as uuid } from "uuid";
import { dbOperations } from "./scripts/core/memory/database.js";
import Canvas from "./scripts/core/canvas/canvas.js";


if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
        navigator.serviceWorker.register("service-worker.js").then(function (registration) {
            console.log("ServiceWorker registration successful with scope: ", registration.scope);
        }, function (err) {
            console.log("ServiceWorker registration failed: ", err);
        });
    });
}


CanvasRenderingContext2D.prototype.circle = function (x, y, color = 'yellow', text = '', radius = 2) {
    this.save()
    const c = new Path2D();
    this.fillStyle = color;
    c.arc(x, y, radius, 0, Math.PI * 2);
    this.fill(c);
    this.fillText(text, x, y - 10);
    this.restore();
}
CanvasRenderingContext2D.prototype.line = function (points, color = 'blue', radius = 4) {
    this.save()
    const c = new Path2D();
    this.strokeStyle = color;
    points.forEach(({ x, y }, i) => {
        if (i) {
            c.lineTo(x, y);
            console.log('line');
        } else {
            c.moveTo(x, y);
            console.log('move')
        }
    });
    this.stroke(c);
    this.restore();
}
CanvasRenderingContext2D.prototype.mark = function (x, y, text, color = 'yellow', radius = 4) {
    this.save()
    this.fillStyle = color;
    this.fillRect(x - radius / 2, y - radius / 2, radius, radius)
    this.fillText(text, x, y);
    this.restore();
}

// Prevent right-click context menu
// window.addEventListener("contextmenu", (e) => {
//     e.preventDefault();
// }, false);



app.init();

