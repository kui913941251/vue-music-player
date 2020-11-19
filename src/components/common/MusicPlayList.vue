<template>
    <transition name="music_play_list">
      <div class="music_play_list" v-show="isListContainerShow" >
        <transition name="play_list_move" >
          <div class="play_list_container" v-show="isListShow" id="play_list_container">
            <div class="play_list_head">
              <div class="play_mode" @click="changePlayMode">
                <span class="iconfont" :class="playMode[playModeIndex].className"></span>
                {{playMode[playModeIndex].name}}({{playList.length}}首)
              </div>
              <div class="clear_list" @click="clearPlayList">
                <span class="iconfont icon-qingkong"></span>
              </div>
            </div>
            <div class="play_list_content">
              <div class="list_item " v-for="(item,index) in playList"
                   :class="{current_list_item: targetMusicIndex === index}" @click="changeTargetMusic(index)">
                <div class="item_title">
                  <span class="title_name">{{item.filename.split("-")[1]}}</span>
                  <span class="tittle_singer">- {{item.filename.split("-")[0]}}</span>
                </div>
                <div class="item_play_now">
                  <span class="iconfont"></span>
                </div>
                <div class="delete_item" @click.stop="deleteMusicItem(index)">
                  <span class="iconfont icon-message-close"></span>
                </div>
              </div>
            </div>
            <div class="close_list" @click="hiddenList">
              关闭
            </div>
          </div>
        </transition>
        <transition name="mask"  v-on:after-leave="afterListLeave">
          <div class="mask" v-show="isListShow"></div>
        </transition>
      </div>
    </transition>

</template>

<script>
  import { playMusic , domnloadMusic , getClickMusicInfo  } from "utils/music";

  export default {
    name: "MusicPlayList",
    data() {
      return {
        playMode: [
          {
            id: "0",
            name: "列表循环",
            className: "icon-liebiaoxunhuan"
          },
          {
            id: "1",
            name: "单曲循环",
            className: "icon-danquxunhuan"
          },
          {
            id: "2",
            name: "随机播放",
            className: "icon-ttpodicon"
          }
        ],
        targetMusicIndex: 0,
        playModeIndex: 0,
        playList: [],
        isListShow: false,
        isListContainerShow: false
      }
    },
    created() {
      // 查看缓存中是否有播放列表
      let musicList = JSON.parse(localStorage.getItem("musicList"))
      if (musicList != null) {
        this.playList = musicList
      }
    },
    mounted() {
      // 接受事件总线上的显示播放列表
      this.$bus.$on("showPlayList" , () => {
        // 修改显示隐藏
        this.isListShow = true
        this.isListContainerShow = true
      })
      // 接收穿过来的播放列表
      this.$bus.$on("addPlayList" , (res) => {
        // 保存播放列表
        this.playList = res.musicList
        // 播放点击的index
        let index = res.index
        this.playClickMusic(this.playList[index].hash)
        // 改变目前播放的targetIndex
        this.targetMusicIndex = index
        // 将播放列表保存到缓存
        localStorage.setItem("musicList" , JSON.stringify(this.playList))
      })

      // 播放上一首音乐
      this.$bus.$on("prevMusic" , this.prevMusic)
      // 播放下一首音乐
      this.$bus.$on("nextMusic" , this.nextMusic)

      // 播放结束，自动切歌
      this.$bus.$on("autoPlayNextMusic" , () => {
        let index
        let currentModeName = this.playMode[this.playModeIndex].name
        if (currentModeName === "单曲循环") {
          index = this.targetMusicIndex
        }else if (currentModeName === "列表循环") {
          index = this.targetMusicIndex + 1
          if (index > this.playList.length - 1) {
            index = 0
          }
        }else if (currentModeName === "随机播放") {
          index = Math.floor(Math.random() * this.playList.length)
        }
        let hash = this.playList[index].hash
        // 播放符合hash的音乐
        playMusic(hash , this)
        // 改变当前播放的音乐index
        this.targetMusicIndex = index
      })

      // 同步切换播放模式
      this.$bus.$on("changePlayMode" , (value) => {
        this.playModeIndex = value
      })

      // 如果点击其他地方 隐藏歌曲列表
      document.onclick = (e) => {
        if (e.target.className === "mask") {
          this.isListShow = false
        }
      }
    },
    methods: {
      // 隐藏播放列表
      hiddenList() {
        this.isListShow = !this.isListShow
      },
      // 隐藏播放列表
      afterListLeave() {
        this.isListContainerShow = false
      },
      // 改变正在播放的音乐
      changeTargetMusic(index) {
        this.targetMusicIndex = index
        let hash = this.playList[index].hash
        this.playClickMusic(hash)
      },
      // 播放指定hash的音乐
      playClickMusic(hash) {
        // 先暂停音乐
        this.$audio.pause()
        playMusic(hash , this)
      },
      // 改变当前页面的播放模式
      changePlayMode() {
        let index = this.playModeIndex + 1
        if (index > this.playMode.length - 1) {
          index = 0
        }
        this.playModeIndex = index
        // 同步其他页面的播放模式
        this.$bus.$on("changePlayMode" , index)
      },

      //播放上一首歌
      prevMusic() {
        let index = this.targetMusicIndex - 1
        if (index < 0) {
          index = this.playList.length - 1
        }
        let hash = this.playList[index].hash
        // 播放符合hash的音乐
        playMusic(hash , this)
        // 改变当前播放的音乐index
        this.targetMusicIndex = index
      },
      // 播放下一首歌
      nextMusic() {
        // 播放前检测播放模式，得到应该播放的index
        let index = this.judgePlayMode()
        let hash = this.playList[index].hash
        // 播放符合hash的音乐
        playMusic(hash , this)
        // 改变当前播放的音乐index
        this.targetMusicIndex = index
      },

      // 通过当前播放模式判断将要播放的下一首
      judgePlayMode() {
        let index
        let currentModeName = this.playMode[this.playModeIndex].name
        if (currentModeName === "列表循环" || currentModeName === "单曲循环") {
          index = this.targetMusicIndex + 1
          if (index > this.playList.length - 1) {
            index = 0
          }
        }else if (currentModeName === "随机播放") {
          index = Math.floor(Math.random() * this.playList.length)
        }
        return index
      },
      // 删除当前点击的音乐item
      deleteMusicItem(index) {
        // 移出当前点击的音乐
        this.playList.splice(index , 1)
        if (index === this.targetMusicIndex) {
          // 如果删除的是当前的音乐
          // 由于删除了一首歌，为了保持当前播放位置不变，当前播放的index也要减一
          this.targetMusicIndex--
          // 播放下一首歌
          this.nextMusic()
        }else if(index > this.targetMusicIndex) {
          // 如果删除的是当前播放音乐的后面的音乐，不要处理
        }else if (index < this.targetMusicIndex) {
          // 如果删除的是当前播放音乐的前面
          // 由于删除了一首歌，index也应该减一
          this.targetMusicIndex--
        }
        // 保存到缓存
        localStorage.setItem("musicList" , JSON.stringify(this.playList))
      },
      // 清空播放列表
      clearPlayList() {
        // 清空
        this.playList = []
        // 保存到缓存
        localStorage.setItem("musicList" , JSON.stringify(this.playList))
      }
    }
  }
</script>

<style lang="less" scoped>
  .music_play_list{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    z-index: 20;
    .play_list_container{
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 60vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      background-color: rgba(255,255,255,.9);
      &::after{
        content: "123";
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        z-index: -1;
        filter: blur(20px);
      }
      .play_list_head{
        padding: 10px;
        border-bottom: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        font-size: 14px;
        font-weight: bold;
        .iconfont{
          font-size: 13px;
          font-weight: normal;
        }
      }
      .play_list_content{
        padding: 0 0 0 10px;
        overflow: auto;
        .list_item{
          padding: 10px 10px 10px 0;
          font-size: 13px;
          display: flex;
          justify-content: space-between;
          border-bottom: 1px solid #eee;
          .item_title{
            width: 80%;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient:vertical;
            overflow: hidden;
            color: #000;
            .tittle_singer{
              color: #666;
              font-size: 10px;
            }
          }
        }
      }
      .close_list{
        width: 100%;
        text-align: center;
        padding: 10px;
        font-size: 13px;
        border-top: 1px solid #eee;
        margin-top: 10px;
      }
    }
  }

  .current_list_item{
    .item_title{
      color: var(--musicThemeColor) !important;
    }
    .tittle_singer{
      color: var(--musicThemeColor) !important;
    }
    .item_play_now{
      span{
        color: var(--musicThemeColor);
        &:before {
          content: "\e602";
        }
      }
    }
  }

  .mask{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: rgba(0,0,0,.2);
    z-index: -2;
  }




  /*.music_play_list-active, .music_play_list-active {*/
  /*  transition:  0.1s;*/
  /*}*/
  /*.music_play_list-enter, .music_play_list-leave-to !* .fade-leave-active below version 2.1.8 *! {*/
  /*  opacity: 0;*/
  /*}*/

  .play_list_move-enter-active, .play_list_move-leave-active {
    transition: .5s;
  }
  .play_list_move-enter, .play_list_move-leave-to /* .fade-leave-active below version 2.1.8 */ {
    transform: translateY(100%);
  }

  .mask-enter-active, .mask-leave-active {
    transition:  .5s;
  }
  .mask-enter, .mask-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }

</style>