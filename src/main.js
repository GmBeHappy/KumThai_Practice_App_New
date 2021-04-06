import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import AudioVisual from 'vue-audio-visual'
import sounds from "vue-sounds";
import '../src/assets/tailwind.css'

Vue.use(sounds, store);
Vue.config.productionTip = false
Vue.use(AudioVisual)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
