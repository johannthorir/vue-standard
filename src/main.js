import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueAxios, axios)
Vue.config.productionTip = true
/* eslint no-new: "off" */
new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')

