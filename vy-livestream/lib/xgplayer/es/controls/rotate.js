!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.rotate=e():(t.xgplayer=t.xgplayer||{},t.xgplayer.PlayerControls=t.xgplayer.PlayerControls||{},t.xgplayer.PlayerControls.rotate=e())}(window,(function(){return function(t){var e={};function r(n){if(e[n])return e[n].exports;var o=e[n]={i:n,l:!1,exports:{}};return t[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}return r.m=t,r.c=e,r.d=function(t,e,n){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)r.d(n,o,function(e){return t[e]}.bind(null,o));return n},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=5)}([function(t,e,r){var n=r(1);"string"==typeof n&&(n=[[t.i,n,""]]);var o={hmr:!0,transform:void 0,insertInto:void 0};r(3)(n,o);n.locals&&(t.exports=n.locals)},function(t,e,r){(t.exports=r(2)(!1)).push([t.i,".xgplayer-skin-default .xgplayer-rotate{position:relative;-webkit-order:10;-moz-box-ordinal-group:11;order:10;display:block;cursor:pointer}.xgplayer-skin-default .xgplayer-rotate .xgplayer-icon{margin-top:7px;width:26px}.xgplayer-skin-default .xgplayer-rotate .xgplayer-icon div{position:absolute}.xgplayer-skin-default .xgplayer-rotate .xgplayer-tips{margin-left:-22px}.xgplayer-skin-default .xgplayer-rotate .xgplayer-tips .xgplayer-tip-rotate{display:block}.xgplayer-skin-default .xgplayer-rotate:hover{opacity:.85}.xgplayer-skin-default .xgplayer-rotate:hover .xgplayer-tips{display:block}.xgplayer-lang-is-en .xgplayer-rotate .xgplayer-tips{margin-left:-26px}.xgplayer-lang-is-jp .xgplayer-rotate .xgplayer-tips{margin-left:-38px}",""])},function(t,e){t.exports=function(t){var e=[];return e.toString=function(){return this.map((function(e){var r=function(t,e){var r=t[1]||"",n=t[3];if(!n)return r;if(e&&"function"==typeof btoa){var o=(a=n,"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(a))))+" */"),i=n.sources.map((function(t){return"/*# sourceURL="+n.sourceRoot+t+" */"}));return[r].concat(i).concat([o]).join("\n")}var a;return[r].join("\n")}(e,t);return e[2]?"@media "+e[2]+"{"+r+"}":r})).join("")},e.i=function(t,r){"string"==typeof t&&(t=[[null,t,""]]);for(var n={},o=0;o<this.length;o++){var i=this[o][0];"number"==typeof i&&(n[i]=!0)}for(o=0;o<t.length;o++){var a=t[o];"number"==typeof a[0]&&n[a[0]]||(r&&!a[2]?a[2]=r:r&&(a[2]="("+a[2]+") and ("+r+")"),e.push(a))}},e}},function(t,e,r){var n,o,i={},a=(n=function(){return window&&document&&document.all&&!window.atob},function(){return void 0===o&&(o=n.apply(this,arguments)),o}),s=function(t){return document.querySelector(t)},l=function(t){var e={};return function(t){if("function"==typeof t)return t();if(void 0===e[t]){var r=s.call(this,t);if(window.HTMLIFrameElement&&r instanceof window.HTMLIFrameElement)try{r=r.contentDocument.head}catch(t){r=null}e[t]=r}return e[t]}}(),f=null,c=0,u=[],p=r(4);function d(t,e){for(var r=0;r<t.length;r++){var n=t[r],o=i[n.id];if(o){o.refs++;for(var a=0;a<o.parts.length;a++)o.parts[a](n.parts[a]);for(;a<n.parts.length;a++)o.parts.push(x(n.parts[a],e))}else{var s=[];for(a=0;a<n.parts.length;a++)s.push(x(n.parts[a],e));i[n.id]={id:n.id,refs:1,parts:s}}}}function g(t,e){for(var r=[],n={},o=0;o<t.length;o++){var i=t[o],a=e.base?i[0]+e.base:i[0],s={css:i[1],media:i[2],sourceMap:i[3]};n[a]?n[a].parts.push(s):r.push(n[a]={id:a,parts:[s]})}return r}function h(t,e){var r=l(t.insertInto);if(!r)throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");var n=u[u.length-1];if("top"===t.insertAt)n?n.nextSibling?r.insertBefore(e,n.nextSibling):r.appendChild(e):r.insertBefore(e,r.firstChild),u.push(e);else if("bottom"===t.insertAt)r.appendChild(e);else{if("object"!=typeof t.insertAt||!t.insertAt.before)throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");var o=l(t.insertInto+" "+t.insertAt.before);r.insertBefore(e,o)}}function y(t){if(null===t.parentNode)return!1;t.parentNode.removeChild(t);var e=u.indexOf(t);e>=0&&u.splice(e,1)}function v(t){var e=document.createElement("style");return t.attrs.type="text/css",m(e,t.attrs),h(t,e),e}function m(t,e){Object.keys(e).forEach((function(r){t.setAttribute(r,e[r])}))}function x(t,e){var r,n,o,i;if(e.transform&&t.css){if(!(i=e.transform(t.css)))return function(){};t.css=i}if(e.singleton){var a=c++;r=f||(f=v(e)),n=C.bind(null,r,a,!1),o=C.bind(null,r,a,!0)}else t.sourceMap&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&"function"==typeof URL.revokeObjectURL&&"function"==typeof Blob&&"function"==typeof btoa?(r=function(t){var e=document.createElement("link");return t.attrs.type="text/css",t.attrs.rel="stylesheet",m(e,t.attrs),h(t,e),e}(e),n=L.bind(null,r,e),o=function(){y(r),r.href&&URL.revokeObjectURL(r.href)}):(r=v(e),n=j.bind(null,r),o=function(){y(r)});return n(t),function(e){if(e){if(e.css===t.css&&e.media===t.media&&e.sourceMap===t.sourceMap)return;n(t=e)}else o()}}t.exports=function(t,e){if("undefined"!=typeof DEBUG&&DEBUG&&"object"!=typeof document)throw new Error("The style-loader cannot be used in a non-browser environment");(e=e||{}).attrs="object"==typeof e.attrs?e.attrs:{},e.singleton||"boolean"==typeof e.singleton||(e.singleton=a()),e.insertInto||(e.insertInto="head"),e.insertAt||(e.insertAt="bottom");var r=g(t,e);return d(r,e),function(t){for(var n=[],o=0;o<r.length;o++){var a=r[o];(s=i[a.id]).refs--,n.push(s)}t&&d(g(t,e),e);for(o=0;o<n.length;o++){var s;if(0===(s=n[o]).refs){for(var l=0;l<s.parts.length;l++)s.parts[l]();delete i[s.id]}}}};var b,w=(b=[],function(t,e){return b[t]=e,b.filter(Boolean).join("\n")});function C(t,e,r,n){var o=r?"":n.css;if(t.styleSheet)t.styleSheet.cssText=w(e,o);else{var i=document.createTextNode(o),a=t.childNodes;a[e]&&t.removeChild(a[e]),a.length?t.insertBefore(i,a[e]):t.appendChild(i)}}function j(t,e){var r=e.css,n=e.media;if(n&&t.setAttribute("media",n),t.styleSheet)t.styleSheet.cssText=r;else{for(;t.firstChild;)t.removeChild(t.firstChild);t.appendChild(document.createTextNode(r))}}function L(t,e,r){var n=r.css,o=r.sourceMap,i=void 0===e.convertToAbsoluteUrls&&o;(e.convertToAbsoluteUrls||i)&&(n=p(n)),o&&(n+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(o))))+" */");var a=new Blob([n],{type:"text/css"}),s=t.href;t.href=URL.createObjectURL(a),s&&URL.revokeObjectURL(s)}},function(t,e){t.exports=function(t){var e="undefined"!=typeof window&&window.location;if(!e)throw new Error("fixUrls requires window.location");if(!t||"string"!=typeof t)return t;var r=e.protocol+"//"+e.host,n=r+e.pathname.replace(/\/[^\/]*$/,"/");return t.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi,(function(t,e){var o,i=e.trim().replace(/^"(.*)"$/,(function(t,e){return e})).replace(/^'(.*)'$/,(function(t,e){return e}));return/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(i)?t:(o=0===i.indexOf("//")?i:0===i.indexOf("/")?r+i:n+i.replace(/^\.\//,""),"url("+JSON.stringify(o)+")")}))}},function(t,e,r){"use strict";r.r(e);var n={name:"rotate",method:function(){let t=this,e=t.config.rotate;function r(){t.rotate(e.clockwise,e.innerRotate)}e&&(t.on("rotateBtnClick",r),t.once("destroy",(function e(){t.off("rotateBtnClick",r),t.off("destroy",e)})),t.updateRotateDeg=function(){let t=this;t.rotateDeg||(t.rotateDeg=0);let e,r=t.root.offsetWidth,n=t.root.offsetHeight,o=t.video.videoWidth,i=t.video.videoHeight;if(!t.config.rotate.innerRotate&&t.config.rotate.controlsFix&&(t.root.style.width=n+"px",t.root.style.height=r+"px"),.25===t.rotateDeg||.75===t.rotateDeg){if(t.config.rotate.innerRotate)if(o/i>n/r){let t=0;t=i/o>n/r?n*o/i:r,e=n/t}else{let t=0;t=i/o>n/r?n:r*i/o,e=r/t}else e=r>=n?r/n:n/r;e=Number(e.toFixed(5))}else e=1;t.config.rotate.innerRotate||t.config.rotate.controlsFix?(t.video.style.transformOrigin="center center",t.video.style.transform=`rotate(${t.rotateDeg}turn) scale(${e})`,t.video.style.webKitTransform=`rotate(${t.rotateDeg}turn) scale(${e})`):(t.root.style.transformOrigin="center center",t.root.style.transform=`rotate(${t.rotateDeg}turn) scale(1)`,t.root.style.webKitTransform=`rotate(${t.rotateDeg}turn) scale(1)`)},t.rotate=function(t=!1,e=!0,r=1){let n=this;n.rotateDeg||(n.rotateDeg=0);let o=t?1:-1;n.rotateDeg=(n.rotateDeg+1+.25*o*r)%1,this.updateRotateDeg(),n.emit("rotate",360*n.rotateDeg)})}};function o(t="div",e="",r={},n=""){let o=document.createElement(t);return o.className=n,o.innerHTML=e,Object.keys(r).forEach(e=>{let n=e,i=r[e];"video"===t||"audio"===t?i&&o.setAttribute(n,i):o.setAttribute(n,i)}),o}r(0);var i={name:"s_rotate",method:function(){let t=this;if(!t.config.rotate)return;let e=o("xg-rotate",'<xg-icon class="xgplayer-icon"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 40 40" fill="none">\n  <g clip-path="url(#clip0)">\n    <path transform="scale(1.5 1.5)" d="M11.6665 9.16663H4.1665C2.78579 9.16663 1.6665 10.2859 1.6665 11.6666V15.8333C1.6665 17.214 2.78579 18.3333 4.1665 18.3333H11.6665C13.0472 18.3333 14.1665 17.214 14.1665 15.8333V11.6666C14.1665 10.2859 13.0472 9.16663 11.6665 9.16663Z" fill="white"/>\n    <path transform="scale(1.5 1.5)" fill-rule="evenodd" clip-rule="evenodd" d="M3.88148 4.06298C3.75371 4.21005 3.67667 4.40231 3.67749 4.61242C3.67847 4.87253 3.79852 5.10435 3.98581 5.25646L6.99111 8.05895C7.32771 8.37283 7.85502 8.35443 8.16891 8.01782C8.48279 7.68122 8.46437 7.15391 8.12778 6.84003L6.62061 5.43457L9.8198 5.4224C9.82848 5.42239 9.8372 5.42221 9.84591 5.4219C10.9714 5.38233 12.0885 5.6285 13.0931 6.13744C14.0976 6.64635 14.957 7.40148 15.5908 8.33234C16.2246 9.2632 16.6122 10.3394 16.7177 11.4606C16.823 12.5819 16.6427 13.7115 16.1934 14.7442C16.0098 15.1661 16.203 15.6571 16.6251 15.8408C17.0471 16.0243 17.5381 15.8311 17.7216 15.4091C18.2833 14.1183 18.5087 12.7063 18.3771 11.3047C18.2453 9.90318 17.7607 8.55792 16.9684 7.39433C16.1761 6.23073 15.1021 5.28683 13.8463 4.65065C12.5946 4.01651 11.203 3.70872 9.80072 3.75583L6.43415 3.76862L7.96326 2.12885C8.27715 1.79225 8.25872 1.26494 7.92213 0.951061C7.58553 0.63718 7.05822 0.655585 6.74433 0.99219L3.90268 4.0395C3.89545 4.04724 3.88841 4.05509 3.88154 4.06303L3.88148 4.06298Z" fill="white"/>\n  </g>\n  <defs>\n    <clipPath id="clip0">\n      <rect width="40" height="40" fill="white"/>\n    </clipPath>\n  </defs>\n</svg>\n</xg-icon>',{},"xgplayer-rotate"),r=o("xg-tips",`<span class="xgplayer-tip-rotate">${t.lang.ROTATE_TIPS}</span>`,{},"xgplayer-tips");e.appendChild(r),t.once("ready",()=>{t.controls.appendChild(e)}),["click","touchend"].forEach(r=>{e.addEventListener(r,(function(e){e.preventDefault(),e.stopPropagation(),t.userGestureTrigEvent("rotateBtnClick")}))})}};e.default={name:"rotate",method:function(){n.method.call(this),i.method.call(this)}}}])}));