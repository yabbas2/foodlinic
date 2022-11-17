import {defineStore} from 'pinia'


export const useOrderStore = defineStore('order', {
  state: () => ({
    orders: [],
  }),
  persist: true,
  getters: {
    ordersCount: (state) => (state.orders.length),
  },
  actions: {
    updateOrders(orderList) {
      /*const arrAddToStore = orderList.filter(dbItem => {
        return !this.orders.some(storeItem => {
          return dbItem.id === storeItem.id;
        });
      });
      this.orders.push(...arrAddToStore);*/
      this.orders = [...orderList];
    },
  },
})