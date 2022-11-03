import Vue from 'vue'
import VueRouter from 'vue-router'

const MenuView = () => import('../views/MenuView.vue')
const DietView = () => import('../views/DietView.vue')

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
