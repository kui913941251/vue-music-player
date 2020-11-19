<template>
  <div class="music_list_head">
    <div class="left"></div>
    <div class="center">
      {{musicListItem.info.list.specialname}}
    </div>
    <div class="right"></div>
  </div>
</template>

<script>


  export default {
    name: "MusicListHead",
    data() {
      return {
        id: "",
        musicListItem: {},
        str: ""
      }
    },
    methods: {

    }
  }
</script>

<style lang="less" scoped>
  .music_list_head{
    height: 40px;
    display: flex;
    .left{
      width: 20px;
      height: 10px;
      border-top: 1px solid #a89bb5;
      border-right: 1px solid #a89bb5;
      transform: rotate(-135deg);
    }
    .center{
      font-size: 14px;
      text-align: center;
      flex: 1;
    }
    .right{
      width: 20px;
    }
  }
</style>