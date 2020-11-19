import {getData} from "network/request";

export async function playMusic(hash , Vue) {
  // 先暂停音乐
  await Vue.$audio.pause()
  // 同步播放器播放状态
  Vue.$bus.$emit("changePlayState" , true)
  let res = await getClickMusicInfo(hash)
  Vue.$audio.src = res.play_url
  // this.$audio.play_target = res
  // 防止更改$audio的地址值，所以遍历添加属性
  for(let item in res) {
    Vue.$audio.play_target[item] = res[item]
  }
  // 更改两个播放器的播放状态
  Vue.$bus.$emit("changePlayState" , false)
  await Vue.$audio.play()
  // 发出获取歌词的信号
  Vue.$bus.$emit("getLyrics")
  // 判断歌曲题目是否超过一行
  Vue.$bus.$emit("judgeTitleWidth")
}
export async function domnloadMusic(hash , Vue) {
  let a = document.createElement('a')
  let res = await getClickMusicInfo(hash)
  let url = res.play_url
  a.href = url
  a.click()
}

export async function getClickMusicInfo(hash , Vue) {
    let res = await getData({
      url: "/yy/index.php",
      params: {
        r: "play/getdata",
        hash
      },
      withCredentials: true
    })
    if(res) {
      return res.data.data
    }
  }