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
    this.drags.on('changeWidthAndHeight', (result)=>{
      console.log('changeWidthAndHeight', result);
    })
    socket.on('drag-out', (data)=>{
      this.drags.listenerDrawDragBox(data);
    })
    socket.on('drag-in', (data)=>{
      this.drags.listenersPutBackBox(data);
    })
    socket.on('drag-move', (data)=>{
      this.drags.listenersMoveBox(data);
    })
    socket.on('drag-zoom', (data)=>{
      this.drags.listenersZoomBox(data);
    })
    socket.on('drag-index', (data)=>{
      this.drags.listenersIndexBox(data);
    })
    socket.emit('init-position');
    socket.on('position', data=>{
      this.drags.setSourceData(data)
      for (let i = 0; i<data.position.length; i++) {
        this.drags.listenerDrawDragBox(data.position[i]);
      }
    })
    socket.on('change-width', data=>{
      console.log(data, 'data');
      this.drags.setSourceData(data, true)
    })
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
    background-color: rgb(255, 180, 180);
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
