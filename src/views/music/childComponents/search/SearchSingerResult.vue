<template>
  <div class="search_singer_res">
    <div class="scroll" ref="scroll">
      <div class="content" ref="content">
        <div class="res_item" v-for="(item,index) in searchRes" @click="goToSingerPage(item)">
          <div class="item_img">
            <img :src="formatImgUrl(item.imgurl)" alt="">
          </div>
          <div class="item_info">
            <div class="item_singer">{{item.singername}}</div>
            <div class="item_singer_pro">
              <span class="singer_music" v-if="item.songcount > 0">单曲:{{item.songcount}}</span>
              <span class="singer_album" v-if="item.albumcount > 0">专辑:{{item.albumcount}}</span>
              <span class="singer_mv" v-if="item.mvcount > 0">MV:{{item.mvcount}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {getSearchSingerData , getSingerInfoData} from "network/request";

  export default {
    name: "SearchSingerResult",
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
    },
    methods: {
      // 获取搜索结果
      getSearchRes(value) {
        if (value != "") {
          getSearchSingerData({
            params: {
              keyword: value,
              format: 'json'
            }
          }).then(res => {
            // 提取搜索到的歌手列表
            let searchSingerList = res.data.data
            // 用变量保存
            let singerList = []
            // 根据歌手列表中每个的id，获取每个歌手的信息
            if (searchSingerList != null || searchSingerList != undefined){
              searchSingerList.forEach(item => {
                // 根据列表中每个的singerid 获取各自的信息，加入搜索结果
                getSingerInfoData({
                  params: {
                    singerid: item.singerid
                  }
                }).then(res => {
                  singerList.push(res.data.data)
                })
              })
            }
            // 将搜索的最终结果保存至数据
            this.searchRes = singerList
          })
        }
      },

      // 处理后台传过来的imgurl
      formatImgUrl(value) {
        let url = value
        url = url.replace("/{size}" , "")
        return url
      },

      // 进入歌手页面
      goToSingerPage(singerObj) {
        // 令歌手页面显示
        this.$bus.$emit("showSingerPage" , singerObj)
      }
    }
  }
</script>

<style lang="less" scoped>
  .search_singer_res{
    height: 100%;
    .scroll{
      height: 100%;
      overflow: auto;
      .content{
        .res_item{
          padding: 10px 10px;
          display: flex;
          .item_img{
            position: relative;
            flex: 1;
            display: flex;
            align-items: center;
            background-color: #fff;
            border-radius: 50%;
            overflow: hidden;
            img{
              width: 100%;
            }
          }
          .item_info{
            margin-left: 10px;
            flex: 5;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            .item_singer{
              font-size: 13px;
              font-weight: bold;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
              overflow: hidden;
            }
            .item_singer_pro{
              color: #666;
              font-size: 12px;
              margin-top: 5px;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 1;
              overflow: hidden;
              .singer_music{
                margin-right: 10px;
              }
              .singer_album{
                margin-right: 10px;
              }
              .singer_mv{
                margin-right: 10px;
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
    .item_num{
      color: var(--musicThemeColor);
    }
    .item_info{
      color: var(--musicThemeColor);
      .item_singer{
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