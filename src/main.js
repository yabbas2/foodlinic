import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

/*--------------------IMPORT GOOGLE MAPS-------------------------*/
import GmapVue from 'gmap-vue'

Vue.use(GmapVue, {
  autoBindAllEvents: false,
  installComponents: true,
  dynamicLoad: false,
})

/*--------------------IMPORT TEL INPUT-------------------------*/
import VueTelInput from 'vue-tel-input';
import 'vue-tel-input/dist/vue-tel-input.css';

Vue.use(VueTelInput);

/*--------------------IMPORT BOOTSTRAP-------------------------*/
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

/*--------------------IMPORT VUETIFY-------------------------*/
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import '@mdi/font/css/materialdesignicons.css'

Vue.use(Vuetify)


new Vue({
  vuetify : new Vuetify({
    icons: {iconfont: 'mdi'}
  }),
  router,
  store,
  render: h => h(App),
  created() {},
}).$mount('#app')
