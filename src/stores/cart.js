import { defineStore } from "pinia";

export const useCartStore = defineStore("cart", {
  state: () => ({
    cart: [],
  }),
  getters: {
    cartItemsCount: (state) =>
      state.cart.reduce((acc, obj) => acc + obj.qty, 0),
  },
  actions: {
    clearCart() {
      this.cart = [];
    },
    updateCart(itemId, qty) {
      let possibleCartItem = this.cart.find((item) => item.id === itemId);
      if (possibleCartItem !== undefined) {
        possibleCartItem.qty = qty;
      } else {
        this.cart.push({ id: itemId, qty: qty });
      }
      //console.log(this.cart);
    },
    cartItemById(itemId) {
      let possibleCartItem = this.cart.find((item) => item.id === itemId);
      if (possibleCartItem !== undefined) {
        return possibleCartItem.qty;
      } else {
        return 0;
      }
    },
  },
});
