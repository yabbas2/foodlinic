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
        beforeEnter: [],
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
        beforeEnter: [checkCartPaths],
      },
    ],
  },
  {
    path: "/order",
    component: () => import("src/layouts/OrderLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/OrderPage.vue"),
        beforeEnter: [checkOrderPaths],
      },
    ],
  },
  {
    path: "/user",
    component: () => import("src/layouts/UserLayout.vue"),
    children: [
      { path: "", redirect: "/user/signin" },
      {
        path: "signin",
        component: () => import("src/pages/SigninPage.vue"),
        beforeEnter: [checkUserPaths],
      },
      {
        path: "profile",
        component: () => import("src/pages/ProfilePage.vue"),
        beforeEnter: [checkUserPaths],
      },
      {
        path: "signup",
        component: () => import("src/pages/SignupPage.vue"),
        beforeEnter: [checkUserPaths],
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

export default routes;

function checkUserPaths(to, from) {
  let token = window.sessionStorage.getItem("x-access-token");
  if (token === null) {
    console.log("no access token found");
    if (to.path === "/user/profile") {
      return { path: "/user/signin" };
    } else {
      return true;
    }
  } else {
    console.log("access token found - valid/invalid");
    if (to.path === "/user/signin" || to.path === "/user/signup") {
      return { path: "/user/profile" };
    }
  }
}

function checkCartPaths(to, from) {
  let token = window.sessionStorage.getItem("x-access-token");
  if (token === null) {
    console.log("no access token found");
    if (to.path === "/cart") {
      return { path: "/user/signin" };
    }
  } else {
    console.log("access token found - valid/invalid");
    return true;
  }
}

function checkOrderPaths(to, from) {
  let token = window.sessionStorage.getItem("x-access-token");
  if (token === null) {
    console.log("no access token found");
    if (to.path === "/order") {
      return { path: "/user/signin" };
    }
  } else {
    console.log("access token found - valid/invalid");
    return true;
  }
}
