<template>
  <transition name="album_move">
    <div class="music_album" v-if="isAlbumShow" ref="music_album">
      <div class="scroll" ref="scroll">
        <div class="content">
          <nav-bar class="album_nav" ref="album_nav">
            <div slot="slot_left" @click="hiddenAlbum">
              <span class="iconfont icon-fanhui"></span>
            </div>
            <div slot="slot_center" ref="nav_center" class="nav_center">
              专辑
            </div>
          </nav-bar>
          <div class="album_info_content" ref="album_info">
            <div class="bg_img" ref="bg_img">
              <img :src="formatImgUrl(albumInfo.imgurl)" alt="">
              <div class="mask"></div>
            </div>
            <div class="album_info">
              <div class="album_img">
                <img :src="formatImgUrl(albumInfo.imgurl)" alt="">
              </div>
              <div class="album_author">
                <div class="album_name">{{albumInfo.albumname}}</div>
                <div class="album_singer">{{albumInfo.singername}}</div>
              </div>
            </div>
          </div>
          <div class="album_list">
            <div class="album_item"
                 v-for="(item,index) in albumMusicList"
                 :class="{active: index == currentIndex}"
                 @click="playClickMusic(index)">
              <div class="item_num">{{index + 1}}</div>
              <div class="item_info">
                <div class="info_title">{{item.filename.split('-')[1]}}</div>
                <div class="info_singer">{{item.filename.split('-')[0]}}</div>
              </div>
              <div class="item_icon">
                <span class="iconfont icon-bofangshu"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import NavBar from "components/common/NavBar";

  import { getAlbumInfoData } from "network/request";

  export default {
    name: "MusicAlbum",
    components: {
      NavBar
    },
    data() {
      return {
        isAlbumShow: false,
        albumInfo: {},
        albumMusicList: [],
        imgUrl: "http://imge.kugou.com/stdmusic/20200323/20200323184344837434.jpg",
        currentIndex: -1,
      }
    },
    created() {
    },
    updated() {
      if (this.isAlbumShow) {
        // 监听页面的滚动
        let scroll = this.$refs.scroll
        scroll.addEventListener("scroll" , () => {
          // 获取信息栏的高度
          let infoHeight = this.$refs.album_info.offsetHeight
          // 已滚动的高度
          let pageY = scroll.scrollTop
          // 如果滚动高度超过10px ， 则设置信息栏的透明度
          if (pageY >= 10) {
            this.$refs.album_info.style = "filter: blur(1px)"
          }else {
            this.$refs.album_info.style = "opacity: 1;"
          }
          // 顶部栏的高度为  40px
          // 算出高度差
          let diff = infoHeight - 40
          if (pageY > 20) {
            // 控制顶部栏渐变色
            this.$refs.album_nav.$el.style = "background-color: rgba(255,255,255,"+ ((pageY - 20) / 40) +");color: rgba(0,0,0,"+ ((pageY - 20) / 40 +0.4) +");"
            this.$refs.nav_center.innerHTML = this.albumInfo.albumname
          }else {
            this.$refs.album_nav.$el.style = "background-color: transparent;color: #fff;"
            this.$refs.nav_center.innerHTML = "专辑"
          }
        })
      }
    },
    mounted() {
      // 监听加入的专辑信息
      this.$bus.$on("addAlbum" , (item) => {
        // 显示专辑页面
        this.isAlbumShow = true
        // 保存专辑对象
        this.albumInfo = item
        // 从中取出专辑id
        let albumid = item.albumid
        // 获取专辑信息
        getAlbumInfoData({
          params: {
            albumid
          }
        }).then(res => {
          this.albumMusicList = res.data.data.info
        })
        // 将选中的index变为-1
        this.currentIndex = -1
      })

    },
    methods: {
      // 隐藏专辑
      hiddenAlbum() {
        this.isAlbumShow = false
      },

      // 播放点击的歌曲
      playClickMusic(index) {
        // 传递播放信息到播放列表
        this.$bus.$emit("addPlayList" , {musicList: this.albumMusicList , index})
        // 改变currentIndex
        this.currentIndex = index
      },
      // 处理后台传过来的imgurl
      formatImgUrl(value) {
        if (value == "" || value == undefined) return
        let url = value
        url = url.replace("/{size}" , "")
        return url
      }
    }
  }
</script>

<style lang="less" scoped>
  .music_album{
    position: fixed;
    background-color: #fcfcfc;
    z-index: 15;
    top: 0;
    left: 0;
    width: 100%;
    .scroll{
      overflow: auto;
      height: ~"calc(100vh - 40px)";
      .content{

        .album_nav{
          position: fixed;
          z-index: 1;
          left: 0;
          top: 0;
          width: 100%;
          color: #fff ;
          /*transition: .5s;*/
          .nav_center{
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            overflow: hidden;
          }
        }
        .album_info_content{
          position: relative;
          height: 45vh;
          display: flex;
          justify-content: center;
          align-items: center;
          .bg_img{
            position: absolute;
            z-index: -1;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
            height: 45vh;
            .mask{
              position: absolute;
              left: 0;
              top: 0;
              bottom: 0;
              right: 0;
            }
            img{
              width: 100%;
              transform: scale(1.1);
              filter: blur(10px);
            }
          }
          .album_info{
            display: flex;
            padding: 0 30px;
            .album_img{
              width: 80px;
              img{
                width: 100%;
                border-radius: 5px;
                vertical-align: middle;
              }
            }
            .album_author{
              flex: 1;
              margin-left: 10px;
              display: flex;
              flex-direction: column;
              justify-content: space-around;
              .album_name{
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                word-break:break-all;
                font-size: 13px;
                color: #fff;
                overflow: hidden;
              }
              .album_singer{
                font-size: 12px;
                color: #fff;
              }
            }
          }
        }
        .album_list{
          padding: 0 10px;
          .album_item{
            display: flex;
            padding: 10px 0;
            .item_num{
              flex: 1;
              display: flex;
              justify-content: center;
              align-items: center;
            }
            .item_info{
              flex: 5;
              .info_title{
                font-size: 15px;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 1;
                overflow: hidden;
              }
              .info_singer{
                font-size: 13px;
                margin-top: 5px;
                color: #666;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 1;
                overflow: hidden;
              }
            }
            .item_icon{
              flex: 1;
              display: flex;
              justify-content: center;
              align-items: center;
              color: #666;
            }
          }
        }
      }
    }
  }


  .active{
    position: relative;
    &:before{
      content: "";
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      height: 50%;
      width: 2px;
      background-color: var(--musicThemeColor);
    }
    .item_num{
      color: var(--musicThemeColor);
    }
    .item_info{
      color: var(--musicThemeColor);
      .info_singer{
        color: var(--musicThemeColor) !important;
      }
    }
  }

  .album_move-enter-active, .album_move-leave-active {
    transition: .5s;
  }
  .album_move-enter, .album_move-leave-to /* .fade-leave-active below version 2.1.8 */ {
    transform: translateX(100%);
  }
</style>