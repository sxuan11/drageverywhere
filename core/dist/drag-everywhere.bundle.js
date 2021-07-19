!function(){"use strict";var t={187:function(t){var e,i="object"==typeof Reflect?Reflect:null,r=i&&"function"==typeof i.apply?i.apply:function(t,e,i){return Function.prototype.apply.call(t,e,i)};e=i&&"function"==typeof i.ownKeys?i.ownKeys:Object.getOwnPropertySymbols?function(t){return Object.getOwnPropertyNames(t).concat(Object.getOwnPropertySymbols(t))}:function(t){return Object.getOwnPropertyNames(t)};var n=Number.isNaN||function(t){return t!=t};function s(){s.init.call(this)}t.exports=s,t.exports.once=function(t,e){return new Promise((function(i,r){function n(i){t.removeListener(e,s),r(i)}function s(){"function"==typeof t.removeListener&&t.removeListener("error",n),i([].slice.call(arguments))}f(t,e,s,{once:!0}),"error"!==e&&function(t,e,i){"function"==typeof t.on&&f(t,"error",e,{once:!0})}(t,n)}))},s.EventEmitter=s,s.prototype._events=void 0,s.prototype._eventsCount=0,s.prototype._maxListeners=void 0;var o=10;function h(t){if("function"!=typeof t)throw new TypeError('The "listener" argument must be of type Function. Received type '+typeof t)}function a(t){return void 0===t._maxListeners?s.defaultMaxListeners:t._maxListeners}function d(t,e,i,r){var n,s,o,d;if(h(i),void 0===(s=t._events)?(s=t._events=Object.create(null),t._eventsCount=0):(void 0!==s.newListener&&(t.emit("newListener",e,i.listener?i.listener:i),s=t._events),o=s[e]),void 0===o)o=s[e]=i,++t._eventsCount;else if("function"==typeof o?o=s[e]=r?[i,o]:[o,i]:r?o.unshift(i):o.push(i),(n=a(t))>0&&o.length>n&&!o.warned){o.warned=!0;var l=new Error("Possible EventEmitter memory leak detected. "+o.length+" "+String(e)+" listeners added. Use emitter.setMaxListeners() to increase limit");l.name="MaxListenersExceededWarning",l.emitter=t,l.type=e,l.count=o.length,d=l,console&&console.warn&&console.warn(d)}return t}function l(){if(!this.fired)return this.target.removeListener(this.type,this.wrapFn),this.fired=!0,0===arguments.length?this.listener.call(this.target):this.listener.apply(this.target,arguments)}function g(t,e,i){var r={fired:!1,wrapFn:void 0,target:t,type:e,listener:i},n=l.bind(r);return n.listener=i,r.wrapFn=n,n}function c(t,e,i){var r=t._events;if(void 0===r)return[];var n=r[e];return void 0===n?[]:"function"==typeof n?i?[n.listener||n]:[n]:i?function(t){for(var e=new Array(t.length),i=0;i<e.length;++i)e[i]=t[i].listener||t[i];return e}(n):u(n,n.length)}function p(t){var e=this._events;if(void 0!==e){var i=e[t];if("function"==typeof i)return 1;if(void 0!==i)return i.length}return 0}function u(t,e){for(var i=new Array(e),r=0;r<e;++r)i[r]=t[r];return i}function f(t,e,i,r){if("function"==typeof t.on)r.once?t.once(e,i):t.on(e,i);else{if("function"!=typeof t.addEventListener)throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type '+typeof t);t.addEventListener(e,(function n(s){r.once&&t.removeEventListener(e,n),i(s)}))}}Object.defineProperty(s,"defaultMaxListeners",{enumerable:!0,get:function(){return o},set:function(t){if("number"!=typeof t||t<0||n(t))throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received '+t+".");o=t}}),s.init=function(){void 0!==this._events&&this._events!==Object.getPrototypeOf(this)._events||(this._events=Object.create(null),this._eventsCount=0),this._maxListeners=this._maxListeners||void 0},s.prototype.setMaxListeners=function(t){if("number"!=typeof t||t<0||n(t))throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received '+t+".");return this._maxListeners=t,this},s.prototype.getMaxListeners=function(){return a(this)},s.prototype.emit=function(t){for(var e=[],i=1;i<arguments.length;i++)e.push(arguments[i]);var n="error"===t,s=this._events;if(void 0!==s)n=n&&void 0===s.error;else if(!n)return!1;if(n){var o;if(e.length>0&&(o=e[0]),o instanceof Error)throw o;var h=new Error("Unhandled error."+(o?" ("+o.message+")":""));throw h.context=o,h}var a=s[t];if(void 0===a)return!1;if("function"==typeof a)r(a,this,e);else{var d=a.length,l=u(a,d);for(i=0;i<d;++i)r(l[i],this,e)}return!0},s.prototype.addListener=function(t,e){return d(this,t,e,!1)},s.prototype.on=s.prototype.addListener,s.prototype.prependListener=function(t,e){return d(this,t,e,!0)},s.prototype.once=function(t,e){return h(e),this.on(t,g(this,t,e)),this},s.prototype.prependOnceListener=function(t,e){return h(e),this.prependListener(t,g(this,t,e)),this},s.prototype.removeListener=function(t,e){var i,r,n,s,o;if(h(e),void 0===(r=this._events))return this;if(void 0===(i=r[t]))return this;if(i===e||i.listener===e)0==--this._eventsCount?this._events=Object.create(null):(delete r[t],r.removeListener&&this.emit("removeListener",t,i.listener||e));else if("function"!=typeof i){for(n=-1,s=i.length-1;s>=0;s--)if(i[s]===e||i[s].listener===e){o=i[s].listener,n=s;break}if(n<0)return this;0===n?i.shift():function(t,e){for(;e+1<t.length;e++)t[e]=t[e+1];t.pop()}(i,n),1===i.length&&(r[t]=i[0]),void 0!==r.removeListener&&this.emit("removeListener",t,o||e)}return this},s.prototype.off=s.prototype.removeListener,s.prototype.removeAllListeners=function(t){var e,i,r;if(void 0===(i=this._events))return this;if(void 0===i.removeListener)return 0===arguments.length?(this._events=Object.create(null),this._eventsCount=0):void 0!==i[t]&&(0==--this._eventsCount?this._events=Object.create(null):delete i[t]),this;if(0===arguments.length){var n,s=Object.keys(i);for(r=0;r<s.length;++r)"removeListener"!==(n=s[r])&&this.removeAllListeners(n);return this.removeAllListeners("removeListener"),this._events=Object.create(null),this._eventsCount=0,this}if("function"==typeof(e=i[t]))this.removeListener(t,e);else if(void 0!==e)for(r=e.length-1;r>=0;r--)this.removeListener(t,e[r]);return this},s.prototype.listeners=function(t){return c(this,t,!0)},s.prototype.rawListeners=function(t){return c(this,t,!1)},s.listenerCount=function(t,e){return"function"==typeof t.listenerCount?t.listenerCount(e):p.call(t,e)},s.prototype.listenerCount=p,s.prototype.eventNames=function(){return this._eventsCount>0?e(this._events):[]}}},e={};function i(r){var n=e[r];if(void 0!==n)return n.exports;var s=e[r]={exports:{}};return t[r](s,s.exports,i),s.exports}i.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(e,{a:e}),e},i.d=function(t,e){for(var r in e)i.o(e,r)&&!i.o(t,r)&&Object.defineProperty(t,r,{enumerable:!0,get:e[r]})},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})};var r={};!function(){i.r(r),i.d(r,{default:function(){return c}});var t=i(187),e=i.n(t);const n=t=>{if(null===t||"object"!=typeof t)return t;const e=Array.isArray(t)?[]:{};return Object.keys(t).forEach((i=>{e[i]=n(t[i])})),e};function s(t,e){return t.className===e?t:t&&t.parentNode?s(t.parentNode,e):void 0}function o(t,e){if("object"!=typeof e)throw new Error(`${e} must be an object`);if(!function(t){const e=document.createElement("div");try{return e.appendChild(t.cloneNode(!0)),1===t.nodeType}catch{return!1}}(t))throw new Error(`${t} must be a HTMLElement`);for(const[i,r]of Object.entries(e))t.style.setProperty(i,r);return t}function h(t,e){let i=null,r=Date.now();return function(){const n=Date.now(),s=e-(n-r),o=arguments;clearTimeout(i),s<=0?(t.apply(this,o),r=Date.now()):i=setTimeout(t,s)}}function a(t){return t.width||t.right-t.left}function d(t){return t.height||t.bottom-t.top}function l(t,e){return Object.prototype.hasOwnProperty.call(t,e)}class g extends(e()){sourceBox="";dragBox="";dragTargetClassName="";pointX=0;pointY=0;newPointX=0;newPointY=0;realXLength=0;realYLength=0;xLength=0;yLength=0;xelementLength=0;yelementLength=0;draggingElement="";draggingRect="";imgs="";mouseInfo={};dragging=!1;dropdown=!1;putBack=!1;zoom=!1;parentNode="";resizeObserve="";zIndex=5e3;_mirror="";_mirrorRect="";mouseDownEvent="";sourceMap=new Map;dragSourceMap=new Map;listenerStyleMap=new Map;initBoxWidth=300;initBoxHeight="";dragMaxWidth=600;dragMaxHeight=0;dragMinWidth=100;dragMinHeight=0;dragNumber=0;baseStyle={position:"absolute",width:"8px",height:"8px",zIndex:5e3};aspectRatio="16:9";ratio=0;unit="px";parentWidth=0;parentHeight=0;dragBoxInfo={dragBoxNowWidth:0,dragBoxNowHeight:0,dragBoxLeft:0,dragBoxTop:0};direction="";notListener=!0;useWidth=!1;sourceRatio=0;sourceWidth=0;sourceHeight=0;constructor({sourceBox:t,dragBox:e,dragTargetClassName:i,notListener:r,imgs:n,initBoxHeight:s,initBoxWidth:o,dragNumber:h,aspectRatio:a="16:9",dragMinWidth:d,dragMaxWidth:l}){super(),this.sourceBox=t,this.dragBox=e,this.imgs=n,this.dragTargetClassName=i,this.initBoxHeight=s||this.initBoxHeight,this.initBoxWidth=o||this.initBoxWidth,this.dragMaxWidth=l||this.dragMaxWidth,this.dragMinWidth=d||this.dragMinWidth,this.aspectRatio=a,this.dragNumber=h,void 0!==r&&(this.notListener=r),this.searchOriginPoint(this.notListener),this.calculateRatio(),this.notListener?this.startListener():this.startListenerListening()}setZIndex(t){this.zIndex=parseInt(t)}searchOriginPoint(t=!0){const e=document.querySelector(this.dragBox).getBoundingClientRect();this.pointX=e.x,this.pointY=e.y;const{height:i,width:r}=document.body.getBoundingClientRect();this.parentWidth=parseFloat(r.toFixed(2)),this.parentHeight=parseFloat(i.toFixed(2)),this.calculateXYlength(e),t&&(this.isBeyondBoundary(),this.changeWidthAndHeight({height:this.parentHeight,width:this.parentWidth}))}calculateXYlength(t){this.xLength=t.width,this.realXLength=t.width,this.yLength=t.height,this.realYLength=t.height}calculateRatio(){if(this.initBoxHeight)this.ratio=this.initBoxWidth/this.initBoxHeight;else{if(!this.aspectRatio.includes(":"))throw new Error("aspectRatio param must be an X:Y");const t=this.aspectRatio.split(":");this.ratio=t[0]/t[1]}this.calculateMaxAndMinHeight()}calculateMaxAndMinHeight(){this.initBoxHeight||(this.initBoxHeight=this.initBoxWidth/this.ratio),this.dragMaxHeight=this.dragMaxWidth/this.ratio,this.dragMinHeight=this.dragMinWidth/this.ratio}changeWidthAndHeight({height:t,width:e}){this.emit("changeWidthAndHeight",{parentHeight:t,parentWidth:e})}setSourceData(t,e=!1){this.sourceRatio=t.width/t.height,this.sourceHeight=t.height,this.sourceWidth=t.width,this.calculateListenerOriginPoint(e)}isBeyondBoundary(){const t=document.querySelectorAll(".drag-box");let e,i,r,n,s,o,h=0,a=0;for(let d=0;d<t.length;d++)e=parseFloat(t[d].style.transform.substr(10).split(",")[0]),i=parseFloat(t[d].style.width),r=parseFloat(t[d].style.transform.substr(10).split(",")[1]),n=parseFloat(t[d].style.height),s=e+i,o=r+n,this.xLength<s&&(h=s-this.xLength),this.yLength<o&&(a=o-this.yLength),t[d].style.transform=`translate(${e-h}px, ${r-a}px)`,(h>0||a>0)&&this.reportMove({id:this.dragSourceMap.get(t[d].id).id,left:parseFloat(t[d].style.transform.substr(10).split(",")[0]),top:parseFloat(t[d].style.transform.substr(10).split(",")[1]),index:parseInt(t[d].style.zIndex),width:t[d].style.width,height:t[d].style.height}),h=0,a=0}calculateListenerOriginPoint(t=!1){this.searchOriginPoint(!1);let e=this.realXLength/this.sourceRatio,i=this.realYLength*this.sourceRatio;e<this.realYLength&&(this.newPointY=(this.realYLength-e)/2,this.yLength=e,this.xLength=this.realXLength,this.useWidth=!0),i<this.realXLength&&(this.newPointX=(this.realXLength-i)/2,this.xLength=i,this.yLength=this.realYLength,this.useWidth=!1),t&&this.recalculatePixel()}startListener(){document.addEventListener("mousedown",this.handleMouseDown.bind(this)),document.addEventListener("mousemove",this.handleMouseMove.bind(this)),document.addEventListener("mouseup",this.handleMouseUp.bind(this)),this.resizeObserve=new ResizeObserver(h(this.searchOriginPoint.bind(this,this.notListener),1e3)),this.resizeObserve.observe(document.querySelector(this.dragBox))}startListenerListening(){this.resizeObserve=new ResizeObserver(h(this.calculateListenerOriginPoint.bind(this,!0),800)),this.resizeObserve.observe(document.querySelector(this.dragBox))}styleMake(t,e=!1){let i,r;return e?(i=t.clientX-(this.mouseDownEvent.clientX-this._mirrorRect.left),r=t.clientY-(this.mouseDownEvent.clientY-this._mirrorRect.top),{top:r,left:i}):(i=t.clientX-this.pointX-(this.mouseDownEvent.clientX-this.draggingRect.left),r=t.clientY-this.pointY-(this.mouseDownEvent.clientY-this.draggingRect.top),i<0&&(i=0),i>this.xelementLength&&(i=this.xelementLength),r<0&&(r=0),r>this.yelementLength&&(r=this.yelementLength),`translate(${i}px, ${r}px)`)}makeMirrorNode(t){this._mirrorRect=t.getBoundingClientRect(),this._mirror=t.cloneNode(!0);const e={width:a(this._mirrorRect)+"px",height:d(this._mirrorRect)+"px",position:"fixed","z-index":"9999",opacity:".5",top:t.clientY-(t.clientY-this._mirrorRect.top)+"px",left:t.clientX-(t.clientX-this._mirrorRect.left)+"px"};o(this._mirror,e),document.body.appendChild(this._mirror)}mirrorNodeMove(t){const e=this.styleMake(t,!0);this._mirror.style.left=e.left+"px",this._mirror.style.top=e.top+"px",this.isInDragBox(t)?(this._mirror.style.width=this.initBoxWidth+this.unit,this._mirror.style.height=this.initBoxHeight+this.unit):(this._mirror.style.width=a(this._mirrorRect)+"px",this._mirror.style.height=d(this._mirrorRect)+"px")}removeMirrorNode(){document.body.removeChild(this._mirror)}makePlaceholderImg(t=this.draggingElement,e=""){const i=document.createElement("div"),r=document.createElement("img"),n={height:"100%",width:"100%"};o(i,n),o(r,n),r.style.objectFit="cover",r.src=this.imgs,i.appendChild(r);const s="id"+Date.now().toString();i.id=e?e+"-img":s;try{return t.parentNode.replaceChild(i,t),i.id}catch(t){console.log(t)}}isInDragBox(t){if(t.clientX>this.pointX&&t.clientY>this.pointY)return!0}moveDragBox(t){this.isInDragBox(t)?(this.parentNode.style.transform=this.styleMake(t),this.isPutBackDragBox(!1)):this.isPutBackDragBox()}reportMove(t){let e={parentWidth:this.parentWidth,parentHeight:this.parentHeight};Object.keys(t).length?e={...e,...t}:(e={...e,id:this.dragSourceMap.get(this.parentNode.id).id,left:parseFloat(this.parentNode.style.transform.substr(10).split(",")[0]),top:parseFloat(this.parentNode.style.transform.substr(10).split(",")[1]),index:parseInt(this.parentNode.style.zIndex),width:this.parentNode.style.width,height:this.parentNode.style.height},e.width=parseFloat(e.width),e.height=parseFloat(e.height)),this.emit("drag-move",e)}reportZoom(t){let e={parentWidth:this.parentWidth,parentHeight:this.parentHeight};e=Object.keys(t).length?{...e,...t}:{...e,id:this.dragSourceMap.get(this.parentNode.id).id,left:parseFloat(this.parentNode.style.transform.substr(10).split(",")[0]),top:parseFloat(this.parentNode.style.transform.substr(10).split(",")[1]),index:this.parentNode.style.zIndex,width:parseInt(this.parentNode.style.zIndex),height:this.parentNode.style.height},console.log(this.parentNode.style),e.width=parseFloat(e.width),e.height=parseFloat(e.height),this.emit("drag-zoom",e)}isPutBackDragBox(t=!0){this.putBack=t;const e=document.querySelector("#"+this.dragSourceMap.get(this.parentNode.id).imgId);t?(this.parentNode.style.opacity="0",e.style.backgroundColor="#78A7ED",e.style.opacity=".3"):(this.parentNode.style.opacity="",e.style.backgroundColor="",e.style.opacity="")}putBackDragBox(){document.querySelector("#"+this.dragSourceMap.get(this.parentNode.id).imgId).replaceWith(this.parentNode.childNodes[0]),document.querySelector(this.dragBox).removeChild(this.parentNode);const t=this.dragSourceMap.get(this.parentNode.id).id;this.emit("drag-in",{id:t}),this.sourceMap.delete(t),this.dragSourceMap.delete(this.parentNode.id)}insideDrag(t){this.dragging=!0,this.parentNode=s(t.target,"drag-box"),this.draggingRect=this.parentNode.getBoundingClientRect(),this.xelementLength=this.realXLength-this.draggingRect.width,this.yelementLength=this.realYLength-this.draggingRect.height,this.zIndex+=1,this.parentNode.style.zIndex=this.zIndex.toString()}outsideDragIntoInside(t){this.draggingElement=s(t.target,this.dragTargetClassName),this.draggingRect=this.draggingElement.getBoundingClientRect(),this.xelementLength=this.realXLength-this.initBoxWidth,this.yelementLength=this.realYLength-this.initBoxHeight,this.makeMirrorNode(this.draggingElement),this.dropdown=!0}zoomReady(t,e){this.zoom=!0,this.direction=e,this.parentNode=s(t.target,"drag-box"),this.dragBoxInfo.dragBoxNowWidth=parseFloat(this.parentNode.style.width),this.dragBoxInfo.dragBoxNowHeight=parseFloat(this.parentNode.style.height),this.dragBoxInfo.dragBoxLeft=parseFloat(this.parentNode.style.transform.substr(10).split(",")[0]),this.dragBoxInfo.dragBoxTop=parseFloat(this.parentNode.style.transform.substr(10).split(",")[1])}zoomInOut(t){let e,i,r,n,s;switch(e=t.clientX-this.mouseDownEvent.clientX,i=e/this.ratio,this.direction){case"br":r=this.dragBoxInfo.dragBoxNowWidth+e,n=this.dragBoxInfo.dragBoxNowHeight+i,s=this.checkMaxAndMinWidth(r,n),this.parentNode.style.width=s.width+"px",this.parentNode.style.height=s.height+"px";break;case"tl":r=this.dragBoxInfo.dragBoxNowWidth-e,n=this.dragBoxInfo.dragBoxNowHeight-i,s=this.checkMaxAndMinWidth(r,n),this.parentNode.style.width=s.width+"px",this.parentNode.style.height=s.height+"px",s.lock||(this.parentNode.style.transform=`translate(${this.dragBoxInfo.dragBoxLeft+e}px, ${this.dragBoxInfo.dragBoxTop+i}px)`);break;case"tr":r=this.dragBoxInfo.dragBoxNowWidth+e,n=this.dragBoxInfo.dragBoxNowHeight+i,s=this.checkMaxAndMinWidth(r,n),this.parentNode.style.width=s.width+"px",this.parentNode.style.height=s.height+"px",s.lock||(this.parentNode.style.transform=`translate(${this.dragBoxInfo.dragBoxLeft}px, ${this.dragBoxInfo.dragBoxTop-i}px)`);break;case"bl":r=this.dragBoxInfo.dragBoxNowWidth-e,n=this.dragBoxInfo.dragBoxNowHeight-i,s=this.checkMaxAndMinWidth(r,n),this.parentNode.style.width=s.width+"px",this.parentNode.style.height=s.height+"px",s.lock||(this.parentNode.style.transform=`translate(${this.dragBoxInfo.dragBoxLeft+e}px, ${this.dragBoxInfo.dragBoxTop}px)`)}}checkMaxAndMinWidth(t,e){let i={width:t,height:e,lock:!1};return t>this.dragMaxWidth?(i.width=this.dragMaxWidth,i.lock=!0):t<this.dragMinWidth&&(i.width=this.dragMinWidth,i.lock=!0),e>this.dragMaxHeight?(i.height=this.dragMaxHeight,i.lock=!0):e<this.dragMinHeight&&(i.height=this.dragMinHeight,i.lock=!0),i}handleMouseDown(t){if(t.target.id!==this.sourceBox.substr(1))if(this.mouseDownEvent=t,t.preventDefault(),this.putBack=!1,this.dragging=!1,this.zoom=!1,this.mouseInfo.offsetX=t.offsetX,this.mouseInfo.offsetY=t.offsetY,function(t){const e=document.querySelectorAll(".drag-box");if(!e.length)return!1;for(let i=0;i<e.length;i++)if(e[i].contains(t))return!0;return!1}(t.target)){if(l(t.target,"direction"))return void this.zoomReady(t,t.target.direction);this.insideDrag(t)}else if(document.querySelector(this.sourceBox).contains(t.target)){if(this.sourceMap.size+1>this.dragNumber)return void this.emit("dragFull");this.outsideDragIntoInside(t)}}handleMouseMove(t){(this.dragging||this.dropdown||this.zoom)&&(this.dropdown&&this.mirrorNodeMove(t),this.dragging&&this.moveDragBox(t),this.zoom&&this.zoomInOut(t))}handleMouseUp(t){this.dropdown&&this.removeMirrorNode(),this.dropdown&&this.isInDragBox(t)&&this.makeDragBox(t),this.putBack&&this.putBackDragBox(),this.dragging&&!this.putBack&&this.reportMove({}),this.zoom&&this.reportZoom({}),this.dragging=!1,this.dropdown=!1,this.zoom=!1}makeDragBox(t){const e=this.makePlaceholderImg(this.draggingElement,this.draggingElement.id),i=document.querySelector(this.dragBox),r=document.createElement("div");r.className="drag-box",r.appendChild(this.draggingElement);const n={position:"absolute",top:"0px",left:"0px",width:this.initBoxWidth+this.unit,height:this.initBoxHeight+this.unit,transform:this.styleMake(t),"z-index":this.zIndex};o(r,n);const s=this.draggingElement.id+"-drag";r.id=s,this.generateMovePoint(r),i.appendChild(r);const h={drawId:s,imgId:e},a={id:this.draggingElement.id,imgId:e};this.sourceMap.set(this.draggingElement.id,h),this.dragSourceMap.set(s,a),this.emit("drag-out",{id:this.draggingElement.id,left:parseFloat(n.transform.substr(10).split(",")[0]),top:parseFloat(n.transform.substr(10).split(",")[1]),index:parseInt(n["z-index"]),parentWidth:this.parentWidth,parentHeight:this.parentHeight,width:this.initBoxWidth,height:this.initBoxHeight})}convertPixel(t){let e={};if(t.transform){const i=parseFloat(t.transform.substr(10).split(",")[0])/t.parentWidth*this.parentWidth,r=parseFloat(t.transform.substr(10).split(",")[1])/t.parentHeight*this.parentHeight;e.transform=`translate(${i}px, ${r}px)`}if(t.width&&t.height){let i=t.width/t.parentWidth*this.parentWidth;i>this.dragMaxWidth&&(i=this.dragMaxWidth),i<this.dragMinWidth&&(i=this.dragMinWidth),e.width=i+"px",e.height=i/this.ratio+"px"}return e}sourceDrawDragBox(t){const e="object"==typeof t?t:JSON.parse(t),i=document.querySelector("#"+e.id),r=this.makePlaceholderImg(i,e.id),n=document.querySelector(this.dragBox),s=document.createElement("div");s.className="drag-box";const h=e.id+"-drag";s.id=h,s.appendChild(i),o(s,{position:"absolute",top:"0px",left:"0px","z-index":e.index,...this.convertPixel({width:e.width,height:e.height,parentWidth:e.parentWidth,parentHeight:e.parentHeight,transform:`translate(${e.left}px, ${e.top}px)`})}),this.generateMovePoint(s);const a={drawId:h,imgId:r},d={id:e.id,imgId:r};this.sourceMap.set(this.draggingElement.id,a),this.dragSourceMap.set(h,d),n.appendChild(s)}generateMovePoint(t){const e=document.createElement("div");o(e,this.generateMovePointStyle("tl")),e.direction="tl",t.appendChild(e);const i=document.createElement("div");o(i,this.generateMovePointStyle("tr")),i.direction="tr",t.appendChild(i);const r=document.createElement("div");o(r,this.generateMovePointStyle("bl")),r.direction="bl",t.appendChild(r);const n=document.createElement("div");o(n,this.generateMovePointStyle("br")),n.direction="br",t.appendChild(n)}generateMovePointStyle(t){if(!["tl","tr","bl","br"].includes(t))throw new Error(`${t} must be 'tl' or 'tr' or 'bl' or 'br'`);return"tl"===t?{...this.baseStyle,cursor:"nwse-resize",top:"-2px",left:"-2px"}:"tr"===t?{...this.baseStyle,cursor:"nesw-resize",top:"-2px",right:"-2px"}:"bl"===t?{...this.baseStyle,cursor:"nesw-resize",left:"-2px",bottom:"-2px"}:"br"===t?{...this.baseStyle,cursor:"nwse-resize",right:"-2px",bottom:"-2px"}:void 0}convertListenerPixel(t){if(null==t||!Object.keys(t).length)return{};let e,i,r={};t.transform?(e=parseFloat(t.transform.substr(10).split(",")[0]),i=parseFloat(t.transform.substr(10).split(",")[1])):(e=t.left,i=t.top);const n=0===e?0:e/t.parentWidth,s=0===i?0:i/t.parentHeight,o=n*this.xLength,h=s*this.yLength;if(this.useWidth){if((t.transform||l(t,"top")||l(t,"left"))&&(r.transform=`translate(${o}px, ${h+this.newPointY}px)`),t.width&&t.height){const e=t.width/t.parentWidth*this.xLength;r.width=e+"px",r.height=e/this.ratio+"px"}}else if((t.transform||l(t,"top")||l(t,"left"))&&(r.transform=`translate(${o+this.newPointX}px, ${h}px)`),t.width&&t.height){const e=t.height/t.parentHeight*this.yLength;r.width=e*this.ratio+"px",r.height=e+"px"}return t.index&&(r["z-index"]=t.index),r}recalculatePixel(){const t=document.querySelectorAll(".drag-box");for(let e=0;e<t.length;e++)o(t[e],this.convertListenerPixel(this.listenerStyleMap.get(t[e].id)))}listenerDrawDragBox(t){const e="object"==typeof t?t:JSON.parse(t),i=document.querySelector("#"+e.id),r=this.makePlaceholderImg(i,e.id),n=document.querySelector(this.dragBox),s=document.createElement("div");s.className="drag-box",s.id=`${e.id}-drag`,s.appendChild(i);const h={width:e.width,height:e.height,parentWidth:e.parentWidth,parentHeight:e.parentHeight,left:e.left,top:e.top};o(s,{position:"absolute",top:"0px",left:"0px","z-index":e.index,...this.convertListenerPixel(h)}),s.style.transition="transform .8s, width .8s, height .8s";const a={drawId:s.id,imgId:r};this.sourceMap.set(e.id,a),this.listenerStyleMap.set(s.id,h),n.appendChild(s)}listenersUpdateBox(t){const e=n(t),i=this.sourceMap.get(e.id).drawId,r=document.querySelector("#"+i);Object.assign(this.listenerStyleMap.get(i),e),o(r,this.convertListenerPixel(e))}listenersPutBackBox(t){const{drawId:e,imgId:i}=this.sourceMap.get(t),r=document.querySelector("#"+i),n=document.querySelector("#"+e);this.sourceMap.delete(t),this.listenerStyleMap.delete(e),r.replaceWith(n.childNodes[0]),document.querySelector(this.dragBox).removeChild(n)}listenersMoveBox(t){const e=n(t),i=this.sourceMap.get(e.id).drawId,r=document.querySelector("#"+i);Object.assign(this.listenerStyleMap.get(i),e),r.style.transform=this.convertListenerPixel(e).transform}listenersZoomBox(t){const e=n(t),i=this.sourceMap.get(e.id).drawId,r=document.querySelector("#"+i);Object.assign(this.listenerStyleMap.get(i),e),o(r,this.convertListenerPixel(e))}listenersIndexBox(t){const e=n(t),i=this.sourceMap.get(e.id).drawId;document.querySelector("#"+i).style.zIndex=e.index}}var c=g}();var n=exports;for(var s in r)n[s]=r[s];r.__esModule&&Object.defineProperty(n,"__esModule",{value:!0})}();