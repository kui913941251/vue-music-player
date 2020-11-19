<template>
  <transition name="list_move">
    <div class="music_list_page" v-if="isListShow">
      <nav-bar class="nav_bar" >
        <div slot="slot_left" class="nav_left" @click="hiddenList">
          <span class="iconfont icon-fanhui"></span>
        </div>
        <div slot="slot_center" class="nav_center">
          {{musicListItem.info.list.specialname}}
        </div>
      </nav-bar>
      <div class="scroll_container">
        <div class="scroll_content" v-if="musicListItem.info.list">
          <div class="banner">
            <img :src="formatImgUrl(musicListItem.info.list.imgurl)" alt="">
          </div>
          <div class="intro" :class="{drop: introIsDrop}">
            <div class="content">{{musicListItem.info && musicListItem.info.list.intro}}</div>
            <span class="iconfont" :class="introIsDrop? 'icon-xiala1' : 'icon-xiala'" @click="changeDrop"></span>
          </div>
          <div class="music_list" >
            <div class="music_item" v-for="(item, index) in musicList" @click="playMusic(index)" :class="{active: index == currentIndex}">
              <div class="item_info">
                <div class="item_title">{{item.filename.split("-")[1]}}</div>
                <div class="item_singer">{{item.filename.split("-")[0]}}</div>
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

  import { getData } from "network/request";

  import {getClickMusicInfo} from "utils/music";

  export default {
    name: "MusicListPage",
    components: {
      NavBar
    },
    data() {
      return {
        isListShow: false,
        musicListItem: {
          info:{list: ""}
        },
        introIsDrop: false,
        musicList: [],
        musicUrl: "",
        currentIndex: -1,
        specialid: ""
      }
    },
    created() {
      document.cookie="kg_mid=2333";
    },
    mounted() {
      this.$bus.$on("updateSongList" , (specialid) => {
        if (specialid != this.specialid) {
          this.currentIndex = -1
        }
        this.specialid = specialid
        getData({
          url: "/plist/list/" + specialid,
          params:{
            json: true
          }
        }).then(res => {
          this.musicListItem = res.data
          this.musicList = res.data.list.list.info
        })
        this.isListShow = true
      })
    },
    methods: {
      formatImgUrl(value) {
        let url = value
        url = url.replace("/{size}" , "")
        return url
      },
      changeDrop() {
        this.introIsDrop = !this.introIsDrop
      },
      playMusic(index) {
        // 将播放列表数组传入播放列表
        this.$bus.$emit("addPlayList" , {musicList: this.musicList , index})
        // 将播放列表数组传入缓存
        localStorage.setItem("musicList" , JSON.stringify(this.musicList))
        this.currentIndex = index
      },
      // 隐藏歌单
      hiddenList() {
        this.isListShow = false
      }
    }
  }
</script>

<style lang="less" scoped>
  .music_list_page{
    position: fixed;
    z-index: 10;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    background-color: #fcfcfc;
    padding-top: 40px;
    .nav_bar{
      background-color: #2ca2f9;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      .nav_left{
        color: #fff;
        span{
          font-size: 24px;
        }
      }
      .nav_center{
        font-size: 13px;
        color: #fff;
      }
    }
    .scroll_container{
      height: ~"calc(100vh - 40px - 40px)";
      overflow: auto;
      .scroll_content{
        .banner{
          width: 100%;
          height: 250px;
          line-height: 250px;
          overflow: hidden;
          img{
            width: 100%;
          }
        }
        .intro{
          position: relative;
          padding: 5px 30px 5px 10px;
          line-height: 20px;
          font-size: 14px;
          color: #333333;
          box-shadow: 0px 3px 3px #eee;
          .content{
            margin-right: 5px;
            overflow: hidden;
            height: 20px;
          }
          span{
            position: absolute;
            right: 10px;
            top: 5px;
            width: 16px;
            height: 16px;
            color: #bfbfbf;
          }
        }
        .drop{
          .content{
            height: auto;
          }
        }
        .music_list{
          .music_item{
            padding: 10px;
            display: flex;
            align-items: center;
            border-bottom: 1px solid #e5e5e5;
            .item_info{
              padding-left: 10px;
              flex: 9;
              .item_title{
                font-size: 15px;
                margin-bottom: 5px;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 1;
                overflow: hidden;
              }
              .item_singer{
                font-size: 13px;
                color: #666;
              }
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
      left: 2px;
      top: 50%;
      transform: translateY(-50%);
      height: 50%;
      width: 2px;
      background-color: var(--musicThemeColor);
    }
    .item_info{
      color: var(--musicThemeColor);
      .item_singer{
        color: var(--musicThemeColor) !important;
      }
    }
    .item_icon{
      span{
        color: var(--musicThemeColor);
      }
    }
  }


  .list_move-enter-active, .list_move-leave-active {
    transition: .5s;
  }
  .list_move-enter, .list_move-leave-to /* .fade-leave-active below version 2.1.8 */ {
    transform: translateX(100%);
  }
</style>