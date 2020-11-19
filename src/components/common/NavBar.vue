<template>
  <div class="nav_bar">
    <div class="left">
      <slot name="slot_left"></slot>
    </div>
    <div class="center">
      <slot name="slot_center"></slot>
    </div>
    <div class="right">
      <slot name="slot_right"></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: "NavBar"
  }
</script>

<style lang="less" scoped>
  .nav_bar{
    display: flex;
    height: 40px;
    line-height: 40px;
    div{
      text-align: center;
    }
    .left{
      width: 50px;
    }
    .center{
      flex: 1;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
    }
    .right{
      width: 50px;
    }
  }
</style>