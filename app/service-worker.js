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

/***/ "./service-worker.js":
/*!***************************!*\
  !*** ./service-worker.js ***!
  \***************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n// const CACHE_NAME = 'quanvas-cache-v1';\r\nconst CACHE_NAME = 'quanvas-v1';\r\n\r\nconst IMAGE_ASSETS = [\r\n    '/images/tools/pen.svg',\r\n    '/images/tools/eraser.svg',\r\n    '/images/tools/line.svg',\r\n    '/images/tools/rectangle.svg',\r\n    '/images/tools/circle.svg',\r\n    '/images/tools/bezier.svg',\r\n    '/images/tools/add-layer.svg',\r\n    '/images/tools/arc-to.svg',\r\n    '/images/tools/clipboard.svg',\r\n    '/images/tools/ellipse.svg',\r\n    '/images/tools/evenodd.svg',\r\n    '/images/tools/nomove.svg',\r\n    '/images/tools/nonzero.svg',\r\n    '/images/tools/pen2.svg',\r\n    '/images/tools/quadratic.svg',\r\n    '/images/tools/round-rectangle.svg',\r\n];\r\n\r\nconst ASSETS_TO_CACHE = [\r\n    '/',\r\n    '/index.html',\r\n    '/style.css',\r\n    '/app/index.js',\r\n    '/app/service-worker.js',\r\n    '/images/icons/quanvas.png',\r\n    '/manifest.json',\r\n    ...IMAGE_ASSETS\r\n];\r\n\r\n\r\nself.addEventListener(\"install\", e => {\r\n    e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE)).then(() => self.skipWaiting()));\r\n});\r\n\r\nself.addEventListener(\"active\", e => {\r\n    e.waitUntil(caches.keys().then(keys => Promise.all(keys.map(key => key !== CACHE_NAME && caches.delete(key)))))\r\n    self.clients.claim();\r\n});\r\nself.addEventListener(\"fetch\", e => {\r\n    e.respondWith(caches.match(e.request).then(res => res || fetch(e.request).catch(() => caches.match(\"/offline.html\"))))\r\n});\r\n\n\n//# sourceURL=webpack://quanvas/./service-worker.js?\n}");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
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
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./service-worker.js"](0,__webpack_exports__,__webpack_require__);
/******/ 	
/******/ })()
;