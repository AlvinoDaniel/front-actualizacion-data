import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import './plugins'
import apiServices from './util/request'
import hasPermission from './util/permissions'
import store from './store'
import { sync } from 'vuex-router-sync'
// import VueApexCharts from 'vue-apexcharts'
import { VueMaskDirective } from 'v-mask'



/* CHART COMPONENT */
// Vue.use(VueApexCharts)
// Vue.component('apexchart', VueApexCharts)

/* FILE UPLOAD COMPONENT */

Vue.directive('mask', VueMaskDirective);

/* FUNCION QUE DETERMINA PERMISO DE USUARIO */
Vue.use(hasPermission);

Vue.config.productionTip = false

Vue.prototype.$api = apiServices;

sync(store, router)

new Vue({
  router,
  vuetify,
  store,
  render: h => h(App),
}).$mount('#app')
