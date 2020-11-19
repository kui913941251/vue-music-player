<template>
  <div class="singer_music_content">
    <div class="scroll" ref="scroll">
      <div class="content" ref="content">
        <div class="res_item"
             v-for="(item,index) in searchRes"
             @click="playClickMusic(index)" :class="{active: index === currentIndex}">
          <div class="item_num">{{index + 1}}</div>
          <div class="item_info">
            <span class="item_title">{{item.filename.split("-")[1]}}</span>
            <span class="item_singer">{{item.filename.split("-")[0]}}</span>
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
  import {getSingerSongInfoData} from "network/request";

  export default {
    name: "SingerMusicContent",
    data() {
      return {
        singerId: '',
        searchRes: [],
        page: 1,    // 当前搜索的页数
        pageSize: 20,   // 服务器每次返回的结果个数
        totalPage: 100,  // 搜索的总结果有多少页
        currentIndex: -1,
      }
    },
    mounted() {
      // 监听是否开始搜索歌曲
      this.$bus.$on("getSingerMusicList" , (res) => {
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
      // 播放点击的歌曲
      playClickMusic(index) {
        // 传递播放信息到播放列表
        this.$bus.$emit("addPlayList" , {musicList: this.searchRes , index})
        this.currentIndex = index
      },
      // 处理后台传过来的imgurl
      formatImgUrl(value) {
        if (value == "" || value == undefined) return
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
      // 获取搜索结果
      getSearchRes(singerId) {
        getSingerSongInfoData({
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

<style lang="less"  scoped>
  .singer_music_content{
    height: 100%;
    .scroll{
      height: 100%;
      overflow: auto;
      .content{
        .res_item{
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
          .item_num{
            text-align: center;
            flex: 1;
          }
          .item_info{
            display: flex;
            flex-direction: column;
            overflow: hidden;
            flex: 8;
            .item_title{
              font-size: 14px;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 1;
              overflow: hidden;
            }
            .item_singer{
              font-size: 13px;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 1;
              overflow: hidden;
              color: #666;
            }
          }
          .item_play_icon{
            flex: 1;
            color: #666;
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