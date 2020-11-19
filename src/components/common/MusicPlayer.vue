<template>
  <div class="music_player">
    <transition name="main_player_move"
                v-on:after-leave="afterMainLeave">
      <music-player-main v-show="mainPlayerShow"
                         @showBottomPlayer="showBottomPlayer" ></music-player-main>
    </transition>
    <transition name="bottom_player_move"
                v-on:after-leave="afterBottomLeave">
      <music-player-bottom v-show="bottomPlayerShow"
                           @showMainPlayer="showMainPlayer"></music-player-bottom>
    </transition>
    <transition name="play_list_move">
      <music-play-list></music-play-list>
    </transition>
  </div>
</template>

<script>
  import MusicPlayerBottom from "./MusicPlayerBottom";
  import MusicPlayerMain from "./MusicPlayerMain";
  import MusicPlayList from "./MusicPlayList";

  export default {
    name: "MusicPlayer",
    components: {
      MusicPlayerBottom,
      MusicPlayerMain,
      MusicPlayList
    },
    data() {
      return {
        mainPlayerShow: false,
        bottomPlayerShow: true
      }
    },
    methods: {
      // 切换主播放器显示
      showMainPlayer() {
        this.bottomPlayerShow = !this.bottomPlayerShow
      },
      // 切换下方播放栏显示
      showBottomPlayer() {
        this.mainPlayerShow = !this.mainPlayerShow
      },
      // 在下方播放栏离开之后 ， 再显示主播放器
      afterBottomLeave(el , done) {
        this.mainPlayerShow = true
      },
      // 在主播放器离开之后 ， 再显示下方播放栏
      afterMainLeave() {
        this.bottomPlayerShow = true
      }
    }
  }
</script>

<style lang="less" scoped>
  .music_player{
    position: relative;
    z-index: 20;
  }



  .bottom_player_move-enter-active, .bottom_player_move-leave-active {
    transition: .5s;
  }
  .bottom_player_move-enter, .bottom_player_move-leave-to /* .fade-leave-active below version 2.1.8 */ {
    transform: translateY(100%);
  }

  .main_player_move-enter-active, .main_player_move-leave-active {
    transition: .5s;
  }
  .main_player_move-enter, .main_player_move-leave-to /* .fade-leave-active below version 2.1.8 */ {
    transform: translateY(100%);
  }


</style>