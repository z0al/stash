!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((t=t||self).statedX={})}(this,function(t){"use strict";var e=function(t){return!!t&&("object"==typeof t||"function"==typeof t)&&"function"==typeof t.then};function n(t,e){return e.type=t,e}t.createAction=n,t.createStore=function(t){var n=[];return{dispatch:function o(r,f){if("function"!=typeof r)throw new Error("Expected action to be a function");if("string"!=typeof r.type)throw new Error("Expected action.type to be a string");if(r.thunk)r(t,f,o);else{var i=r(t,f);e(i)||(t=i)}for(var u=n,c=0;c<u.length;c++)(0,u[c])(t,r)},subscribe:function(t){if("function"!=typeof t)throw new Error("A subscriber must be a function");return n.push(t),function(){var e=n.indexOf(t);e>=0&&n.splice(e,1)}},getState:function(){return t}}},t.createThunk=function(t,e){var o=n(t,e);return o.thunk=!0,o},Object.defineProperty(t,"__esModule",{value:!0})});