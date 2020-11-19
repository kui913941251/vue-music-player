<template>
  <div class="music_player_main">
    <div class="w">
      <div class="top_head">
        <div class="placeholder" @click="showBottomPlayer">
          <span class="iconfont icon-fanhui"></span>
        </div>
        <div class="top_tab">
          <div class="tab_item"
               v-for="(item , index) in tbs"
               :key="item.id"
               :class="{active: index == currentIndex}"
               @click="changeIndex(index)">
            {{item.name}}
          </div>
        </div>
        <div class="placeholder"></div>
      </div>
      <div class="player_content">
        <div class="music_content" v-show="currentIndex === 0" ref="player_content">
          <div class="music_img">
            <img :src="audio.play_target.img || 'http://img4.imgtn.bdimg.com/it/u=1336479818,623042420&fm=26&gp=0.jpg'" alt="">
          </div>
          <div class="music_title" :class="{title_loop: titleLoop }">
            <span ref="titleLoop">{{audio.play_target.song_name || "暂无"}}</span><span v-if="titleLoop">{{audio.play_target.song_name || "暂无"}}</span>
          </div>
          <div class="music_singer">
            {{audio.play_target.author_name || "暂无"}}
          </div>
          <div class="music_lyric">
            {{lyricsText}}
          </div>
          <div class="progress_bar">
            <div class="total_length" ref="total_length" @click="changePlayTime">
              <div class="cache_length" :style="{width: cacheWidth + 'px'}"></div>
              <div class="played_length" :style="{width: playedGress + 'px'}">
                <div class="player_dot"></div>
              </div>
            </div>
          </div>
          <div class="music_time">
            <div class="played_time">{{playedTimeShow}}</div>
            <div class="total_time">{{totalTimeShow}}</div>
          </div>
          <div class="bottom_toll">
            <div class="play_mode"  @click="changePlayMode">
              <span class="iconfont" :class="playMode[playModeIndex].className"></span>
            </div>
            <div class="play_tool">
              <div class="pre_music" @click="prevMusic">
                <span class="iconfont icon-pre"></span>
              </div>
              <div class="play_state" @click="changePlayState">
                <span class="iconfont" :class="isPaused? 'icon-bofang-main isplay':'icon-zanting-main'"></span>
              </div>
              <div class="next_music" @click="nextMusic">
                <span class="iconfont icon-next"></span>
              </div>
            </div>
            <div class="play_list" @click="showPlayList">
              <span class="iconfont icon-bofangliebiao"></span>
            </div>
          </div>
        </div>
        <music-player-lyric-content v-show="currentIndex === 1"></music-player-lyric-content>
      </div>
    </div>
    <div class="bg_img">
      <img :src="audio.play_target.img || 'http://img4.imgtn.bdimg.com/it/u=1336479818,623042420&fm=26&gp=0.jpg'" alt="">
    </div>
    <div class="mask"></div>
  </div>
</template>

<script>
  import MusicPlayerLyricContent from "./MusicPlayerLyricContent";

  export default {
    name: "MusicPlayerMain",
    components: {
      MusicPlayerLyricContent
    },
    data() {
      return {
        tbs: [
          {
            id: "0",
            name: "歌曲"
          },
          {
            id: "1",
            name: "歌词"
          }
        ],
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
        playModeIndex: 0,
        currentIndex: 0,
        isPaused: true,
        audio: {},
        lyricsText: "暂无",
        playedGress: 0,
        progressWidth: 0,
        cacheWidth: 0,
        palyedTime: 0,
        totalTime: 0,
        titleLoop: false
      }
    },
    computed: {
      playedTimeShow() {
        let time = this.palyedTime
        let second = parseInt((time % 60))
        let min = Math.floor(time / 60)
        return (min < 10? "0" + min: min) + ":" + (second < 10? '0' + second:second)
      },
      totalTimeShow() {
        let time = this.totalTime
        if (isNaN(time)) {
          return "00:00"
        }
        let second = parseInt((time % 60))
        let min = Math.floor(time / 60)
        return (min < 10? "0" + min: min) + ":" + (second < 10? '0' + second:second)
      }
    },
    created() {
      this.audio = this.$audio
    },
    mounted(){
      // 接收下方播放栏的播放状态
      this.$bus.$on("changePlayState" ,  (res) => {
        this.isPaused = res
      })
      // 监听歌曲的播放进度
      this.$bus.$on("timeUpdate" ,  () => {
        // 获取进度条总长度
        this.progressWidth = this.$refs.total_length.offsetWidth
        let currentTime = parseInt(this.audio.currentTime)
        let total_time = parseInt(this.audio.duration)
        let ratio = parseFloat(currentTime / total_time)
        this.palyedTime = currentTime
        this.totalTime = total_time
        // 设置已经播放了的进度
        this.playedGress = Math.floor(ratio * this.progressWidth)
        // 获取已缓存的对象
        let timeRanges = this.$audio.buffered
        // // 获取已缓存的进度
        if (timeRanges.length != 0) {
          let cacheTime = timeRanges.end(timeRanges.length - 1)
          let cacheRatio = cacheTime / total_time
          this.cacheWidth = cacheRatio * this.progressWidth
        }
      })


      this.$bus.$on("judgeTitleWidth" , () => {
        this.judgeTitleWidth()
      })

      // 获取歌词
      this.$bus.$on("changeLyrics" , (value) => {
        this.lyricsText = value
      })

      // 同步播放模式
      this.$bus.$on("changePlayMode" , (value) => {
        this.playModeIndex = value
      })
    },
    methods: {
      // 显示下方播放栏
      showBottomPlayer() {
        this.$emit("showBottomPlayer")
      },
      // 改变index
      changeIndex(index) {
        this.currentIndex = index
      },
      // 改变播放状态
      changePlayState() {
        // 获取当前播放状态
        let state = this.audio.paused
        // 表示正在处于暂停状态 ， 点击开始播放
        if (state) {
          this.audio.play()
          this.isPaused = false
        }else {
          // 表示正在处于播放状态，点击暂停
          this.audio.pause()
          this.isPaused = true
        }
        // 同步下方播放栏
        this.$bus.$emit("changePlayState" , this.isPaused)
      },

      // 切换上一首歌曲
      prevMusic() {
        this.$bus.$emit("prevMusic")
      },
      // 切换下一首歌曲
      nextMusic() {
        this.$bus.$emit("nextMusic")
      },

      // 改变当前页面的播放模式
      changePlayMode() {
        let index = this.playModeIndex + 1
        if (index > this.playMode.length - 1) {
          index = 0
        }
        this.playModeIndex = index
        this.$bus.$emit("changePlayMode" , index)
      },

      // 改变播放时间
      changePlayTime(event) {
        let pageX = event.pageX
        let progressOffset = this.$refs.total_length.offsetLeft
        let playedWidth = pageX - progressOffset
        let ratio = playedWidth / this.progressWidth
        let totalTime = this.totalTime
        let setTime = totalTime * ratio
        this.audio.currentTime = setTime
        this.playedGress = playedWidth
      },
      // 判断歌曲标题是否要循环
      judgeTitleWidth() {
        let contentWidth = this.$refs.player_content.offsetWidth
        let titleWidth = this.$refs.titleLoop.offsetWidth
        if (titleWidth > contentWidth) {
          this.titleLoop = true
        } else {
          this.titleLoop = false
        }
      },
      // 显示播放列表
      showPlayList() {
        this.$bus.$emit("showPlayList")
      }
    }
  }
</script>

<style lang="less" scoped>
  .music_player_main{
    position: fixed;
    z-index: 10;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: rgba(0,0,0,.9);
    padding: 10px 0;
    .w{
      width: 80%;
      margin: 0 auto;
      .top_head{
        display: flex;
        .placeholder{
          width: 40px;
          span{
            display: inline-block;
            transform: rotate(-90deg);
            color: #fff;
          }
        }
        .top_tab{
          flex: 1;
          display: flex;
          justify-content: center;
          font-size: 12px;
          color: #fff;
          .tab_item{
            margin-right: 10px;
            color: rgba(255,255,255,.5);
          }
          .tab_item:last-child{
            margin-right: 0;
          }
          .tab_item:not(:last-child)::after{
            content: "";
            display: inline-block;
            width: 2px;
            height: 10px;
            background-color: rgba(255,255,255,.5);
            margin-left: 7px;
          }
          .active{
            color: #fff;
          }
        }
      }

      .player_content{
        padding: 10px 0;
        display: flex;
        flex-direction: column;
        .music_content{
          .music_img{
            width: 100%;
            max-height: 50vh;
            overflow: hidden;
            border-radius: 10px;
            img{
              width: 100%;
            }
          }
        }
        .music_title{
          width: auto;
          margin-top: 10px;
          color: #fff;
          font-weight: bold;
          white-space: nowrap;
          overflow: hidden;
        }

        .title_loop{
          span{
            display: inline-block;
            animation: titleLoop 10s linear infinite;
            padding-right: 10px;
          }
        }

        .music_singer{
          color: rgba(255,255,255,.4);
          font-size: 13px;
          margin: 3px 0;
        }
        .music_lyric{
          color: rgba(255,255,255,.4);
          font-size: 13px;
          white-space: nowrap;
          overflow: hidden;
        }

        .progress_bar{
          margin-top: 10px;
          .total_length{
            position: relative;
            width: 100%;
            height: 2px;
            background-color: rgba(255,255,255,.3);
            .cache_length{
              position: absolute;
              width: 60%;
              height: 2px;
              background-color: rgba(255,255,255,.4);
            }
            .played_length{
              position: absolute;
              width: 50%;
              height: 2px;
              background-color: rgba(255,255,255);
              .player_dot{
                position: absolute;
                top: -2px;
                right: 0;
                width: 6px;
                height: 6px;
                background-color: #fff;
                border-radius: 50%;
              }
            }
          }
        }
        .music_time{
          margin-top: 5px;
          display: flex;
          justify-content: space-between;
          div{
            color: rgba(255,255,255,.4);
            font-size: 13px;
          }
        }

        .bottom_toll{
            margin-top: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .play_mode{
              color: rgba(255,255,255,.6);
              width: 20px;
              span{
                font-size: 20px;
              }
          }
          .play_tool{
            display: flex;
            align-items: center;
            color: #fff;
            .pre_music{
              span{
                font-size: 24px;
              }
            }
            .play_state{
              width: 50px;
              height: 50px;
              display: flex;
              justify-content: center;
              align-items: center;
              margin: 0 20px;
              span{
                font-size: 60px;
              }
              .isplay{
                margin-left: -3px;
                font-size: 61px;
              }
            }
            .next_music{
              span{
                font-size: 24px;
              }
            }
          }
          .play_list{
            color: rgba(255,255,255,.6);
            span{
              font-size: 20px;
            }
          }
        }
      }
    }

    .bg_img{
      position: absolute;
      z-index: -2;
      left: -5%;
      top: -5%;
      width: 110%;
      height: 110vh;
      filter: blur(10px);
      img{
        width: 100%;
        height: 100%;
      }
    }
    .mask{
      position: absolute;
      z-index: -1;
      left: 0;
      top: 0;
      width: 100%;
      height: 100vh;
      background-color: rgba(0,0,0,.5);
    }
  }

  @keyframes titleLoop {
    100% {
      transform: translateX(-100%);
    }
  }
</style>