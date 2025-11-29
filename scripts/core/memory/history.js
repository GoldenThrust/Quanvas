import layerManager from '../canvas/layer/manager.js';
import { dbOperations } from './database.js';
import Serializer from '../canvas/layer/serialization.js';
import { canvas } from '../canvas/canvas.js';
import app from '../app.js';

class HistoryManager {
    constructor() {
        this.history = [];
        this.redoStack = [];
    }

    updateHistory(data) {
        if (app.unloading) return;
        this.history.push(data);
        this.redoStack = [];
        console.log('History updated', data);
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
                const { layerId, name, order, paths } = entry;
                await layerManager.createLayer({ id: layerId, name, order});
                try {
                    await dbOperations.createLayer({ id: layerId, projectId: localStorage.getItem('current-project'), name, order });
                } catch (e) { }

                if (paths && paths.length) {
                    for (const p of paths) {
                        try { await dbOperations.createPath(p); } catch (e) { }
                        const unser = Serializer.unserialize(p);
                        canvas.flushToPath(unser);
                    }
                }
                break;
            }

            case 'save-drawing': {
                const { layerId, pathId } = entry;
                try {
                    if (pathId) await dbOperations.deletePath(pathId);
                } catch (e) { }

                const layer = layerManager.getLayer(layerId);
                if (layer) {
                    layer.clear();
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
                if (prev) layerManager.setActiveLayer(prev);
                break;
            }

            case 'rename-layer': {
                const { layerId, oldName } = entry;
                const layer = layerManager.getLayer(layerId);
                if (layer) layer.setName(layerId, oldName);
                break;
            }

            case 'change-layer-pos':
            case 'chanege-layer-pos': {
                const { fromOrder, toOrder } = entry;
                if (typeof fromOrder === 'number' && typeof toOrder === 'number') {
                    await layerManager.reOrder(toOrder, fromOrder);
                }
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
                await layerManager.createLayer({id: layerId, name, order, skipHistory: true });
                break;
            }

            case 'remove-layer': {
                const id = entry.layerId;
                const layer = layerManager.getLayer(id);
                if (layer) {
                    layer.layer.remove();
                    layer.canvas.remove();
                    layerManager.layers.delete(id);
                }
                try { await dbOperations.deleteLayer(id); } catch (e) { }
                break;
            }

            case 'save-drawing': {
                const { savedData, layerId } = entry;
                if (savedData) {
                    try {
                        const res = await dbOperations.createPath(savedData);
                        const unser = Serializer.unserialize(savedData);
                        canvas.flushToPath(unser);
                    } catch (e) { }
                }
                break;
            }

            case 'set-active-layer': {
                const id = entry.layerId;
                if (id) layerManager.setActiveLayer(id);
                break;
            }

            case 'rename-layer': {
                const { layerId, newName } = entry;
                const layer = layerManager.getLayer(layerId);
                if (layer) layer.setName(layerId, newName);
                break;
            }

            case 'change-layer-pos':
            case 'chanege-layer-pos': {
                const { fromOrder, toOrder } = entry;
                if (typeof fromOrder === 'number' && typeof toOrder === 'number') {
                    await layerManager.reOrder(fromOrder, toOrder);
                }
                break;
            }

            default:
                console.warn('Unknown history redo type', entry.type);
        }
    }
}

const history = new HistoryManager();
export default history;