<template>
  <transition name="rank_list_detail">
    <div class="rank_list_detail" v-if="isRankDetailShow">
      <nav-bar class="nav_bar">
        <div class="nav_left" slot="slot_left" @click="isRankDetailShow = false">
          <span class="iconfont icon-fanhui"></span>
        </div>
        <div class="nav_center" slot="slot_center">
          {{rankDetail.info.rankname}}
        </div>
      </nav-bar>
      <div class="rank_banner">
        <img :src="formatImgUrl(rankDetail.info.bannerurl)" alt="">
      </div>
      <div class="rank_song_list">
        <div class="res_item"
             v-for="(item,index) in rankDetail.songs.list"
             :class="{active: index == currentIndex}"
             @click="playClickMusic(index)">
          <div class="item_num">{{index + 1}}</div>
          <div class="item_info">
            <div class="item_title">{{item.filename.split("-")[1]}}</div>
            <div class="item_singer">{{item.filename.split("-")[0]}}</div>
          </div>
          <div class="item_play_icon">
            <span class="iconfont icon-bofangshu"></span>
          </div>
          <div class="item_icon">
            <span class="iconfont icon-qianjin"></span>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import NavBar from "components/common/NavBar";

  import {getRankListMusicData} from "network/request";

  export default {
    name: "MusicRankListDetail",
    components: {
      NavBar
    },
    data() {
      return {
        isRankDetailShow: false,
        rankDetail:{},
        currentIndex: -1,
      }
    },
    mounted() {
      this.$bus.$on("addRank" , rankId => {
        getRankListMusicData({
          params: {
            rankid: rankId,
            page: 1,
            json: true
          }
        }).then(res => {
          this.rankDetail = res.data
          this.currentIndex = -1
          this.isRankDetailShow = true
        })
      })
    },
    methods: {
      // 处理后台传过来的imgurl
      formatImgUrl(value) {
        if (value == "" || value == undefined) return
        let url = value
        url = url.replace("/{size}" , "")
        return url
      },
      // 播放点击的歌曲
      playClickMusic(index) {
        // 传递播放信息到播放列表
        this.$bus.$emit("addPlayList" , {musicList: this.rankDetail.songs.list , index})
        this.currentIndex = index
      },
    }
  }
</script>

<style lang="less" scoped>
  .rank_list_detail{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: ~"calc(100vh - 40px)";
    background-color: #fcfcfc;
    padding-top: 40px;
    overflow: auto;
    .nav_bar{
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      background-color: #fff;
    }
    .rank_banner{
      width: 100%;
      img{
        width: 100%;
      }
    }
    .rank_song_list{
      .res_item{
        padding: 10px;
        display: flex;
        align-items: center;
        .item_num{
          flex: 1;
          text-align: center;
        }
        .item_info{
          flex: 8;
          display: flex;
          flex-direction: column;
          .item_title{
            font-size: 14px;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            overflow: hidden;
          }
          .item_singer{
            font-size: 13px;
            color: #666;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            overflow: hidden;
          }
        }
        .item_play_icon{
          flex: 1;
          display: flex;
          justify-content: center;
          color: #666;
        }
        .item_icon{
          color: #666;
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
    .item_num{
      color: var(--musicThemeColor);
    }
    .item_info{
      color: var(--musicThemeColor);
      .item_singer{
        color: var(--musicThemeColor) !important;
      }
      .item_album{
        color: var(--musicThemeColor) !important;
      }
    }
    .item_play_icon{
      span{
        color: var(--musicThemeColor);
      }
    }
  }


  .rank_list_detail-active, .rank_list_detail-leave-active {
    transition: .5s;
  }
  .rank_list_detail-enter, .rank_list_detail-leave-to /* .fade-leave-active below version 2.1.8 */ {
    transform: translateX(100%);
  }
</style>