import EventEmitter from 'events';
import { deepCopy } from './utils/deepCopy'
import { isHTMLElement, hasKey, setObjectStyle, findParentNode ,getRectHeight ,reduceSearchClass ,getRectWidth ,throttle} from './utils'

class Drag extends EventEmitter {
  // 源盒子ID
  sourceBox = '';
  // 被拖入的盒子ID
  dragBox = '';
  // 需要寻找的父盒子被拖拽的className
  dragTargetClassName = '';
  // x轴原点
  pointX = 0;
  // y轴原点
  pointY = 0;
  // 监听者新的x轴原点
  newPointX = 0;
  // 监听者新的y轴原点
  newPointY = 0;
  // 原来的x轴长度
  realXLength = 0;
  // 原来的y轴长度
  realYLength = 0;
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
  dragging = false;
  // 外部进内部
  dropdown = false;
  // 内部回到外部
  putBack = false;
  // 放大缩小
  zoom = false;
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
  dragSourceMap = new Map();
  listenerStyleMap = new Map();
  initBoxWidth = 300;
  initBoxHeight = '';
  dragMaxWidth = 600;
  dragMaxHeight = 0;
  dragMinWidth = 100;
  dragMinHeight = 0;
  dragNumber = 0;
  baseStyle = {
    position: 'absolute',
    width: '8px',
    height: '8px',
    zIndex: 5000,
  };
  aspectRatio = '16:9';
  // 比例
  ratio = 0;
  // 单位
  unit = 'px';
  // 盒子宽度
  parentWidth = 0;
  // 盒子高度
  parentHeight = 0;
  // 拖拉盒子信息
  dragBoxInfo = {
    dragBoxNowWidth: 0,
    dragBoxNowHeight: 0,
    dragBoxLeft: 0,
    dragBoxTop: 0,
  }
  // 拖拉方向
  direction = '';
  // 是否是监听者,默认不是
  notListener = true;
  // 是否是使用宽度来计算比例
  useWidth = false;
  // 源比例
  sourceRatio = 0;
  // 源宽度
  sourceWidth = 0;
  // 源高度
  sourceHeight = 0;

  /**
   * 构造函数
   * @param sourceBox 需要被拖动的父盒子ID
   * @param dragBox 目标拖动区域
   * @param dragTargetClassName 目标拖动元素类名
   * @param notListener 是否不是监听者（默认不是）
   * @param imgs 被拖走元素的占位图
   * @param initBoxHeight 生成拖拽元素的初始高度
   * @param initBoxWidth 生成拖拽元素的初始宽度
   * @param dragNumber 最大的拖拽数量
   * @param aspectRatio 拖拽元素的比例
   * @param dragMinWidth 生成拖拽元素的最小宽度
   * @param dragMaxWidth 生成拖拽元素的最大宽度
   */
  constructor({
                sourceBox,
                dragBox,
                dragTargetClassName,
                notListener,
                imgs,
                initBoxHeight,
                initBoxWidth,
                dragNumber,
                aspectRatio = '16:9',
                dragMinWidth,
                dragMaxWidth
              }) {
    super();
    this.sourceBox = sourceBox;
    this.dragBox = dragBox;
    this.imgs = imgs;
    this.dragTargetClassName = dragTargetClassName;
    this.initBoxHeight = initBoxHeight ? initBoxHeight : this.initBoxHeight;
    this.initBoxWidth = initBoxWidth ? initBoxWidth : this.initBoxWidth;
    this.dragMaxWidth = dragMaxWidth ? dragMaxWidth : this.dragMaxWidth;
    this.dragMinWidth = dragMinWidth ? dragMinWidth : this.dragMinWidth;
    this.aspectRatio = aspectRatio;
    this.dragNumber = dragNumber;
    if (notListener !== undefined) {
      this.notListener = notListener
    }
    this.searchOriginPoint(this.notListener);
    this.calculateRatio();
    if (this.notListener) {
      this.startListener();
    } else {
      this.startListenerListening();
    }
  }

  setZIndex(num) {
    this.zIndex = num;
  }

  // 搜索XY的原点坐标
  searchOriginPoint(emit = true) {
    const result = document.querySelector(this.dragBox).getBoundingClientRect();
    this.pointX = result.x;
    this.pointY = result.y;
    const { height, width } = document.body.getBoundingClientRect();
    this.parentWidth = parseFloat(width.toFixed(2));
    this.parentHeight = parseFloat(height.toFixed(2));
    this.calculateXYlength(result);
    if (emit) {
      this.isBeyondBoundary();
      this.changeWidthAndHeight({height: this.parentHeight, width:  this.parentWidth});
    }
  }

  // 计算XY的长度
  calculateXYlength(r) {
    this.xLength = r.width;
    this.realXLength = r.width;
    this.yLength = r.height;
    this.realYLength = r.height;
  }

  // 计算比例
  calculateRatio() {
    if (this.initBoxHeight) {
      this.ratio = this.initBoxWidth / this.initBoxHeight;
    } else {
      if (!this.aspectRatio.includes(':')) {
        throw new Error(`aspectRatio param must be an X:Y`)
      }
      const result = this.aspectRatio.split(':');
      this.ratio = result[0] / result[1];
    }
    this.calculateMaxAndMinHeight();
  }

  // 计算拖拉盒子的最大和最小宽高
  calculateMaxAndMinHeight() {
    if (!this.initBoxHeight) {
      this.initBoxHeight = this.initBoxWidth / this.ratio;
    }
    this.dragMaxHeight = this.dragMaxWidth / this.ratio;
    this.dragMinHeight = this.dragMinWidth / this.ratio;
  }

  // 窗口宽高发生改变上传事件
  changeWidthAndHeight({height, width}) {
    this.emit('changeWidthAndHeight', {parentHeight: height, parentWidth: width})
  }

  // 设定源信息
  setSourceData(data, recalculate = false) {
    this.sourceRatio = data.width / data.height;
    this.sourceHeight = data.height;
    this.sourceWidth = data.width;
    this.calculateListenerOriginPoint(recalculate)
  }

  // 缩放窗口的时候超出边界
  isBeyondBoundary() {
    const eleList = document.querySelectorAll('.drag-box');
    let xTran, width, yTran, height, xAll, yAll, xDiff = 0, yDiff = 0;
    for (let i = 0; i < eleList.length; i++) {
      xTran = parseFloat(eleList[i].style.transform.substr(10).split(',')[0]);
      width = parseFloat(eleList[i].style.width)
      yTran = parseFloat(eleList[i].style.transform.substr(10).split(',')[1])
      height = parseFloat(eleList[i].style.height)
      xAll = xTran + width;
      yAll = yTran + height;
      if (this.xLength < xAll) {
        xDiff = xAll - this.xLength;
      }
      if (this.yLength < yAll) {
        yDiff = yAll - this.yLength;
      }
      eleList[i].style.transform = `translate(${xTran - xDiff}px, ${yTran - yDiff}px)`;
      if (xDiff > 0 || yDiff > 0) {
        this.reportMove(
          {
            id: this.dragSourceMap.get(eleList[i].id).id,
            left: parseFloat(eleList[i].style.transform.substr(10).split(',')[0]),
            top: parseFloat(eleList[i].style.transform.substr(10).split(',')[1]),
            index: eleList[i].style["z-index"],
            width: eleList[i].style.width,
            height: eleList[i].style.height,
          })
      }
      xDiff = 0;
      yDiff = 0;
    }
  }

  // 改变宽高后重新计算原点
  calculateListenerOriginPoint(recalculate = false) {
    this.searchOriginPoint(false);
    let useWidthCalculateHeight = this.realXLength / this.sourceRatio;
    let useHeightCalculateWidth = this.realYLength * this.sourceRatio;
    if (useWidthCalculateHeight < this.realYLength) {
      this.newPointY = (this.realYLength - useWidthCalculateHeight) / 2;
      this.yLength = useWidthCalculateHeight;
      this.xLength = this.realXLength;
      this.useWidth = true;
    }
    if (useHeightCalculateWidth < this.realXLength) {
      this.newPointX = (this.realXLength - useHeightCalculateWidth) / 2;
      this.xLength = useHeightCalculateWidth;
      this.yLength = this.realYLength;
      this.useWidth = false;
    }
    if (recalculate) {
      this.recalculatePixel()
    }
  }

  // 注册事件
  startListener() {
    document.addEventListener('mousedown', this.handleMouseDown.bind(this));
    document.addEventListener('mousemove', this.handleMouseMove.bind(this));
    document.addEventListener('mouseup', this.handleMouseUp.bind(this));
    this.resizeObserve = new ResizeObserver(throttle(this.searchOriginPoint.bind(this, this.notListener), 1000));
    this.resizeObserve.observe(document.querySelector(this.dragBox));
  }

  // 注册监听者的事件
  startListenerListening() {
    this.resizeObserve = new ResizeObserver(throttle(this.calculateListenerOriginPoint.bind(this, true), 800));
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
      top = node.clientY - this.pointY - (this.mouseDownEvent.clientY - this.draggingRect.top);
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
      height: getRectHeight(this._mirrorRect) + 'px',
      position: 'fixed',
      'z-index': '9999',
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
    if (this.isInDragBox(event)) {
      this._mirror.style.width = this.initBoxWidth + this.unit;
      this._mirror.style.height = this.initBoxHeight + this.unit;
    } else {
      this._mirror.style.width = getRectWidth(this._mirrorRect) + 'px';
      this._mirror.style.height = getRectHeight(this._mirrorRect) + 'px';
    }
  }

  // 删除虚拟节点
  removeMirrorNode() {
    document.body.removeChild(this._mirror);
  }

  // 创建拖走后的img
  makePlaceholderImg(draggingElement = this.draggingElement, drawId = '') {
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
    const id = 'id' + Date.now().toString();
    inside.id = drawId ? drawId + '-img' : id;
    try {
      draggingElement.parentNode.replaceChild(inside, draggingElement);
      return inside.id;
    } catch (e) {
      console.log(e)
    }
  }

  // 是否在目标拖动的盒子中
  isInDragBox(event) {
    if (event.clientX > this.pointX && event.clientY > this.pointY) {
      return true;
    }
  }

  // 移动内部的拖动盒子
  moveDragBox(event) {
    if (this.isInDragBox(event)) {
      this.parentNode.style.transform = this.styleMake(event);
      this.isPutBackDragBox(false)
    } else {
      this.isPutBackDragBox()
    }
  }

  // 上传移动事件
  reportMove(info) {
    let obj = {
      parentWidth: this.parentWidth,
      parentHeight: this.parentHeight,
    }
    if (Object.keys(info).length) {
      obj = {
        ...obj,
        ...info
      }
    } else {
      obj = {
        ...obj,
        id: this.dragSourceMap.get(this.parentNode.id).id,
        left: parseFloat(this.parentNode.style.transform.substr(10).split(',')[0]),
        top: parseFloat(this.parentNode.style.transform.substr(10).split(',')[1]),
        index: this.parentNode.style["z-index"],
        width: this.parentNode.style.width,
        height: this.parentNode.style.height,
      }
      obj.width = parseFloat(obj.width);
      obj.height = parseFloat(obj.height);
    }
    this.emit('drag-move', obj)
  }

  // 上传缩放事件
  reportZoom(info) {
    let obj = {
      parentWidth: this.parentWidth,
      parentHeight: this.parentHeight,
    }
    if (Object.keys(info).length) {
      obj = {
        ...obj,
        ...info
      }
    } else {
      obj = {
        ...obj,
        id: this.dragSourceMap.get(this.parentNode.id).id,
        left: parseFloat(this.parentNode.style.transform.substr(10).split(',')[0]),
        top: parseFloat(this.parentNode.style.transform.substr(10).split(',')[1]),
        index: this.parentNode.style["z-index"],
        width: this.parentNode.style.width,
        height: this.parentNode.style.height,
      }
    }
    obj.width = parseFloat(obj.width);
    obj.height = parseFloat(obj.height);
    this.emit('drag-zoom', obj)
  }

  // 判断当前是否是放回盒子的
  isPutBackDragBox(back = true) {
    this.putBack = back
    const element = document.querySelector('#' + this.dragSourceMap.get(this.parentNode.id).imgId);
    if (back) {
      this.parentNode.style.opacity = '0';
      element.style.backgroundColor = '#78A7ED';
      element.style.opacity = '.3';
    } else {
      this.parentNode.style.opacity = '';
      element.style.backgroundColor = '';
      element.style.opacity = '';
    }
  }

  // 返回拖拽盒子
  putBackDragBox() {
    const element = document.querySelector('#' + this.dragSourceMap.get(this.parentNode.id).imgId);
    element.replaceWith(this.parentNode.childNodes[0])
    document.querySelector(this.dragBox).removeChild(this.parentNode);
    const id = this.dragSourceMap.get(this.parentNode.id).id;
    this.emit('drag-in', {
      id
    });
    this.sourceMap.delete(id);
    this.dragSourceMap.delete(this.parentNode.id);
  }

  // 内部拖拽
  insideDrag(event) {
    this.dragging = true;
    this.parentNode = findParentNode(event.target, 'drag-box');
    this.draggingRect = this.parentNode.getBoundingClientRect();
    this.xelementLength = this.realXLength - this.draggingRect.width;
    this.yelementLength = this.realYLength - this.draggingRect.height;
    this.zIndex += 1;
    this.parentNode.style.zIndex = this.zIndex.toString();
  }

  // 外部拖拽进内部
  outsideDragIntoInside(event) {
    this.draggingElement = findParentNode(event.target, this.dragTargetClassName);
    this.draggingRect = this.draggingElement.getBoundingClientRect();
    this.xelementLength = this.realXLength - this.initBoxWidth;
    this.yelementLength = this.realYLength - this.initBoxHeight;
    this.makeMirrorNode(this.draggingElement);
    this.dropdown = true;
  }

  // 记录放大缩小的值
  zoomReady(event, direction) {
    this.zoom = true;
    this.direction = direction;
    this.parentNode = findParentNode(event.target, 'drag-box');
    this.dragBoxInfo.dragBoxNowWidth = parseFloat(this.parentNode.style.width);
    this.dragBoxInfo.dragBoxNowHeight = parseFloat(this.parentNode.style.height);
    this.dragBoxInfo.dragBoxLeft = parseFloat(this.parentNode.style.transform.substr(10).split(',')[0])
    this.dragBoxInfo.dragBoxTop = parseFloat(this.parentNode.style.transform.substr(10).split(',')[1])
  }

  // 放大缩小处理
  zoomInOut(event) {
    let xOffset, yOffset, nowWidth, nowHeight, result;
    xOffset = event.clientX - this.mouseDownEvent.clientX;
    yOffset = (xOffset) / this.ratio;
    switch (this.direction) {
      case "br":
        nowWidth = this.dragBoxInfo.dragBoxNowWidth + xOffset;
        nowHeight = this.dragBoxInfo.dragBoxNowHeight + yOffset;
        result = this.checkMaxAndMinWidth(nowWidth, nowHeight)
        this.parentNode.style.width = result.width + 'px';
        this.parentNode.style.height = result.height + 'px';
        break;
      case "tl":
        nowWidth = this.dragBoxInfo.dragBoxNowWidth - xOffset;
        nowHeight = this.dragBoxInfo.dragBoxNowHeight - yOffset;
        result = this.checkMaxAndMinWidth(nowWidth, nowHeight);
        this.parentNode.style.width = result.width + 'px';
        this.parentNode.style.height = result.height + 'px';
        if (!result.lock) {
          this.parentNode.style.transform = `translate(${this.dragBoxInfo.dragBoxLeft + xOffset}px, ${this.dragBoxInfo.dragBoxTop + yOffset}px)`;
        }
        break;
      case "tr":
        nowWidth = this.dragBoxInfo.dragBoxNowWidth + xOffset;
        nowHeight = this.dragBoxInfo.dragBoxNowHeight + yOffset;
        result = this.checkMaxAndMinWidth(nowWidth, nowHeight);
        this.parentNode.style.width = result.width + 'px';
        this.parentNode.style.height = result.height + 'px';
        if (!result.lock) {
          this.parentNode.style.transform = `translate(${this.dragBoxInfo.dragBoxLeft}px, ${this.dragBoxInfo.dragBoxTop - yOffset}px)`;
        }
        break;
      case "bl":
        nowWidth = this.dragBoxInfo.dragBoxNowWidth - xOffset;
        nowHeight = this.dragBoxInfo.dragBoxNowHeight - yOffset;
        result = this.checkMaxAndMinWidth(nowWidth, nowHeight);
        this.parentNode.style.width = result.width + 'px';
        this.parentNode.style.height = result.height + 'px';
        if (!result.lock) {
          this.parentNode.style.transform = `translate(${this.dragBoxInfo.dragBoxLeft + xOffset}px, ${this.dragBoxInfo.dragBoxTop}px)`;
        }
        break;
    }
  }

  // 检查放大缩小是否超过了阈值
  checkMaxAndMinWidth(inwidth, inheight) {
    let result = {
      width: inwidth,
      height: inheight,
      lock: false,
    }
    if (inwidth > this.dragMaxWidth) {
      result.width = this.dragMaxWidth;
      result.lock = true;
    } else if (inwidth < this.dragMinWidth) {
      result.width = this.dragMinWidth;
      result.lock = true;
    }
    if (inheight > this.dragMaxHeight) {
      result.height = this.dragMaxHeight;
      result.lock = true;
    } else if (inheight < this.dragMinHeight) {
      result.height = this.dragMinHeight;
      result.lock = true;
    }
    return result;
  }

  // 处理鼠标点击事件
  handleMouseDown(event) {
    if (event.target.id === this.sourceBox.substr(1)) return;
    this.mouseDownEvent = event;
    event.preventDefault();
    this.putBack = false;
    this.dragging = false;
    this.zoom = false;
    this.mouseInfo.offsetX = event.offsetX;
    this.mouseInfo.offsetY = event.offsetY;
    // 在内部拖拽
    if (reduceSearchClass(event.target)) {
      if (hasKey(event.target, 'direction')) {
        this.zoomReady(event, event.target.direction);
        return;
      }
      this.insideDrag(event)
    } else if (document.querySelector(this.sourceBox).contains(event.target)) {
      // 在外面移入拖拽区
      if ((this.sourceMap.size + 1) > this.dragNumber) {
        this.emit('dragFull')
        return;
      }
      this.outsideDragIntoInside(event);
    }
  }

  // 处理鼠标移动事件
  handleMouseMove(event) {
    if (!this.dragging && !this.dropdown && !this.zoom) return;
    if (this.dropdown) {
      this.mirrorNodeMove(event);
    }
    if (this.dragging) {
      this.moveDragBox(event);
    }
    if (this.zoom) {
      this.zoomInOut(event);
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
    if (this.putBack) {
      this.putBackDragBox();
    }
    if (this.dragging && !this.putBack) {
      this.reportMove({});
    }
    if (this.zoom) {
      this.reportZoom({});
    }
    this.dragging = false;
    this.dropdown = false;
    this.zoom = false;
  }

  // 生成拖拉盒子
  makeDragBox(event) {
    const inPlaceId = this.makePlaceholderImg(this.draggingElement, this.draggingElement.id);
    const parent = document.querySelector(this.dragBox);
    const element = document.createElement('div');
    element.className = 'drag-box';
    element.appendChild(this.draggingElement);
    const elementStyle = {
      position: 'absolute',
      top: '0px',
      left: '0px',
      width: this.initBoxWidth + this.unit,
      height: this.initBoxHeight + this.unit,
      transform: this.styleMake(event),
      'z-index': this.zIndex
    }
    setObjectStyle(element, elementStyle);
    const elementId = this.draggingElement.id + '-drag';
    element.id = elementId;
    this.generateMovePoint(element);
    parent.appendChild(element);
    const sourceInfo = {
      drawId: elementId,
      imgId: inPlaceId,
    }
    const dragInfo = {
      id: this.draggingElement.id,
      imgId: inPlaceId,
    }
    this.sourceMap.set(this.draggingElement.id, sourceInfo);
    this.dragSourceMap.set(elementId, dragInfo)
    this.emit('drag-out',
      {
        id: this.draggingElement.id,
        left: parseFloat(elementStyle.transform.substr(10).split(',')[0]),
        top: parseFloat(elementStyle.transform.substr(10).split(',')[1]),
        'z-index': elementStyle["z-index"],
        parentWidth: this.parentWidth,
        parentHeight: this.parentHeight,
        width: this.initBoxWidth,
        height: this.initBoxHeight,
      })
  }

  /**
   * 转换源样式
   * @param style
   * @returns {{}}
   */
  convertPixel(style) {
    let result = {}
    if (style.transform) {
      const dragBoxLeft = (parseFloat(style.transform.substr(10).split(',')[0]) / style.parentWidth) * this.parentWidth;
      const dragBoxTop = (parseFloat(style.transform.substr(10).split(',')[1]) / style.parentHeight) * this.parentHeight;
      result.transform = `translate(${dragBoxLeft}px, ${dragBoxTop}px)`;
    }
    if (style.width && style.height) {
      let width = (style.width / style.parentWidth) * this.parentWidth
      if (width > this.dragMaxWidth) {
        width = this.dragMaxWidth;
      }
      if (width < this.dragMinWidth) {
        width = this.dragMinWidth;
      }
      result.width = width + 'px';
      result.height = width / this.ratio + 'px';
    }
    return result;
  }

  /**
   * 源重新生成拖拉盒子
   * @param data
   * @param data.inPlaceId 占位图ID
   * @param data.drawId 真实拖拽元素ID
   * @param data.id 被拖出的元素ID
   * @param data.width 源的拖动盒子宽度
   * @param data.height 源的拖动盒子高度
   * @param data.parentWidth 源的盒子宽度
   * @param data.parentHeight 源的盒子高度
   * @param data.transform 源的拖动盒子的坐标
   * @param data.z-index 源的拖动盒子的层级
   */
  sourceDrawDragBox(data) {
    const e = typeof data === 'object' ? data : JSON.parse(data);
    const draggingElement = document.querySelector("#" + e.id)
    const imgId = this.makePlaceholderImg(draggingElement, e.id);
    const parent = document.querySelector(this.dragBox);
    const element = document.createElement('div');
    element.className = 'drag-box';
    const elementId = e.id + '-drag';
    element.id = elementId;
    element.appendChild(draggingElement);
    const elementStyle = {
      position: 'absolute',
      top: '0px',
      left: '0px',
      'z-index': e['index'],
      ...this.convertPixel(
        {
          width: e.width,
          height: e.height,
          parentWidth: e.parentWidth,
          parentHeight: e.parentHeight,
          transform: `translate(${e.left}px, ${e.top}px)`,
        })
    }
    setObjectStyle(element, elementStyle);
    this.generateMovePoint(element);
    const sourceInfo = {
      drawId: elementId,
      imgId,
    }
    const dragInfo = {
      id: e.id,
      imgId,
    }
    this.sourceMap.set(this.draggingElement.id, sourceInfo);
    this.dragSourceMap.set(elementId, dragInfo)
    parent.appendChild(element);
  }

  // 生成拖拉点
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
   * 生成拖拉点样式
   * @param direction 方向
   */
  generateMovePointStyle(direction) {
    if (!['tl', 'tr', 'bl', 'br'].includes(direction)) {
      throw new Error(`${direction} must be 'tl' or 'tr' or 'bl' or 'br'`)
    }
    if (direction === 'tl') {
      return {
        ...this.baseStyle,
        cursor: 'nwse-resize',
        top: '-2px',
        left: '-2px',
      }
    }
    if (direction === 'tr') {
      return {
        ...this.baseStyle,
        cursor: 'nesw-resize',
        top: '-2px',
        right: '-2px',
      }
    }
    if (direction === 'bl') {
      return {
        ...this.baseStyle,
        cursor: 'nesw-resize',
        left: '-2px',
        bottom: '-2px',
      }
    }
    if (direction === 'br') {
      return {
        ...this.baseStyle,
        cursor: 'nwse-resize',
        right: '-2px',
        bottom: '-2px',
      }
    }
  }

  /**
   * 转换监听者的像素
   * @param style
   * @returns {{}}
   */
  convertListenerPixel(style) {
    if(style === null || style === undefined || !Object.keys(style).length) return {};
    let result = {}
    let dragBoxLeft, dragBoxTop;
    if(style.transform) {
      dragBoxLeft = parseFloat(style.transform.substr(10).split(',')[0]);
      dragBoxTop = parseFloat(style.transform.substr(10).split(',')[1]);
    } else {
      dragBoxLeft = style.left;
      dragBoxTop = style.top;
    }
    const dragBoxLeftRatio = dragBoxLeft === 0 ? 0 : dragBoxLeft / style.parentWidth;
    const dragBoxTopRatio = dragBoxTop === 0 ? 0 : dragBoxTop / style.parentHeight;
    const left = dragBoxLeftRatio * this.xLength;
    const top = dragBoxTopRatio * this.yLength;
    if (this.useWidth) {
      if (style.transform || hasKey(style, 'top') || hasKey(style, 'left')) {
        result.transform = `translate(${left}px, ${top + (this.newPointY)}px)`;
      }
      if (style.width && style.height) {
        const width = (style.width / style.parentWidth) * this.xLength
        result.width = width + 'px';
        result.height = width / this.ratio + 'px';
      }
    } else {
      if (style.transform || hasKey(style, 'top') || hasKey(style, 'left')) {
        result.transform = `translate(${left + (this.newPointX)}px, ${top}px)`;
      }
      if (style.width && style.height) {
        const height = (style.height / style.parentHeight) * this.yLength
        result.width = height * this.ratio + 'px';
        result.height = height + 'px';
      }
    }
    if(style.index) {
      result['z-index'] = style.index;
    }
    return result;
  }

  /**
   * 改变宽高重新计算像素
   */
  recalculatePixel() {
    const eleList = document.querySelectorAll('.drag-box');
    for (let i = 0; i < eleList.length; i++) {
      setObjectStyle(eleList[i], this.convertListenerPixel(this.listenerStyleMap.get(eleList[i].id)));
    }
  }

  /**
   * 监听者生成拖拉盒子
   * @param data
   * @param data.inPlaceId 占位图ID
   * @param data.drawId 真实拖拽元素ID
   * @param data.id 被拖出的元素ID
   * @param data.width 源的拖动盒子宽度
   * @param data.height 源的拖动盒子高度
   * @param data.parentWidth 源的盒子宽度
   * @param data.parentHeight 源的盒子高度
   * @param data.transform 源的拖动盒子的坐标
   * @param data.z-index 源的拖动盒子的层级
   */
  listenerDrawDragBox(data) {
    const e = typeof data === 'object' ? data : JSON.parse(data);
    const draggingElement = document.querySelector("#" + e.id)
    const imgId = this.makePlaceholderImg(draggingElement, e.id);
    const parent = document.querySelector(this.dragBox);
    const element = document.createElement('div');
    element.className = 'drag-box';
    element.id = `${e.id}-drag`;
    element.appendChild(draggingElement);
    const obj = {
      width: e.width,
      height: e.height,
      parentWidth: e.parentWidth,
      parentHeight: e.parentHeight,
      left: e.left,
      top: e.top,
    }
    const elementStyle = {
      position: 'absolute',
      top: '0px',
      left: '0px',
      'z-index': e['index'],
      ...this.convertListenerPixel(obj)
    }
    setObjectStyle(element, elementStyle);
    element.style.transition = 'transform .8s, width .8s, height .8s';
    const sourceInfo = {
      drawId: element.id,
      imgId
    }
    this.sourceMap.set(e.id, sourceInfo);
    this.listenerStyleMap.set(element.id, obj);
    parent.appendChild(element);
  }

  listenersUpdateBox(data) {
    const info = deepCopy(data);
    const drawId = this.sourceMap.get(info.id).drawId;
    const element = document.querySelector('#' + drawId);
    Object.assign(this.listenerStyleMap.get(drawId), info);
    setObjectStyle(element, this.convertListenerPixel(info));
  }

  /**
   * 监听者放回拖拉盒子
   * @param data
   * @param data.imgId 占位图ID
   * @param data.drawId 真实拖拽元素ID
   */
  listenersPutBackBox(data) {
    const { drawId, imgId } = this.sourceMap.get(data)
    const element = document.querySelector('#' + imgId);
    const sourceElement = document.querySelector('#' + drawId);
    this.sourceMap.delete(data);
    this.listenerStyleMap.delete(drawId)
    element.replaceWith(sourceElement.childNodes[0])
    document.querySelector(this.dragBox).removeChild(sourceElement);
  }

  /**
   * 监听者移动盒子
   * @param data
   * @param data.imgId 占位图ID
   * @param data.drawId 真实拖拽元素ID
   * @param data.transform 最新的拖拽盒子的坐标
   */
  listenersMoveBox(data) {
    const info = deepCopy(data);
    const drawId = this.sourceMap.get(info.id).drawId;
    const element = document.querySelector('#' + drawId);
    Object.assign(this.listenerStyleMap.get(drawId), info);
    element.style.transform = this.convertListenerPixel(info).transform;
  }

  /**
   * 监听者盒子改变大小
   * @param data
   * @param data.imgId 占位图ID
   * @param data.drawId 真实拖拽元素ID
   * @param data.transform 最新的拖拽盒子的坐标
   * @param data.width 最新的拖拽盒子的宽度
   * @param data.height 最新的拖拽盒子的高度
   */
  listenersZoomBox(data) {
    const info = deepCopy(data);
    const drawId = this.sourceMap.get(info.id).drawId;
    const element = document.querySelector('#' + drawId);
    Object.assign(this.listenerStyleMap.get(drawId), info);
    setObjectStyle(element, this.convertListenerPixel(info));
  }

  /**
   * 监听者改变层级
   * @param data
   * @param data.drawId 真实拖拽元素ID
   */
  listenersIndexBox(data) {
    const info = deepCopy(data);
    const drawId = this.sourceMap.get(info.id).drawId;
    const element = document.querySelector('#' + drawId);
    element.style.zIndex = info['index'];
  }
}

export default Drag;
