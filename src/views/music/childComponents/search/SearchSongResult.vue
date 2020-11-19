<template>
  <div class="search_song_res">
    <div class="scroll" ref="scroll">
      <div class="content" ref="content">
        <div class="res_item"
             v-for="(item,index) in searchRes"
             :class="{active: index == currentIndex}"
             @click="playClickMusic(index)">
          <div class="item_num">{{index + 1}}</div>
          <div class="item_info">
            <div class="item_title">{{item.songname}}</div>
            <div class="item_author">
              <span class="item_singer">{{item.singername}}</span> ·
              <span class="item_album">{{item.album_name}}</span>
            </div>
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
  </div>
</template>

<script>
  import { getSearchSongData } from "network/request";


  export default {
    name: "SearchSongResult",
    data() {
      return {
        searchRes: [],
        searchKeyword: "",
        page: 1,    // 当前搜索的页数
        pageSize: 20,   // 服务器每次返回的结果个数
        totalPage: 100,  // 搜索的总结果有多少页
        currentIndex: -1,
      }
    },
    mounted() {
      // 监听是否开始搜索歌曲
      this.$bus.$on("startSearch" , (value) => {
        // 手动点击的搜索，将搜索结果都归零
        this.searchRes = []
        this.page = 0
        // 开始搜索
        this.getSearchRes(value)
        // 保存搜索的关键词
        this.searchKeyword = value
      })

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
          this.getSearchRes(this.searchKeyword)
        }
      })

    },
    methods: {
      // 播放点击的歌曲
      playClickMusic(index) {
        // 传递播放信息到播放列表
        this.$bus.$emit("addPlayList" , {musicList: this.searchRes , index})
        this.currentIndex = index
      },

      // 获取搜索结果
      getSearchRes(value) {
        // 检查是否是相同的搜索内容
        if (value === this.searchKeyword) {
          // 页数加一
          this.page++
        }else {
          // 不是相同内容，清空搜索结果，页数变为1 ， 更新搜索内容
          this.searchRes = []
          this.page = 1
          this.searchKeyword = value
        }
        if (this.page >= this.totalPage) {
          // alert("已经没有下一页了")
          return
        }
        if (value != "") {
          getSearchSongData({
            url: "/api/v3/search/song",
            params: {
              keyword: value,
              page: this.page,
              pagesize: this.pageSize
            }
          }).then(res => {
            // 计算总共的页数
            let total = res.data.data.total
            this.totalPage = Math.floor(total / this.pageSize)
            // 将获取过来的结果拼接到原结果上
            let contact = this.searchRes.concat(res.data.data.info)
            this.searchRes = contact
          })
        }
      },
    }
  }
</script>

<style lang="less" scoped>
  .search_song_res{
    height: 100%;
    .scroll{
      height: 100%;
      overflow: auto;
      .content{
        .res_item{
          padding: 10px;
          display: flex;
          align-items: center;
          .item_num{
            flex: 1;
            text-align: center;
            font-size: 13px;
          }
          .item_info{
            flex: 8;
            display: flex;
            flex-direction: column;
            .item_title{
              font-size: 15px;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 1;
              overflow: hidden;
            }
            .item_author{
              font-size: 12px;
              margin-top: 5px;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 1;
              overflow: hidden;
              .item_singer{
                color: #666;
              }
              .item_album{
                color: #666;
              }
            }
          }
          .item_play_icon{
            flex: 1;
            display: flex;
            justify-content: center;
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
</style>