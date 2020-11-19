<template>
  <div class="head">
    <div class="title">
      <span class="iconfont icon-yinle"></span>
      <span>乐音乐</span>
    </div>
    <div class="search iconfont icon-sousuo" @click="showSearch"></div>
  </div>
</template>

<script>
  export default {
    name: "Head",
    methods: {
      showSearch() {
        this.$bus.$emit("showSearch")
      }
    }
  }
</script>

<style lang="less" scoped>
  .head{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 40px;
    line-height: 40px;
    padding: 0 10px;
    background-color: var(--musicThemeColor);
    color: #fff;
    display: flex;
    justify-content: space-between;
    .title{
      font-family: 微软雅黑;
      font-weight: bold;
    }
    .search{
      font-size: 20px;
    }
  }
</style>