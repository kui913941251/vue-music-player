<template>
  <div class="search_video_res">
    <div class="scroll" ref="scroll">
      <div class="content" ref="content">
        <div class="res_item" v-for="(item,index) in searchRes">
          <div class="item_img">
            <img :src="formatImgUrl(item.imgurl)" alt="">
            <div class="history_hot">
              <span class="iconfont icon-shipin">{{formatNum(item.historyheat)}}</span>
            </div>
          </div>
          <div class="item_info">
            <div class="item_title">{{item.filename}}</div>
            <div class="item_author">
              <span class="item_singer">{{item.singername}}</span>
              <span class="item_time">{{formatTime(item.duration)}}</span>
              <span class="item_push_date">{{formatPushDate(item.publishdate)}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { getSearchVideoDataKey } from "network/request";

  export default {
    name: "SearchVideoResult",
    data() {
      return {
        searchRes: [],
        searchKeyword: "",
        page: 1,    // 当前搜索的页数
        pageSize: 20,   // 服务器每次返回的结果个数
        totalPage: 100,  // 搜索的总结果有多少页
      }
    },
    mounted() {
      // 监听手动点击 搜索 开始搜索歌曲
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
      // 处理后台传过来的imgurl
      formatImgUrl(value) {
        let url = value
        url = url.replace("/{size}" , "")
        return url
      },
      // 处理数量
      formatNum(value) {
        let num = parseInt(value)
        if (num >= 10000) {
          num = Math.floor(num / 10000) + " 万"
        }
        return num
      },
      // 处理上传时间
      formatPushDate(value) {
        let date = value.split(" ")[0]
        return date
      },
      // 处理总时长
      formatTime(value) {
        let num = parseInt(value)
        let second = num % 60
        let min = Math.floor(num / 60)
        return (min > 10 ? min : "0" + min) + ":" + (second > 10 ? second : "0" + second)
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
          getSearchVideoDataKey({
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
  .search_video_res{
    height: 100%;
    .scroll{
      height: 100%;
      overflow: auto;
      .content{
        .res_item{
          padding: 10px 15px;
          display: flex;
          .item_img{
            position: relative;
            flex: 1;
            display: flex;
            align-items: center;
            background-color: #000;
            border-radius: 5px;
            overflow: hidden;
            .history_hot{
              position: absolute;
              right: 5px;
              bottom: 2px;
              span{
                font-size: 10px;
                color: #fff;
                &:before{
                  margin-right: 3px;
                }
              }
            }
            img{
              width: 100%;
            }
          }
          .item_info{
            margin-left: 10px;
            flex: 2;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            .item_title{
              font-size: 12px;
              font-weight: bold;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
              overflow: hidden;
            }
            .item_author{
              color: #666;
              font-size: 12px;
              margin-top: 5px;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 1;
              overflow: hidden;
              .item_singer{
                margin-right: 10px;
              }
              .item_time{
                margin-right: 10px;
              }
            }
          }
        }
      }
    }
  }
</style>