// if ("serviceWorker" in navigator) {
//     window.addEventListener("load", function () {
//         navigator.serviceWorker.register("service-worker.js").then(function (registration) {
//             console.log("ServiceWorker registration successful with scope: ", registration.scope);
//         }, function (err) {
//             console.log("ServiceWorker registration failed: ", err);
//         });
//     });
// }

import Canvas from "./scripts/core/canvas.js";
import { canvas } from "./scripts/shared/main.js";
import { v4 as uuid } from 'uuid';
const rootElem = document.getElementById('root');
const layersElem = document.getElementById('layers');

addLayer();
addLayer();
addLayer();


// Prevent right-click context menu
window.addEventListener("contextmenu", function (e) {
    e.preventDefault();
}, false);

const settings = {
    fillrule: 'evenodd',
    disablemove: false,
    clip: false,
}

const toolsId = [
    'pen', 'pen2',
    'rectangle', 'round-rectangle',
    'circle', 'ellipse',
    'line', 'arc-to',
    'bezier', 'quadratic',
    'add-layer',
    'clipboard',
    'eraser', 'fillrule',
    'nomove'
]

const toolsMenu = {
    'penTools': [toolsId[0], toolsId[1]],
    'rectangleTools': [toolsId[2], toolsId[3]],
    'circleTools': [toolsId[4], toolsId[5]],
    'lineTools': [toolsId[6], toolsId[7]],
    'curveTools': [toolsId[8], toolsId[9]],
}


const tools = document.getElementById("tools");
const toolsMenuElem = document.getElementById('toolsmenu');
const specialMenuElem = document.getElementById('special');
let selectedElement = tools.querySelector('#penTools');

tools.addEventListener("click", (e) => {
    if (e.target.parentElement.id && toolsId.includes(e.target.id)) {
        selectTool(e.target.parentElement);
        if (e.ctrlKey) showMirrorTools(e.target.parentElement);
    }
});

specialMenuElem.addEventListener('click', e => {
    const pElem = e.target.parentElement;
    const id = pElem.id;
    if (id && settings[id] !== undefined) {
        if (id === 'fillrule') {
            settings[id] = settings[id] === 'nonzero' ? 'evenodd' : 'nonzero';
            console.log(settings[id], settings[id] === 'evenodd')
            if (settings[id] === 'evenodd') pElem.classList.add('selected');
            else pElem.classList.remove('selected');
        } else {
            settings[id] = !settings[id];
            if (settings[id]) pElem.classList.add('selected');
            else pElem.classList.remove('selected');
        }
    }
})



function selectTool(tool) {
    selectedElement.classList.remove('selected');
    tool.classList.add('selected');
    selectedElement = tool;
}

function showMirrorTools(tool) {
    const { top, right } = tool.getBoundingClientRect();
    toolsMenuElem.style.top = top + 'px';
    toolsMenuElem.style.left = (right + 10) + 'px';
    buildToolsElem(tool);
    toolsMenuElem.style.visibility = 'visible';
}

function buildToolsElem(tool) {
    toolsMenuElem.innerText = '';
    toolsMenu[tool.id].forEach(id => {
        const div = document.createElement('div');
        div.dataset.name = id;
        const img = document.createElement('img');
        img.src = `./images/tools/${id}.svg`;
        div.appendChild(img);
        div.addEventListener('click', e => {
            tool.innerText = '';
            const tImg = img.cloneNode();
            tImg.id = id;
            tool.appendChild(tImg);
            toolsMenuElem.style.visibility = 'hidden';
        })
        toolsMenuElem.appendChild(div);
    });
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
    layersElem.appendChild(layer);
    canvas.set(id.unique, new Canvas(id, rootElem, layer));

}

const addLayerElem = document.getElementById('addlayer');

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