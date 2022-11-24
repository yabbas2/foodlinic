import { defineStore } from "pinia";

const key = import.meta.env.VITE_USER_ID_KEY;

export const useUserStore = defineStore("user", {
  state: () => ({
    [key]: null,
  }),
  persist: true,
  getters: {},
  actions: {
    login(backendForm) {
      this[key] = backendForm[key];
    },
    logout() {
      window.localStorage.removeItem("user");
    },
    checkLogin() {
      return window.localStorage.getItem("user") !== null && this[key] !== null;
    },
  },
});
