window.PlayerControls=window.PlayerControls||{},window.PlayerControls.definition=function(e){var t={};function n(r){if(t[r])return t[r].exports;var i=t[r]={i:r,l:!1,exports:{}};return e[r].call(i.exports,i,i.exports,n),i.l=!0,i.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)n.d(r,i,function(t){return e[t]}.bind(null,i));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=o(n(1)),i=o(n(2));function o(e){return e&&e.__esModule?e:{default:e}}t.default={name:"definition",method:function(){r.default.method.call(this),i.default.method.call(this)}},e.exports=t.default},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.default={name:"definition",method:function(){var e=this;e.once("destroy",(function t(){e.off("destroy",t)}))}},e.exports=t.default},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r,i=n(3),o=n(5),a=(r=o)&&r.__esModule?r:{default:r};n(6);t.default={name:"s_definition",method:function(){var e=this,t=e.root,n=void 0,r=(0,i.createDom)("xg-definition","",{tabindex:3},"xgplayer-definition");function o(){var n=e.definitionList,o=["<ul>"],a=e.config.url,s=document.createElement("a");e.switchURL?["mp4","hls","__flv__","dash"].every((function(t){return!e[t]||(e[t].url&&(s.href=e[t].url),"__flv__"===t&&(e[t]._options?s.href=e[t]._options.url:s.href=e[t]._mediaDataSource.url),"hls"===t&&(s.href=e[t].originUrl||e[t].url,a=s.href),a=s.href,!1)})):a=e.currentSrc||e.src,n.forEach((function(t){s.href=t.url,e.dash?o.push("<li url='"+t.url+"' cname='"+t.name+"' class='"+(t.selected?"selected":"")+"'>"+t.name+"</li>"):o.push("<li url='"+t.url+"' cname='"+t.name+"' class='"+(s.href===a?"selected":"")+"'>"+t.name+"</li>")}));var l=n.filter((function(t){return s.href=t.url,e.dash?!0===t.selected:s.href===a}));console.warn("cursrc:",l,"src:",a,"list:",n),o.push("</ul><p class='name'>"+(l[0]||{name:""}).name+"</p>");var u=t.querySelector(".xgplayer-definition");if(u){u.innerHTML=o.join("");var c=u.querySelector(".name");e.config.definitionActive&&"hover"!==e.config.definitionActive||c.addEventListener("mouseenter",(function(t){t.preventDefault(),t.stopPropagation(),(0,i.addClass)(e.root,"xgplayer-definition-active"),u.focus()}))}else{r.innerHTML=o.join("");var f=r.querySelector(".name");e.config.definitionActive&&"hover"!==e.config.definitionActive||f.addEventListener("mouseenter",(function(t){t.preventDefault(),t.stopPropagation(),(0,i.addClass)(e.root,"xgplayer-definition-active"),r.focus()})),e.controls.appendChild(r)}}function s(n){e.definitionList=n,n&&n instanceof Array&&n.length>0&&((0,i.addClass)(t,"xgplayer-is-definition"),e.once("canplay",o))}function l(){if(e.currentTime=e.curTime,n)e.pause();else{var t=e.play();void 0!==t&&t&&t.catch((function(e){}))}}function u(){e.once("timeupdate",l)}function c(){(0,i.removeClass)(t,"xgplayer-definition-active")}"mobile"===a.default.device&&(e.config.definitionActive="click"),e.on("resourceReady",s),["touchend","click"].forEach((function(t){r.addEventListener(t,(function(t){t.preventDefault(),t.stopPropagation();var o=e.definitionList,s=t.target||t.srcElement,c=document.createElement("a");if(s&&"li"===s.tagName.toLocaleLowerCase()){var f,d=void 0;if(Array.prototype.forEach.call(s.parentNode.childNodes,(function(t){(0,i.hasClass)(t,"selected")&&(d=t.getAttribute("cname"),(0,i.removeClass)(t,"selected"),e.emit("beforeDefinitionChange",t.getAttribute("url")))})),e.dash&&o.forEach((function(e){e.selected=!1,e.name===s.innerHTML&&(e.selected=!0)})),(0,i.addClass)(s,"selected"),f=s.getAttribute("cname"),s.parentNode.nextSibling.innerHTML=""+s.getAttribute("cname"),c.href=s.getAttribute("url"),n=e.paused,e.switchURL){var p=document.createElement("a");["mp4","hls","__flv__","dash"].every((function(t){return!e[t]||(e[t].url&&(p.href=e[t].url),"__flv__"===t&&(e[t]._options?p.href=e[t]._options.url:p.href=e[t]._mediaDataSource.url),"hls"===t&&(p.href=e[t].originUrl||e[t].url),!1)})),p.href===c.href||e.ended||e.switchURL(c.href)}else{if(e.hls){document.createElement("a");e.hls.url}c.href!==e.currentSrc&&(e.curTime=e.currentTime,e.ended||(e.src=c.href))}navigator.userAgent.toLowerCase().indexOf("android")>-1?e.once("timeupdate",u):e.once("loadedmetadata",l),e.emit("definitionChange",{from:d,to:f}),"mobile"===a.default.device&&(0,i.removeClass)(e.root,"xgplayer-definition-active")}else"click"!==e.config.definitionActive||!s||"p"!==s.tagName.toLocaleLowerCase()&&"em"!==s.tagName.toLocaleLowerCase()||("mobile"===a.default.device?(0,i.toggleClass)(e.root,"xgplayer-definition-active"):(0,i.addClass)(e.root,"xgplayer-definition-active"),r.focus());e.emit("focus")}),!1)})),r.addEventListener("mouseleave",(function(e){e.preventDefault(),e.stopPropagation(),(0,i.removeClass)(t,"xgplayer-definition-active")})),e.on("blur",c),e.once("destroy",(function t(){e.off("resourceReady",s),e.off("canplay",o),navigator.userAgent.toLowerCase().indexOf("android")>-1?(e.off("timeupdate",u),e.off("timeupdate",l)):e.off("loadedmetadata",l),e.off("blur",c),e.off("destroy",t)})),e.getCurrentDefinition=function(){for(var t=e.controls.querySelectorAll(".xgplayer-definition ul li"),n=0;n<t.length;n++)if(t[n].className&&t[n].className.indexOf("selected")>-1)return{name:t[n].getAttribute("cname"),url:t[n].getAttribute("url")};return{name:t[0].getAttribute("cname"),url:t[0].getAttribute("url")}},e.switchDefinition=function(){for(var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},n=e.controls.querySelectorAll(".xgplayer-definition ul li"),r=0;r<n.length;r++)n[r].getAttribute("cname")!==t.name&&n[r].getAttribute("url")!==t.url&&r!==t.index||n[r].click()}}},e.exports=t.default},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.util=t.PresentationMode=void 0,t.createDom=a,t.hasClass=s,t.addClass=l,t.removeClass=u,t.toggleClass=c,t.findDom=f,t.padStart=d,t.format=p,t.event=g,t.typeOf=h,t.deepCopy=v,t.getBgImage=m,t.copyDom=y,t._setInterval=b,t._clearInterval=x,t.createImgBtn=w,t.isWeiXin=L,t.isUc=C,t.computeWatchDur=_,t.offInDestroy=O,t.on=A,t.once=S,t.getBuffered2=j,t.checkIsBrowser=k,t.setStyle=E,t.checkWebkitSetPresentationMode=function(e){return"function"==typeof e.webkitSetPresentationMode};var r,i=n(4),o=(r=i)&&r.__esModule?r:{default:r};function a(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"div",t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"",n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"",i=document.createElement(e);return i.className=r,i.innerHTML=t,Object.keys(n).forEach((function(t){var r=t,o=n[t];"video"===e||"audio"===e?o&&i.setAttribute(r,o):i.setAttribute(r,o)})),i}function s(e,t){return!!e&&(e.classList?Array.prototype.some.call(e.classList,(function(e){return e===t})):!!e.className&&!!e.className.match(new RegExp("(\\s|^)"+t+"(\\s|$)")))}function l(e,t){e&&(e.classList?t.replace(/(^\s+|\s+$)/g,"").split(/\s+/g).forEach((function(t){t&&e.classList.add(t)})):s(e,t)||(e.className+=" "+t))}function u(e,t){e&&(e.classList?t.split(/\s+/g).forEach((function(t){e.classList.remove(t)})):s(e,t)&&t.split(/\s+/g).forEach((function(t){var n=new RegExp("(\\s|^)"+t+"(\\s|$)");e.className=e.className.replace(n," ")})))}function c(e,t){e&&t.split(/\s+/g).forEach((function(t){s(e,t)?u(e,t):l(e,t)}))}function f(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:document,t=arguments[1],n=void 0;try{n=e.querySelector(t)}catch(r){0===t.indexOf("#")&&(n=e.getElementById(t.slice(1)))}return n}function d(e,t,n){for(var r=String(n),i=t>>0,o=Math.ceil(i/r.length),a=[],s=String(e);o--;)a.push(r);return a.join("").substring(0,i-s.length)+s}function p(e){if(window.isNaN(e))return"";var t=d(Math.floor(e/3600),2,0),n=d(Math.floor((e-3600*t)/60),2,0),r=d(Math.floor(e-3600*t-60*n),2,0);return("00"===t?[n,r]:[t,n,r]).join(":")}function g(e){if(e.touches){var t=e.touches[0]||e.changedTouches[0];e.clientX=t.clientX||0,e.clientY=t.clientY||0,e.offsetX=t.pageX-t.target.offsetLeft,e.offsetY=t.pageY-t.target.offsetTop}e._target=e.target||e.srcElement}function h(e){return Object.prototype.toString.call(e).match(/([^\s.*]+)(?=]$)/g)[0]}function v(e,t){if("Object"===h(t)&&"Object"===h(e))return Object.keys(t).forEach((function(n){"Object"!==h(t[n])||t[n]instanceof Node?"Array"===h(t[n])?e[n]="Array"===h(e[n])?e[n].concat(t[n]):t[n]:e[n]=t[n]:e[n]?v(e[n],t[n]):e[n]=t[n]})),e}function m(e){var t=(e.currentStyle||window.getComputedStyle(e,null)).backgroundImage;if(!t||"none"===t)return"";var n=document.createElement("a");return n.href=t.replace(/url\("|"\)/g,""),n.href}function y(e){if(e&&1===e.nodeType){var t=document.createElement(e.tagName);return Array.prototype.forEach.call(e.attributes,(function(e){t.setAttribute(e.name,e.value)})),e.innerHTML&&(t.innerHTML=e.innerHTML),t}return""}function b(e,t,n,r){e._interval[t]||(e._interval[t]=setInterval(n.bind(e),r))}function x(e,t){clearInterval(e._interval[t]),e._interval[t]=null}function w(e,t,n,r){var i=a("xg-"+e,"",{},"xgplayer-"+e+"-img");if(i.style.backgroundImage='url("'+t+'")',n&&r){var o=void 0,s=void 0,l=void 0;["px","rem","em","pt","dp","vw","vh","vm","%"].every((function(e){return!(n.indexOf(e)>-1&&r.indexOf(e)>-1)||(o=Number(n.slice(0,n.indexOf(e)).trim()),s=Number(r.slice(0,r.indexOf(e)).trim()),l=e,!1)})),i.style.width=""+o+l,i.style.height=""+s+l,i.style.backgroundSize=""+o+l+" "+s+l,i.style.margin="start"===e?"-"+s/2+l+" auto auto -"+o/2+l:"auto 5px auto 5px"}return i}function L(){return window.navigator.userAgent.toLowerCase().indexOf("micromessenger")>-1}function C(){return window.navigator.userAgent.toLowerCase().indexOf("ucbrowser")>-1}function _(){for(var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],t=[],n=0;n<e.length;n++)if(!(!e[n].end||e[n].begin<0||e[n].end<0||e[n].end<e[n].begin))if(t.length<1)t.push({begin:e[n].begin,end:e[n].end});else for(var r=0;r<t.length;r++){var i=e[n].begin,o=e[n].end;if(o<t[r].begin){t.splice(r,0,{begin:i,end:o});break}if(!(i>t[r].end)){var a=t[r].begin,s=t[r].end;t[r].begin=Math.min(i,a),t[r].end=Math.max(o,s);break}if(r>t.length-2){t.push({begin:i,end:o});break}}for(var l=0,u=0;u<t.length;u++)l+=t[u].end-t[u].begin;return l}function O(e,t,n,r){e.once(r,(function i(){e.off(t,n),e.off(r,i)}))}function A(e,t,n,r){if(r)e.on(t,n),O(e,t,n,r);else{e.on(t,(function r(i){n(i),e.off(t,r)}))}}function S(e,t,n,r){if(r)e.once(t,n),O(e,t,n,r);else{e.once(t,(function r(i){n(i),e.off(t,r)}))}}function j(e){for(var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:.5,n=[],r=0;r<e.length;r++)n.push({start:e.start(r)<.5?0:e.start(r),end:e.end(r)});n.sort((function(e,t){var n=e.start-t.start;return n||t.end-e.end}));var i=[];if(t)for(var a=0;a<n.length;a++){var s=i.length;if(s){var l=i[s-1].end;n[a].start-l<t?n[a].end>l&&(i[s-1].end=n[a].end):i.push(n[a])}else i.push(n[a])}else i=n;return new o.default(i)}function k(){return!("undefined"==typeof window||void 0===window.document||void 0===window.document.createElement)}function E(e,t,n){var r=e.style;try{r[t]=n}catch(e){r.setProperty(t,n)}}t.PresentationMode={PIP:"picture-in-picture",INLINE:"inline",FULLSCREEN:"fullscreen"};t.util={createDom:a,hasClass:s,addClass:l,removeClass:u,toggleClass:c,findDom:f,padStart:d,format:p,event:g,typeOf:h,deepCopy:v,getBgImage:m,copyDom:y,setInterval:b,clearInterval:x,createImgBtn:w,isWeiXin:L,isUc:C,computeWatchDur:_,offInDestroy:O,on:A,once:S,getBuffered2:j,checkIsBrowser:k,setStyle:E}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}();var i=function(){function e(t){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.bufferedList=t}return r(e,[{key:"start",value:function(e){return this.bufferedList[e].start}},{key:"end",value:function(e){return this.bufferedList[e].end}},{key:"length",get:function(){return this.bufferedList.length}}]),e}();t.default=i,e.exports=t.default},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r={};Object.defineProperty(r,"device",{get:function(){return r.os.isPc?"pc":"mobile"}}),Object.defineProperty(r,"browser",{get:function(){var e=navigator.userAgent.toLowerCase(),t={ie:/rv:([\d.]+)\) like gecko/,firfox:/firefox\/([\d.]+)/,chrome:/chrome\/([\d.]+)/,opera:/opera.([\d.]+)/,safari:/version\/([\d.]+).*safari/};return[].concat(Object.keys(t).filter((function(n){return t[n].test(e)})))[0]||""}}),Object.defineProperty(r,"os",{get:function(){var e=navigator.userAgent,t=/(?:Windows Phone)/.test(e),n=/(?:SymbianOS)/.test(e)||t,r=/(?:Android)/.test(e),i=/(?:Firefox)/.test(e),o=/(?:iPad|PlayBook)/.test(e)||r&&!/(?:Mobile)/.test(e)||i&&/(?:Tablet)/.test(e),a=/(?:iPhone)/.test(e)&&!o;return{isTablet:o,isPhone:a,isAndroid:r,isPc:!(a||r||n||o),isSymbian:n,isWindowsPhone:t,isFireFox:i}}}),t.default=r,e.exports=t.default},function(e,t,n){var r=n(7);"string"==typeof r&&(r=[[e.i,r,""]]);var i={hmr:!0,transform:void 0,insertInto:void 0};n(9)(r,i);r.locals&&(e.exports=r.locals)},function(e,t,n){(e.exports=n(8)(!1)).push([e.i,".xgplayer-skin-default .xgplayer-definition{-webkit-order:5;-moz-box-ordinal-group:6;order:5;width:60px;height:150px;z-index:18;position:relative;outline:none;display:none;cursor:default;margin-left:10px;margin-top:-119px}.xgplayer-skin-default .xgplayer-definition ul{display:none;list-style:none;width:78px;background:rgba(0,0,0,.54);border-radius:1px;position:absolute;bottom:30px;left:0;text-align:center;white-space:nowrap;margin-left:-10px;z-index:26;cursor:pointer}.xgplayer-skin-default .xgplayer-definition ul li{opacity:.7;font-family:PingFangSC-Regular;font-size:11px;color:hsla(0,0%,100%,.8);padding:6px 13px}.xgplayer-skin-default .xgplayer-definition ul li.selected,.xgplayer-skin-default .xgplayer-definition ul li:hover{color:#fff;opacity:1}.xgplayer-skin-default .xgplayer-definition .name{text-align:center;font-family:PingFangSC-Regular;font-size:13px;cursor:pointer;color:hsla(0,0%,100%,.8);position:absolute;bottom:0;width:60px;height:20px;line-height:20px;background:rgba(0,0,0,.38);border-radius:10px;display:inline-block;vertical-align:middle}.xgplayer-skin-default.xgplayer-definition-active .xgplayer-definition ul,.xgplayer-skin-default.xgplayer-is-definition .xgplayer-definition{display:block}",""])},function(e,t){e.exports=function(e){var t=[];return t.toString=function(){return this.map((function(t){var n=function(e,t){var n=e[1]||"",r=e[3];if(!r)return n;if(t&&"function"==typeof btoa){var i=(a=r,"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(a))))+" */"),o=r.sources.map((function(e){return"/*# sourceURL="+r.sourceRoot+e+" */"}));return[n].concat(o).concat([i]).join("\n")}var a;return[n].join("\n")}(t,e);return t[2]?"@media "+t[2]+"{"+n+"}":n})).join("")},t.i=function(e,n){"string"==typeof e&&(e=[[null,e,""]]);for(var r={},i=0;i<this.length;i++){var o=this[i][0];"number"==typeof o&&(r[o]=!0)}for(i=0;i<e.length;i++){var a=e[i];"number"==typeof a[0]&&r[a[0]]||(n&&!a[2]?a[2]=n:n&&(a[2]="("+a[2]+") and ("+n+")"),t.push(a))}},t}},function(e,t,n){var r,i,o={},a=(r=function(){return window&&document&&document.all&&!window.atob},function(){return void 0===i&&(i=r.apply(this,arguments)),i}),s=function(e){return document.querySelector(e)},l=function(e){var t={};return function(e){if("function"==typeof e)return e();if(void 0===t[e]){var n=s.call(this,e);if(window.HTMLIFrameElement&&n instanceof window.HTMLIFrameElement)try{n=n.contentDocument.head}catch(e){n=null}t[e]=n}return t[e]}}(),u=null,c=0,f=[],d=n(10);function p(e,t){for(var n=0;n<e.length;n++){var r=e[n],i=o[r.id];if(i){i.refs++;for(var a=0;a<i.parts.length;a++)i.parts[a](r.parts[a]);for(;a<r.parts.length;a++)i.parts.push(b(r.parts[a],t))}else{var s=[];for(a=0;a<r.parts.length;a++)s.push(b(r.parts[a],t));o[r.id]={id:r.id,refs:1,parts:s}}}}function g(e,t){for(var n=[],r={},i=0;i<e.length;i++){var o=e[i],a=t.base?o[0]+t.base:o[0],s={css:o[1],media:o[2],sourceMap:o[3]};r[a]?r[a].parts.push(s):n.push(r[a]={id:a,parts:[s]})}return n}function h(e,t){var n=l(e.insertInto);if(!n)throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");var r=f[f.length-1];if("top"===e.insertAt)r?r.nextSibling?n.insertBefore(t,r.nextSibling):n.appendChild(t):n.insertBefore(t,n.firstChild),f.push(t);else if("bottom"===e.insertAt)n.appendChild(t);else{if("object"!=typeof e.insertAt||!e.insertAt.before)throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");var i=l(e.insertInto+" "+e.insertAt.before);n.insertBefore(t,i)}}function v(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e);var t=f.indexOf(e);t>=0&&f.splice(t,1)}function m(e){var t=document.createElement("style");return e.attrs.type="text/css",y(t,e.attrs),h(e,t),t}function y(e,t){Object.keys(t).forEach((function(n){e.setAttribute(n,t[n])}))}function b(e,t){var n,r,i,o;if(t.transform&&e.css){if(!(o=t.transform(e.css)))return function(){};e.css=o}if(t.singleton){var a=c++;n=u||(u=m(t)),r=L.bind(null,n,a,!1),i=L.bind(null,n,a,!0)}else e.sourceMap&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&"function"==typeof URL.revokeObjectURL&&"function"==typeof Blob&&"function"==typeof btoa?(n=function(e){var t=document.createElement("link");return e.attrs.type="text/css",e.attrs.rel="stylesheet",y(t,e.attrs),h(e,t),t}(t),r=_.bind(null,n,t),i=function(){v(n),n.href&&URL.revokeObjectURL(n.href)}):(n=m(t),r=C.bind(null,n),i=function(){v(n)});return r(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap)return;r(e=t)}else i()}}e.exports=function(e,t){if("undefined"!=typeof DEBUG&&DEBUG&&"object"!=typeof document)throw new Error("The style-loader cannot be used in a non-browser environment");(t=t||{}).attrs="object"==typeof t.attrs?t.attrs:{},t.singleton||"boolean"==typeof t.singleton||(t.singleton=a()),t.insertInto||(t.insertInto="head"),t.insertAt||(t.insertAt="bottom");var n=g(e,t);return p(n,t),function(e){for(var r=[],i=0;i<n.length;i++){var a=n[i];(s=o[a.id]).refs--,r.push(s)}e&&p(g(e,t),t);for(i=0;i<r.length;i++){var s;if(0===(s=r[i]).refs){for(var l=0;l<s.parts.length;l++)s.parts[l]();delete o[s.id]}}}};var x,w=(x=[],function(e,t){return x[e]=t,x.filter(Boolean).join("\n")});function L(e,t,n,r){var i=n?"":r.css;if(e.styleSheet)e.styleSheet.cssText=w(t,i);else{var o=document.createTextNode(i),a=e.childNodes;a[t]&&e.removeChild(a[t]),a.length?e.insertBefore(o,a[t]):e.appendChild(o)}}function C(e,t){var n=t.css,r=t.media;if(r&&e.setAttribute("media",r),e.styleSheet)e.styleSheet.cssText=n;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(n))}}function _(e,t,n){var r=n.css,i=n.sourceMap,o=void 0===t.convertToAbsoluteUrls&&i;(t.convertToAbsoluteUrls||o)&&(r=d(r)),i&&(r+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(i))))+" */");var a=new Blob([r],{type:"text/css"}),s=e.href;e.href=URL.createObjectURL(a),s&&URL.revokeObjectURL(s)}},function(e,t){e.exports=function(e){var t="undefined"!=typeof window&&window.location;if(!t)throw new Error("fixUrls requires window.location");if(!e||"string"!=typeof e)return e;var n=t.protocol+"//"+t.host,r=n+t.pathname.replace(/\/[^\/]*$/,"/");return e.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi,(function(e,t){var i,o=t.trim().replace(/^"(.*)"$/,(function(e,t){return t})).replace(/^'(.*)'$/,(function(e,t){return t}));return/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(o)?e:(i=0===o.indexOf("//")?o:0===o.indexOf("/")?n+o:r+o.replace(/^\.\//,""),"url("+JSON.stringify(i)+")")}))}}]);