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

eval("{__webpack_require__.r(__webpack_exports__);\nconst CACHE_NAME = 'quanvas-cache-v1';\r\n\r\nconst IMAGE_ASSETS = [\r\n    '/images/tools/add-layer.svg',\r\n    '/images/tools/C-circle.svg',\r\n    '/images/tools/C-ellipse.svg',\r\n    '/images/tools/clipboard.svg',\r\n    '/images/tools/eraser.svg',\r\n    '/images/tools/fill.svg',\r\n    '/images/tools/K-bezier.svg',\r\n    '/images/tools/K-quadratic.svg',\r\n    '/images/tools/L-arcto.svg',\r\n    '/images/tools/L-line.svg',\r\n    '/images/tools/P-chalk.svg',\r\n    '/images/tools/P-pen.svg',\r\n    '/images/tools/R-rectangle.svg',\r\n    '/images/tools/R-roundrectangle.svg',\r\n    '/images/tools/stroke.svg',\r\n\r\n    '/images/icons/create.svg',\r\n    '/images/icons/delete.svg',\r\n    '/images/icons/menu.svg',\r\n];\r\n\r\nconst ASSETS_TO_CACHE = [\r\n    '/',\r\n    '/index.html',\r\n    '/style.css',\r\n    '/app/index.js',\r\n    '/app/service-worker.js',\r\n    '/images/icons/quanvas.png',\r\n    '/manifest.json',\r\n    ...IMAGE_ASSETS\r\n];\r\n\r\n\r\nself.addEventListener(\"install\", e => {\r\n    e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE)).then(() => self.skipWaiting()));\r\n});\r\n\r\nself.addEventListener(\"activate\", e => {\r\n    e.waitUntil(caches.keys().then(keys => Promise.all(keys.map(key => key !== CACHE_NAME && caches.delete(key)))))\r\n    self.clients.claim();\r\n});\r\n\r\nself.addEventListener(\"fetch\", e => {\r\n    e.respondWith(networkFirst(e.request));\r\n});\r\n\r\n\r\nasync function networkFirst(req) {\r\n    const cache = await caches.open(CACHE_NAME);\r\n\r\n    try {\r\n        const res = await fetch(req);\r\n        cache.put(req, res.clone());\r\n        return res;\r\n    } catch (err) {\r\n        const cached = caches.match(req);\r\n        return cached || Response.error();\r\n    }\r\n}\n\n//# sourceURL=webpack://quanvas/./service-worker.js?\n}");

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