import Vue from 'vue'
import VueRouter from 'vue-router'
import MenuView from "../views/MenuView.vue";
import DietView from "../views/DietView.vue";

Vue.use(VueRouter)

const routes = [
  {
    path: '/menu',
    name: 'menu',
    component: MenuView
  },
  {
    path: '/diet',
    name: 'diet',
    component: DietView
  },
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
