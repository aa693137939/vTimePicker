import Vue from 'vue'
import App from './App.vue'
import vTimepicker from './vTimepicker/index'

Vue.use( vTimepicker );

new Vue({
  el: '#app',
  render: h => h(App)
})
