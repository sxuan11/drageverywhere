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
      socket,
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
        }
    )
    this.drags.on('dragFull',()=>{
      console.log('dragFull');
    });
    this.drags.on('drag-out', (data)=>{
      socket.emit('drag-out', data);
    })
    this.drags.on('drag-in', (data)=>{
      socket.emit('drag-in', data);
    })
    this.drags.on('drag-move', (data)=>{
      socket.emit('drag-move', data);
    })
    this.drags.on('drag-zoom', (data)=>{
      socket.emit('drag-zoom', data);
    })
    this.drags.on('drag-index', (data)=>{
      socket.emit('drag-index', data);
    })
    this.drags.on('changeWidthAndHeight', (result)=>{
      console.log('changeWidthAndHeight', result);
      socket.emit('change-width', result);
    })
    socket.emit('init-position');
    socket.on('position', data=>{
      let max = 0;
      for (let i = 0; i<data.position.length; i++) {
        if (data.position[i]['z-index']> max){
          max = data.position[i]['z-index']
        }
        this.drags.sourceDrawDragBox(data.position[i]);
      }
      this.drags.setZIndex(max);
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
