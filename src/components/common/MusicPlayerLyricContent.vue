<template>
  <div class="music_lyric_content">
    <div class="music_title">
      {{audio.play_target.song_name || "暂无"}}
    </div>
    <div class="music_singer">
      {{audio.play_target.author_name || "暂无"}}
    </div>
    <div class="lyric_container">
      <ul class="lyric_content" ref="lyric_content" :style="{'top': lyricContentOffsetTop +'px'}">
        <li v-for="(item , index) in lyrics"
            class="lyric_item"
            :class="{active: currentLyricsIndex == index}"
            ref="lyricItem">
          {{item}}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    name: "MusicPlayerLyricContent",
    data() {
      return {
        audio: {},
        times: [],
        lyrics: [],
        currentLyricsIndex: 0,
        lyricsItemHeight: 0,
        lyricContentOffsetTop: 0
      }
    },
    mounted() {
      // 监听歌曲的播放进度
      this.$bus.$on("lyricUpdate" ,  () => {
        let currentTime = this.$audio.currentTime
        let index = this.times.findIndex((item) => {
          return currentTime < item
        })
        if (index == -1){
          index = this.$refs.lyricItem && this.$refs.lyricItem.length
        }
        // 获取每句歌词的高度
        this.currentLyricsIndex = index - 1
        if (this.currentLyricsIndex > 0) {
          this.lyricContentOffsetTop = 0
          // 发送歌词到歌曲页
          this.$bus.$emit('changeLyrics' , this.lyrics[this.currentLyricsIndex])
          for (let i = 1 ; i <= this.currentLyricsIndex ; i++) {
            this.lyricContentOffsetTop -= this.$refs.lyricItem[i].offsetHeight
          }
        }
      })
      // 获取歌词
      this.$bus.$on("getLyrics" , () => {
        this.formateLyric(this.audio.play_target.lyrics)
      })
    },
    created() {
      this.audio = this.$audio
    },
    methods: {
      // 格式化歌词
      formateLyric(str) {
        if (str === "") return
        // 匹配换行符
        let arr = str.split("\n")
        // 检查 ] 右边是否有歌词 , 将右侧带歌词的移入newArr
        let lyric = []
        let times = []
        arr.forEach(item => {
          let arrItem = item.split("]")
          if (arrItem[1] == "" || arrItem[1] == undefined || arrItem[1] == null || (arrItem[1].length>0 && arrItem[1].trim().length == 0)) {
            return
          }else {
            // 将歌词加入歌词数组
            lyric.push(arrItem[1])
            // 处理时间
            let timeStr = arrItem[0].replace("[" , "")
            let timerArr = timeStr.split(":")
            let min = parseInt(timerArr[0])
            let second = parseFloat(timerArr[1])
            let totalS = (min * 60 + second).toFixed(2) * 1
            times.push(totalS)
          }
        })
        this.times = times
        this.lyrics = lyric
      },
      // 歌词体偏移
      moveLyricContent() {
        let itemHeight = this.lyricsItemHeight
        let offsetHeight = this.$refs.lyric_content.offsetTop
        this.lyricContentOffsetTop = offsetHeight - itemHeight
      }
    }
  }
</script>

<style lang="less" scoped>
  .music_lyric_content{
    .music_title{
      color: rgba(255,255,255,.7);
      font-size: 25px;
      font-weight: bold;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
    }
    .music_singer{
      margin-top: 3px;
      font-size: 13px;
      color: rgba(255,255,255,.7);
    }

    .lyric_container{
      position: relative;
      margin-top: 30px;
      height: 50vh;
      overflow: hidden;
      .lyric_content{
        position: absolute;
        top: 0px;
        transform: translateY(40px);
        width: 100%;
        transition: .3s;
        .lyric_item{
          color: rgba(255,255,255,.5);
          font-size: 15px;
          padding-top: 10px;
        }
        .active{
          font-weight: bold;
          font-size: 18px;
          color: #fff;
        }
      }
    }
  }
</style>