/**
 * 判断这个元素是否是HTML节点
 * @param obj
 * @returns {boolean}
 */
export function isHTMLElement(obj) {
  const e = document.createElement("div");
  try {
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
export function reduceSearchClass(childNode) {
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
 * 递归查找父节点包含某个类名的节点
 * @param element html节点
 * @param className 类名
 * @returns {HTMLElement}
 */
export function findParentNode(element, className) {
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
export function objectToString(object) {
  if (typeof object !== 'object') {
    throw new Error(`${object} must be an object`);
  }
  let str = '';
  for (const [k, v] of Object.entries(object)) {
    str += `${k}: ${v};`;
  }
  return str;
}

/**
 * 设定html元素样式
 * @param element
 * @param styleObject
 * @returns {HTMLElement}
 */
export function setObjectStyle(element, styleObject) {
  if (typeof styleObject !== 'object') {
    throw new Error(`${styleObject} must be an object`);
  }
  if (!isHTMLElement(element)) {
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
 * @param imd 是否立即执行
 * @returns {(function(): void)|*}
 */
export function throttle(fun, delay, imd=true) {
  let timer = null;
  let startTime = Date.now();
  if(imd){
    return function () {
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
    }
  } else {
    return function(){
      clearTimeout(timer);
      timer = setTimeout(()=>{
        fun.apply(this, arguments);
      }, delay)
    }
  }

}

export function getRectWidth(rect) {
  return rect.width || (rect.right - rect.left);
}

export function getRectHeight(rect) {
  return rect.height || (rect.bottom - rect.top);
}

export function hasKey(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}
