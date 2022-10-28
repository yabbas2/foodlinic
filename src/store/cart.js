import {defineStore} from 'pinia'


export const useCartStore = defineStore('cart', {
  state: () => ({
    menuItems: [],
  }),
  getters: {
    cartItems: (state) => (state.menuItems.filter(item => item.qty > 0)),
    cartItemsMin: (state) => (state.menuItems.map(item => (item.qty > 0)? {id: item.id, qty: item.qty} : {}).filter(newItem => Object.keys(newItem).length !== 0)),
    cartItemsCount: (state) => (state.cartItems.reduce((acc, obj) => acc + obj.qty, 0)),
    totalPrice: (state) => (state.cartItems.reduce((acc, obj) => acc + obj.total_price, 0)),
  },
  actions: {
    clearCart() {
      this.menuItems.forEach((item, idx) => {
        this.menuItems[idx].qty = 0;
        this.menuItems[idx].total_price = 0;
      });
    },
  },
})