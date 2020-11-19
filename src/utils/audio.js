


export function createAudioObj(Vue) {
  // 创建audio对象
  let audio = document.createElement("audio")
  audio.play_target = {}
  audio.addEventListener("timeupdate" , function () {
    Vue.prototype.$bus.$emit("lyricUpdate")
    Vue.prototype.$bus.$emit("timeUpdate")
    // 检测是否播放结束
    let isEnd = audio.ended
    if (isEnd) {
      // 播放结束，进行下一曲
      Vue.prototype.$bus.$emit("autoPlayNextMusic")
    }
  })
  Vue.prototype.$audio = audio
}
