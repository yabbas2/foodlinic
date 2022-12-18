import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
//import { auth } from "../firebase";

const routes = [
  {
    path: "/",
    redirect: "/menu",
  },
  {
    path: "/menu",
    component: () => import("src/layouts/MenuLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/MenuPage.vue"),
        //beforeEnter: [],
      },
    ],
  },
  {
    path: "/cart",
    component: () => import("src/layouts/CartLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/CartPage.vue"),
        //beforeEnter: [checkCartPaths],
      },
    ],
  },
  {
    path: "/order/:id",
    component: () => import("src/layouts/OrderLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/OrderPage.vue"),
        //beforeEnter: [checkOrderPaths],
      },
    ],
  },
  //{
  //  path: "/user",
  //  component: () => import("src/layouts/UserLayout.vue"),
  //  children: [
  //    { path: "", redirect: "/user/signin" },
  //    {
  //      path: "signin",
  //      component: () => import("src/pages/SigninPage.vue"),
  //      beforeEnter: [checkUserPaths],
  //    },
  //    {
  //      path: "profile",
  //      component: () => import("src/pages/ProfilePage.vue"),
  //      beforeEnter: [checkUserPaths],
  //    },
  //    {
  //      path: "signup",
  //      component: () => import("src/pages/SignupPage.vue"),
  //      beforeEnter: [checkUserPaths],
  //    },
  //  ],
  //},

  {
    path: "/privacy-policy",
    component: () => import("src/layouts/PrivacyPolicyLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/PrivacyPolicyPage.vue"),
      },
    ],
  },
  {
    path: "/terms-and-conditions",
    component: () => import("src/layouts/TermsLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/TermsPage.vue"),
      },
    ],
  },
  {
    path: import.meta.env.VITE_ADMIN_URL,
    component: () => import("src/layouts/AdminLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/AdminPage.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

//function checkUserPaths(to, from) {
//  console.log(auth.currentUser);
//  if (auth.currentUser) {
//    console.log("access token found");
//    if (to.path === "/user/signin" || to.path === "/user/signup") {
//      return { path: "/user/profile" };
//    }
//  } else {
//    console.log("no access token found");
//    if (to.path === "/user/profile") {
//      return { path: "/user/signin" };
//    } else {
//      return true;
//    }
//  }
//}

//function checkCartPaths(to, from) {
//  let token = window.sessionStorage.getItem("x-access-token");
//  if (token === null) {
//    console.log("no access token found");
//    if (to.path === "/cart") {
//      return { path: "/user/signin" };
//    }
//  } else {
//    console.log("access token found - valid/invalid");
//    return true;
//  }
//}

//function checkOrderPaths(to, from) {
//  let token = window.sessionStorage.getItem("x-access-token");
//  if (token === null) {
//    console.log("no access token found");
//    if (to.path === "/order") {
//      return { path: "/user/signin" };
//    }
//  } else {
//    console.log("access token found - valid/invalid");
//    return true;
//  }
//}

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

const createHistory = process.env.SERVER
  ? createMemoryHistory
  : process.env.VUE_ROUTER_MODE === "history"
  ? createWebHistory
  : createWebHashHistory;

const Router = createRouter({
  scrollBehavior: () => ({ left: 0, top: 0 }),
  routes,

  // Leave this as is and make changes in quasar.conf.js instead!
  // quasar.conf.js -> build -> vueRouterMode
  // quasar.conf.js -> build -> publicPath
  history: createHistory(process.env.VUE_ROUTER_BASE),
});

export default Router;
