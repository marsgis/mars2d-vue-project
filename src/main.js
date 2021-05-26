import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// import { load } from './components/mars2d/includeLib'
// load('jquery,bootstrap,bootstrap-select,font-awesome,web-icons,layer,haoutil,nprogress,toastr, turf,mars2d,esri-leaflet,leaflet-wfs')

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
