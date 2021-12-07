# drag
这个库可以让你从源区域拖动到目标区域，并提供等比例的换算

## 安装方式

```shell
npm i drageverywhere
or 
yarn add drageverywhere
```

## 例子运行
你可以fork这个仓库，或者下载源代码[地址](https://github.com/sxuan11/drageverywhere.git)
```shell
yarn install --frozen-lockfile
or 
npm ci
npm run start_server
npm run serve
```
### 
**分别打开**

**http://localhost:8080/source**

**http://localhost:8080/listener**

在source页面进行操作，listener页面数据监听页面，即可看到效果

## usage 使用方法
```javascript
new Drag({
          sourceBox: '#home-box',
          dragBox: '#move-box',
          referBox: '#move-box',
          dragTargetClassName: 'c-item',
          imgs: 'img地址或require',
          dragNumber: 4,
          aspectRatio: '16:9',
          dragMaxWidth: 600,
        })
```

### 参数说明
| 参数 | 说明               | 类型            | 必要的 | 默认值       |
| --- |------------------|---------------| --- |-----------|
|sourceBox| 需要被拖动的父盒子(源区域)ID | String        | * | -         |
|dragBox| 被拖入的盒子(目标区域)ID   | String        | * | -         |
|dragTargetClassName(目标元素)| 目标拖动元素类名         | String        | * | -         |
|imgs| 被拖走元素的占位图        | Base64 or url | * | -         |
|imgPlaceStyle| 占位图的文字样式         | object        |  | -         |
|initBoxWidth| 生成拖拽元素的初始宽度      | number        | * | 300       |
|notListener| 是否不是监听者          | Boolean       |  | true      |
|initBoxHeight| 生成拖拽元素的初始高度      | number        |  | 根据比例和宽度计算 |
|dragNumber| 最大的拖拽数量          | number        |  | 4         |
|aspectRatio| 拖拽元素的比例          | string        |  | 16:9      |
|dragMinWidth| 生成拖拽元素的最小宽度      | number        |  | 100       |
|dragMaxWidth| 生成拖拽元素的最大宽度      | number        |  | 根据比例和宽度计算 |
|referBox| 动态计算比例的参照物       | string        |  | body      |
|zIndex| 拖动元素的初始层级        | number        |  | 100       |
|emitTime| 改变窗口的事件节流事件      | number        |  | 1000      |
|canDrag| 设定当前是否可以拖动       | boolean       |  | true      |

### 基础数据
id:被拖出元素的ID

index:拖拽盒子的层级

left:拖拽盒子的左边距

top:拖拽盒子的上边距

width:拖拽盒子的宽度

height:拖拽盒子的高度

parentWidth:参照盒子的宽度

parentHeight:参照盒子的高度度
### 事件
|事件名|描述|回调参数|
|---|---|---|
|dragFull|达到拖拽上限||
|drag-out|有元素被拖出|基础数据|
|drag-in|有元素被拖回|id|
|drag-move|有元素被改变了位置|基础数据|
|drag-zoom|有元素被改变了大小|基础数据|
|changeWidthAndHeight|参照元素改变了宽高|{parentHeight,parentWidth}|
|mouseUp|鼠标松开取消移动过||
|mouseMoving|鼠标正在移动||
|zIndexChange|内部层级发生改变|index|

### 方法
|方法名|描述|参数|
|---|---|---|
|sourceDrawDragBox|源绘制数据，适用于操作者绘制之前的数据|基础数据|
|setZIndex|源设置当前的层级|number|
|setSourceData|监听者设定基础数据|width,height|
|listenerDrawDragBox|监听者绘制拖拽元素|基础数据|
|listenersPutBackBox|监听者放回元素|id|
|listenersUpdateBox|监听者更新拖拽元素|基础数据|
|listenersIndexBox|监听者改变层级|基础数据|
|destroyById|源销毁指定id元素|id|
|destroyAll|源销毁所有元素||
|setCanDrag|设定当前是否可以拖动|boolean|
|putBackDragBoxById|放回指定元素|源元素id string|
