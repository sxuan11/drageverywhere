<template>
  <div class="c-item">
    video{{text}}
    <div class="c-item-item">
      是的
      <div>
        再嵌套
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "item",
  props: {
    text:Number,
    default: ()=>{
      return 0
    }
  }
}
</script>

<style lang="scss" scoped>
.c-item {
  height: 100%;
  background-color: #42b983;
  width: 100%;
  border: aqua 1px solid;
  cursor: move;
  box-sizing: border-box;
}
</style>
