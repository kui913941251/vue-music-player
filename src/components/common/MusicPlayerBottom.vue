<template>
  <div class="music_player_bottom" @click="showMainPlayer">
    <div class="player_img">
      <img :src="audio.play_target.img || 'http://img4.imgtn.bdimg.com/it/u=1336479818,623042420&fm=26&gp=0.jpg'"
           :class="!isPaused? 'is_play': ''"
           alt="">
    </div>
    <div class="center_title">
      {{$audio.play_target.song_name ? $audio.play_target.song_name + "-" + $audio.play_target.author_name :"暂无"}}
    </div>
    <div class="right_tool">
      <div class="tool_play" @click.stop="changePlayState">
        <span class="iconfont" :class="!isPaused? 'icon-zanting':'icon-bofang'"></span>
      </div>
      <div class="tool_play_list" @click.stop="showPlayList">
        <span class="iconfont icon-bofangliebiao"></span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "MusicPlayerBottom",
    components: {

    },
    data() {
      return {
        audio: {},
        isPaused: true
      }
    },
    created() {
      this.audio = this.$audio
    },
    mounted() {
      // 接收主播放器的播放状态
      this.$bus.$on("changePlayState" ,  (res) => {
        this.isPaused = res
      })
    },
    methods: {
      // 改变播放状态
      changePlayState() {
        let audio = this.audio
        console.dir(audio)
        // 判断是否正在暂停
        if (audio.paused) {
          // 如果处于暂停  则播放
          audio.play()
          this.isPaused = false
        }else {
          // 如果处于播放  则暂停
          audio.pause()
          this.isPaused = true
        }
        // 同步主播放器
        this.$bus.$emit("changePlayState" , this.isPaused)
      },
      // 隐藏底部播放栏，显示主播放器
      showMainPlayer() {
        this.$emit("showMainPlayer")
      },
      // 显示播放列表
      showPlayList() {
        this.$bus.$emit("showPlayList")
      }
    },
    activated() {
    }
  }
</script>

<style lang="less" scoped>
  .music_player_bottom{
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 40px;
    padding: 0 5px;
    display: flex;
    align-items: center;
    background-color: #fff;
    .player_img{
      width: 40px;
      height: 40px;
      img{
        width: 100% ;
        height: 100%;
        margin-top: -5px;
        border-radius: 50%;
      }
      .is_play{
        animation: 15s imgRotate infinite linear;
      }
    }
    .center_title{
      padding: 0 10px;
      font-size: 12px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
    }
    .right_tool{
      color: var(--musicThemeColor);
      margin-left: auto;
      display: flex;
      .tool_play{
        width: 24px;
        width: 24px;
        margin-right: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        span{
          font-size: 24px;
        }
      }
      .tool_play_list{
        width: 24px;
        height: 24px;
        margin-right: 10px;
        display: flex;
        align-items: center;
        span{
          font-size: 20px;
          vertical-align: middle;
          margin-top: 2px;
        }
      }
    }
  }
  @keyframes imgRotate {
    100% {
      transform: rotate(360deg);
    }
  }
</style>