import {defineStore} from 'pinia'


export const useVsbyStore = defineStore('vsby', {
  state: () => ({
    oneTimeLazyLoad: false,
    signupDiagVsby: false,
    signinDiagVsby: false,
    cartDiagVsby: false,
    orderDiagVsby: false,
    profileDiagVsby: false,
  }),
  getters: {
    lazyLoad: (state) => (state.signupDiagVsby || state.signinDiagVsby || state.cartDiagVsby || state.orderDiagVsby || state.profileDiagVsby || state.oneTimeLazyLoad),
  },
  actions: {
    openSignupDialog() {
      this.signupDiagVsby = true;
      this.signinDiagVsby = false;
      this.cartDiagVsby = false;
      this.orderDiagVsby = false;
      this.profileDiagVsby = false;
      this.oneTimeLazyLoad = true;
    },
    openSigninDialog() {
      this.signupDiagVsby = false;
      this.signinDiagVsby = true;
      this.cartDiagVsby = false;
      this.orderDiagVsby = false;
      this.profileDiagVsby = false;
      this.oneTimeLazyLoad = true;
    },
    openCartDialog() {
      this.signupDiagVsby = false;
      this.signinDiagVsby = false;
      this.cartDiagVsby = true;
      this.orderDiagVsby = false;
      this.profileDiagVsby = false;
      this.oneTimeLazyLoad = true;
    },
    openOrderDialog() {
      this.signupDiagVsby = false;
      this.signinDiagVsby = false;
      this.cartDiagVsby = false;
      this.orderDiagVsby = true;
      this.profileDiagVsby = false;
      this.oneTimeLazyLoad = true;
    },
    openProfileDialog() {
      this.signupDiagVsby = false;
      this.signinDiagVsby = false;
      this.cartDiagVsby = false;
      this.orderDiagVsby = false;
      this.profileDiagVsby = true;
      this.oneTimeLazyLoad = true;
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