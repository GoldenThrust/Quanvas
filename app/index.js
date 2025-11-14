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

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _scripts_shared_main_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./scripts/shared/main.js */ \"./scripts/shared/main.js\");\n/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! uuid */ \"./node_modules/uuid/dist/v4.js\");\n/* harmony import */ var _scripts_shared_settings_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./scripts/shared/settings.js */ \"./scripts/shared/settings.js\");\n/* harmony import */ var _scripts_core_canvas_layer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./scripts/core/canvas/layer.js */ \"./scripts/core/canvas/layer.js\");\n/* harmony import */ var _scripts_shared_constants_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./scripts/shared/constants.js */ \"./scripts/shared/constants.js\");\n// if (\"serviceWorker\" in navigator) {\r\n//     window.addEventListener(\"load\", function () {\r\n//         navigator.serviceWorker.register(\"service-worker.js\").then(function (registration) {\r\n//             console.log(\"ServiceWorker registration successful with scope: \", registration.scope);\r\n//         }, function (err) {\r\n//             console.log(\"ServiceWorker registration failed: \", err);\r\n//         });\r\n//     });\r\n// }\r\n\r\n\r\n\r\n\r\n\r\n\r\nconst layersElem = document.getElementById('layers');\r\n\r\nCanvasRenderingContext2D.prototype.circle = function (x, y, radius = 2) {\r\n    this.save()\r\n    this.beginPath();\r\n    this.fillStyle = 'red';\r\n    this.arc(x, y, radius, 0, Math.PI * 2);\r\n    this.fill();\r\n    this.restore();\r\n}\r\n\r\n// Prevent right-click context menu\r\nwindow.addEventListener(\"contextmenu\", function (e) {\r\n    e.preventDefault();\r\n}, false);\r\n\r\n\r\nconst toolsElem = document.getElementById(\"tools\");\r\nconst toolsMenuElem = document.getElementById('toolsmenu');\r\nconst specialMenuElem = document.getElementById('special');\r\n\r\nlet selectedElement = toolsElem.querySelector(`#${_scripts_shared_main_js__WEBPACK_IMPORTED_MODULE_0__.activeMetaData.selectedTool}`);\r\n\r\nconst addLayerElem = document.getElementById('addlayer');\r\n\r\naddLayer();\r\nselectPen('P-pen');\r\n\r\nfunction selectPen(pen) {\r\n    let elem;\r\n    if (pen instanceof HTMLElement) {\r\n        elem = pen;\r\n    } else {\r\n        const toolsMenu = _scripts_shared_constants_js__WEBPACK_IMPORTED_MODULE_4__.TOOLS_MENU[pen[0]];\r\n\r\n        for (let i = 0; i < toolsMenu.length; i++) {\r\n            if (toolsMenu[i] == pen) {\r\n                elem = document.getElementById(pen);\r\n            };\r\n        }\r\n    }\r\n\r\n    selectedElement.classList.remove('selected');\r\n    let selectedElem = toolsElem.querySelector(`#${elem.id}`);\r\n    if (!selectedElem) {\r\n        selectedElem = toolsElem.querySelector(`[id^=${elem.id[0]}]`);\r\n        const tempSrc = elem.src;\r\n        const tempId = elem.id;\r\n        elem.src = selectedElem.src;\r\n        elem.id = selectedElem.id;\r\n        selectedElem.src = tempSrc;\r\n        selectedElem.id = tempId;\r\n        selectedElem.classList.add('selected');\r\n        selectedElement = selectedElem;\r\n    } else {\r\n        selectedElement = elem;\r\n    }\r\n    selectedElement.classList.add('selected');\r\n\r\n    _scripts_shared_main_js__WEBPACK_IMPORTED_MODULE_0__.activeMetaData.selectedTool = selectedElement.id;\r\n}\r\n\r\ntoolsMenuElem.addEventListener('click', (e) => {\r\n    toolsMenuElem.style.visibility = 'hidden';\r\n    if (!_scripts_shared_constants_js__WEBPACK_IMPORTED_MODULE_4__.TOOLS_MENU[e.target.id[0]]?.includes(e.target.id)) return;\r\n    selectPen(e.target);\r\n})\r\n\r\ntoolsElem.addEventListener(\"click\", (e) => {\r\n    toolsMenuElem.style.visibility = 'hidden';\r\n    const tool = e.target;\r\n    if (!_scripts_shared_constants_js__WEBPACK_IMPORTED_MODULE_4__.TOOLS_MENU[tool.id[0]]?.includes(tool.id)) return;\r\n    const prevM = toolsMenuElem.querySelector(`#${selectedElement.id[0]}`);\r\n    const newM = toolsMenuElem.querySelector(`#${tool.id[0]}`);\r\n    prevM.style.display = 'none';\r\n    newM.style.display = 'flex';\r\n    if (e.ctrlKey && _scripts_shared_constants_js__WEBPACK_IMPORTED_MODULE_4__.TOOLS_MENU[tool.id[0]].length > 1) {\r\n        const { top, right } = tool.getBoundingClientRect();\r\n        toolsMenuElem.style.top = top + 'px';\r\n        toolsMenuElem.style.left = (right + 10) + 'px';\r\n        toolsMenuElem.style.visibility = 'visible';\r\n    }\r\n    selectPen(tool);\r\n});\r\n\r\n\r\nfunction getDragAfterElement(y) {\r\n    const elements = Array.from(layersElem.querySelectorAll('.layer:not(.dragging)'));\r\n    return elements.reduce(\r\n        (closest, child) => {\r\n            const box = child.getBoundingClientRect();\r\n            const offset = y - box.top - box.height / 2;\r\n            if (offset < 0 && offset > closest.offset) {\r\n                return { offset: offset, element: child };\r\n            } else {\r\n                return closest;\r\n            }\r\n        },\r\n        { offset: Number.NEGATIVE_INFINITY }\r\n    ).element;\r\n}\r\n\r\nfunction selectLayer(layer) {\r\n    const selectedLayer = _scripts_shared_main_js__WEBPACK_IMPORTED_MODULE_0__.activeMetaData.selectedLayer;\r\n    if (layer) {\r\n        if (selectedLayer) {\r\n            const canva = _scripts_shared_main_js__WEBPACK_IMPORTED_MODULE_0__.canvas.get(selectedLayer);\r\n            canva.layer.classList.remove('selectedLayer');\r\n        }\r\n        layer.classList.add('selectedLayer');\r\n        _scripts_shared_main_js__WEBPACK_IMPORTED_MODULE_0__.activeMetaData.selectedLayer = layer.dataset.id;\r\n    }\r\n}\r\n\r\nfunction addLayer() {\r\n    const id = {\r\n        unique: (0,uuid__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(),\r\n        name: _scripts_shared_main_js__WEBPACK_IMPORTED_MODULE_0__.canvas.size + 1\r\n    }\r\n    const layer = document.createElement('div');\r\n    layer.classList.add('layer');\r\n    layer.draggable = true;\r\n    layer.dataset.id = id.unique;\r\n    layersElem.prepend(layer);\r\n    _scripts_shared_main_js__WEBPACK_IMPORTED_MODULE_0__.canvas.set(id.unique, new _scripts_core_canvas_layer_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"](id, layer));\r\n\r\n\r\n    layer.addEventListener('click', e => {\r\n        selectLayer(e.currentTarget);\r\n    });\r\n    selectLayer(layer);\r\n}\r\n\r\n\r\nspecialMenuElem.addEventListener('click', e => {\r\n    const pElem = e.target.parentElement;\r\n    const id = pElem.id;\r\n    if (id && _scripts_shared_settings_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"][id] !== undefined) {\r\n        if (id === 'fillrule') {\r\n            _scripts_shared_settings_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"][id] = _scripts_shared_settings_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"][id] === 'nonzero' ? 'evenodd' : 'nonzero';\r\n            if (_scripts_shared_settings_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"][id] === 'evenodd') pElem.classList.add('selected');\r\n            else pElem.classList.remove('selected');\r\n        } else if (id === 'fill') {\r\n            pElem.querySelector('img').src = _scripts_shared_settings_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"][id] === true ? './images/tools/fill.svg' : './images/tools/stroke.svg';\r\n            _scripts_shared_settings_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"][id] = !_scripts_shared_settings_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"][id];\r\n        } else {\r\n            _scripts_shared_settings_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"][id] = !_scripts_shared_settings_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"][id];\r\n            if (_scripts_shared_settings_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"][id]) pElem.classList.add('selected');\r\n            else pElem.classList.remove('selected');\r\n        }\r\n    }\r\n})\r\n\r\naddLayerElem.addEventListener('click', _ => {\r\n    addLayer();\r\n})\r\n\r\nlayersElem.addEventListener('dragstart', (e) => {\r\n    const layer = e.target.closest('.layer');\r\n    if (!layer) return;\r\n    layer.classList.add('dragging');\r\n});\r\n\r\nlayersElem.addEventListener('dragend', (e) => {\r\n    const layer = e.target.closest('.layer');\r\n    if (!layer) return;\r\n    layer.classList.remove('dragging');\r\n});\r\n\r\nlayersElem.addEventListener(\"dragover\", (e) => {\r\n    e.preventDefault();\r\n    const afterElement = getDragAfterElement(e.clientY);\r\n    const draggable = layersElem.querySelector(\".dragging\");\r\n    if (!draggable) return;\r\n    if (afterElement == null) {\r\n        const dCanvas = _scripts_shared_main_js__WEBPACK_IMPORTED_MODULE_0__.canvas.get(draggable.dataset.id);\r\n        layersElem.appendChild(dCanvas.layer);\r\n        _scripts_shared_main_js__WEBPACK_IMPORTED_MODULE_0__.rootElem.appendChild(dCanvas.canvas);\r\n    } else {\r\n        const dCanvas = _scripts_shared_main_js__WEBPACK_IMPORTED_MODULE_0__.canvas.get(draggable.dataset.id);\r\n        const aCanvas = _scripts_shared_main_js__WEBPACK_IMPORTED_MODULE_0__.canvas.get(afterElement.dataset.id);\r\n        layersElem.insertBefore(dCanvas.layer, aCanvas.layer);\r\n        _scripts_shared_main_js__WEBPACK_IMPORTED_MODULE_0__.rootElem.insertBefore(dCanvas.canvas, aCanvas.canvas);\r\n    }\r\n\r\n    // if (afterElement == null) {\r\n\r\n    //     layersElem.appendChild(draggable);\r\n\r\n    // } else {\r\n    //     layersElem.insertBefore(draggable, afterElement);\r\n\r\n    // }\r\n});\r\n\r\n\r\n// Keybinding\r\naddEventListener('keydown', (e) => {\r\n    e.preventDefault();\r\n    let keyBind = '';\r\n\r\n    if (e.ctrlKey) keyBind += 'ctrl+';\r\n    if (e.shiftKey) keyBind += 'shift+';\r\n    if (e.altKey) keyBind += 'alt+'\r\n    keyBind += e.key;\r\n    console.log(keyBind)\r\n\r\n    switch (keyBind.toLowerCase()) {\r\n        case 'v':\r\n            selectPen('P-pen')\r\n            break;\r\n        case 'shift+v':\r\n            selectPen('P-brush')\r\n            break;\r\n        \r\n        case 'r':\r\n            selectPen('R-rectangle')\r\n            break;\r\n        case 'shift+r':\r\n            selectPen('R-roundrectangle')\r\n            break;\r\n        \r\n        case 'c':\r\n            selectPen('C-circle')\r\n            break;\r\n        case 'shift+c':\r\n            selectPen('C-ellipse')\r\n            break;\r\n        \r\n        case 'l':\r\n            selectPen('L-line')\r\n            break;\r\n        \r\n        case 'k':\r\n            selectPen('K-quadratic')\r\n            break;\r\n        case 'shift+k':\r\n            selectPen('K-bezier')\r\n            break;\r\n\r\n        default:\r\n            break;\r\n    }\r\n})\n\n//# sourceURL=webpack://quanvas/./main.js?\n}");

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

/***/ "./scripts/core/canvas/canvas.js":
/*!***************************************!*\
  !*** ./scripts/core/canvas/canvas.js ***!
  \***************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Canvas)\n/* harmony export */ });\n/* harmony import */ var _shared_main_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../shared/main.js */ \"./scripts/shared/main.js\");\n/* harmony import */ var _shared_settings_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../shared/settings.js */ \"./scripts/shared/settings.js\");\n/* harmony import */ var _utils_random_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../utils/random.js */ \"./scripts/utils/random.js\");\n/* harmony import */ var _shared_constants_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../shared/constants.js */ \"./scripts/shared/constants.js\");\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\nclass Canvas {\r\n    constructor(canvas) {\r\n        const { width, height } = _shared_main_js__WEBPACK_IMPORTED_MODULE_0__.rootElem.getBoundingClientRect();\r\n\r\n        this.previousPosition = { x: 0, y: 0 };\r\n        this.initialPosition = { x: 0, y: 0 };\r\n\r\n        this.canvas = canvas;\r\n\r\n        this.ctx = this.canvas.getContext('2d');\r\n\r\n        this.canvas.width = width;\r\n        this.canvas.height = height;\r\n\r\n        this.currentPathProp = {\r\n            path: null,\r\n            settings: null,\r\n            metadata: false,\r\n            points: []\r\n        };\r\n\r\n        this.path = new Set();\r\n\r\n        this.isDrawing = false;\r\n        this.#eventlistener();\r\n    }\r\n\r\n\r\n    #eventlistener() {\r\n        this.canvas.addEventListener('mousedown', (e) => {\r\n            this.currentPathProp.path = new Path2D();\r\n            const rect = this.canvas.getBoundingClientRect();\r\n            const x = e.clientX - rect.left;\r\n            const y = e.clientY - rect.top;\r\n\r\n            this.initialPosition.x = x;\r\n            this.initialPosition.y = y;\r\n            this.previousPosition.x = x;\r\n            this.previousPosition.y = y;\r\n\r\n            this.isDrawing = true;\r\n        });\r\n\r\n        this.canvas.addEventListener('mousemove', (e) => {\r\n            if (this.isDrawing) {\r\n                const rect = this.canvas.getBoundingClientRect();\r\n                const x = e.clientX - rect.left;\r\n                const y = e.clientY - rect.top;\r\n\r\n                this.draw(x, y, _shared_main_js__WEBPACK_IMPORTED_MODULE_0__.activeMetaData, _shared_settings_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"]);\r\n\r\n                this.previousPosition.x = x;\r\n                this.previousPosition.y = y;\r\n            }\r\n        });\r\n\r\n        this.canvas.addEventListener('mouseup', () => {\r\n            this.isDrawing = false;\r\n            const layer = _shared_main_js__WEBPACK_IMPORTED_MODULE_0__.canvas.get(_shared_main_js__WEBPACK_IMPORTED_MODULE_0__.activeMetaData.selectedLayer);\r\n\r\n            if (this.currentPathProp.settings?.fill) {\r\n                layer.drawPath(this.currentPathProp.path, true);\r\n            } else {\r\n                layer.drawPath(this.currentPathProp.path, false);\r\n            }\r\n            this.#clear();\r\n            this.path.add(this.currentPathProp);\r\n            this.currentPathProp.path = null;\r\n        });\r\n    }\r\n\r\n    #clear() {\r\n        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);\r\n    }\r\n\r\n    #moveToInitialPosition(line = false) {\r\n        this.#clear();\r\n        this.currentPathProp.path = new Path2D();\r\n        if (line)\r\n            this.currentPathProp.path.lineTo(this.initialPosition.x, this.initialPosition.y);\r\n        else\r\n            this.currentPathProp.path.moveTo(this.initialPosition.x, this.initialPosition.y);\r\n    }\r\n\r\n    #moveToPreviousPosition(line = true) {\r\n        if (line) {\r\n            this.ctx.lineTo(this.previousPosition.x, this.previousPosition.y);\r\n            this.currentPathProp.path.lineTo(this.previousPosition.x, this.previousPosition.y);\r\n        } else {\r\n            this.ctx.moveTo(this.previousPosition.x, this.previousPosition.y);\r\n            this.currentPathProp.path.moveTo(this.previousPosition.x, this.previousPosition.y);\r\n        }\r\n    }\r\n\r\n    draw(x, y, activeMetaData, settings) {\r\n        console.log(activeMetaData.selectedTool);\r\n        const drawGPath = _shared_constants_js__WEBPACK_IMPORTED_MODULE_3__.TOOLS_MENU.P.includes(activeMetaData.selectedTool);\r\n        if (drawGPath)\r\n            this.ctx.beginPath();\r\n        if (!settings.erase)\r\n            switch (activeMetaData.selectedTool) {\r\n                case 'P-pen':\r\n                    this.#pen(x, y);\r\n                    break;\r\n                case 'P-brush':\r\n                    this.#brush(x, y);\r\n                    break;\r\n                case 'R-rectangle':\r\n                    this.#rectangle(x, y);\r\n                    break;\r\n                case 'R-roundrectangle':\r\n                    this.#roundRectangle(x, y);\r\n                    break;\r\n                case 'C-circle':\r\n                    this.#circle(x, y);\r\n                    break;\r\n                case 'C-ellipse':\r\n                    this.#ellipse(x, y);\r\n                    break;\r\n                case 'L-line':\r\n                    this.#line(x, y);\r\n                    break;\r\n                case 'K-bezier':\r\n                    this.#bezier(x, y);\r\n                    break;\r\n                case 'K-quadratic':\r\n                    this.#quadratic(x, y);\r\n                    break;\r\n                case true:\r\n                    break;\r\n                default:\r\n                    this.#eraser(x, y);\r\n                    break;\r\n            }\r\n        else\r\n            this.#eraser(x, y);\r\n\r\n        if (settings.fill && !drawGPath) {\r\n                this.ctx.fill(this.currentPathProp.path);\r\n        } else {\r\n            if (drawGPath)\r\n                this.ctx.stroke();\r\n            else\r\n                this.ctx.stroke(this.currentPathProp.path);\r\n        }\r\n\r\n        this.currentPathProp.points.push({ x, y });\r\n        this.currentPathProp.metadata = activeMetaData;\r\n        this.currentPathProp.settings = settings;\r\n    }\r\n\r\n    #pen(x, y) {\r\n        this.#moveToPreviousPosition();\r\n        this.ctx.lineTo(x, y);\r\n        this.currentPathProp.path.lineTo(x, y);\r\n    }\r\n\r\n    #brush(x, y) {\r\n        this.#moveToPreviousPosition();\r\n        const path = this.currentPathProp.path;\r\n        const dX = this.previousPosition.x - x;\r\n        const dY = this.previousPosition.y - y;\r\n        const radius = Math.hypot(dX, dY);\r\n        const stepDX = dX / radius;\r\n        const stepDY = dY / radius;\r\n        for (let i = 0; i < radius; i++) {\r\n            for (let j = 0; j < 2; j++) {\r\n                const xs = (x + (stepDX * i)) + (0,_utils_random_js__WEBPACK_IMPORTED_MODULE_2__.random)(-5, 5);\r\n                const ys = (y + (stepDY * i)) + (0,_utils_random_js__WEBPACK_IMPORTED_MODULE_2__.random)(-5, 5);\r\n                // path.moveTo(x + (stepDX * i), (y + (stepDY * i)));\r\n                this.ctx.arc(xs, ys, 0.5, 0, Math.PI * 2)\r\n                path.arc(xs, ys, 0.5, 0, Math.PI * 2);\r\n            }\r\n        }\r\n        // path.arc(x, y, 2, 0, Math.PI * 2);\r\n    }\r\n\r\n    #paint(x, y) {\r\n        this.#moveToPreviousPosition(x, y);\r\n        const path = this.currentPathProp.path;\r\n        const dX = this.previousPosition.x - x;\r\n        const dY = this.previousPosition.y - y;\r\n        const radius = Math.hypot(dX, dY);\r\n        const stepDX = dX / radius;\r\n        const stepDY = dY / radius;\r\n\r\n        const cut = 5;\r\n        const spread = Math.PI * 2;\r\n\r\n        for (let i = 0; i < radius; i++) {\r\n            for (let j = 0; j < cut; j++) {\r\n                const alpha = (0,_utils_random_js__WEBPACK_IMPORTED_MODULE_2__.lerp)(\r\n                    spread / 2,\r\n                    -spread / 2,\r\n                    cut === 1 ? 0.5 : j / (cut - 1)\r\n                );\r\n\r\n                // path.moveTo((x + (stepDX * i)) + Math.cos(alpha) * (10), (y + (stepDY * i)) + Math.sin(alpha) * (10));\r\n                path.arc((x + (stepDX * i)) + Math.cos(alpha) * (10), (y + (stepDY * i)) + Math.sin(alpha) * (10), 1, 0, Math.PI * 2);\r\n\r\n            }\r\n        }\r\n\r\n\r\n        // path.arc(x, y, 2, 0, Math.PI * 2);\r\n    }\r\n\r\n    // rebuild() {\r\n    //     this.path.forEach((path) => {\r\n    //         this.draw(path.x, path.y, path.activeMetaData, path.settings)\r\n    //     })\r\n    // }\r\n\r\n    #rectangle(x, y) {\r\n        this.#moveToInitialPosition();\r\n        const path = this.currentPathProp.path;\r\n        path.rect(this.initialPosition.x, this.initialPosition.y, x - this.initialPosition.x, y - this.initialPosition.y);\r\n    }\r\n\r\n    #roundRectangle(x, y) {\r\n        this.#moveToInitialPosition();\r\n        const path = this.currentPathProp.path;\r\n        path.roundRect(this.initialPosition.x, this.initialPosition.y, x - this.initialPosition.x, y - this.initialPosition.y, 10);\r\n    }\r\n\r\n    #circle(x, y) {\r\n        this.#clear();\r\n        const radius = Math.hypot(x - this.initialPosition.x, y - this.initialPosition.y);\r\n        this.currentPathProp.path.arc(this.initialPosition.x, this.initialPosition.y, radius, 0, Math.PI * 2);\r\n    }\r\n    #ellipse(x, y) {\r\n        this.#clear();\r\n        const radiusX = Math.abs(x - this.initialPosition.x);\r\n        const radiusY = Math.abs(y - this.initialPosition.y);\r\n        // const rotation = Math.atan2(y - this.initialPosition.y, x - this.initialPosition.x);\r\n        this.currentPathProp.path.ellipse(this.initialPosition.x, this.initialPosition.y, radiusX, radiusY, 0, 0, Math.PI * 2);\r\n    }\r\n\r\n    #line(x, y) {\r\n        this.#moveToInitialPosition();\r\n        this.currentPathProp.path.lineTo(x, y);\r\n    }\r\n\r\n    #bezier(x, y) {\r\n        this.#moveToInitialPosition();\r\n        const path = this.currentPathProp.path;\r\n        const cp1x = this.initialPosition.x + (x - this.initialPosition.x) / 3;\r\n        const cp1y = this.initialPosition.y;\r\n        const cp2x = this.initialPosition.x + (x - this.initialPosition.x) * 2 / 3;\r\n        const cp2y = y;\r\n        path.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);\r\n    }\r\n\r\n    #quadratic(x, y) {\r\n        this.#moveToInitialPosition();\r\n        const path = this.currentPathProp.path;\r\n        const cpX = (this.initialPosition.x + x) / 2;\r\n        const cpY = this.initialPosition.y;\r\n        path.quadraticCurveTo(cpX, cpY, x, y);\r\n    }\r\n\r\n\r\n    #eraser(x, y) {\r\n        const layer = _shared_main_js__WEBPACK_IMPORTED_MODULE_0__.canvas.get(_shared_main_js__WEBPACK_IMPORTED_MODULE_0__.activeMetaData.selectedLayer);\r\n        layer.ctx.clearRect(x, y, 5, 5);\r\n    }\r\n}\n\n//# sourceURL=webpack://quanvas/./scripts/core/canvas/canvas.js?\n}");

/***/ }),

/***/ "./scripts/core/canvas/layer.js":
/*!**************************************!*\
  !*** ./scripts/core/canvas/layer.js ***!
  \**************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Layer)\n/* harmony export */ });\n/* harmony import */ var _shared_main_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../shared/main.js */ \"./scripts/shared/main.js\");\n\r\n\r\nclass Layer {\r\n    constructor(id, layerElem) {\r\n        const { width, height } = _shared_main_js__WEBPACK_IMPORTED_MODULE_0__.rootElem.getBoundingClientRect();\r\n        const { width: lWidth, height: lHeight } = layerElem.getBoundingClientRect();\r\n\r\n        this.previousPosition = { x: 0, y: 0 };\r\n        this.initialPosition = { x: 0, y: 0 };\r\n\r\n        this.canvas = document.createElement('canvas');\r\n\r\n        this.layerCanvas = this.canvas.cloneNode();\r\n        this.canvas.dataset.id = id.unique;\r\n\r\n        _shared_main_js__WEBPACK_IMPORTED_MODULE_0__.rootElem.appendChild(this.canvas);\r\n        layerElem.appendChild(this.layerCanvas);\r\n\r\n        this.layer = layerElem;\r\n\r\n        this.ctx = this.canvas.getContext('2d');\r\n        this.lctx = this.layerCanvas.getContext('2d');\r\n\r\n\r\n        this.canvas.width = width;\r\n        this.canvas.height = height;\r\n        this.layerCanvas.width = lWidth;\r\n        this.layerCanvas.height = lHeight;\r\n\r\n        const span = document.createElement('span');\r\n        span.innerText = `Layer ${id.name}`;\r\n\r\n        layerElem.appendChild(span);\r\n        this.id = id.unique;\r\n        this.name = id.name;\r\n        this.isDrawing = false;\r\n    }\r\n\r\n    #clear() {\r\n        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);\r\n        this.lctx.clearRect(0, 0, this.layerCanvas.width, this.layerCanvas.height);\r\n    }\r\n\r\n    receiveDrawing(canvas) {\r\n        this.ctx.drawImage(canvas, 0, 0, this.canvas.width, this.canvas.height);\r\n        this.lctx.clearRect(0, 0, this.layerCanvas.width, this.layerCanvas.height);\r\n        this.lctx.drawImage(this.canvas, 0, 0, this.layerCanvas.width, this.layerCanvas.height);\r\n    }\r\n\r\n    drawPath(path, fill) {\r\n        if (fill) {\r\n            this.ctx.fill(path);\r\n        } else {\r\n            this.ctx.stroke(path);\r\n        }\r\n        this.lctx.clearRect(0, 0, this.layerCanvas.width, this.layerCanvas.height);\r\n        this.lctx.drawImage(this.canvas, 0, 0, this.layerCanvas.width, this.layerCanvas.height);\r\n    }\r\n\r\n    redraw(canvas) {\r\n        this.#clear();\r\n        this.receiveDrawing(canvas);\r\n    }\r\n}\n\n//# sourceURL=webpack://quanvas/./scripts/core/canvas/layer.js?\n}");

/***/ }),

/***/ "./scripts/shared/constants.js":
/*!*************************************!*\
  !*** ./scripts/shared/constants.js ***!
  \*************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   TOOLS_MENU: () => (/* binding */ TOOLS_MENU)\n/* harmony export */ });\n// export const TOOL_IDS = [\r\n//     'pen', 'pen',\r\n//     'rectangle', 'round-rectangle',\r\n//     'circle', 'ellipse',\r\n//     'line',\r\n//     'quadratic', 'bezier',\r\n//     'add-layer',\r\n//     'clipboard',\r\n//     'eraser', 'fillrule',\r\n//     'nomove'\r\n// ];\r\n\r\nconst TOOLS_MENU = {\r\n    'P': ['P-pen', 'P-brush'],\r\n    'R': ['R-rectangle', 'R-roundrectangle'],\r\n    'C': ['C-circle', 'C-ellipse'],\r\n    'L': ['L-line'],\r\n    'K': ['K-quadratic', 'K-bezier'],\r\n};\r\n\n\n//# sourceURL=webpack://quanvas/./scripts/shared/constants.js?\n}");

/***/ }),

/***/ "./scripts/shared/main.js":
/*!********************************!*\
  !*** ./scripts/shared/main.js ***!
  \********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   activeMetaData: () => (/* binding */ activeMetaData),\n/* harmony export */   canvas: () => (/* binding */ canvas),\n/* harmony export */   maincanvas: () => (/* binding */ maincanvas),\n/* harmony export */   rootElem: () => (/* binding */ rootElem)\n/* harmony export */ });\n/* harmony import */ var _core_canvas_canvas_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/canvas/canvas.js */ \"./scripts/core/canvas/canvas.js\");\n\r\n// import Database from \"../core/db.js\";\r\n\r\nconst rootElem = document.getElementById('root');\r\nconst maincanvas = new _core_canvas_canvas_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"](document.getElementById('canvas'));\r\nconst canvas = new Map();\r\nconst activeMetaData = {\r\n    selectedTool: 'P-pen',\r\n    selectedLayer: null\r\n}\r\n\n\n//# sourceURL=webpack://quanvas/./scripts/shared/main.js?\n}");

/***/ }),

/***/ "./scripts/shared/settings.js":
/*!************************************!*\
  !*** ./scripts/shared/settings.js ***!
  \************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nconst settings = {\r\n    erase: false,\r\n    fillrule: 'evenodd',\r\n    disablemove: false,\r\n    clip: false,\r\n    fill: false\r\n}\r\n\r\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (settings);\n\n//# sourceURL=webpack://quanvas/./scripts/shared/settings.js?\n}");

/***/ }),

/***/ "./scripts/utils/random.js":
/*!*********************************!*\
  !*** ./scripts/utils/random.js ***!
  \*********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   lerp: () => (/* binding */ lerp),\n/* harmony export */   random: () => (/* binding */ random)\n/* harmony export */ });\nfunction random(min, max) {\r\n    const minCeiled = Math.ceil(min);\r\n    const maxFloored = Math.floor(max);\r\n    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);\r\n}\r\n\r\nfunction lerp(a, b, t) {\r\n    return a + (b - a) * t;\r\n}\n\n//# sourceURL=webpack://quanvas/./scripts/utils/random.js?\n}");

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