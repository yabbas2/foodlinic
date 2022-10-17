import Vue from 'vue'
import VueRouter from 'vue-router'
import MenuView from "../views/MenuView.vue";

Vue.use(VueRouter)

const routes = [
  {
    path: '/menu',
    name: 'menu',
    component: MenuView
  }
]

const router = new VueRouter({
  routes
})

export default router
