import Layer from './layer.js';
import { rootElem } from '../../../shared/domElem.js';
import app from '../../app.js';
import toolsManager from '../../toolbox/manager.js';
import Serializer from './serialization.js';
import { v4 as uuid } from 'uuid';

const layersElem = document.getElementById('layers');
const addLayerElem = document.getElementById('addlayer');


class LayerManager {
    constructor() {
        this.layer = new Map();
        this.activeLayerId = null;
        this.#addEventListener();
    }

    #addEventListener() {
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
        });

        layersElem.addEventListener("dragover", (e) => {
            e.preventDefault();
            const afterElement = this.#getDragAfterElement(e.clientY);
            const draggable = layersElem.querySelector(".dragging");
            if (!draggable) return;
            if (afterElement == null) {
                const dCanvas = this.layer.get(draggable.dataset.id);
                layersElem.appendChild(dCanvas.layer);
                rootElem.appendChild(dCanvas.canvas);
            } else {
                const dCanvas = this.layer.get(draggable.dataset.id);
                const aCanvas = this.layer.get(afterElement.dataset.id);
                layersElem.insertBefore(dCanvas.layer, aCanvas.layer);
                rootElem.insertBefore(dCanvas.canvas, aCanvas.canvas);
            }
        });

    }

    createLayer() {
        const id = {
            unique: uuid(),
            name: this.layer.size + 1
        }
        const layer = document.createElement('div');
        layer.classList.add('layer');
        layer.draggable = true;
        layer.dataset.id = id.unique;
        layersElem.prepend(layer);
        this.layer.set(id.unique, new Layer(id, layer));

        layer.addEventListener('click', e => {
            this.setActiveLayer(e.currentTarget.dataset.id);
        });

        this.setActiveLayer(id.unique);
    }

    getLayer(id) {
        return this.layer.get(id);
    }

    getActiveLayer() {
        return this.getLayer(this.activeLayerId);
    }

    saveDrawing(path, points) {
        console.clear();
        const layer = this.getActiveLayer();

        const data = Serializer.serialize({
            points,
            state: app.state,
            tool: toolsManager.activeToolId,
            layer: layer.id
        })

        layer.drawPath(path, app.state.fill);

        layer.addData(data);

        console.table(points)
        console.log('Total points:', points.length);
    }

    setActiveLayer(id) {
        const layer = this.layer.get(this.activeLayerId);
        layer?.layer?.classList?.remove('selectedLayer');

        const newLayer = this.layer.get(id)
        newLayer?.layer?.classList?.add('selectedLayer');

        this.activeLayerId = id;
    }

    renameLayer(id, name) {

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
        this.layers = [];
        this.activeLayerId = null;
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