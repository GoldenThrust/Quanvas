import Canvas from "../core/canvas/canvas.js";
// import Database from "../core/db.js";

export const rootElem = document.getElementById('root');
export const maincanvas = new Canvas(document.getElementById('canvas'));
export const canvas = new Map();
export const activeMetaData = {
    selectedTool: 'P-pen',
    selectedLayer: null
}
