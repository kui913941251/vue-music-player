module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        "assets": "@/assets",
        "router": "@/router",
        "store": "@/store",
        "views": "@/views",
        "components": "@/components",
        "network": "@/network",
        "utils": "@/utils"
      }
    }
  },
  devServer: {
    proxy: {
      "/plist/index": {   // 获取音乐歌单
        target: "http://m.kugou.com/"
      },
      "/plist/list": {    // 获取歌单下面的音乐列表
        target: "http://m.kugou.com/"
      },
      "/rank/list": {     // 获取排行榜
        target: "http://m.kugou.com/"
      },
      "/rank/info": {     // 获取排行榜下面的歌单
        target: "http://m.kugou.com/"
      },
      "/singer/class": {   // 获取歌手信息
        target: "http://m.kugou.com/"
      },
      "/yy/index.php": {    // 获取音乐详情
        target: "http://www.kugou.com/"
      },
      "/api/v3/search/hot": {  // 获取热门信息
        target: "http://mobilecdn.kugou.com/"
      },
      "/api/v3/search/song": {  // 音乐搜索
        target: "http://mobilecdn.kugou.com/"
      },
      "/api/v3/search/mv": {        // mv搜索  关键词
        target: "http://msearch.kugou.com/"
      },
      "/api/v3/search/album": {        // 专辑搜索  关键词
        target: "http://msearch.kugou.com/"
      },
      "/api/v3/album/song": {        // 获取专辑信息  id
        target: "http://mobilecdn.kugou.com/"
      },
      "/api/v3/search/singer": {        // 歌手搜索 关键词
        target: "http://mobilecdn.kugou.com/"
      },
      "/api/v3/singer/info": {        // 获取歌手信息 id
        target: "http://mobilecdnbj.kugou.com/"
      },
      "/api/v3/singer/album": {        // 获取歌手专辑信息 id
        target: "http://mobilecdnbj.kugou.com/"
      },
      "/api/v3/singer/mv": {        // 获取歌手MV信息 id
        target: "http://mobilecdnbj.kugou.com/"
      },
      "/api/v3/singer/song": {        // 获取歌手音乐信息 id
        target: "http://mobilecdnbj.kugou.com/"
      },
      "/singer/list": {        // 获取歌手分类下面的歌手列表
        target: "http://m.kugou.com/"
      }
    }
  }
}