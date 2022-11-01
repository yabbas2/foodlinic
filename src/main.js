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

Vue.use(Vuetify);

/*--------------------IMPORT PINIA-------------------------*/
import { createPinia, PiniaVuePlugin } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

Vue.use(PiniaVuePlugin)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)


new Vue({
  vuetify: new Vuetify(),
  router,
  pinia,
  render: h => h(App),
}).$mount('#app')
