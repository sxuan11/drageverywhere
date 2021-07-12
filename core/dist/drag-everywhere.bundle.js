!function(){"use strict";var t={187:function(t){var e,i="object"==typeof Reflect?Reflect:null,r=i&&"function"==typeof i.apply?i.apply:function(t,e,i){return Function.prototype.apply.call(t,e,i)};e=i&&"function"==typeof i.ownKeys?i.ownKeys:Object.getOwnPropertySymbols?function(t){return Object.getOwnPropertyNames(t).concat(Object.getOwnPropertySymbols(t))}:function(t){return Object.getOwnPropertyNames(t)};var n=Number.isNaN||function(t){return t!=t};function o(){o.init.call(this)}t.exports=o,t.exports.once=function(t,e){return new Promise((function(i,r){function n(i){t.removeListener(e,o),r(i)}function o(){"function"==typeof t.removeListener&&t.removeListener("error",n),i([].slice.call(arguments))}f(t,e,o,{once:!0}),"error"!==e&&function(t,e,i){"function"==typeof t.on&&f(t,"error",e,{once:!0})}(t,n)}))},o.EventEmitter=o,o.prototype._events=void 0,o.prototype._eventsCount=0,o.prototype._maxListeners=void 0;var s=10;function h(t){if("function"!=typeof t)throw new TypeError('The "listener" argument must be of type Function. Received type '+typeof t)}function a(t){return void 0===t._maxListeners?o.defaultMaxListeners:t._maxListeners}function d(t,e,i,r){var n,o,s,d;if(h(i),void 0===(o=t._events)?(o=t._events=Object.create(null),t._eventsCount=0):(void 0!==o.newListener&&(t.emit("newListener",e,i.listener?i.listener:i),o=t._events),s=o[e]),void 0===s)s=o[e]=i,++t._eventsCount;else if("function"==typeof s?s=o[e]=r?[i,s]:[s,i]:r?s.unshift(i):s.push(i),(n=a(t))>0&&s.length>n&&!s.warned){s.warned=!0;var l=new Error("Possible EventEmitter memory leak detected. "+s.length+" "+String(e)+" listeners added. Use emitter.setMaxListeners() to increase limit");l.name="MaxListenersExceededWarning",l.emitter=t,l.type=e,l.count=s.length,d=l,console&&console.warn&&console.warn(d)}return t}function l(){if(!this.fired)return this.target.removeListener(this.type,this.wrapFn),this.fired=!0,0===arguments.length?this.listener.call(this.target):this.listener.apply(this.target,arguments)}function c(t,e,i){var r={fired:!1,wrapFn:void 0,target:t,type:e,listener:i},n=l.bind(r);return n.listener=i,r.wrapFn=n,n}function g(t,e,i){var r=t._events;if(void 0===r)return[];var n=r[e];return void 0===n?[]:"function"==typeof n?i?[n.listener||n]:[n]:i?function(t){for(var e=new Array(t.length),i=0;i<e.length;++i)e[i]=t[i].listener||t[i];return e}(n):p(n,n.length)}function u(t){var e=this._events;if(void 0!==e){var i=e[t];if("function"==typeof i)return 1;if(void 0!==i)return i.length}return 0}function p(t,e){for(var i=new Array(e),r=0;r<e;++r)i[r]=t[r];return i}function f(t,e,i,r){if("function"==typeof t.on)r.once?t.once(e,i):t.on(e,i);else{if("function"!=typeof t.addEventListener)throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type '+typeof t);t.addEventListener(e,(function n(o){r.once&&t.removeEventListener(e,n),i(o)}))}}Object.defineProperty(o,"defaultMaxListeners",{enumerable:!0,get:function(){return s},set:function(t){if("number"!=typeof t||t<0||n(t))throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received '+t+".");s=t}}),o.init=function(){void 0!==this._events&&this._events!==Object.getPrototypeOf(this)._events||(this._events=Object.create(null),this._eventsCount=0),this._maxListeners=this._maxListeners||void 0},o.prototype.setMaxListeners=function(t){if("number"!=typeof t||t<0||n(t))throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received '+t+".");return this._maxListeners=t,this},o.prototype.getMaxListeners=function(){return a(this)},o.prototype.emit=function(t){for(var e=[],i=1;i<arguments.length;i++)e.push(arguments[i]);var n="error"===t,o=this._events;if(void 0!==o)n=n&&void 0===o.error;else if(!n)return!1;if(n){var s;if(e.length>0&&(s=e[0]),s instanceof Error)throw s;var h=new Error("Unhandled error."+(s?" ("+s.message+")":""));throw h.context=s,h}var a=o[t];if(void 0===a)return!1;if("function"==typeof a)r(a,this,e);else{var d=a.length,l=p(a,d);for(i=0;i<d;++i)r(l[i],this,e)}return!0},o.prototype.addListener=function(t,e){return d(this,t,e,!1)},o.prototype.on=o.prototype.addListener,o.prototype.prependListener=function(t,e){return d(this,t,e,!0)},o.prototype.once=function(t,e){return h(e),this.on(t,c(this,t,e)),this},o.prototype.prependOnceListener=function(t,e){return h(e),this.prependListener(t,c(this,t,e)),this},o.prototype.removeListener=function(t,e){var i,r,n,o,s;if(h(e),void 0===(r=this._events))return this;if(void 0===(i=r[t]))return this;if(i===e||i.listener===e)0==--this._eventsCount?this._events=Object.create(null):(delete r[t],r.removeListener&&this.emit("removeListener",t,i.listener||e));else if("function"!=typeof i){for(n=-1,o=i.length-1;o>=0;o--)if(i[o]===e||i[o].listener===e){s=i[o].listener,n=o;break}if(n<0)return this;0===n?i.shift():function(t,e){for(;e+1<t.length;e++)t[e]=t[e+1];t.pop()}(i,n),1===i.length&&(r[t]=i[0]),void 0!==r.removeListener&&this.emit("removeListener",t,s||e)}return this},o.prototype.off=o.prototype.removeListener,o.prototype.removeAllListeners=function(t){var e,i,r;if(void 0===(i=this._events))return this;if(void 0===i.removeListener)return 0===arguments.length?(this._events=Object.create(null),this._eventsCount=0):void 0!==i[t]&&(0==--this._eventsCount?this._events=Object.create(null):delete i[t]),this;if(0===arguments.length){var n,o=Object.keys(i);for(r=0;r<o.length;++r)"removeListener"!==(n=o[r])&&this.removeAllListeners(n);return this.removeAllListeners("removeListener"),this._events=Object.create(null),this._eventsCount=0,this}if("function"==typeof(e=i[t]))this.removeListener(t,e);else if(void 0!==e)for(r=e.length-1;r>=0;r--)this.removeListener(t,e[r]);return this},o.prototype.listeners=function(t){return g(this,t,!0)},o.prototype.rawListeners=function(t){return g(this,t,!1)},o.listenerCount=function(t,e){return"function"==typeof t.listenerCount?t.listenerCount(e):u.call(t,e)},o.prototype.listenerCount=u,o.prototype.eventNames=function(){return this._eventsCount>0?e(this._events):[]}}},e={};function i(r){var n=e[r];if(void 0!==n)return n.exports;var o=e[r]={exports:{}};return t[r](o,o.exports,i),o.exports}i.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(e,{a:e}),e},i.d=function(t,e){for(var r in e)i.o(e,r)&&!i.o(t,r)&&Object.defineProperty(t,r,{enumerable:!0,get:e[r]})},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})};var r={};!function(){i.r(r);var t=i(187),e=i.n(t);function n(t,e){return t.className===e?t:t&&t.parentNode?n(t.parentNode,e):void 0}function o(t,e){if("object"!=typeof e)throw new Error(`${e} must be an object`);if(!function(t){const e=document.createElement("div");try{return e.appendChild(t.cloneNode(!0)),1===t.nodeType}catch{return!1}}(t))throw new Error(`${t} must be a HTMLElement`);for(const[i,r]of Object.entries(e))t.style.setProperty(i,r);return t}function s(t){return t.width||t.right-t.left}function h(t){return t.height||t.bottom-t.top}class a extends(e()){sourceBox="";dragBox="";dragTargetClassName="";pointX=0;pointY=0;xLength=0;yLength=0;xelementLength=0;yelementLength=0;draggingElement="";draggingRect="";imgs="";mouseInfo={};dragging=!1;dropdown=!1;putBack=!1;zoom=!1;parentNode="";resizeObserve="";zIndex=5e3;_mirror="";_mirrorRect="";mouseDownEvent="";sourceMap=new Map;initBoxWidth=300;initBoxHeight="";dragMaxWidth=600;dragMaxHeight=0;dragMinWidth=100;dragMinHeight=0;dragNumber=0;baseStyle={position:"absolute",width:"8px",height:"8px",zIndex:5e3};aspectRatio="16:9";ratio=0;unit="px";boxWidth=0;boxHeight=0;dragBoxInfo={dragBoxNowWidth:0,dragBoxNowHeight:0,dragBoxLeft:0,dragBoxTop:0};direction="";isListener=!0;constructor({sourceBox:t,dragBox:e,dragTargetClassName:i,isListener:r,imgs:n,initBoxHeight:o,initBoxWidth:s,dragNumber:h,aspectRatio:a="16:9",dragMinWidth:d,dragMaxWidth:l}){super(),this.sourceBox=t,this.dragBox=e,this.imgs=n,this.dragTargetClassName=i,this.initBoxHeight=o||this.initBoxHeight,this.initBoxWidth=s||this.initBoxWidth,this.dragMaxWidth=l||this.dragMaxWidth,this.dragMinWidth=d||this.dragMinWidth,this.aspectRatio=a,this.dragNumber=h,this.searchOriginPoint(),this.calculateLength(),void 0!==r&&(this.isListener=r),this.isListener&&this.startListener()}setZIndex(t){this.zIndex=t}searchOriginPoint(){const t=document.querySelector(this.dragBox).getBoundingClientRect();this.pointX=t.x,this.pointY=t.y,this.calculateXYlength(t),this.changeWidthAndHeight()}calculateXYlength(t){this.xLength=t.width,this.yLength=t.height}calculateLength(){if(this.initBoxHeight)this.ratio=this.initBoxWidth/this.initBoxHeight;else{if(!this.aspectRatio.includes(":"))throw new Error("aspectRatio param must be an X:Y");const t=this.aspectRatio.split(":");this.ratio=t[0]/t[1]}this.calculateHeight()}calculateHeight(){this.initBoxHeight||(this.initBoxHeight=this.initBoxWidth/this.ratio),this.dragMaxHeight=this.dragMaxWidth/this.ratio,this.dragMinHeight=this.dragMinWidth/this.ratio}changeWidthAndHeight(){const{height:t,width:e}=document.body.getBoundingClientRect();this.boxWidth=e,this.boxHeight=t,this.emit("changeWidthAndHeight",{height:t,width:e})}startListener(){document.addEventListener("mousedown",this.handleMouseDown.bind(this)),document.addEventListener("mousemove",this.handleMouseMove.bind(this)),document.addEventListener("mouseup",this.handleMouseUp.bind(this)),this.resizeObserve=new ResizeObserver(function(t,e){let i=null,r=Date.now();return function(){const e=Date.now(),n=500-(e-r),o=arguments;clearTimeout(i),n<=0?(t.apply(this,o),r=Date.now()):i=setTimeout(t,n)}}(this.searchOriginPoint.bind(this))),this.resizeObserve.observe(document.querySelector(this.dragBox))}styleMake(t,e=!1){let i,r;return e?(i=t.clientX-(this.mouseDownEvent.clientX-this._mirrorRect.left),r=t.clientY-(this.mouseDownEvent.clientY-this._mirrorRect.top),{top:r,left:i}):(i=t.clientX-this.pointX-(this.mouseDownEvent.clientX-this.draggingRect.left),r=t.clientY-this.pointY-(this.mouseDownEvent.clientY-this.draggingRect.top),i<0&&(i=0),i>this.xelementLength&&(i=this.xelementLength),r<0&&(r=0),r>this.yelementLength&&(r=this.yelementLength),`translate(${i}px, ${r}px)`)}makeMirrorNode(t){this._mirrorRect=t.getBoundingClientRect(),this._mirror=t.cloneNode(!0);const e={width:s(this._mirrorRect)+"px",height:h(this._mirrorRect)+"px",position:"fixed","z-index":"9999",opacity:".5",top:t.clientY-(t.clientY-this._mirrorRect.top)+"px",left:t.clientX-(t.clientX-this._mirrorRect.left)+"px"};o(this._mirror,e),document.body.appendChild(this._mirror)}mirrorNodeMove(t){const e=this.styleMake(t,!0);this._mirror.style.left=e.left+"px",this._mirror.style.top=e.top+"px",this.isInDragBox(t)?(this._mirror.style.width=this.initBoxWidth+this.unit,this._mirror.style.height=this.initBoxHeight+this.unit):(this._mirror.style.width=s(this._mirrorRect)+"px",this._mirror.style.height=h(this._mirrorRect)+"px")}removeMirrorNode(){document.body.removeChild(this._mirror)}makePlaceholderImg(t=this.draggingElement,e=""){const i=document.createElement("div"),r=document.createElement("img"),n={height:"100%",width:"100%"};o(i,n),o(r,n),r.style.objectFit="cover",r.src=this.imgs,i.appendChild(r);const s="id"+Date.now().toString();i.id=e||s;try{return t.parentNode.replaceChild(i,t),s}catch(t){console.log(t)}}setMap(t,e){this.sourceMap.set(e,t)}isInDragBox(t){if(t.clientX>this.pointX&&t.clientY>this.pointY)return!0}moveDragBox(t){this.isInDragBox(t)?(this.parentNode.style.transform=this.styleMake(t),this.isPutBackDragBox(!1)):this.isPutBackDragBox()}reportMove(){this.emit("drag-move",{drawId:this.parentNode.id,transform:this.parentNode.style.transform,boxWidth:this.boxWidth,boxHeight:this.boxHeight})}reportZoom(){this.emit("drag-zoom",{drawId:this.parentNode.id,transform:this.parentNode.style.transform,width:parseFloat(this.parentNode.style.width),height:parseFloat(this.parentNode.style.height),boxWidth:this.boxWidth,boxHeight:this.boxHeight})}isPutBackDragBox(t=!0){this.putBack=t;const e=document.querySelector("#"+this.sourceMap.get(this.parentNode.id));t?(this.parentNode.style.opacity="0",e.style.backgroundColor="#78A7ED",e.style.opacity=".3"):(this.parentNode.style.opacity="",e.style.backgroundColor="",e.style.opacity="")}putBackDragBox(){document.querySelector("#"+this.sourceMap.get(this.parentNode.id)).replaceWith(this.parentNode.childNodes[0]),document.querySelector(this.dragBox).removeChild(this.parentNode),this.emit("drag-in",{imgId:this.sourceMap.get(this.parentNode.id),drawId:this.parentNode.id}),this.sourceMap.delete(this.parentNode.id)}insideDrag(t){this.dragging=!0,this.parentNode=n(t.target,"drag-box"),this.draggingRect=this.parentNode.getBoundingClientRect(),this.xelementLength=this.xLength-this.draggingRect.width,this.yelementLength=this.yLength-this.draggingRect.height,this.zIndex+=1,this.parentNode.style.zIndex=this.zIndex,this.emit("drag-index",{drawId:this.parentNode.id,"z-index":this.zIndex})}outsideDragIntoInside(t){this.draggingElement=n(t.target,this.dragTargetClassName),this.draggingRect=this.draggingElement.getBoundingClientRect(),this.xelementLength=this.xLength-this.initBoxWidth,this.yelementLength=this.yLength-this.initBoxHeight,this.makeMirrorNode(this.draggingElement),this.dropdown=!0}zoomReady(t,e){this.zoom=!0,this.direction=e,this.parentNode=n(t.target,"drag-box"),this.dragBoxInfo.dragBoxNowWidth=parseFloat(this.parentNode.style.width),this.dragBoxInfo.dragBoxNowHeight=parseFloat(this.parentNode.style.height),this.dragBoxInfo.dragBoxLeft=parseFloat(this.parentNode.style.transform.substr(10).split(",")[0]),this.dragBoxInfo.dragBoxTop=parseFloat(this.parentNode.style.transform.substr(10).split(",")[1])}zoomInOut(t){let e,i,r,n,o;switch(e=t.clientX-this.mouseDownEvent.clientX,i=e/this.ratio,this.direction){case"br":r=this.dragBoxInfo.dragBoxNowWidth+e,n=this.dragBoxInfo.dragBoxNowHeight+i,o=this.checkMaxAndMinWidth(r,n),this.parentNode.style.width=o.width+"px",this.parentNode.style.height=o.height+"px";break;case"tl":r=this.dragBoxInfo.dragBoxNowWidth-e,n=this.dragBoxInfo.dragBoxNowHeight-i,o=this.checkMaxAndMinWidth(r,n),this.parentNode.style.width=o.width+"px",this.parentNode.style.height=o.height+"px",o.lock||(this.parentNode.style.transform=`translate(${this.dragBoxInfo.dragBoxLeft+e}px, ${this.dragBoxInfo.dragBoxTop+i}px)`);break;case"tr":r=this.dragBoxInfo.dragBoxNowWidth+e,n=this.dragBoxInfo.dragBoxNowHeight+i,o=this.checkMaxAndMinWidth(r,n),this.parentNode.style.width=o.width+"px",this.parentNode.style.height=o.height+"px",o.lock||(this.parentNode.style.transform=`translate(${this.dragBoxInfo.dragBoxLeft}px, ${this.dragBoxInfo.dragBoxTop-i}px)`);break;case"bl":r=this.dragBoxInfo.dragBoxNowWidth-e,n=this.dragBoxInfo.dragBoxNowHeight-i,o=this.checkMaxAndMinWidth(r,n),this.parentNode.style.width=o.width+"px",this.parentNode.style.height=o.height+"px",o.lock||(this.parentNode.style.transform=`translate(${this.dragBoxInfo.dragBoxLeft+e}px, ${this.dragBoxInfo.dragBoxTop}px)`)}}checkMaxAndMinWidth(t,e){let i={width:t,height:e,lock:!1};return t>this.dragMaxWidth?(i.width=this.dragMaxWidth,i.lock=!0):t<this.dragMinWidth&&(i.width=this.dragMinWidth,i.lock=!0),e>this.dragMaxHeight?(i.height=this.dragMaxHeight,i.lock=!0):e<this.dragMinHeight&&(i.height=this.dragMinHeight,i.lock=!0),i}handleMouseDown(t){if(t.target.id!==this.sourceBox.substr(1))if(this.mouseDownEvent=t,t.preventDefault(),this.putBack=!1,this.dragging=!1,this.zoom=!1,this.mouseInfo.offsetX=t.offsetX,this.mouseInfo.offsetY=t.offsetY,function(t){const e=document.querySelectorAll(".drag-box");if(!e.length)return!1;for(let i=0;i<e.length;i++)if(e[i].contains(t))return!0;return!1}(t.target)){if(Object.prototype.hasOwnProperty.call(t.target,"direction"))return void this.zoomReady(t,t.target.direction);this.insideDrag(t)}else if(document.querySelector(this.sourceBox).contains(t.target)){if(this.sourceMap.size+1>this.dragNumber)return void this.emit("dragFull");this.outsideDragIntoInside(t)}}handleMouseMove(t){(this.dragging||this.dropdown||this.zoom)&&(this.dropdown&&this.mirrorNodeMove(t),this.dragging&&this.moveDragBox(t),this.zoom&&this.zoomInOut(t))}handleMouseUp(t){this.dropdown&&this.removeMirrorNode(),this.dropdown&&this.isInDragBox(t)&&this.makeDragBox(t),this.putBack&&this.putBackDragBox(),this.dragging&&!this.putBack&&this.reportMove(),this.zoom&&this.reportZoom(),this.dragging=!1,this.dropdown=!1,this.zoom=!1}makeDragBox(t){const e=this.makePlaceholderImg(),i=document.querySelector(this.dragBox),r=document.createElement("div");r.className="drag-box",r.appendChild(this.draggingElement);const n={position:"absolute",top:"0px",left:"0px",width:this.initBoxWidth+this.unit,height:this.initBoxHeight+this.unit,transform:this.styleMake(t),"z-index":this.zIndex};o(r,n);const s=e+"-drag";r.id=s,this.generateMovePoint(r),i.appendChild(r),this.setMap(e,s),this.emit("drag-out",{id:this.draggingElement.id,transform:n.transform,"z-index":n["z-index"],boxWidth:this.boxWidth,boxHeight:this.boxHeight,width:this.initBoxWidth,height:this.initBoxHeight,drawId:s,inPlaceId:e})}convertListenerPixel(t){let e={};if(t.transform){const i=parseFloat(t.transform.substr(10).split(",")[0])/t.boxWidth*this.boxWidth,r=parseFloat(t.transform.substr(10).split(",")[1])/t.boxHeight*this.boxHeight;e.transform=`translate(${i}px, ${r}px)`}return t.width&&(e.width=t.width/t.boxWidth*this.boxWidth+"px"),t.height&&(e.height=t.height/t.boxHeight*this.boxHeight+"px"),e}listenerDrawDragBox(t,e=!1){const i="object"==typeof t?t:JSON.parse(t),r=document.querySelector("#"+i.id);this.makePlaceholderImg(r,t.inPlaceId);const n=document.querySelector(this.dragBox),s=document.createElement("div");s.className="drag-box",s.id=t.drawId,s.appendChild(r),o(s,{position:"absolute",top:"0px",left:"0px","z-index":i["z-index"],...this.convertListenerPixel({width:i.width,height:i.height,boxWidth:i.boxWidth,boxHeight:i.boxHeight,transform:i.transform})}),e&&(this.generateMovePoint(s),this.setMap(t.inPlaceId,t.drawId)),n.appendChild(s)}listenersPutBackBox(t){const e=document.querySelector("#"+t.imgId),i=document.querySelector("#"+t.drawId);e.replaceWith(i.childNodes[0]),document.querySelector(this.dragBox).removeChild(i)}listenersMoveBox(t){const e=document.querySelector("#"+t.drawId);e.style.transition="transform .8s",e.style.transform=this.convertListenerPixel(t).transform}listenersZoomBox(t){const e=document.querySelector("#"+t.drawId);e.style.transition="transform .8s, width .8s, height .8s",e.style.transform=this.convertListenerPixel(t).transform,e.style.width=this.convertListenerPixel(t).width,e.style.height=this.convertListenerPixel(t).height}listenersIndexBox(t){document.querySelector("#"+t.drawId).style.zIndex=t["z-index"]}generateMovePoint(t){const e=document.createElement("div");o(e,this.generateMovePointStyle("tl")),e.direction="tl",t.appendChild(e);const i=document.createElement("div");o(i,this.generateMovePointStyle("tr")),i.direction="tr",t.appendChild(i);const r=document.createElement("div");o(r,this.generateMovePointStyle("bl")),r.direction="bl",t.appendChild(r);const n=document.createElement("div");o(n,this.generateMovePointStyle("br")),n.direction="br",t.appendChild(n)}generateMovePointStyle(t){if(!["tl","tr","bl","br"].includes(t))throw new Error(`${t} must be 'tl' or 'tr' or 'bl' or 'br'`);return"tl"===t?{...this.baseStyle,cursor:"nwse-resize",top:"-2px",left:"-2px"}:"tr"===t?{...this.baseStyle,cursor:"nesw-resize",top:"-2px",right:"-2px"}:"bl"===t?{...this.baseStyle,cursor:"nesw-resize",left:"-2px",bottom:"-2px"}:"br"===t?{...this.baseStyle,cursor:"nwse-resize",right:"-2px",bottom:"-2px"}:void 0}}r.default=a}();var n=exports;for(var o in r)n[o]=r[o];r.__esModule&&Object.defineProperty(n,"__esModule",{value:!0})}();