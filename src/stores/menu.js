import { defineStore } from "pinia";

export const useMenuStore = defineStore("menu", {
  state: () => ({
    menu: [],
  }),
  getters: {
    menuItemsCount: (state) => state.menu.length,
  },
  actions: {
    menuProp(itemId, prop) {
      return this.menu.filter((item) => item.id === itemId)[0][prop];
    },
  },
});
