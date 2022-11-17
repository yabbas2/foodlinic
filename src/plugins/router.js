import { createRouter, createWebHistory } from 'vue-router';


const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/menu'
    },
    {
      path: '/menu',
      name: 'menu',
      component: () => import('@/views/MenuView.vue'),
    },
    {
      path: '/user',
      redirect: '/user/profile',
      children: [
        {
          path: 'profile',
          name: 'profile',
          component: () => import('@/views/ProfileView.vue'),
        },
        {
          path: 'signin',
          name: 'signin',
          component: () => import('@/views/SigninView.vue'),
        },
        {
          path: 'signup',
          name: 'signup',
          component: () => import('@/views/SignupView.vue'),
        },
      ],
    },
  ]
});

export default router;

// routing rules
router.beforeEach(async (to, from) => {
  if (to.name === 'profile') {
    let userObj = window.localStorage.getItem('user');
    if (userObj === null) {
      return { name: 'signin' };
    }
  }
});