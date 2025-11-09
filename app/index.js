/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./main.js":
/*!*****************!*\
  !*** ./main.js ***!
  \*****************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _scripts_core_canvas_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./scripts/core/canvas.js */ \"./scripts/core/canvas.js\");\n/* harmony import */ var _scripts_shared_main_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./scripts/shared/main.js */ \"./scripts/shared/main.js\");\n/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! uuid */ \"./node_modules/uuid/dist/v4.js\");\n// if (\"serviceWorker\" in navigator) {\r\n//     window.addEventListener(\"load\", function () {\r\n//         navigator.serviceWorker.register(\"service-worker.js\").then(function (registration) {\r\n//             console.log(\"ServiceWorker registration successful with scope: \", registration.scope);\r\n//         }, function (err) {\r\n//             console.log(\"ServiceWorker registration failed: \", err);\r\n//         });\r\n//     });\r\n// }\r\n\r\n\r\n\r\n\r\nconst rootElem = document.getElementById('root');\r\nconst layersElem = document.getElementById('layers');\r\n\r\naddLayer();\r\naddLayer();\r\naddLayer();\r\n\r\n\r\n// Prevent right-click context menu\r\nwindow.addEventListener(\"contextmenu\", function (e) {\r\n    e.preventDefault();\r\n}, false);\r\n\r\nconst settings = {\r\n    fillrule: 'evenodd',\r\n    disablemove: false,\r\n    clip: false,\r\n}\r\n\r\nconst toolsId = [\r\n    'pen', 'pen2',\r\n    'rectangle', 'round-rectangle',\r\n    'circle', 'ellipse',\r\n    'line', 'arc-to',\r\n    'bezier', 'quadratic',\r\n    'add-layer',\r\n    'clipboard',\r\n    'eraser', 'fillrule',\r\n    'nomove'\r\n]\r\n\r\nconst toolsMenu = {\r\n    'penTools': [toolsId[0], toolsId[1]],\r\n    'rectangleTools': [toolsId[2], toolsId[3]],\r\n    'circleTools': [toolsId[4], toolsId[5]],\r\n    'lineTools': [toolsId[6], toolsId[7]],\r\n    'curveTools': [toolsId[8], toolsId[9]],\r\n}\r\n\r\n\r\nconst tools = document.getElementById(\"tools\");\r\nconst toolsMenuElem = document.getElementById('toolsmenu');\r\nconst specialMenuElem = document.getElementById('special');\r\nlet selectedElement = tools.querySelector('#penTools');\r\n\r\ntools.addEventListener(\"click\", (e) => {\r\n    if (e.target.parentElement.id && toolsId.includes(e.target.id)) {\r\n        selectTool(e.target.parentElement);\r\n        if (e.ctrlKey) showMirrorTools(e.target.parentElement);\r\n    }\r\n});\r\n\r\nspecialMenuElem.addEventListener('click', e => {\r\n    const pElem = e.target.parentElement;\r\n    const id = pElem.id;\r\n    if (id && settings[id] !== undefined) {\r\n        if (id === 'fillrule') {\r\n            settings[id] = settings[id] === 'nonzero' ? 'evenodd' : 'nonzero';\r\n            console.log(settings[id], settings[id] === 'evenodd')\r\n            if (settings[id] === 'evenodd') pElem.classList.add('selected');\r\n            else pElem.classList.remove('selected');\r\n        } else {\r\n            settings[id] = !settings[id];\r\n            if (settings[id]) pElem.classList.add('selected');\r\n            else pElem.classList.remove('selected');\r\n        }\r\n    }\r\n})\r\n\r\n\r\n\r\nfunction selectTool(tool) {\r\n    selectedElement.classList.remove('selected');\r\n    tool.classList.add('selected');\r\n    selectedElement = tool;\r\n}\r\n\r\nfunction showMirrorTools(tool) {\r\n    const { top, right } = tool.getBoundingClientRect();\r\n    toolsMenuElem.style.top = top + 'px';\r\n    toolsMenuElem.style.left = (right + 10) + 'px';\r\n    buildToolsElem(tool);\r\n    toolsMenuElem.style.visibility = 'visible';\r\n}\r\n\r\nfunction buildToolsElem(tool) {\r\n    toolsMenuElem.innerText = '';\r\n    toolsMenu[tool.id].forEach(id => {\r\n        const div = document.createElement('div');\r\n        div.dataset.name = id;\r\n        const img = document.createElement('img');\r\n        img.src = `./images/tools/${id}.svg`;\r\n        div.appendChild(img);\r\n        div.addEventListener('click', e => {\r\n            tool.innerText = '';\r\n            const tImg = img.cloneNode();\r\n            tImg.id = id;\r\n            tool.appendChild(tImg);\r\n            toolsMenuElem.style.visibility = 'hidden';\r\n        })\r\n        toolsMenuElem.appendChild(div);\r\n    });\r\n}\r\n\r\nfunction addLayer() {\r\n    const id = {\r\n        unique: (0,uuid__WEBPACK_IMPORTED_MODULE_2__[\"default\"])(),\r\n        name: _scripts_shared_main_js__WEBPACK_IMPORTED_MODULE_1__.canvas.size + 1\r\n    }\r\n    const layer = document.createElement('div');\r\n    layer.classList.add('layer');\r\n    layer.draggable = true;\r\n    layer.dataset.id = id.unique;\r\n    layersElem.appendChild(layer);\r\n    _scripts_shared_main_js__WEBPACK_IMPORTED_MODULE_1__.canvas.set(id.unique, new _scripts_core_canvas_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"](id, rootElem, layer));\r\n\r\n}\r\n\r\nconst addLayerElem = document.getElementById('addlayer');\r\n\r\naddLayerElem.addEventListener('click', _ => {\r\n    addLayer();\r\n})\r\n\r\n\r\nlayersElem.addEventListener('dragstart', (e) => {\r\n    const layer = e.target.closest('.layer');\r\n    if (!layer) return;\r\n    layer.classList.add('dragging');\r\n});\r\n\r\nlayersElem.addEventListener('dragend', (e) => {\r\n    const layer = e.target.closest('.layer');\r\n    if (!layer) return;\r\n    layer.classList.remove('dragging');\r\n});\r\n\r\n\r\nfunction getDragAfterElement(y) {\r\n    const elements = Array.from(layersElem.querySelectorAll('.layer:not(.dragging)'));\r\n    return elements.reduce(\r\n        (closest, child) => {\r\n            const box = child.getBoundingClientRect();\r\n            const offset = y - box.top - box.height / 2;\r\n            if (offset < 0 && offset > closest.offset) {\r\n                return { offset: offset, element: child };\r\n            } else {\r\n                return closest;\r\n            }\r\n        },\r\n        { offset: Number.NEGATIVE_INFINITY }\r\n    ).element;\r\n}\r\n\r\n\r\nlayersElem.addEventListener(\"dragover\", (e) => {\r\n    e.preventDefault();\r\n    const afterElement = getDragAfterElement(e.clientY);\r\n    const draggable = layersElem.querySelector(\".dragging\");\r\n    if (!draggable) return;\r\n    if (afterElement == null) {\r\n        const dCanvas = _scripts_shared_main_js__WEBPACK_IMPORTED_MODULE_1__.canvas.get(draggable.dataset.id);\r\n        layersElem.appendChild(dCanvas.layer);\r\n        rootElem.appendChild(dCanvas.canvas);\r\n    } else {\r\n        const dCanvas = _scripts_shared_main_js__WEBPACK_IMPORTED_MODULE_1__.canvas.get(draggable.dataset.id);\r\n        const aCanvas = _scripts_shared_main_js__WEBPACK_IMPORTED_MODULE_1__.canvas.get(afterElement.dataset.id);\r\n        layersElem.insertBefore(dCanvas.layer, aCanvas.layer);\r\n        rootElem.insertBefore(dCanvas.canvas, aCanvas.canvas);\r\n    }\r\n\r\n    // if (afterElement == null) {\r\n\r\n    //     layersElem.appendChild(draggable);\r\n\r\n    // } else {\r\n    //     layersElem.insertBefore(draggable, afterElement);\r\n\r\n    // }\r\n});\n\n//# sourceURL=webpack://quanvas/./main.js?\n}");

/***/ }),

/***/ "./node_modules/uuid/dist/native.js":
/*!******************************************!*\
  !*** ./node_modules/uuid/dist/native.js ***!
  \******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nconst randomUUID = typeof crypto !== 'undefined' && crypto.randomUUID && crypto.randomUUID.bind(crypto);\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ randomUUID });\n\n\n//# sourceURL=webpack://quanvas/./node_modules/uuid/dist/native.js?\n}");

/***/ }),

/***/ "./node_modules/uuid/dist/regex.js":
/*!*****************************************!*\
  !*** ./node_modules/uuid/dist/regex.js ***!
  \*****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/i);\n\n\n//# sourceURL=webpack://quanvas/./node_modules/uuid/dist/regex.js?\n}");

/***/ }),

/***/ "./node_modules/uuid/dist/rng.js":
/*!***************************************!*\
  !*** ./node_modules/uuid/dist/rng.js ***!
  \***************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ rng)\n/* harmony export */ });\nlet getRandomValues;\nconst rnds8 = new Uint8Array(16);\nfunction rng() {\n    if (!getRandomValues) {\n        if (typeof crypto === 'undefined' || !crypto.getRandomValues) {\n            throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');\n        }\n        getRandomValues = crypto.getRandomValues.bind(crypto);\n    }\n    return getRandomValues(rnds8);\n}\n\n\n//# sourceURL=webpack://quanvas/./node_modules/uuid/dist/rng.js?\n}");

/***/ }),

/***/ "./node_modules/uuid/dist/stringify.js":
/*!*********************************************!*\
  !*** ./node_modules/uuid/dist/stringify.js ***!
  \*********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__),\n/* harmony export */   unsafeStringify: () => (/* binding */ unsafeStringify)\n/* harmony export */ });\n/* harmony import */ var _validate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./validate.js */ \"./node_modules/uuid/dist/validate.js\");\n\nconst byteToHex = [];\nfor (let i = 0; i < 256; ++i) {\n    byteToHex.push((i + 0x100).toString(16).slice(1));\n}\nfunction unsafeStringify(arr, offset = 0) {\n    return (byteToHex[arr[offset + 0]] +\n        byteToHex[arr[offset + 1]] +\n        byteToHex[arr[offset + 2]] +\n        byteToHex[arr[offset + 3]] +\n        '-' +\n        byteToHex[arr[offset + 4]] +\n        byteToHex[arr[offset + 5]] +\n        '-' +\n        byteToHex[arr[offset + 6]] +\n        byteToHex[arr[offset + 7]] +\n        '-' +\n        byteToHex[arr[offset + 8]] +\n        byteToHex[arr[offset + 9]] +\n        '-' +\n        byteToHex[arr[offset + 10]] +\n        byteToHex[arr[offset + 11]] +\n        byteToHex[arr[offset + 12]] +\n        byteToHex[arr[offset + 13]] +\n        byteToHex[arr[offset + 14]] +\n        byteToHex[arr[offset + 15]]).toLowerCase();\n}\nfunction stringify(arr, offset = 0) {\n    const uuid = unsafeStringify(arr, offset);\n    if (!(0,_validate_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(uuid)) {\n        throw TypeError('Stringified UUID is invalid');\n    }\n    return uuid;\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (stringify);\n\n\n//# sourceURL=webpack://quanvas/./node_modules/uuid/dist/stringify.js?\n}");

/***/ }),

/***/ "./node_modules/uuid/dist/v4.js":
/*!**************************************!*\
  !*** ./node_modules/uuid/dist/v4.js ***!
  \**************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _native_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./native.js */ \"./node_modules/uuid/dist/native.js\");\n/* harmony import */ var _rng_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./rng.js */ \"./node_modules/uuid/dist/rng.js\");\n/* harmony import */ var _stringify_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./stringify.js */ \"./node_modules/uuid/dist/stringify.js\");\n\n\n\nfunction _v4(options, buf, offset) {\n    options = options || {};\n    const rnds = options.random ?? options.rng?.() ?? (0,_rng_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"])();\n    if (rnds.length < 16) {\n        throw new Error('Random bytes length must be >= 16');\n    }\n    rnds[6] = (rnds[6] & 0x0f) | 0x40;\n    rnds[8] = (rnds[8] & 0x3f) | 0x80;\n    if (buf) {\n        offset = offset || 0;\n        if (offset < 0 || offset + 16 > buf.length) {\n            throw new RangeError(`UUID byte range ${offset}:${offset + 15} is out of buffer bounds`);\n        }\n        for (let i = 0; i < 16; ++i) {\n            buf[offset + i] = rnds[i];\n        }\n        return buf;\n    }\n    return (0,_stringify_js__WEBPACK_IMPORTED_MODULE_2__.unsafeStringify)(rnds);\n}\nfunction v4(options, buf, offset) {\n    if (_native_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].randomUUID && !buf && !options) {\n        return _native_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].randomUUID();\n    }\n    return _v4(options, buf, offset);\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (v4);\n\n\n//# sourceURL=webpack://quanvas/./node_modules/uuid/dist/v4.js?\n}");

/***/ }),

/***/ "./node_modules/uuid/dist/validate.js":
/*!********************************************!*\
  !*** ./node_modules/uuid/dist/validate.js ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _regex_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./regex.js */ \"./node_modules/uuid/dist/regex.js\");\n\nfunction validate(uuid) {\n    return typeof uuid === 'string' && _regex_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].test(uuid);\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (validate);\n\n\n//# sourceURL=webpack://quanvas/./node_modules/uuid/dist/validate.js?\n}");

/***/ }),

/***/ "./scripts/core/canvas.js":
/*!********************************!*\
  !*** ./scripts/core/canvas.js ***!
  \********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Canvas)\n/* harmony export */ });\nclass Canvas {\r\n    constructor(id, rootElem, layerElem) {\r\n        const { width, height } = rootElem.getBoundingClientRect();\r\n        const { width: lWidth, height: lHeight } = layerElem.getBoundingClientRect();\r\n\r\n        this.canvas = document.createElement('canvas');\r\n        this.layerCanvas = this.canvas.cloneNode();\r\n        this.canvas.dataset.id = id.unique;\r\n\r\n        rootElem.appendChild(this.canvas);\r\n        layerElem.appendChild(this.layerCanvas);\r\n\r\n        this.layer = layerElem;\r\n\r\n        this.ctx = this.canvas.getContext('2d');\r\n        this.lctx = this.layerCanvas.getContext('2d');\r\n\r\n\r\n        this.canvas.width = width;\r\n        this.canvas.height = height;\r\n        this.layerCanvas.width = lWidth;\r\n        this.layerCanvas.height = lHeight;\r\n\r\n        const span = document.createElement('span');\r\n        span.innerText = `Layer ${id.name}`;\r\n\r\n        layerElem.appendChild(span);\r\n        this.id = id.unique;\r\n        this.name = id.name;\r\n        this.isDrawing = false;\r\n        this.#eventlistener();\r\n    }\r\n\r\n    #eventlistener() {\r\n        this.canvas.addEventListener('mousedown', (e) => {\r\n            const rect = this.canvas.getBoundingClientRect();\r\n            const x = e.clientX - rect.left;\r\n            const y = e.clientY - rect.top;\r\n\r\n            this.ctx.lineCap = 'round';\r\n            this.ctx.lineJoin = 'round';\r\n            this.ctx.beginPath();\r\n            this.ctx.moveTo(x, y);\r\n            this.isDrawing = true;\r\n        });\r\n\r\n        this.canvas.addEventListener('mousemove', (e) => {\r\n            if (this.isDrawing) {\r\n                const rect = this.canvas.getBoundingClientRect();\r\n                const x = e.clientX - rect.left;\r\n                const y = e.clientY - rect.top;\r\n\r\n                this.draw(x, y);\r\n\r\n                this.lctx.drawImage(this.canvas, 0, 0, this.layerCanvas.width, this.layerCanvas.height)\r\n            }\r\n        });\r\n\r\n        this.canvas.addEventListener('mouseup', () => {\r\n            this.isDrawing = false;\r\n        });\r\n\r\n    }\r\n\r\n    draw(x, y) {\r\n        this.ctx.lineWidth = 20;\r\n        this.ctx.lineTo(x, y);\r\n        this.ctx.stroke();\r\n    }\r\n\r\n    clear() {\r\n        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);\r\n    }\r\n\r\n    destroy() {\r\n\r\n    }\r\n}\n\n//# sourceURL=webpack://quanvas/./scripts/core/canvas.js?\n}");

/***/ }),

/***/ "./scripts/shared/main.js":
/*!********************************!*\
  !*** ./scripts/shared/main.js ***!
  \********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   canvas: () => (/* binding */ canvas)\n/* harmony export */ });\nconst canvas = new Map();\n\n//# sourceURL=webpack://quanvas/./scripts/shared/main.js?\n}");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./main.js");
/******/ 	
/******/ })()
;