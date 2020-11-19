<template>
  <div class="music_list">
    <div class="scroll" ref="scroll">
      <div class="content" ref="content">
        <div class="list_item" v-for="(item , index) in musicList" :key="item.specialid" @click="goToMusicList(item.specialid)">
          <div class="left_img">
            <img :src="formatImgUrl(item.imgurl)" alt="">
          </div>
          <div class="right_info">
            <div class="title">
              {{item.specialname}}
            </div>
            <div class="play_count">
              <span class="iconfont icon-V"></span>
              <span>{{formatCount(item.playcount)}}</span>
            </div>
          </div>
          <div class="icon">
            <span class="iconfont icon-qianjin"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { getData } from "network/request";

  export default {
    name: "MusicList",
    data() {
      return {
        musicList: [],
        page: 1,    // 当前搜索的页数
      }
    },
    created() {
      this.getSearchRes()
    },
    mounted() {
      // 监听滚动区域的滚动
      let scroll = this.$refs.scroll
      scroll.addEventListener("scroll" , () => {
        // 页面当前滚动高度
        let pageY = scroll.scrollTop
        // 视窗的高度
        let scrollHeight = scroll.offsetHeight
        // 可滚动的内容高度
        let contentHeight = this.$refs.content.offsetHeight
        if ( (scrollHeight + pageY) >= contentHeight) {
          // 已经滚动到底部，获取下一页
          this.getSearchRes()
        }
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
      formatCount(value) {
        if (value == "" || value == undefined) return
        let num = parseInt(value)
        return num >= 10000 ? (num / 10000).toFixed(1) + " 万" : num
      },
      goToMusicList(specialid) {
        // this.$router.push("/musiclistpage/" + specialid)
        // 进入歌单页面，更新歌单信息
        this.$bus.$emit("updateSongList" , specialid)
      },
      // 获取搜索结果
      getSearchRes() {
        getData({
          url: "/plist/index",
          params: {
            json: true,
            page: this.page
          }
        }).then(res => {
          // 将获取过来的结果拼接到原结果上
          let contact = this.musicList.concat(res.data.plist.list.info)
          this.musicList = contact
          this.page++
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .music_list{
    height: ~"calc(100vh - 120px)";
    .scroll{
      height: 100%;
      overflow: auto;
      .content{
        .list_item{
          padding: 10px;
          display: flex;
          align-items: center;
          .left_img{
            flex: 1;
            img{
              width: 100%;
              border-radius: 10px;
            }
          }
          .right_info{
            flex: 4;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            padding: 0 10px;
            .title{
              font-size: 15px;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp:1;
              overflow: hidden;
            }
            .play_count{
              margin-top: 5px;
              span{
                vertical-align: middle;
                margin-right: 5px;
                font-size: 14px;
                color: #a89bb5;
              }
            }
          }
          .icon{
          }
        }
      }
    }
  }
</style>