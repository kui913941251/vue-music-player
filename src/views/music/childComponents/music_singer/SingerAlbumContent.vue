<template>
  <div class="singer_album_content">
      <div class="scroll" ref="scroll">
        <div class="content" ref="content">
          <div class="res_item" v-for="(item,index) in searchRes" @click="goToAlbum(item)">
            <div class="item_img">
              <img :src="formatImgUrl(item.imgurl)" alt="">
            </div>
            <div class="item_info">
              <div class="item_title">{{item.albumname}}</div>
              <div class="item_author">
                <span class="item_push_date">{{formatPushDate(item.publishtime)}}</span>
                <span class="item_num">{{item.songcount + "首"}}</span>
              </div>
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
  import {getSingerAlbumInfoData} from "network/request";

  export default {
    name: "SingerAlbumContent",
    data() {
      return {
        singerId: '',
        searchRes: [],
        page: 1,    // 当前搜索的页数
        pageSize: 20,   // 服务器每次返回的结果个数
        totalPage: 100,  // 搜索的总结果有多少页
      }
    },
    mounted() {
      // 监听是否开始搜索歌曲
      this.$bus.$on("getSingerAlbumList" , (res) => {
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
      // 获取搜索结果
      getSearchRes(singerId) {
          getSingerAlbumInfoData({
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
  .singer_album_content{
    height: 100%;
    .scroll{
      height: 100%;
      overflow: auto;
      .content{
        padding: 0 10px;
        .res_item{
          padding: 10px 0;
          display: flex;
          align-items: center;
          .item_img{
            position: relative;
            flex: 1;
            display: flex;
            align-items: center;
            background-color: #000;
            border-radius: 5px;
            overflow: hidden;
            img{
              width: 100%;
            }
          }
          .item_info{
            margin-left: 10px;
            flex: 4;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            .item_title{
              font-size: 13px;
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
              .item_num{
                margin-left: 10px;
              }
            }
          }
        }
      }
    }
  }
</style>