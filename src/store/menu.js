import {defineStore} from 'pinia'


export const useMenuStore = defineStore('menu', {
  state: () => ({
    menuItems: [],
  }),
  persist: true,
  getters: {
    cartItems: (state) => (state.menuItems.filter(item => item.qty > 0)),
    cartItemsMin: (state) => (state.menuItems.map(item => (item.qty > 0)? {id: item.id, qty: item.qty} : {}).filter(newItem => Object.keys(newItem).length !== 0)),
    cartItemsCount: (state) => (state.cartItems.reduce((acc, obj) => acc + obj.qty, 0)),
    totalPrice: (state) => (state.cartItems.reduce((acc, obj) => acc + obj.total_price, 0)),
    menuItemsCount: (state) => (state.menuItems.length),
  },
  actions: {
    clearCart() {
      this.menuItems.forEach((item, idx) => {
        this.menuItems[idx].qty = 0;
        this.menuItems[idx].total_price = 0;
      });
    },
    updateMenu(menuList) {
      /*TODO:bug:if one parameter is updated in db, it won't reflect here since id might be identical*/
      const arrAddToStore = menuList.filter(dbItem => {
        return !this.menuItems.some(storeItem => {
          return dbItem.id === storeItem.id;
        });
      });
      const arrRemoveFromStore = this.menuItems.filter(storeItem => {
        return !menuList.some(dbItem => {
          return dbItem.id === storeItem.id;
        });
      });
      this.menuItems.push(...arrAddToStore);
      this.menuItems = this.menuItems.filter(item => {
        return !arrRemoveFromStore.includes(item)
      });
    },
  },
})