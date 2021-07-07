<template>
  <div class="c-item">
    video{{text}}
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
  height: 90px;
  background-color: #42b983;
  width: 160px;
  border: aqua 1px solid;
  cursor: move;
}
</style>
