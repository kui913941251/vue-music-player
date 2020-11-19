<template>
  <transition name="search_move">
    <div class="search" v-show="searchShow">
      <div class="search_bar">
        <div class="back" @click="hiddenSearch">
          <span class="iconfont icon-fanhui"></span>
        </div>
        <div class="search_input">
          <span class="iconfont icon-sousuo"></span>
          <input type="text" placeholder="请输入关键字" v-model="typeWord" @keydown="useEnter">
          <span class="iconfont icon-message-close clear_result" @click="clearTypeWord"></span>
        </div>
        <div class="start_search" @click="startSearch">搜索</div>
        <div class="cancel_btn" @click="clearSearchRes">取消</div>
      </div>
      <div class="search_content" ref="search_content">
        <div class="search_res"  v-show="isSearchResShow">
          <tab-bar :tabs="tabs" class="search_tab" @changeIndex="changeCurrentTabsIndex"></tab-bar>
          <div class="type_content">
            <search-song-result v-show="currentTabsIndex == 0"></search-song-result>
            <search-video-result v-show="currentTabsIndex == 1"></search-video-result>
            <search-album-result v-show="currentTabsIndex == 2"></search-album-result>
            <search-singer-result v-show="currentTabsIndex == 3"></search-singer-result>
          </div>
        </div>
        <div class="search_keyword" v-show="!isSearchResShow">
          <div class="search_history">
            <div class="title">
              <h4>搜索历史</h4>
              <span class="iconfont icon-qingkong" @click="clearHistorySearch"></span>
            </div>
            <div class="history_content">
              <div class="history_item" v-for="item in searchHistory" @click="clickTag(item)">
                {{item}}
              </div>
            </div>
          </div>
          <div class="hot_search">
            <h4>热门搜索</h4>
            <div class="hot_search_content">
              <div class="hot_search_item" v-for="(item , index) in hotSearch" @click="clickTag(item.keyword)">
                <div class="hot_title">{{item.keyword}}</div>
                <!--<div class="hot_num">{{index + 1}}</div>-->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import SearchSongResult from "./SearchSongResult";
  import SearchAlbumResult from "./SearchAlbumResult";
  import SearchVideoResult from "./SearchVideoResult";
  import SearchSingerResult from "./SearchSingerResult";

  import TabBar from "../TabBar";

  import {getData} from "network/request";

  export default {
    name: "Search",
    components: {
      TabBar,
      SearchSongResult,
      SearchAlbumResult,
      SearchVideoResult,
      SearchSingerResult
    },
    data() {
      return {
        tabs: [
          {
            id: "0",
            name: "歌曲"
          },
          {
            id: "1",
            name: "视频"
          },
          {
            id: "2",
            name: "专辑"
          },
          {
            id: "3",
            name: "歌手"
          }
        ],
        currentTabsIndex: 0,
        searchShow: false,
        hotSearch: [],
        searchHistory: [],
        typeWord: '',
        searchKeyword: "",
        timer: null,
        isSearchResShow: false,
        page: 1,    // 当前搜索的页数
        pageSize: 20,   // 服务器每次返回的结果个数
        totalPage: 100,  // 搜索的总结果有多少页
      }
    },
    created() {
      // 获取热门搜索
      getData({
        url: "/api/v3/search/hot",
        params: {
          format: 'json',
          plat: 0,
          count: 30
        }
      }).then(res => {
        this.hotSearch = res.data.data.info
      })

      // 读取搜索记录
      let searchHistory = JSON.parse(localStorage.getItem("searchHistory"))
      if (searchHistory === null) {
        searchHistory = []
      }
      this.searchHistory = searchHistory
    },
    updated() {
      if(this.isSearchResShow) {
        let search_content = this.$refs.search_content
        search_content.onscroll = () => {
          // 获取滚动容器高度
          let contentHeight = search_content.offsetHeight
          // 获取总共可以的滚动高度
          let scrollHeight = this.$refs.scroll_content && this.$refs.scroll_content.offsetHeight
          // 已经滚动的高度
          let scrollY = search_content.scrollTop
          if ((scrollY + contentHeight) >= scrollHeight) {
            // 已经滚到底部，继续获取下一页
            this.getSearchRes(this.searchKeyword)
          }
        }
      }
    },
    mounted() {
      // 显示search
      this.$bus.$on("showSearch" , () => {
        this.searchShow = true
      })


    },
    methods: {
      async startSearch() {
        // 获取搜索表单的关键词
        let value = this.typeWord
        if (value == "") return  // 如果输入框为空，则return
        // 显示搜索结果
        this.isSearchResShow = true
        // 发送搜索请求
        this.$bus.$emit("startSearch" , value)
        // 保存搜索记录
        this.saveSearchHistory(value)
      },
      // 保存搜索记录
      saveSearchHistory(value) {
        if (value == "") return // 如果为空，则不保存
        // 获取缓存中的搜索记录
        let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || []
        // 查看缓存中是否存在当前搜索记录
        let res = searchHistory.findIndex(item => item === value)
        if (res == -1) {
          // 未找到当前的搜索记录，保存到缓存
          searchHistory.unshift(value)
        }else {
          // 找到了当前的搜索记录，清除记录，将当前搜索保存到前面
          searchHistory.splice(res , 1)
          searchHistory.unshift(value)
        }
        // 更新数据到界面
        this.searchHistory = searchHistory
        // 保存搜索记录到缓存
        localStorage.setItem("searchHistory" , JSON.stringify(this.searchHistory))
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
          getData({
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

      // 清空历史搜索
      clearHistorySearch() {
        this.searchHistory = []
        // 同步缓存
        localStorage.setItem("searchHistory" , JSON.stringify(this.searchHistory))
      },

      // 播放点击的歌曲
      playClickMusic(index) {
        // 传递播放信息到播放列表
        this.$bus.$emit("addPlayList" , {musicList: this.searchRes , index})
      },

      // 点击历史或者热搜后跳转搜索
      clickTag(value) {
        this.typeWord = value
        this.startSearch(value)
      },
      // 隐藏search
      hiddenSearch() {
        this.searchShow = false
      },

      // 清空当前搜索的结果
      clearSearchRes() {
        this.isSearchResShow = false
      },
      // 清空搜索关键词
      clearTypeWord() {
        this.typeWord = ""
      },
      // 更改tab的选中Index
      changeCurrentTabsIndex(index) {
        this.currentTabsIndex = index
      },

      // 聚焦监听回车
      useEnter(e) {
        if (e.keyCode == 13) {
          this.startSearch()
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .search{
    position: fixed;
    left: 0;
    bottom: 0;
    top: 0;
    right: 0;
    background-color: #fafafa;
    padding-top: 50px;
    .search_bar{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      display: flex;
      align-items: center;
      background-color: #fafafa;
      padding: 10px;
      .back{
        width: 30px;
      }
      .search_input{
        background-color: #fff;
        box-shadow: 0 0 5px #eee;
        height: 30px;
        display: flex;
        align-items: center;
        padding: 0 10px;
        border-radius: 15px;
        flex: 1;
        input{
          flex: 1;
          outline: none;
          border: none;
          padding-left: 10px;
        }
        span{
          font-size: 12px;
          color: #666;
        }
      }
      .cancel_btn , .start_search{
        font-size: 13px;
        width: 40px;
        text-align: center;
        font-weight: bold;
      }
    }

    .search_content{
      position: relative;
      height: ~"calc(100vh - 50px - 40px)";
      /*overflow: auto;*/
      .search_res{
        position: relative;
        background-color: #fafafa;
        padding: 40px 0px 0;
        height: 100%;
        overflow: hidden;
        .search_tab{
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          background-color: #fafafa;
        }
        .type_content{
          height: ~"calc(100%)";
          overflow: auto;
        }
      }
      .search_keyword{
        padding: 10px;
        .search_history{
          .title{
            display: flex;
            justify-content: space-between;
            align-items: center;
            span{
              color: #666;
              font-size: 13px;
            }
            h4{
              font-size: 15px;
            }
          }
          .history_content{
            display: flex;
            flex-wrap: wrap;
            padding: 10px 0 20px;
            .history_item{
              background-color: #fff;
              padding: 0 10px;
              font-size: 13px;
              height: 20px;
              line-height: 20px;
              border-radius: 10px;
              margin-right: 10px;
              margin-top: 10px;
            }
          }
        }
        .hot_search{
          h4 {
            font-size: 15px;
          }
          .hot_search_content{
            display: flex;
            flex-wrap: wrap;
            .hot_search_item{
              background-color: #fff;
              padding: 0 10px;
              font-size: 13px;
              height: 20px;
              line-height: 20px;
              border-radius: 10px;
              margin-right: 10px;
              margin-top: 10px;
              .hot_title{

              }
            }
          }
        }
      }
    }
  }


  .search_move-enter-active, .search_move-leave-active {
    transition: .5s;
  }
  .search_move-enter, .search_move-leave-to /* .fade-leave-active below version 2.1.8 */ {
    transform: translateX(100%);
  }
</style>