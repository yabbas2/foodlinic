import {defineStore} from 'pinia'


export const useVsbyStore = defineStore('vsby', {
  state: () => ({
    signupDiagVsby: false,
    signinDiagVsby: false,
    cartDiagVsby: false,
    orderDiagVsby: false,
    profileDiagVsby: false,
  }),
  getters: {
    
  },
  actions: {
    openSignupDialog() {
      this.signupDiagVsby = true;
      this.signinDiagVsby = false;
      this.cartDiagVsby = false;
      this.orderDiagVsby = false;
      this.profileDiagVsby = false;
    },
    openSigninDialog() {
      this.signupDiagVsby = false;
      this.signinDiagVsby = true;
      this.cartDiagVsby = false;
      this.orderDiagVsby = false;
      this.profileDiagVsby = false;
    },
    openCartDialog() {
      this.signupDiagVsby = false;
      this.signinDiagVsby = false;
      this.cartDiagVsby = true;
      this.orderDiagVsby = false;
      this.profileDiagVsby = false;
    },
    openOrderDialog() {
      this.signupDiagVsby = false;
      this.signinDiagVsby = false;
      this.cartDiagVsby = false;
      this.orderDiagVsby = true;
      this.profileDiagVsby = false;
    },
    openProfileDialog() {
      this.signupDiagVsby = false;
      this.signinDiagVsby = false;
      this.cartDiagVsby = false;
      this.orderDiagVsby = false;
      this.profileDiagVsby = true;
    },
    closeSignupDialog() {
      this.signupDiagVsby = false;
    },
    closeSigninDialog() {
      this.signinDiagVsby = false;
    },
    closeCartDialog() {
      this.cartDiagVsby = false;
    },
    closeOrderDialog() {
      this.orderDiagVsby = false;
    },
    closeProfileDialog() {
      this.profileDiagVsby = false;
    },
  },
})