import {defineStore} from 'pinia'


export const useUserStore = defineStore('user', {
  state: () => ({
    username: '',
    fullName: '',
  }),
  getters: {
    isLoggedIn: (state) => (state.username !== ''),
  },
  actions: {
    login(username, fullName) {
        this.username = username;
        this.fullName = fullName;
    },
    logout() {
        this.username = '';
        this.fullName = '';
    }
  },
})