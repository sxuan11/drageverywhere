<template>
  <div class="home">
    <div class="home-box" id="home-box">
      <div v-for="(index) of 6" :id="`item${index}`" :key="index" style="display: inline-block;" class="home-box-item">
        <Item :text="index"/>
      </div>
    </div>
    <div class="move-box" id="move-box">

    </div>
  </div>
</template>

<script>
import Item from "@/views/item";
import imgs from '@/assets/place.png'
import Drag from "./drag";

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
          initBoxHeight:'172px',
          initBoxWidth:'300px',
          dragNumber: 4,
        }
    )
    this.drags.on('dragFull',()=>{
      console.log('dragFull');
    })
    this.drags.on('changeWidthAndHeight', (result)=>{
      console.log('changeWidthAndHeight', result);
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
