<template>
  <transition name="singer_class_detail">
    <div class="singer_class_detail" v-if="isClassDetailShow">
      <nav-bar class="nav_bar">
        <div class="nav_left" slot="slot_left" @click="hiddenClassDetail">
          <span class="iconfont icon-fanhui"></span>
        </div>
        <div class="nav_center" slot="slot_center">{{singerClassName}}</div>
      </nav-bar>
      <div class="scroll" ref="scroll">
        <div class="content" ref="content">
          <div class="singer_list">
            <div class="singer_item" v-for="item in singerList" @click="goToSingerPage(item)">
              <div class="item_img">
                <img :src="formatImgUrl(item.imgurl)" alt="">
              </div>
              <div class="item_singer">{{item.singername}}</div>
              <div class="item_icon">
                <span class="iconfont icon-qianjin"></span>
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

  import {getSingerClassDetailData} from "network/request";

  export default {
    name: "SingerClassDetail",
    components: {
      NavBar
    },
    data() {
      return {
        isClassDetailShow: false,
        singerClassName: "",
        singerList: [],
        classId: "",
        page: 1,    // 当前搜索的页数
        pageSize: 20,   // 服务器每次返回的结果个数
        totalPage: 100,  // 搜索的总结果有多少页
      }
    },
    updated() {
      if (this.isClassDetailShow) {
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
            this.getSearchRes(this.classId)
          }
        })
      }
    },
    mounted() {
      // 更新歌手类别
      this.$bus.$on("addClassInfo" , (classId => {
        // 先清空列表
        this.singerList = []
        this.isClassDetailShow = true
        this.getSearchRes(classId)
      }))

    },
    methods: {
      // 隐藏页面
      hiddenClassDetail() {
        this.isClassDetailShow = false
      },
      // 处理后台传过来的imgurl
      formatImgUrl(value) {
        if (value == "" || value == undefined) return
        let url = value
        url = url.replace("/{size}" , "")
        return url
      },
      // 获取搜索结果
      getSearchRes(classId) {
        getSingerClassDetailData({
          url :  "/singer/list/"+ classId,
          params: {
            json: true,
            page: this.page
          }
        }).then(res => {
          // 保存title
          this.singerClassName = res.data.classname
          this.classId = res.data.classid
          // 将获取过来的结果拼接到原结果上
          let contact = this.singerList.concat(res.data.singers.list.info)
          this.singerList = contact
        })
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
  .singer_class_detail{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: ~"calc(100vh - 40px)";
    background-color: #fcfcfc;
    padding-top: 40px;
    .nav_bar{
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      background-color: #fff;
    }
    .scroll{
      height: 100%;
      overflow: auto;
      .content{
        .singer_list{
          .singer_item{
            display: flex;
            align-items: center;
            padding: 10px;
            .item_img{
              flex: 1;
              border-radius: 50%;
              overflow: hidden;
              img{
                width: 100%;
                vertical-align: middle;
              }
            }
            .item_singer{
              flex: 4;
              margin-left: 10px;
            }
            .item_icon{
              color: #666;
            }
          }
        }
      }
    }
  }



  .singer_class_detail-active, .singer_class_detail-leave-active {
    transition: .5s;
  }
  .singer_class_detail-enter, .singer_class_detail-leave-to /* .fade-leave-active below version 2.1.8 */ {
    transform: translateX(100%);
  }
</style>