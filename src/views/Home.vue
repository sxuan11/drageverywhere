<template>
  <div class="home">
    <div class="home-box" id="home-box">
      <div v-for="(index) of 6" :key="index" style="display: inline-block;" class="home-box-item">
        <Item :id="`item${index}`" :text="index"/>
      </div>
    </div>
    <div v-if="showMove" class="move-box" id="move-box">

    </div>
    <button @click="closeMove">关闭拖拽盒子</button>
    <button @click="destroyId">销毁指定ID</button>
  </div>
</template>

<script>
import Item from "@/views/item";
import imgs from '@/assets/place.png'
import Drag from "../../core/dist/drag-everywhere.bundle";
import io from "socket.io-client";

const socket = io('http://127.0.0.1:3030/');

export default {
  name: 'Home',
  data() {
    return {
      dragged: '',
      imgs,
      drags: '',
      socket,
      dragMap: new Map(),
      showMove: true,
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
          referBox: '#move-box',
          dragTargetClassName: 'c-item',
          imgs: this.imgs,
          dragNumber: 4,
          aspectRatio: '16:9',
          dragMaxWidth: 600,
          emitTime: 1500,
        }
    )
    this.drags.on('dragFull', () => {
      console.log('dragFull');
    });
    this.drags.on('drag-out', (data) => {
      this.dragMap.set(data.id, data)
      socket.emit('drag-out', data);
    })
    this.drags.on('drag-in', (data) => {
      this.dragMap.delete(data);
      socket.emit('drag-in', data);
    })
    this.drags.on('drag-move', (data) => {
      this.dragMap.set(data.id, data)
      socket.emit('drag-out', data);
    })
    this.drags.on('drag-zoom', (data) => {
      this.dragMap.set(data.id, data)
      socket.emit('drag-out', data);
    })
    this.drags.on('mouseMoving', () => {
      console.log('move');
    })
    this.drags.on('mouseUp', () => {
      console.log('up');
    })
    this.drags.on('changeWidthAndHeight', (result) => {
      for (const v of this.dragMap.values()) {
        v.parentHeight = result.parentHeight;
        v.parentWidth = result.parentWidth;
        this.dragMap.set(v.id, v);
        socket.emit('drag-out', v);
      }
    })
    socket.emit('init-position');
    socket.on('position', data => {
      let max = 0;
      for (const i in data) {
        if (data[i]['index'] > max) {
          max = data[i]['index']
        }
        this.dragMap.set(data[i].id, data[i])
        this.drags.sourceDrawDragBox(data[i]);
      }
      max && this.drags.setZIndex(max);
    })
  },
  methods: {
    closeMove() {
      this.showMove = !this.showMove;
    },
    destroyId() {
      this.drags.destroyById('item5')
      // this.drags.destroyAll();
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
    background-color: rgb(99, 99, 99);
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
