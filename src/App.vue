<template>
  <div id="app">
    <music></music>
    <router-view></router-view>
  </div>
</template>

<script>
  import Music from "./views/music/Music";

  export default {
    name: "App",
    components: {
      Music
    }
  }

</script>

<style lang="less">
  @import "assets/css/common.css";
  @import "assets/font/font.css";
  @import "assets/css/iconfont.css";
</style>
