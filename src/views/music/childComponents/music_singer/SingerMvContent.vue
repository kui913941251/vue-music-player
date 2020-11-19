<template>
  <div class="singer_mv_content">
    <div class="scroll" ref="scroll">
      <div class="content" ref="content">
        <div class="res_item" v-for="(item,index) in searchRes">
          <div class="item_img">
            <img :src="formatImgUrl(item.imgurl)" alt="">
          </div>
          <div class="item_info">
            <span class="iconfont icon-shipin">{{formatNum(item.historyheat)}}</span>
            <span class="item_title">{{item.filename}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {getSingerMvInfoData} from "network/request";

  export default {
    name: "SingerMvContent",
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
      // 监听是否开始搜索
      this.$bus.$on("getSingerMvList" , (res) => {
        // 保存歌手id
        this.singerId = res.singerId
        // 判断是点击还是下拉
        if (res.type == "click") {
          // 如果是点击，就清空数据
          this.searchRes = []
          this.page = 1
        }else if (res.type == "drop") {
          // 如果是下拉，page + 1
          this.page += 1
        }
        if (this.page >= this.total) {
          // 如果大于等于最大页数则返回
          return
        }
        // 开始搜索
        this.getSearchRes(this.singerId)
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
        if (value == "" || value == undefined) return
        let url = value
        url = url.replace("/{size}" , "")
        return url
      },
      // 处理数量
      formatNum(value) {
        if (value == "" || value == undefined) return
        let num = parseInt(value)
        if (num >= 10000) {
          num = Math.floor(num / 10000) + " 万"
        }
        return num
      },
      // 处理上传时间
      formatPushDate(value) {
        if (value == "" || value == undefined) return
        let date = value.split(" ")[0]
        return date
      },
      // 获取搜索结果
      getSearchRes(singerId) {
        getSingerMvInfoData({
          params: {
            singerid: singerId,
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
      },
      // 进入点击的当前专辑
      goToAlbum(item) {
        // 将当前专辑信息传到专辑页面
        this.$bus.$emit("addAlbum" , item)
      }
    }
  }
</script>

<style lang="less" scoped>
  .singer_mv_content{
    height: 100%;
    .scroll{
      height: 100%;
      overflow: auto;
      .content{
        padding: 10px 10px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        &:after{
          content: "";
          display: block;
          width: 45%;
        }
        .res_item{
          display: flex;
          flex-direction: column;
          width: 45%;
          padding-bottom: 5px;
          .item_img{
            width: 100%;
            border-radius: 5px;
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
            img{
              width: 100%;
              transform: scale(1.1);
            }
          }
          .item_info{
            display: flex;
            align-items: center;
            padding: 5px 0;
            .item_title{
              font-size: 12px;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 1;
              overflow: hidden;
              margin-left: 4px;
            }
            .iconfont{
              color: var(--musicThemeColor);
              font-size: 14px;
              vertical-align: middle;
              margin-top: 1px;
            }
          }
        }
      }
    }
  }
</style>