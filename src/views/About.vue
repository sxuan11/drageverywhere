<template>
  <div class="home">
    <div class="home-box" id="home-box">
      <div v-for="(index) of 6" :key="index" style="display: inline-block;" class="home-box-item">
        <Item :id="`item${index}`" :text="index"/>
      </div>
    </div>
    <div class="move-box" id="move-box">

    </div>
  </div>
</template>

<script>
import Item from "@/views/item";
import imgs from '@/assets/place.png'
import Drag from "../../core/dist/drag-everywhere.bundle";
import io from "socket.io-client";

const socket= io('http://127.0.0.1:3030/');

export default {
  name: 'Home',
  data() {
    return {
      dragged: '',
      imgs,
      drags: '',
      dragMap: new Map(),
      dragInfo: {
        height: 0,
        width: 0,
      }
    }
  },
  components: {
    Item
  },
  mounted() {
    this.drags = new Drag(
        {
          sourceBox: '#home-box',
          dragBox: '#move-box',
          dragTargetClassName: 'c-item',
          imgs: this.imgs,
          dragNumber: 4,
          aspectRatio: '16:9',
          dragMaxWidth: 600,
          notListener: false,
        })
    this.drags.on('dragFull',()=>{
      console.log('dragFull');
    })
    // this.drags.on('changeWidthAndHeight', (result)=>{
    //   console.log('changeWidthAndHeight', result);
    // })
    socket.on('drag-in', (data)=>{
      this.drags.listenersPutBackBox(data);
      this.dragMap.delete(data);
    })
    socket.on('drag-out', this.checkDrag.bind(this))
    socket.on('drag-move', this.checkDrag.bind(this))
    socket.on('drag-zoom', this.checkDrag.bind(this))
    socket.emit('init-position');
    socket.on('position', data=>{
      this.drags.setSourceData(data)
      for (const i in data) {
        this.checkDrag(data[i])
      }
    })
    // socket.on('change-width', data=>{
    //   console.log(data, 'data');
    //   // this.drags.setSourceData(data, true)
    // })
  },
  methods: {
    checkDrag(data) {
      const { id, parentWidth, parentHeight } = data;
      if(this.dragMap.size === 0) {
        this.drags.setSourceData({width: parentWidth, height: parentHeight});
        this.dragInfo.height = parentHeight;
        this.dragInfo.width = parentWidth;
        this.drags.listenerDrawDragBox(data);
        this.dragMap.set(id, data);
      } else {
        if(this.dragMap.has(id)) {
          this.drags.setSourceData({width: parentWidth, height: parentHeight}, true);
          this.drags.listenersUpdateBox(data);
          this.dragMap.set(id, data);
        } else {
          if(this.dragInfo.height !== parentHeight || this.dragInfo.width !== parentWidth){
            this.drags.setSourceData({width: parentWidth, height: parentHeight}, true);
            this.dragInfo.height = parentHeight;
            this.dragInfo.width = parentWidth;
          }
          this.drags.listenerDrawDragBox(data);
          this.dragMap.set(id, data)
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.home {
  height: 100%;
  display: flex;
  flex-direction: column;

  .home-box {
    display: flex;
    height: 84px;
  }

  .move-box {
    flex: 1;
    position: relative;
    background-color: rgb(255, 173, 173);
    overflow: hidden;
  }

  .home-box-item {
    height: 84px;
    width: 150px;
  }
}
</style>
<style lang="css">

</style>
