const routes = [
  {
    path: "/",
    redirect: "/menu",
  },
  {
    path: "/menu",
    component: () => import("src/layouts/MenuLayout.vue"),
    children: [{ path: "", component: () => import("pages/MenuPage.vue") }],
  },
  {
    path: "/cart",
    component: () => import("src/layouts/CartLayout.vue"),
    children: [{ path: "", component: () => import("pages/CartPage.vue") }],
  },
  {
    path: "/user",
    component: () => import("src/layouts/UserLayout.vue"),
    children: [{ path: "", component: () => import("pages/UserPage.vue") }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
