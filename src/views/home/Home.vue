<template>
  <div id="home">
    <div class="content">
      <transition name="title_fade" v-on:after-enter="makeListShow">
        <div class="home_title" v-show="titleShow">放松一下</div>
      </transition>
      <transition name="list_fade">
        <div class="type_list" v-show="listShow">
          <div v-on:click="$router.push('/music')">音 乐</div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
  import { getNewSongs } from "network/request"
  export default {
    name: "Home",
    data() {
      return {
        titleShow: false,
        listShow: false
      }
    },
    methods: {
      makeListShow() {
        console.log("完成过度")
        this.listShow = true
      }
    },
    mounted() {
      this.titleShow = true
    },
    created() {

    }
  }
</script>

<style lang="less" scoped>
  #home{
    position: relative;
    background-color: #42b983;
    height: 100vh;
    .content{
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50% , -50%);
      .home_title{
        font-family: "方正简体" !important;
        font-size: 30px;
        color: #fff;
        text-align: center;
      }
      .type_list{
        margin-top: 20px;
        div{
          padding: 10px 40px;
          border: 1px solid #fff;
          color: #fff;
          border-radius: 10px;
          margin-top: 10px;
        }
      }
    }
  }

  .title_fade-enter-active , .title_fade-leave-active{
    transition: 1s;
  }
  .title_fade-enter, .title_fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
    transform: translateX(100%);
  }

  .list_fade-enter-active , .list_fade-leave-active{
    transition: 1s;
  }
  .list_fade-enter, .list_fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
    transform: translateY(100%);
  }
</style>