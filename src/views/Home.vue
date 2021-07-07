<template>
  <div class="home">
    <div class="home-box" id="home-box">
      <div v-for="(index) of 6" :id="`item${index}`" :key="index" style="display: inline-block;">
        <Item :text="index" />
      </div>
    </div>
    <div class="move-box" id="move-box">

    </div>
  </div>
</template>

<script>
import Item from "@/views/item";
import imgs from '@/assets/logo.png'
import Drag from "./drag";

export default {
  name: 'Home',
  data() {
    return{
      dragged:'',
      imgs,
      drags:'',
    }
  },
  components: {
    Item
  },
  mounted() {
    this.drags = new Drag('#home-box','#move-box', this.imgs)
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
  }
  .move-box {
    flex: 1;
    position: relative;
    background-color: rgb(255, 180, 180);
  }
}
</style>
<style lang="css">
.imgs {
  width: 20px;
  height: 20px;
}
</style>
