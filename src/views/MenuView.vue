<template>
  <div>
    <TopBar :cart-counter="cartCounter" @cartBtnClicked="cartBtnClickedEvent"></TopBar>
    <Intro img-src="menu.png"></Intro>
    <Menu v-if="!preloaderEnabled" :tabs="menuCatgs" :cardDecks="menuItems" @cartChanged="cartChangedEvent"></Menu>
    <Preloader v-if="preloaderEnabled"></Preloader>
    <CartDialog :cartItems="menuItems" v-model="showCartDialog" @cartChanged="cartChangedEvent" @cartClearRequest="cartClearedEvent"></CartDialog>
  </div>
</template>

<style scoped>

</style>

<script>
import TopBar from "@/components/TopBar.vue";
import Preloader from "@/components/Preloader.vue";
import Intro from "@/components/Intro.vue";
import Menu from "@/components/Menu.vue";
import CartDialog from "@/components/CartDialog.vue";
import axios from 'axios'


export default {
  name: "MenuView",
  created() {
    this.registerEvents();
  },
  mounted() {
    this.fetchMenuCatgs();
    this.fetchMenuItems();
  },
  data() {
    return {
      cartCounter: 0,
      cartObj: {},
      waitedEvents: [],
      successfulWaitedEvent: 0,
      preloaderEnabled: true,
      menuCatgs: [],
      menuItems: [],
      showCartDialog: null
    }
  },
  components: {
    TopBar,
    Preloader,
    Intro,
    Menu,
    CartDialog,
  },
  methods: {
    cartBtnClickedEvent() {
      this.showCartDialog = true;
    },
    constructMenuCatgsObj(jsonData) {
      this.menuCatgs = jsonData;
    },
    constructMenuItemsObj(jsonData) {
      for (var idx = 0; idx < jsonData.length; idx++) {
        var menuItemObj = jsonData[idx];
        menuItemObj['refId'] = menuItemObj.menu_category_ref;
        delete menuItemObj.menu_category_ref;
        menuItemObj['qty'] = 0;
        menuItemObj['total_price'] = 0;
        /*if      (menuItemObj.status == 'New')     {menuItemObj['color'] = "danger";}
        else if (menuItemObj.status == 'Try It')  {menuItemObj['color'] = "info";}
        else if (menuItemObj.status == 'Popular') {menuItemObj['color'] = "success";}
        else                                      {menuItemObj['color'] = "dark";}*/
        try {menuItemObj['imgSrc'] = require('../assets/menu-items/' + menuItemObj.name.replaceAll(' ', '-') + '.png');}
        catch (e) {menuItemObj['imgSrc'] = require('../assets/no-image.png');}
        this.menuItems.push(menuItemObj);
      }
    },
    reactOnReceivedData() {
      if (this.successfulWaitedEvent != this.waitedEvents.length) {return;}
      if ( (this.menuCatgs.length > 0) && (Object.keys(this.menuItems).length > 0) ) {
        setTimeout(() => {
          this.preloaderEnabled = false
        }, 500);
      }
    },
    async fetchMenuCatgs() {
      await axios.get('http://127.0.0.1:9000/foodapis/menu-category') /*TODO: change in production to https://foodlinic.pythonanywhere.com/foodapis/menu-category*/
        .then(response => {
          this.constructMenuCatgsObj(response.data)
          this.$emit('recvMenuCatgs')
          /*console.log(this.menuCatgs)*/
        })
        .catch(error => {
          console.log(error) /*TODO: better error handling*/
        })
    },
    async fetchMenuItems() {
      await axios.get('http://127.0.0.1:9000/foodapis/menu-item') /*TODO: change in production to https://foodlinic.pythonanywhere.com/foodapis/menu-item*/
        .then(response => {
          this.constructMenuItemsObj(response.data)
          this.$emit('recvMenuItems')
          /*console.log(this.menuItems)*/
        })
        .catch(error => {
          console.log(error) /*TODO: better error handling*/
        })
    },
    registerEvents() {
      this.successfulWaitedEvent = 0;
      this.waitedEvents = [ /*Configurable*/
        {name: 'recvMenuCatgs', callback: () => {this.successfulWaitedEvent++;this.reactOnReceivedData();}},
        {name: 'recvMenuItems', callback: () => {this.successfulWaitedEvent++;this.reactOnReceivedData();}}
      ];
      for (let e of this.waitedEvents) {
        this.$on(e.name, e.callback);
      }
    },
    cartChangedEvent(cart) {
      this.cartCounter = 0;
      this.menuItems = [...cart];
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
