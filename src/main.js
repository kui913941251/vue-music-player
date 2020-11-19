import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import less from 'less'
import { createAudioObj } from "./utils/audio";

createAudioObj(Vue)

// // 创建audio对象
// let audio = document.createElement("audio")
// audio.play_target = {}
// audio.addEventListener("timeupdate" , function () {
//   console.log(audio.currentTime)
//   Vue.$bus.$emit("timeUpdate")
// })
// Vue.prototype.$audio = audio

// 使用less
Vue.use(less)

// 创建事件总线$bus
let bus = new Vue()
Vue.prototype.$bus = bus

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
