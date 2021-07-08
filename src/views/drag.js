import EventEmitter from 'events';

/**
 * 判断这个元素是否是HTML节点
 * @param obj
 * @returns {boolean}
 */
function isHTMLElement(obj){
  const e = document.createElement("div");
  try{
    e.appendChild(obj.cloneNode(true));
    return obj.nodeType === 1;
  } catch {
    return false;
  }
}
/**
 * 搜索是否是拖动盒子的子节点
 * @param childNode html节点
 * @returns {boolean}
 */
function reduceSearchClass(childNode) {
  const parentNode = document.querySelectorAll('.drag-box');
  if (!parentNode.length) return false;
  for (let i = 0; i < parentNode.length; i++) {
    if (parentNode[i].contains(childNode)) {
      return true;
    }
  }
  return false;
}

/**
 * 递归查找父节点是否包含某个类名
 * @param element html节点
 * @param className 类名
 * @returns {*}
 */
function findParentNode(element, className) {
  if (element.className === className) {
    return element;
  } else if (element && element.parentNode) {
    return findParentNode(element.parentNode, className);
  }
}

/**
 * 对象转字符串
 * @param object
 * @returns {string}
 */
// eslint-disable-next-line no-unused-vars
function objectToString(object) {
  if (typeof object !== 'object') {
    throw new Error(`${object} must be an object`);
  }
  let str = '';
  for (const [k, v] of Object.entries(object)) {
    str += `${k}: ${v};`;
  }
  return str;
}

function setObjectStyle(element, styleObject) {
  if (typeof styleObject !== 'object') {
    throw new Error(`${styleObject} must be an object`);
  }
  if(!isHTMLElement(element)){
    throw new Error(`${element} must be a HTMLElement`);
  }
  for (const [propertyName, value] of Object.entries(styleObject)) {
    element.style.setProperty(propertyName, value);
  }
  return element;
}

/**
 * 节流函数
 * @param fun
 * @param delay
 * @returns {(function(): void)|*}
 */
function throttle(fun, delay) {
  let timer = null;
  let startTime = Date.now();
  return function() {
    const currentTime = Date.now();
    const remaining = delay - (currentTime - startTime);
    const args = arguments;
    clearTimeout(timer);
    if (remaining <= 0) {
      fun.apply(this, args);
      startTime = Date.now();
    } else {
      timer = setTimeout(fun, remaining);
    }
  };
}

function getRectWidth(rect) { return rect.width || (rect.right - rect.left); }
function getRectHeight(rect) { return rect.height || (rect.bottom - rect.top); }

class Drag extends EventEmitter{
  // 储存的dom元素
  domList=[];
  // 源盒子ID
  sourceBox = '';
  // 被拖入的盒子ID
  dragBox='';
  // 需要寻找的父盒子被拖拽的className
  dragTargetClassName = '';
  // x轴原点
  pointX = 0;
  // y轴原点
  pointY = 0;
  // x轴长度
  xLength = 0;
  // y轴长度
  yLength = 0;
  // x轴减去元素的长度
  xelementLength = 0;
  // y轴减去元素的长度
  yelementLength = 0;
  // 正在拖动的元素
  draggingElement = '';
  // 正在拖动的元素的距离
  draggingRect = '';
  // 被拖入的占位符
  imgs = '';
  // 初次点击的鼠标距离
  mouseInfo = {};
  // 内部拖动
  dragging= false;
  // 外部进内部
  dropdown= false;
  // 内部回到外部
  putBack= false;
  // 放大缩小
  zoom= false;
  // 父节点
  parentNode = '';
  // resize监视器
  resizeObserve = '';
  // 全局zIndex
  zIndex = 5000;
  // 镜像元素
  _mirror = '';
  // 镜像元素的距离
  _mirrorRect = '';
  // 点击鼠标的事件
  mouseDownEvent = '';
  // 拖拽区和源区域的映射关系
  sourceMap = new Map();
  initBoxWidth = '300px';
  initBoxHeight = '172px';
  dragNumber = 0;
  baseStyle = {
    position: 'absolute',
    width: '8px',
    height: '8px',
    zIndex: 5000,
  }

  /**
   * 构造函数
   * @param sourceBox
   * @param dragBox
   * @param dragTargetClassName
   * @param imgs
   * @param initBoxHeight
   * @param initBoxWidth
   * @param dragNumber
   */
  constructor({sourceBox, dragBox, dragTargetClassName, imgs, initBoxHeight ,initBoxWidth, dragNumber}) {
    super();
    this.sourceBox = sourceBox;
    this.dragBox = dragBox;
    this.imgs = imgs;
    this.dragTargetClassName = dragTargetClassName;
    this.initBoxHeight = initBoxHeight ? initBoxHeight : this.initBoxHeight;
    this.initBoxWidth = initBoxWidth ? initBoxWidth : this.initBoxWidth;
    this.dragNumber = dragNumber;
    this.searchOriginPoint();
    this.startListener();
  }

  // 搜索XY的原点坐标
  searchOriginPoint() {
    const result = document.querySelector(this.dragBox).getBoundingClientRect();
    this.pointX = result.x;
    this.pointY = result.y;
    this.calculateXYlength(result);
    this.changeWidthAndHeight();
  }

  // 计算XY的长度
  calculateXYlength(r) {
    this.xLength = r.width;
    this.yLength = r.height;
  }

  changeWidthAndHeight() {
    const { height, width } = document.body.getBoundingClientRect();
    this.emit('changeWidthAndHeight', { height, width })
  }

  // 注册事件
  startListener() {
    document.addEventListener('mousedown', this.handleMouseDown.bind(this));
    document.addEventListener('mousemove', this.handleMouseMove.bind(this));
    document.addEventListener('mouseup', this.handleMouseUp.bind(this));
    this.resizeObserve = new ResizeObserver(throttle(this.searchOriginPoint.bind(this), 500));
    this.resizeObserve.observe(document.querySelector(this.dragBox));
  }

  /**
   * 构建拖动元素的样式
   * @param node html节点
   * @param mirror 是否虚拟元素
   * @returns {string|{top: number, left: number}}
   */
  styleMake(node, mirror = false) {
    let left;
    let top;
    if (mirror) {
      left = node.clientX - (this.mouseDownEvent.clientX - this._mirrorRect.left);
      top = node.clientY - (this.mouseDownEvent.clientY - this._mirrorRect.top);
      return {
        top,
        left
      };
    } else {
      left = node.clientX - this.pointX - (this.mouseDownEvent.clientX - this.draggingRect.left);
      top = node.clientY - this.pointY -  (this.mouseDownEvent.clientY - this.draggingRect.top);
      // if (this.dragging) {
        if (left < 0) {
          left = 0;
        }
        if (left > this.xelementLength) {
          left = this.xelementLength;
        }
        if (top < 0) {
          top = 0;
        }
        if (top > this.yelementLength) {
          top = this.yelementLength;
        }
      // }
      return `translate(${left}px, ${top}px)`;
    }

  }

  // 构建虚拟节点
  makeMirrorNode(node) {
    this._mirrorRect = node.getBoundingClientRect();
    this._mirror = node.cloneNode(true);
    const style = {
      width: getRectWidth(this._mirrorRect) + 'px',
      height : getRectHeight(this._mirrorRect) + 'px',
      position : 'fixed',
      zIndex: '9999',
      opacity: '.5',
      top: (node.clientY - (node.clientY - this._mirrorRect.top)) + 'px',
      left: (node.clientX - (node.clientX - this._mirrorRect.left)) + 'px'
    }
    setObjectStyle(this._mirror, style);
    document.body.appendChild(this._mirror);
  }

  // 虚拟节点移动
  mirrorNodeMove(event) {
    const style = this.styleMake(event, true);
    this._mirror.style.left = style.left + 'px';
    this._mirror.style.top = style.top + 'px';
    if(this.isInDragBox(event)) {
      this._mirror.style.width = this.initBoxWidth;
      this._mirror.style.height = this.initBoxHeight;
    }else {
      this._mirror.style.width = getRectWidth(this._mirrorRect) + 'px';
      this._mirror.style.height = getRectHeight(this._mirrorRect) + 'px';
    }
  }

  // 删除虚拟节点
  removeMirrorNode() {
    document.body.removeChild(this._mirror);
  }

  // 创建拖走后的img
  makePlaceholderImg() {
    const inside = document.createElement('div');
    const img = document.createElement('img');
    const style = {
      height: '100%',
      width: '100%',
    }
    setObjectStyle(inside, style);
    setObjectStyle(img, style);
    img.style.objectFit = 'cover';
    img.src = this.imgs;
    inside.appendChild(img);
    const id ='id' + Date.now().toString();
    inside.id = id;
    try {
      this.draggingElement.parentNode.replaceChild(inside, this.draggingElement);
      return id;
    }catch (e){
      console.log(e)
    }
  }

  setMap(imgId, dragId) {
    this.sourceMap.set(dragId,imgId)
  }

  // 是否在目标拖动的盒子中
  isInDragBox(event) {
    if (event.clientX > this.pointX && event.clientY > this.pointY) {
      return true;
    }
  }

  moveDragBox(event) {
    if(this.isInDragBox(event)){
      this.parentNode.style.transform = this.styleMake(event);
      this.isPutBackDragBox(false)
    }else {
      this.isPutBackDragBox()
    }
  }

  isPutBackDragBox(back=true) {
    this.putBack = back
    const element = document.querySelector('#'+this.sourceMap.get(this.parentNode.id));
    if(back) {
      this.parentNode.style.opacity = '0';
      element.style.backgroundColor = '#78A7ED';
      element.style.opacity = '.3';
    }else {
      this.parentNode.style.opacity = '';
      element.style.backgroundColor = '';
      element.style.opacity = '';
    }
  }

  putBackDragBox() {
    const element = document.querySelector('#'+this.sourceMap.get(this.parentNode.id));
    element.replaceWith(this.parentNode.childNodes[0])
    document.querySelector(this.dragBox).removeChild(this.parentNode);
    this.sourceMap.delete(this.parentNode.id);
  }

  insideDrag(event) {
    this.dragging = true;
    this.parentNode = findParentNode(event.target, 'drag-box');
    this.draggingRect = this.parentNode.getBoundingClientRect();
    this.xelementLength = this.xLength - this.draggingRect.width;
    this.yelementLength = this.yLength - this.draggingRect.height;
    this.zIndex += 1;
    this.parentNode.style.zIndex = this.zIndex;
  }

  outsideDragIntoInside(event) {
    this.draggingElement = findParentNode(event.target, this.dragTargetClassName);
    this.draggingRect = this.draggingElement.getBoundingClientRect();
    this.xelementLength = this.xLength - parseFloat(this.initBoxWidth);
    this.yelementLength = this.yLength - parseFloat(this.initBoxHeight);
    this.makeMirrorNode(this.draggingElement);
    this.dropdown = true;
  }

  zoomInOut() {
    this.zoom= true;
  }

  // 处理鼠标点击事件
  handleMouseDown(event) {
    if (event.target.id === this.sourceBox.substr(1)) return;
    this.mouseDownEvent = event;
    event.preventDefault();
    this.putBack = false;
    this.dragging = false;
    console.log(event, 'handleMouseDown');
    this.mouseInfo.offsetX = event.offsetX;
    this.mouseInfo.offsetY = event.offsetY;
    // 在内部拖拽
    if (reduceSearchClass(event.target)) {
      if(Object.prototype.hasOwnProperty.call(event.target, 'direction')){
        this.zoomInOut(event);
        return;
      }
      this.insideDrag(event)
    } else if (document.querySelector(this.sourceBox).contains(event.target)) {
      // 在外面移入拖拽区
      if((this.sourceMap.size + 1)  > this.dragNumber) {
        this.emit('dragFull')
        return;
      }
      console.log('outside');
      this.outsideDragIntoInside(event);
    }
  }

  // 处理鼠标移动事件
  handleMouseMove(event) {
    if (!this.dragging && !this.dropdown) return;
    if (this.dropdown) {
      this.mirrorNodeMove(event);
    }
    if (this.dragging) {
      this.moveDragBox(event)
    }
  }

  // 处理鼠标松开事件
  handleMouseUp(event) {
    if (this.dropdown) {
      this.removeMirrorNode();
    }
    if (this.dropdown && this.isInDragBox(event)) {
      this.makeDragBox(event)
    }
    if(this.putBack) {
      this.putBackDragBox();
    }
    this.dragging = false;
    this.dropdown = false;
  }

  makeDragBox(event) {
    const inPlaceId = this.makePlaceholderImg();
    const parent = document.querySelector(this.dragBox);
    const element = document.createElement('div');
    element.className = 'drag-box';
    element.appendChild(this.draggingElement);
    const elementStyle = {
      position: 'absolute',
      top: '0px',
      left: '0px',
      width: this.initBoxWidth,
      height: this.initBoxHeight,
      transform : this.styleMake(event),
      zIndex: this.zIndex
    }
    setObjectStyle(element, elementStyle);
    const elementId = inPlaceId + '-drag';
    element.id = elementId
    this.generateMovePoint(element);
    parent.appendChild(element);
    this.setMap(inPlaceId, elementId)
  }

  generateMovePoint(element) {
    const tl = document.createElement('div');
    setObjectStyle(tl, this.generateMovePointStyle('tl'));
    tl.direction = 'tl'
    element.appendChild(tl);
    const tr = document.createElement('div');
    setObjectStyle(tr, this.generateMovePointStyle('tr'));
    tr.direction = 'tr'
    element.appendChild(tr);
    const bl = document.createElement('div');
    setObjectStyle(bl, this.generateMovePointStyle('bl'));
    bl.direction = 'bl'
    element.appendChild(bl);
    const br = document.createElement('div');
    setObjectStyle(br, this.generateMovePointStyle('br'));
    br.direction = 'br'
    element.appendChild(br);
  }

  /**
   *
   * @param direction
   */
  generateMovePointStyle(direction) {
    if(!['tl','tr','bl','br'].includes(direction)){
      throw new Error(`${direction} must be 'tl' or 'tr' or 'bl' or 'br'`)
    }
    if(direction === 'tl') {
      return {
        ...this.baseStyle,
        cursor: 'nwse-resize',
        top: '-2px',
        left: '-2px',
      }
    }
    if(direction === 'tr') {
      return {
        ...this.baseStyle,
        cursor: 'nesw-resize',
        top: '-2px',
        right: '-2px',
      }
    }
    if(direction === 'bl') {
      return {
        ...this.baseStyle,
        cursor: 'nesw-resize',
        left: '-2px',
        bottom: '-2px',
      }
    }
    if(direction === 'br') {
      return {
        ...this.baseStyle,
        cursor: 'nwse-resize',
        right: '-2px',
        bottom: '-2px',
      }
    }
  }
}

export default Drag;
