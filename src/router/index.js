import Vue from 'vue'
import VueRouter from 'vue-router'
import MenuView from "../views/MenuView.vue";
import CartView from "../views/CartView.vue";

Vue.use(VueRouter)

const routes = [
  {
    path: '/menu',
    name: 'menu',
    component: MenuView
  },
  {
    path: '/cart',
    name: 'cart',
    component: CartView
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
