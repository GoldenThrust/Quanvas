import Layer from './layer.js';
import { rootElem } from '../../../shared/domElem.js';
import app from '../../app.js';
import toolsManager from '../../toolbox/manager.js';
import Serializer from './serialization.js';
import { v4 as uuid } from 'uuid';
import Database, { database, dbOperations } from '../../memory/database.js';
import { canvas } from '../canvas.js';

const layersElem = document.getElementById('layers');
const addLayerElem = document.getElementById('addlayer');


class LayerManager {
    constructor() {
        this.layers = new Map();
        this.activeLayerId = null;
        this.project = null;
        this.#addEventListener();
    }

    #addEventListener() {
        const sortPos = [0, 0];
        addLayerElem.addEventListener('click', _ => {
            this.createLayer();
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
            if (sortPos[0])
                this.reOrder(...sortPos);

            sortPos[0] = 0;
        });

        layersElem.addEventListener("dragover", (e) => {
            e.preventDefault();
            const afterElement = this.#getDragAfterElement(e.clientY);
            const draggable = layersElem.querySelector(".dragging");
            if (!draggable) return;
            if (afterElement == null) {
                const dCanvas = this.layers.get(draggable.dataset.id);
                layersElem.appendChild(dCanvas.layer);
                // rootElem.appendChild(dCanvas.canvas);
                sortPos[1] = 0;
            } else {
                const dCanvas = this.layers.get(draggable.dataset.id);
                const aCanvas = this.layers.get(afterElement.dataset.id);
                layersElem.insertBefore(dCanvas.layer, aCanvas.layer);
                // rootElem.insertBefore(dCanvas.canvas, aCanvas.canvas);
                sortPos[0] = Number(dCanvas.layer.dataset.order);
                sortPos[1] = Number(aCanvas.layer.dataset.order);
            }
        });

    }

    async createLayer(id = null, name = null, order = null) {
        const projectId = Database.getCurrentProjectID();
        if (!projectId) return;

        let save = false;
        if (id === null || name === null || order === null) save = true;
        id = id ?? uuid();
        order = order ?? this.layers.size + 1;
        name = name ?? `Layer ${order}`;

        const layerDivElem = document.createElement('div');
        layerDivElem.classList.add('layer');
        layerDivElem.draggable = true;
        layerDivElem.dataset.id = id;
        layerDivElem.dataset.order = order;
        layersElem.prepend(layerDivElem);
        const layer = new Layer(id, name, order, layerDivElem);
        this.layers.set(id, layer);
        layerDivElem.addEventListener('click', e => {
            this.setActiveLayer(e.currentTarget.dataset.id);
        });

        this.setActiveLayer(id);
        
        if(save) {

            console.log('Saving layer to DB', {
                id: id,
                projectId,
                name: layer.name,
                order
            });
            await dbOperations.createLayer({
                id: id,
                projectId,
                name: layer.name,
                order
            })
        }
    }

    async reOrder(fromOrder, toOrder) {
        const elements = Array.from(layersElem.children);

        if (fromOrder > toOrder) {
            for (let i = elements.length - fromOrder; i < elements.length - toOrder; i++) {
                const order = Number(elements[i].dataset.order);
                let pos;

                if (order === fromOrder) pos = toOrder + 1;
                else
                    pos = order + 1;

                elements[i].dataset.order = pos;


                this.layers.get(elements[i].dataset.id).canvas.style.zIndex = pos;
                await dbOperations.updateLayer(elements[i].dataset.id, {
                    order: pos
                });
            }
        } else {
            for (let i = elements.length - toOrder; i < elements.length - fromOrder + 1; i++) {
                const order = Number(elements[i].dataset.order);
                let pos;

                if (order === fromOrder) pos = toOrder;
                else pos = order - 1;

                elements[i].dataset.order = pos;

                this.layers.get(elements[i].dataset.id).canvas.style.zIndex = pos;
                await dbOperations.updateLayer(elements[i].dataset.id, {
                    order: pos
                });
            }
        }
    }

    getLayer(id) {
        return this.layers.get(id);
    }

    getActiveLayer() {
        return this.getLayer(this.activeLayerId);
    }

    saveDrawing(path, points) {
        console.clear();
        const layer = this.getActiveLayer();

        if (layer == null) {
            console.warn('No active layer to save drawing');
            return;
        }

        const data = Serializer.serialize({
            points,
            state: app.state,
            tool: toolsManager.activeToolId,
            layer: layer.id
        })

        layer.drawPath(path, app.state.fill);

        layer.addData(path, data);

        console.table(points)
        console.log('Total points:', points.length);
    }

    setActiveLayer(id) {
        const layer = this.layers.get(this.activeLayerId);
        layer?.layer?.classList?.remove('selectedLayer');

        const newLayer = this.layers.get(id)
        newLayer?.layer?.classList?.add('selectedLayer');

        this.activeLayerId = id;
    }

    renameLayer(id, name) {
        const layer = this.layers.get(id);
        layer.setName(id, name);
    }

    removeLayer(id) {

    }

    moveLayer(id, toindex) {

    }

    mergeLayer(topLayerId, bottomLayerId) {

    }

    addPathToLayer(id, path) {

    }

    clearLayer(id) {

    }

    getState() {

    }

    loadState(state) {

    }

    clearAll() {
        rootElem.innerHTML = '';
        layersElem.innerHTML = '';
        rootElem.append(canvas.canvas);
        this.layers.clear();
        this.activeLayerId = null;
        localStorage.removeItem('current-project')
    }

    #getDragAfterElement(y) {
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
}

const layerManager = new LayerManager();
export default layerManager;