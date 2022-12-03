import { defineStore } from "pinia";

const key = import.meta.env.VITE_USER_ID_KEY;

export const useUserStore = defineStore("user", {
  state: () => ({
    [key]: null,
  }),
  persist: {
    storage: sessionStorage,
    key: "x-access-token",
  },
  getters: {},
  actions: {
    login(backendForm) {
      this[key] = backendForm[key];
    },
    logout() {
      window.sessionStorage.removeItem("x-access-token");
    },
  },
});
