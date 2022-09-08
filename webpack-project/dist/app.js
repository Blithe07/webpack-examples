"use strict";
(self["webpackChunkwebpack_project"] = self["webpackChunkwebpack_project"] || []).push([[143],{

/***/ 772:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ 260:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.alterMsg = void 0;
function alterMsg(msg) {
    alert(msg);
}
exports.alterMsg = alterMsg;


/***/ }),

/***/ 200:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.module = void 0;
exports.module = 'common-module';


/***/ }),

/***/ 607:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var __webpack_unused_export__;

__webpack_unused_export__ = ({ value: true });
__webpack_require__(772);
var lodash_1 = __webpack_require__(611);
var click_message_1 = __webpack_require__(260);
Promise.resolve().then(function () { return __webpack_require__(200); });
var node = document.createElement('span');
node.textContent = 'hello world';
node.style.color = '#fff';
// 同步导入
node.addEventListener('click', function () {
    (0, click_message_1.alterMsg)('同步');
});
document.body.appendChild(node);
var obj1 = { a: '1', b: '2' };
var obj2 = (0, lodash_1.cloneDeep)(obj1);
console.log(obj2);


/***/ }),

/***/ 611:
/***/ ((module) => {

module.exports = _;

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ var __webpack_exports__ = (__webpack_exec__(607));
/******/ }
]);