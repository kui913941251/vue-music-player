import {request} from "./index"

// 获取数据
export function getData(config) {
  return request(config)
}


// 获取排行榜信息
export function getRankListData(config) {
  config.url= "/rank/list"
  return request(config)
}
// 获取排行榜下面的歌单
export function getRankListMusicData(config) {
  config.url= "/rank/info"
  return request(config)
}


// 获取搜索音乐的结果
export function getSearchSongData(config) {
  config.url =  "/api/v3/search/song"
  return request(config)
}

// 获取搜索视频的结果
export function getSearchVideoDataKey(config) {
  config.url =  "/api/v3/search/mv"
  return request(config)
}

// 获取搜索专辑的结果
export function getSearchAlbumData(config) {
  config.url =  "/api/v3/search/album"
  return request(config)
}

// 获取搜索歌手的结果
export function getSearchSingerData(config) {
  // http://mobilecdn.kugou.com/api/v3/search/singer?format=json&keyword=111
    config.url =  "/api/v3/search/singer"
  return request(config)
}

// 获取专辑信息
export function getAlbumInfoData(config) {
  // http://mobilecdn.kugou.com/api/v3/album/song?albumid=36758574
  config.url =  "/api/v3/album/song"
  return request(config)
}

//  获取歌手信息
export function getSingerInfoData(config) {
  // http://mobilecdnbj.kugou.com/api/v3/singer/info?singerid=86747
  config.url =  "/api/v3/singer/info"
  return request(config)
}
//  获取歌手专辑信息
export function getSingerAlbumInfoData(config) {
  // http://mobilecdnbj.kugou.com/api/v3/singer/album?pagesize=20&singerid=86747&page=1
  config.url =  "/api/v3/singer/album"
  return request(config)
}
//  获取歌手MV信息
export function getSingerMvInfoData(config) {
  // http://mobilecdnbj.kugou.com/api/v3/singer/album?pagesize=20&singerid=86747&page=1
  config.url =  "/api/v3/singer/mv"
  return request(config)
}
//  获取歌手音乐信息
export function getSingerSongInfoData(config) {
  // http://mobilecdnbj.kugou.com/api/v3/singer/album?pagesize=20&singerid=86747&page=1
  config.url =  "/api/v3/singer/song"
  return request(config)
}

//  获取歌手分类
export function getSingerClassData(config) {
  config.url =  "/singer/class"
  return request(config)
}

//  获取歌手分类下面的歌手列表
export function getSingerClassDetailData(config) {
  return request(config)
}