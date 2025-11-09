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

eval("{__webpack_require__.r(__webpack_exports__);\nif (\"serviceWorker\" in navigator) {\r\n    window.addEventListener(\"load\", function () {\r\n        navigator.serviceWorker.register(\"service-worker.js\").then(function (registration) {\r\n            console.log(\"ServiceWorker registration successful with scope: \", registration.scope);\r\n        }, function (err) {\r\n            console.log(\"ServiceWorker registration failed: \", err);\r\n        });\r\n    });\r\n}\r\n\r\n// Prevent right-click context menu\r\nwindow.addEventListener(\"contextmenu\", function (e) {\r\n    e.preventDefault();\r\n}, false);\r\n\r\nconst tools = document.getElementById(\"tools\");\r\nlet selectedElement = tools.querySelector('#pen');\r\n\r\ntools.addEventListener(\"click\", (e) => {\r\n    if (e.target.parentElement.id) {\r\n        selectTool(e.target.parentElement);\r\n    }\r\n});\r\n\r\nfunction selectTool(tool) {\r\n    if (['pen', 'rect', 'line', 'circle', 'curve'].includes(tool.id)) {\r\n        selectedElement.classList.remove('selected');\r\n        tool.classList.add('selected');\r\n        selectedElement = tool;\r\n    }\r\n}\r\n\n\n//# sourceURL=webpack://quanvas/./main.js?\n}");

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
/******/ 	__webpack_modules__["./main.js"](0,__webpack_exports__,__webpack_require__);
/******/ 	
/******/ })()
;