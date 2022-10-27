import {defineStore} from 'pinia'


export const useUserStore = defineStore('user', {
  state: () => ({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
  }),
  persist: true,
  getters: {
    isLoggedIn: (state) => (state.email !== ''),
  },
  actions: {
    login(backendForm) {
      this.firstname = backendForm.firstname;
      this.lastname = backendForm.lastname;
      this.email = backendForm.email;
      this.phone = backendForm.phone;
    },
    logout() {
      this.firstname = '';
      this.lastname = '';
      this.email = '';
      this.phone = '';
    }
  },
})