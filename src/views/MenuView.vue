<template>
  <div>
    <TopBar 
      :cart-counter="cartCounter" 
      @cartBtnClicked="cartBtnClickedEvent"
    ></TopBar>
    <Intro 
      img-src="menu.png"
    ></Intro>
    <Menu 
      v-model="menuItems" 
      @cartChanged="cartChangedEvent"
    ></Menu>
    <CartDialog 
      v-model="menuItems" 
      :show="showCartDialog"
      @show="showCartDialog=$event"
      @cartChanged="cartChangedEvent" 
      @cartCleared="cartClearedEvent"
    ></CartDialog>
  </div>
</template>

<style scoped>

</style>

<script>
import TopBar from "@/components/TopBar.vue";
import Intro from "@/components/Intro.vue";
import Menu from "@/components/Menu.vue";
import CartDialog from "@/components/CartDialog.vue";


export default {
  name: "MenuView",
  created() {
    
  },
  data() {
    return {
      cartCounter: 0,
      preloaderEnabled: true,
      menuItems: [],
      showCartDialog: null
    }
  },
  components: {
    TopBar,
    Intro,
    Menu,
    CartDialog,
  },
  methods: {
    cartBtnClickedEvent() {
      this.showCartDialog = true;
    },
    cartChangedEvent() {
      this.cartCounter = 0;
      for (var idx = 0; idx < this.menuItems.length; idx++) {
        this.menuItems[idx].total_price = this.menuItems[idx].price * this.menuItems[idx].qty;
        this.cartCounter += this.menuItems[idx].qty;
      }
      console.log(this.menuItems);
      console.log(this.cartCounter);
    },
    cartClearedEvent() {
      this.cartCounter = 0;
      for (var idx = 0; idx < this.menuItems.length; idx++) {
        this.menuItems[idx].total_price = 0;
        this.menuItems[idx].qty = 0;
      }
    },
  },
};
</script>
