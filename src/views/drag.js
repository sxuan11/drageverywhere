// eslint-disable-next-line no-unused-vars
/**
 * 搜索是否是拖动盒子的子节点
 * @param childNode html节点
 * @returns {boolean}
 */
function reduceSearchClass(childNode) {
  const parentNode = document.querySelectorAll('.drag-box');
  if (!parentNode.length) return false;
  for (let i = 0 ; i<parentNode.length ; i++){
    if (parentNode[i].contains(childNode)){
      return true
    }
  }
  return false;
}

// eslint-disable-next-line no-unused-vars
/**
 * 递归查找父节点是否包含某个类名
 * @param element html节点
 * @param className 类名
 * @returns {*}
 */
function findParentNode(element,className) {
  if(element.className === className){
    return element
  }else if(element.target && element.target.parentNode){
    findParentNode(element.target.parentNode, className)
  }
}

/**
 * 对象转字符串
 * @param object
 * @returns {string}
 */
// eslint-disable-next-line no-unused-vars
function objectToString(object) {
  if(typeof object !== 'object'){
    throw new Error(`${object} must be an object`)
  }
  let str = '';
  for (let [k, v] of Object.entries(object)) {
    str +=`${k}: ${v};`
  }
  return str;
}

/**
 * 节流函数
 * @param fun
 * @param delay
 * @returns {(function(): void)|*}
 */
// eslint-disable-next-line no-unused-vars
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

function getRectWidth (rect) { return rect.width || (rect.right - rect.left); }
function getRectHeight (rect) { return rect.height || (rect.bottom - rect.top); }

class Drag {
  // 储存的dom元素
  domList=[];
  // 源盒子ID
  sourceBox = '';
  // 被拖入的盒子ID
  dragBox='';
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
  dragged = ''
  // 被拖入的占位符
  imgs = '';
  // 初次点击的鼠标距离
  mouseInfo = {};
  clickElement = '';
  // 内部拖动
  dragging= false;
  // 外部进内部
  dropdown= false;
  // 父节点
  parentNode = '';
  // resize监视器
  resizeObserve = '';
  // 全局zIndex
  zIndex = 0;
  // 镜像元素
  _mirror = '';
  // 元素的距离
  rect = '';
  // 点击鼠标的事件
  mouseDownEvent = '';

  /**
   * 构造函数
   * @param sourceBox
   * @param dragBox
   * @param imgs
   */
  constructor(sourceBox, dragBox, imgs) {
    this.sourceBox = sourceBox;
    this.dragBox = dragBox;
    this.imgs = imgs
    this.searchOriginPoint();
    this.startListener();
  }

  setDomList() {

  }

  // 搜索XY的原点坐标
  searchOriginPoint() {
    const result = document.querySelector(this.dragBox).getBoundingClientRect();
    this.pointX = result.x;
    this.pointY = result.y;
    this.calculateXYlength(result);
  }

  // 计算XY的长度
  calculateXYlength(r) {
    this.xLength = r.width;
    this.yLength = r.height;
  }

  // 注册事件
  startListener() {
    document.addEventListener('mousedown', this.handleMouseDown.bind(this));
    document.addEventListener('mousemove', this.handleMouseMove.bind(this));
    document.addEventListener('mouseup', this.handleMouseUp.bind(this));
    this.resizeObserve = new ResizeObserver(this.searchOriginPoint.bind(this));
    this.resizeObserve.observe(document.querySelector(this.dragBox))
    // document.addEventListener('mousedown', event=>{
    //   console.log(event, 'mousedown');
    //   this.mouseInfo.offsetX = event.offsetX;
    //   this.mouseInfo.offsetY = event.offsetY;
    //   if(reduceSearchClass(event.target)){
    //     this.clickElement = event.target;
    //     // this.startMove();
    //   }
    // })
    // document.addEventListener("mouseup",()=>{
    //   console.log('mouseup');
    //   // document.removeEventListener('mousemove', this.moveEvent.bind(this))
    // })
    // eslint-disable-next-line no-unused-vars
    // document.addEventListener('drag', (event)=>{
    //   // console.log(event);
    // })
    // document.addEventListener("dragstart", ( event )=> {
    //   console.log(event, 'dragstart');
    //   // 保存拖动元素的引用(ref.)
    //   this.dragged = event.target;
    //   // 使其半透明
    //   event.target.style.opacity = .5;
    // }, false);
    //
    // document.addEventListener("dragend", ( event )=> {
    //   // 重置透明度
    //   event.target.style.opacity = "";
    // }, false);
    //
    // /* 放置目标元素时触发事件 */
    // document.addEventListener("dragover", ( event )=> {
    //   // console.log(event, 'dragover');
    //   // 阻止默认动作以启用drop
    //   event.preventDefault();
    // }, false);
    //
    // document.addEventListener("dragenter", ( event )=> {
    //   // console.log(event, 'dragenter')
    //   // 当可拖动的元素进入可放置的目标时高亮目标节点
    //   if ( event.target.className === "move-box" ) {
    //     event.target.style.background = "purple";
    //   }
    // }, false);
    //
    // document.addEventListener("dragleave", ( event )=> {
    //   // console.log(event, 'dragleave')
    //   // 当拖动元素离开可放置目标节点，重置其背景
    //   if ( event.target.className === "move-box" ) {
    //     event.target.style.background = "";
    //   }
    // }, false);
    //
    // document.addEventListener("drop", ( event )=> {
    //   // 阻止默认动作（如打开一些元素的链接）
    //   console.log(event, 'drop');
    //   event.preventDefault();
    //   // 将拖动的元素到所选择的放置目标节点中
    //   if ( event.target.className === "move-box" ) {
    //     event.target.style.background = "";
    //     // const inside = document.createElement("div")
    //     // const img = document.createElement('img')
    //     // img.src = this.imgs;
    //     // img.classList.add('imgs');
    //     // inside.appendChild(img);
    //     // this.dragged.parentNode.replaceChild( inside, this.dragged );
    //     const element = document.createElement("div");
    //     element.className = 'drag-box';
    //     element.style = this.styleMake(event);
    //     // element.onclick = this.moveEvent
    //     this.dragged.draggable = false;
    //     element.appendChild(this.dragged)
    //     // console.log(this.dragged);
    //     // this.dragged.style =
    //     event.target.appendChild( element );
    //   }
    // }, false)
  }

  /**
   * 构建拖动元素的样式
   * @param node html节点
   * @param mirror 是否虚拟元素
   * @returns {string|{top: number, left: number}}
   */
  styleMake(node, mirror=false) {
    let left;
    let top;
    if(mirror){
      left = node.clientX  - (this.mouseDownEvent.clientX - this.rect.left);
      top = node.clientY  - (this.mouseDownEvent.clientY - this.rect.top);
      return {
        top,
        left
      }
    } else {
      left = node.clientX - this.pointX - this.mouseInfo.offsetX;
      top = node.clientY - this.pointY - this.mouseInfo.offsetY;
      if(this.dragging) {
        if(left<0){
          left=0
        }
        if(left > this.xelementLength) {
          left = this.xelementLength
        }
        if(top<0){
          top=0
        }
        if(top > this.yelementLength) {
          top = this.yelementLength
        }
      }
      return `translate(${left}px, ${top}px)`;
    }

  }

  startMove() {
    document.addEventListener('mousemove', this.moveEvent.bind(this))
  }

  moveEvent(event) {
    console.log(event, 'moveEvent');
    event.target.style = this.styleMake(event);
  }

  // 构建虚拟节点
  makeMirrorNode(node) {
    this.rect = node.target.getBoundingClientRect();
    this._mirror = node.target.cloneNode(true);
    this._mirror.style.width = getRectWidth(this.rect) + 'px';
    this._mirror.style.height = getRectHeight(this.rect) + 'px';
    this._mirror.style.position = 'fixed';
    this._mirror.style.top = (node.clientY - (node.clientY - this.rect.top)) + 'px';
    this._mirror.style.left = (node.clientX - (node.clientX - this.rect.left)) + 'px';
    this._mirror.style.opacity = '.5'
    document.body.appendChild(this._mirror)
  }

  // 虚拟节点移动
  mirrorNodeMove(event) {
    const style = this.styleMake(event,true);
    this._mirror.style.left = style.left + 'px';
    this._mirror.style.top = style.top + 'px';
  }

  // 删除虚拟节点
  removeMirrorNode() {
    document.body.removeChild(this._mirror)
  }

  // 是否在目标拖动的盒子中
  isInDragBox(event) {
    if(event.clientX > this.pointX && event.clientY >this.pointY) {
      return true
    }
  }

  // 处理鼠标点击事件
  handleMouseDown(event) {
    console.log(event, 'handleMouseDown');
    if(event.target.id === this.sourceBox.substr(1))return;
    this.mouseDownEvent = event;
    event.preventDefault();
    this.mouseInfo.offsetX = event.offsetX;
    this.mouseInfo.offsetY = event.offsetY;
    // 在内部拖拽
    if(reduceSearchClass(event.target)){
      this.dragging = true;
      this.parentNode = findParentNode(event.target.parentNode, 'drag-box');
      this.xelementLength = this.xLength - this.parentNode.offsetWidth;
      this.yelementLength = this.yLength - this.parentNode.offsetHeight;
      this.zIndex +=1
      this.parentNode.style.zIndex = this.zIndex;
    } else if(document.querySelector(this.sourceBox).contains(event.target)) {
      // 在外面移入拖拽区
      this.dragged = event.target;
      this.makeMirrorNode(event);
      this.dropdown = true;
    }
  }

  // 处理鼠标移动事件
  handleMouseMove(event) {
    if (!this.dragging && !this.dropdown) return;
    if(this.dropdown) {
      this.mirrorNodeMove(event)
    }
    if(this.dragging) {
      this.parentNode.style.transform = this.styleMake(event)
    }
  }

  // 处理鼠标松开事件
  handleMouseUp(event) {
    if(this.dropdown) {
      this.removeMirrorNode()
    }
    if(this.dropdown && this.isInDragBox(event)) {
      const parent = document.querySelector(this.dragBox);
      const element = document.createElement('div');
      element.className = 'drag-box';
      element.appendChild(this.dragged);
      element.style.position = 'absolute';
      element.style.transform = this.styleMake(event);
      element.style.zIndex = this.zIndex;
      parent.appendChild(element)
    }
    // else if(this.dragging) {
    //   const parentNode = findParentNode(event.target.parentNode, 'drag-box');
    //   parentNode.style = this.styleMake(event)
    // }
    // console.log(findParentNode(event.target.parentNode, 'drag-box'));
    this.dragging = false;
    this.dropdown = false;
  }
}

export default Drag;
