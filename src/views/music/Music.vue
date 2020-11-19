<template>
  <div id="music">
    <Head></Head>
    <tab-bar :tabs="tabs" @changeIndex="changeIndex" class="tab_bar"></tab-bar>
    <div class="music_content">
      <singer v-if="currentIndex === 0"></singer>
      <music-list v-else-if="currentIndex === 1"></music-list>
      <rank-list v-else-if="currentIndex === 2"></rank-list>
    </div>
    <music-list-page></music-list-page>
    <music-album></music-album>
    <music-singer></music-singer>
    <music-player></music-player>
    <music-rank-list-detail></music-rank-list-detail>
    <singer-class-detail></singer-class-detail>
    <search></search>
  </div>
</template>

<script>
  // 子组件
  import Singer from "./childComponents/Singer";
  import RankList from "./childComponents/RankList";
  import MusicList from "./childComponents/MusicList";
  import Head from "./childComponents/Head";
  import Search from "./childComponents/search/Search";
  import MusicListPage from "../musicListPage/MusicListPage";
  import MusicAlbum from "./childComponents/MusicAlbum";
  import MusicSinger from "./childComponents/music_singer/MusicSinger";
  import MusicRankListDetail from "./childComponents/MusicRankListDetail";
  import SingerClassDetail from "./childComponents/SingerClassDetail";

  // 公共组件
  import TabBar from "./childComponents/TabBar";
  import MusicPlayer from "components/common/MusicPlayer";

  // 网络请求
  import { getData } from "network/request"

  export default {
    name: "Music",
    components: {
      TabBar,
      Singer,
      RankList,
      MusicList,
      Head,
      MusicPlayer,
      Search,
      MusicListPage,
      MusicAlbum,
      MusicSinger,
      MusicRankListDetail,
      SingerClassDetail
    },
    data() {
      return {
        tabs: [
          {
            id: "0",
            name: "歌手"
          },
          {
            id: "1",
            name: "歌单"
          },
          {
            id: "2",
            name: "排行"
          }
        ],
        currentIndex: 0
      }
    },
    methods: {
      changeIndex(index) {
        this.currentIndex = index
      }
    }
  }
</script>

<style lang="less" scoped>
  #music{
    background-color: #FCFCFC;
    padding: 80px 0 40px;
    .tab_bar{
      position: fixed;
      left: 0;
      top: 40px;
    }
  }
</style>