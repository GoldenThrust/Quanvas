import layerManager from '../canvas/layer/manager.js';
import { dbOperations } from './database.js';
import Serializer from '../canvas/layer/serialization.js';
import { canvas } from '../canvas/canvas.js';
import app from '../app.js';
import { layersElem } from '../../shared/domElem.js';

class HistoryManager {
    constructor() {
        this.history = [];
        this.redoStack = [];
    }

    updateHistory(data) {
        if (app.unloading) return;
        this.history.push(data);
        this.redoStack = [];
        if (this.history.length > 100) this.history.shift();
    }

    async undo() {
        if (this.history.length === 0) return null;
        const lastState = this.history.pop();
        this.redoStack.push(lastState);
        try {
            await this.#replayUndo(lastState);
        } catch (e) {
            console.error('Undo failed', e);
        }
        return lastState;
    }

    async redo() {
        if (this.redoStack.length === 0) return null;
        const lastState = this.redoStack.pop();
        this.history.push(lastState);
        try {
            await this.#replayRedo(lastState);
        } catch (e) {
            console.error('Redo failed', e);
        }
        return lastState;
    }

    clearHistory() {
        this.history = [];
        this.redoStack = [];
    }

    async #replayUndo(entry) {
        if (!entry || !entry.type) return;

        switch (entry.type) {
            case 'create-layer': {
                const id = entry.layerId;
                const layer = layerManager.getLayer(id);
                if (layer) {
                    layer.layer.remove();
                    layer.canvas.remove();
                    layerManager.layers.delete(id);
                    layerManager.setActiveLayer(entry.activeLayerId, true)
                }
                try { await dbOperations.deleteLayer(id); } catch (e) { }
                break;
            }

            case 'remove-layer': {
                const { layerId, name, order, data } = entry;
                await layerManager.createLayer({ id: layerId, name, order, skipHistory: true });
                const elements = Array.from(layersElem.children);

                const element = elements.find(el => Math.min(Number(el.dataset.order) + 1, layerManager.layers.size) === Number(order));

                layersElem.insertBefore(layerManager.getLayer(layerId).layer, element);
                await layerManager.reOrder(layerManager.layers.size, order);

                if (data && data.size) {
                    for (const [_, p] of data) {
                        try { await dbOperations.createPath(p); } catch (e) { }
                        const unser = Serializer.unserialize(p);
                        canvas.flushToPath(unser);
                    }
                }
                break;
            }

            case 'save-drawing': {
                const { id: pathId, layerId } = entry.data;

                try {
                    if (pathId) await dbOperations.deletePath(pathId);
                } catch (e) { }

                const layer = layerManager.getLayer(layerId);
                if (layer) {
                    layer.clear();
                    layer.clearData();
                    const paths = await dbOperations.getPathsByLayer(layerId);
                    for (const p of paths) {
                        const unser = Serializer.unserialize(p);
                        canvas.flushToPath(unser);
                    }
                }
                break;
            }

            case 'set-active-layer': {
                const prev = entry.prevLayerId ?? null;
                console.log('Undo set-active-layer to', prev);

                if (prev) layerManager.setActiveLayer(prev, true);
                break;
            }

            case 'rename-layer': {
                const { layerId, newName, oldName } = entry;
                console.log('Undo rename-layer to', oldName, 'for', layerId, 'from', newName);
                const layer = layerManager.getLayer(layerId);
                if (layer) layer.setName(layerId, oldName);
                break;
            }

            case 'change-layer-pos': {
                let { fromPos, toPos } = entry;
                fromPos = fromPos < toPos ? fromPos - 1 : fromPos;
                toPos = fromPos < toPos ? toPos : toPos + 1;
        
                const fromElem = layerManager.getLayerByOrder(fromPos);
                const toElem = layerManager.getLayerByOrder(toPos);

                layerManager.changePosition(toElem, fromElem, false);
                await layerManager.reOrder(toPos, fromPos);
                layerManager.dragInfo['fromPos'] = 0;
                break;
            }

            default:
                console.warn('Unknown history undo type', entry.type);
        }
    }

    async #replayRedo(entry) {
        if (!entry || !entry.type) return;

        switch (entry.type) {
            case 'create-layer': {
                const { layerId, name, order } = entry;
                await layerManager.createLayer({ id: layerId, name, order, skipHistory: true });
                break;
            }

            case 'remove-layer': {
                const id = entry.layerId;
                await layerManager.removeLayer(id, true);
                break;
            }

            case 'save-drawing': {
                const data = entry.data;
                if (data) {
                    try {
                        await dbOperations.createPath(data);
                        const unser = Serializer.unserialize(data);
                        canvas.flushToPath(unser);
                    } catch (e) {
                        console.error(e);
                    }
                }
                break;
            }

            case 'set-active-layer': {
                const id = entry.layerId;
                if (id) layerManager.setActiveLayer(id, true);
                break;
            }

            case 'rename-layer': {
                const { layerId, newName, oldName } = entry;
                const layer = layerManager.getLayer(layerId);
                console.log('Redo rename-layer to', newName, 'for', layerId, 'from', oldName);
                if (layer) layer.setName(layerId, newName);
                break;
            }

            case 'change-layer-pos': {
                const { dragElem, afterElem } = entry;
                layerManager.changePosition(dragElem, afterElem);
                const { fromPos, toPos } = layerManager.dragInfo;
                await layerManager.reOrder(fromPos, toPos);
                break;
            }

            default:
                console.warn('Unknown history redo type', entry.type);
        }
    }
}

const history = new HistoryManager();
export default history;