import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

/*--------------------IMPORT BOOTSTRAP-------------------------*/
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

/*--------------------IMPORT AOS-------------------------*/
import AOS from 'aos'
import 'aos/dist/aos.css'

/*--------------------IMPORT VUETIFY-------------------------*/
import Vuetify from 'vuetify'
//import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify)


new Vue({
  vuetify : new Vuetify(),
  router,
  store,
  render: h => h(App),
  created() {
    AOS.init();
  },
}).$mount('#app')
