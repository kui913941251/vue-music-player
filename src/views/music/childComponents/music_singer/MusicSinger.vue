<template>
  <transition name="music_singer_move">
    <div class="music_singer" v-show="isMusicSingerShow">
      <div class="scroll" ref="scroll">
        <div class="content" ref="content">
          <nav-bar class="nav_bar" ref="singer_nav">
            <div class="nav_left" slot="slot_left" @click="hiddenMusicSinger">
              <span class="iconfont icon-fanhui"></span>
            </div>
            <div class="nav_center" slot="slot_center" ref="nav_center">{{singerInfo.singername}}</div>
          </nav-bar>
          <div class="singer_info_content" ref="singer_info_content">
            <div class="singer_img">
              <img :src="formatImgUrl(singerInfo.imgurl)" alt="">
            </div>
            <div class="singer_name">{{singerInfo.singername}}</div>
          </div>
          <tab-bar :tabs="tabs" @changeIndex="changeTabsIndex" class="tab_bar" ref="tab_bar"></tab-bar>
          <tab-bar :tabs="tabs" @changeIndex="changeTabsIndex" class="tab_bar tab_bar_fixed" ref="tab_bar2"></tab-bar>
          <div class="product_content">
            <singer-music-content v-show="currentTabsIndex == 0"></singer-music-content>
            <singer-album-content v-show="currentTabsIndex == 1"></singer-album-content>
            <singer-mv-content v-show="currentTabsIndex == 2"></singer-mv-content>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import SingerMusicContent from "./SingerMusicContent";
  import SingerAlbumContent from "./SingerAlbumContent";
  import SingerMvContent from "./SingerMvContent";

  import NavBar from "components/common/NavBar";
  import TabBar from "../TabBar";

  import {getSingerInfoData} from "network/request";

  export default {
    name: "MusicSinger",
    components: {
      NavBar,
      TabBar,
      SingerMusicContent,
      SingerAlbumContent,
      SingerMvContent
    },
    data() {
      return {
        tabs: [
          {
            id: "0",
            name: "歌曲"
          },
          {
            id: "1",
            name: "专辑"
          },
          {
            id: "2",
            name: "视频"
          }
        ],
        singerInfo: {},
        currentTabsIndex: 0,
        isMusicSingerShow: false
      }
    },
    updated() {
      if (this.isMusicSingerShow) {
        // 监听滚动区域的滚动
        let scroll = this.$refs.scroll
        // 获取tabbar 偏移量 Y，并减去navbar的高度 40px
        let tabBarOffset = this.$refs.tab_bar.$el.offsetTop - 40
        scroll.addEventListener("scroll" , () => {
          // 页面当前滚动高度
          let pageY = scroll.scrollTop
          // 视窗的高度
          let scrollHeight = scroll.offsetHeight
          // 可滚动的内容高度
          let contentHeight = this.$refs.content.offsetHeight
          if ( (scrollHeight + pageY) >= contentHeight) {
            // 如果到底部，更新对应区域的内容
            this.getSingerProduction("drop")
          }
          if (pageY >= tabBarOffset) {
            // 如果滚动距离大于tabbar偏移量Y，则显示tabbar2
            this.$refs.tab_bar2.$el.style = "display:flex;"
          }else if(pageY < tabBarOffset){
            this.$refs.tab_bar2.$el.style = "display:none;"
          }
          // 获取顶部信息高度
          let singer_info_content = this.$refs.singer_info_content.offsetHeight
          if (pageY >= (singer_info_content - 40)) {
            // 控制顶部栏变色
            this.$refs.singer_nav.$el.style = "background-color: rgba(126, 126, 126,"+ ((pageY - 20) / 40) +");"
            this.$refs.nav_center.style = "opacity: 1;"
            // 控制顶部信息模糊度
            this.$refs.singer_info_content.style = "filter: blur(1px)"
          }else {
            this.$refs.singer_nav.$el.style = "background-color: transparent;"
            this.$refs.nav_center.style = "opacity: 0;"
            this.$refs.singer_info_content.style = "filter: blur(0)"
          }
        })
      }
    },
    mounted() {
      // 监听显示歌手页面
      this.$bus.$on("showSingerPage" , (singerObj) => {
        // 显示页面
        this.isMusicSingerShow = true
        // 保存歌手信息
        this.singerInfo = singerObj
        // 更新对应区域的内容
        this.getSingerProduction("click")
      })


    },
    methods: {
      // 隐藏歌手页面
      hiddenMusicSinger() {
        this.isMusicSingerShow = false
      },
      // 更改显示的区域,并请求数据
      changeTabsIndex(index) {
        // 将滚动区域归零
        this.$refs.scroll.scrollTop = 0
        this.currentTabsIndex = index
        this.getSingerProduction("click")
        // 同步tabbar选中
        this.$refs.tab_bar.currentIndex = index
        this.$refs.tab_bar2.currentIndex = index
      },
      // 处理后台传过来的imgurl
      formatImgUrl(value) {
        if (value == "" || value == undefined) return
        let url = value
        url = url.replace("/{size}" , "")
        return url
      },

      // 更新显示内容区域的数据
      getSingerProduction(type) {
        // 判断是在哪个区域
        if (this.currentTabsIndex == 0) {
          this.$bus.$emit("getSingerMusicList" , {singerId: this.singerInfo.singerid , type: type})
        }else if (this.currentTabsIndex == 1) {
          // 发出获取专辑信息的请求
          this.$bus.$emit("getSingerAlbumList" , {singerId: this.singerInfo.singerid , type: type})
        }else if (this.currentTabsIndex == 2) {
          this.$bus.$emit("getSingerMvList" , {singerId: this.singerInfo.singerid , type: type})
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .music_singer{
    position: fixed;
    z-index: 10;
    left: 0;
    top: 0;
    width: 100%;
    height: ~"calc(100vh - 40px)";
    background-color: #fcfcfc;
    .scroll{
      height: 100%;
      overflow: auto;
      .content{
        .nav_bar{
          position: absolute;
          z-index: 10;
          left: 0;
          top: 0;
          width: 100%;
          overflow: hidden;
          .nav_left{
            color: #fff;
          }
          .nav_center{
            /*transition: .3s;*/
            color: #fff;
            opacity: 0;
          }
        }
        .tab_bar{
          background-color: #fcfcfc;
          /deep/ .tab_item{
            color: #666;
          }
          /deep/ .line{
            background-color: #000;
          }
          /deep/ .active{
           color: #000;
            font-size: 16px;
            font-weight: bold;
          }
        }
        .tab_bar_fixed{
          position: fixed;
          z-index: 10;
          top: 40px;
          display: none;
        }
        .singer_info_content{
          display: flex;
          flex-direction: column;
          align-items: center;
          background-color: rgba(0,0,0,.5);
          padding: 50px 0 20px;
          .singer_img{
            width: 50px;
            height: 50px;
            overflow: hidden;
            border-radius: 50%;
            img{
              width: 100%;
              transform: scale(1.1);
            }
          }
          .singer_name{
            margin-top: 10px;
            color: #fff;
          }
        }
      }
    }
  }



  .music_singer_move-enter-active, .music_singer_move-leave-active {
    transition: .5s;
  }
  .music_singer_move-enter, .music_singer_move-leave-to /* .fade-leave-active below version 2.1.8 */ {
    transform: translateX(100%);
  }
</style>