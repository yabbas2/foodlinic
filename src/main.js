import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

/*--------------------IMPORT GOOGLE MAPS-------------------------*/
import GmapVue from 'gmap-vue'

Vue.use(GmapVue, {
  autoBindAllEvents: false,
  installComponents: true,
  dynamicLoad: false,
})

/*--------------------IMPORT VUETIFY-------------------------*/
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css'
import '@mdi/font/css/materialdesignicons.css'

Vue.use(Vuetify);


new Vue({
  vuetify: new Vuetify({
    icons: {iconfont: 'mdi'},
  }),
  router,
  render: h => h(App),
}).$mount('#app')
