// if ("serviceWorker" in navigator) {
//     window.addEventListener("load", function () {
//         navigator.serviceWorker.register("service-worker.js").then(function (registration) {
//             console.log("ServiceWorker registration successful with scope: ", registration.scope);
//         }, function (err) {
//             console.log("ServiceWorker registration failed: ", err);
//         });
//     });
// }

import { canvas, maincanvas, activeMetaData, rootElem } from "./scripts/shared/main.js";
import { v4 as uuid } from 'uuid';
import settings from "./scripts/shared/settings.js";
import Layer from "./scripts/core/canvas/layer.js";
import { TOOL_IDS, TOOLS_MENU } from "./scripts/shared/constants.js";
const layersElem = document.getElementById('layers');

CanvasRenderingContext2D.prototype.circle = function (x, y, color = 'yellow', radius = 4) {
    this.save()
    const c = new Path2D();
    this.fillStyle = color;
    c.arc(x, y, radius, 0, Math.PI * 2);
    this.fill(c);
    this.restore();
}
CanvasRenderingContext2D.prototype.mark = function (x, y, text, color = 'yellow', radius = 4) {
    this.save()
    // this.beginPath();
    // this.fillStyle = 'red';
    // this.arc(x, y, radius, 0, Math.PI * 2);
    // this.fill();
    this.fillStyle = color;
    this.fillRect(x - radius / 2, y - radius / 2, radius, radius)
    this.fillText(text, x, y);
    this.restore();
}

// Prevent right-click context menu
// window.addEventListener("contextmenu", function (e) {
//     e.preventDefault();
// }, false);


const toolsElem = document.getElementById("tools");
const toolsMenuElem = document.getElementById('toolsmenu');
const specialMenuElem = document.getElementById('special');

let selectedElement = toolsElem.querySelector(`#${activeMetaData.selectedTool}`);

const addLayerElem = document.getElementById('addlayer');

selectPen('K-quadratic');
addLayer();

function selectPen(pen) {
    maincanvas.releasePath();
    let elem;
    if (pen instanceof HTMLElement) {
        elem = pen;
    } else {
        const toolsMenu = TOOLS_MENU[pen[0]];

        for (let i = 0; i < toolsMenu.length; i++) {
            if (toolsMenu[i] == pen) {
                elem = document.getElementById(pen);
            };
        }
    }

    selectedElement.classList.remove('selected');
    let selectedElem = toolsElem.querySelector(`#${elem.id}`);
    if (!selectedElem) {
        selectedElem = toolsElem.querySelector(`[id^=${elem.id[0]}]`);
        const tempSrc = elem.src;
        const tempId = elem.id;
        elem.src = selectedElem.src;
        elem.id = selectedElem.id;
        selectedElem.src = tempSrc;
        selectedElem.id = tempId;
        selectedElem.classList.add('selected');
        selectedElement = selectedElem;
    } else {
        selectedElement = elem;
    }
    selectedElement.classList.add('selected');

    activeMetaData.selectedTool = selectedElement.id;
}

toolsMenuElem.addEventListener('click', (e) => {
    toolsMenuElem.style.visibility = 'hidden';
    if (!TOOLS_MENU[e.target.id[0]]?.includes(e.target.id)) return;
    selectPen(e.target);
})

toolsElem.addEventListener("click", (e) => {
    toolsMenuElem.style.visibility = 'hidden';
    const tool = e.target;
    if (!TOOLS_MENU[tool.id[0]]?.includes(tool.id)) return;
    const prevM = toolsMenuElem.querySelector(`#${selectedElement.id[0]}`);
    const newM = toolsMenuElem.querySelector(`#${tool.id[0]}`);
    prevM.style.display = 'none';
    newM.style.display = 'flex';
    if (e.ctrlKey && TOOLS_MENU[tool.id[0]].length > 1) {
        const { top, right } = tool.getBoundingClientRect();
        toolsMenuElem.style.top = top + 'px';
        toolsMenuElem.style.left = (right + 10) + 'px';
        toolsMenuElem.style.visibility = 'visible';
    }
    selectPen(tool);
});


function getDragAfterElement(y) {
    const elements = Array.from(layersElem.querySelectorAll('.layer:not(.dragging)'));
    return elements.reduce(
        (closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        },
        { offset: Number.NEGATIVE_INFINITY }
    ).element;
}

function selectLayer(layer) {
    const selectedLayer = activeMetaData.selectedLayer;
    if (layer) {
        if (selectedLayer) {
            const canva = canvas.get(selectedLayer);
            canva.layer.classList.remove('selectedLayer');
        }
        layer.classList.add('selectedLayer');
        activeMetaData.selectedLayer = layer.dataset.id;
    }
}

function addLayer() {
    const id = {
        unique: uuid(),
        name: canvas.size + 1
    }
    const layer = document.createElement('div');
    layer.classList.add('layer');
    layer.draggable = true;
    layer.dataset.id = id.unique;
    layersElem.prepend(layer);
    canvas.set(id.unique, new Layer(id, layer));


    layer.addEventListener('click', e => {
        selectLayer(e.currentTarget);
    });
    selectLayer(layer);
}


specialMenuElem.addEventListener('click', e => {
    const elem = e.target;
    const id = elem.id;
    toggleSpecialMenu(id);
})

function toggleSpecialMenu(menu) {
    let elem;
    if (menu instanceof HTMLElement) {
        elem = pen;
    } else {
        elem = specialMenuElem.querySelector(`#${menu}`);
    }

    const id = elem?.id;

    if (!TOOL_IDS.includes(id) && settings[id] === undefined) return;
    if (id === 'fillrule') {
        settings[id] = settings[id] === 'nonzero' ? 'evenodd' : 'nonzero';
        if (settings[id] === 'evenodd') elem.classList.add('selected');
        else elem.classList.remove('selected');
    } else if (id === 'fill') {
        elem.src = settings[id] === true ? './images/tools/fill.svg' : './images/tools/stroke.svg';
        settings[id] = !settings[id];
    } else {
        settings[id] = !settings[id];
        if (settings[id]) elem.classList.add('selected');
        else elem.classList.remove('selected');
    }
}

addLayerElem.addEventListener('click', _ => {
    addLayer();
})

layersElem.addEventListener('dragstart', (e) => {
    const layer = e.target.closest('.layer');
    if (!layer) return;
    layer.classList.add('dragging');
});

layersElem.addEventListener('dragend', (e) => {
    const layer = e.target.closest('.layer');
    if (!layer) return;
    layer.classList.remove('dragging');
});

layersElem.addEventListener("dragover", (e) => {
    e.preventDefault();
    const afterElement = getDragAfterElement(e.clientY);
    const draggable = layersElem.querySelector(".dragging");
    if (!draggable) return;
    if (afterElement == null) {
        const dCanvas = canvas.get(draggable.dataset.id);
        layersElem.appendChild(dCanvas.layer);
        rootElem.appendChild(dCanvas.canvas);
    } else {
        const dCanvas = canvas.get(draggable.dataset.id);
        const aCanvas = canvas.get(afterElement.dataset.id);
        layersElem.insertBefore(dCanvas.layer, aCanvas.layer);
        rootElem.insertBefore(dCanvas.canvas, aCanvas.canvas);
    }

    // if (afterElement == null) {

    //     layersElem.appendChild(draggable);

    // } else {
    //     layersElem.insertBefore(draggable, afterElement);

    // }
});


// Keybinding
addEventListener('keydown', (e) => {
    e.preventDefault();
    let keyBind = '';

    if (e.ctrlKey) keyBind += 'ctrl+';
    if (e.shiftKey) keyBind += 'shift+';
    if (e.altKey) keyBind += 'alt+'
    keyBind += e.key;
    console.log(keyBind)

    switch (keyBind.toLowerCase()) {
        case 'p':
            selectPen('P-pen')
            break;
        case 'shift+p':
            selectPen('P-brush')
            break;

        case 'r':
            selectPen('R-rectangle')
            break;
        case 'shift+r':
            selectPen('R-roundrectangle')
            break;

        case 'c':
            selectPen('C-circle')
            break;
        case 'shift+c':
            selectPen('C-ellipse')
            break;

        case 'l':
            selectPen('L-line')
            break;
        case 'shift+l':
            selectPen('L-arcto')
            break;

        case 'k':
            selectPen('K-quadratic')
            break;
        case 'shift+k':
            selectPen('K-bezier')
            break;
        case 'e':
            toggleSpecialMenu('erase')
            break;
        case 'f':
            toggleSpecialMenu('fill')
            break;

        case 'escape':
            maincanvas.releasePath()
            break;

        default:
            break;
    }
})