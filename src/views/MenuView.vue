<template>
  <div class="menu-view">
    <TopBar :cart-counter="cartCounter" @cartBtnClicked="cartBtnClickedEvent"></TopBar>
    <Intro img-src="menu.png"></Intro>
    <TabsWCards v-if="!preloaderEnabled" :tabs="menuCatgs" :cardDecks="menuItems" :inputNumberLimit="menuItemCartLimit" @cartChanged="cartChangedEvent"></TabsWCards>
    <Preloader v-if="preloaderEnabled"></Preloader>
    <CartModal :showModal="showCartModal" @modalClosed="modalClosedEvent"></CartModal>
  </div>
</template>

<style scoped>

</style>

<script>
import TopBar from "@/components/TopBar.vue";
import Preloader from "@/components/Preloader.vue";
import Intro from "@/components/Intro.vue";
import TabsWCards from "@/components/TabsWCards.vue";
import CartModal from "@/components/CartModal.vue";
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
      menuItemCartLimit: 10,
      waitedEvents: [],
      successfulWaitedEvent: 0,
      preloaderEnabled: true,
      menuCatgs: null,
      menuItems: null,
      showCartModal: null
    }
  },
  components: {
    TopBar,
    Preloader,
    Intro,
    TabsWCards,
    CartModal
},
  methods: {
    modalClosedEvent() {
      console.log("cartModal closed!");
      this.showCartModal = false;
    },
    cartBtnClickedEvent() {
      console.log("cartBtn clicked!");
      this.showCartModal = true;
    },
    ConstructMenuCatgsObj(jsonData) {
      this.menuCatgs = jsonData;
    },
    ConstructMenuItemsObj(jsonData) {
      this.menuItems = [];
      for (var idx = 0; idx < jsonData.length; idx++) {
        var menuItemObj = jsonData[idx];
        menuItemObj['refId'] = menuItemObj.menu_category_ref;
        delete menuItemObj.menu_category_ref;
        /*delete menuItemObj.id;*/
        if      (menuItemObj.status == 'New')     {menuItemObj['color'] = "danger";}
        else if (menuItemObj.status == 'Try It')  {menuItemObj['color'] = "info";}
        else if (menuItemObj.status == 'Popular') {menuItemObj['color'] = "success";}
        else                                      {menuItemObj['color'] = "dark";}
        try {menuItemObj['imgSrc'] = require('../assets/menu-items/' + menuItemObj.name.replaceAll(' ', '-') + '.png');}
        catch (e) {menuItemObj['imgSrc'] = require('../assets/no-image.png');}
        this.menuItems.push(menuItemObj);
      }
    },
    reactOnReceivedData() {
      if (this.successfulWaitedEvent != this.waitedEvents.length) {return;}
      if ( (this.menuCatgs.length > 0) && (this.menuItems.length > 0) ) {this.preloaderEnabled = false;}
    },
    async fetchMenuCatgs() {
      await axios.get('http://127.0.0.1:9000/foodapis/menu-category') /*TODO: change in production to https://foodlinic.pythonanywhere.com/foodapis/menu-category*/
        .then(response => {
          this.ConstructMenuCatgsObj(response.data)
          this.$emit('recvMenuCatgs')
          console.log(this.menuCatgs)
        })
        .catch(error => {
          console.log(error) /*TODO: better error handling*/
        })
    },
    async fetchMenuItems() {
      await axios.get('http://127.0.0.1:9000/foodapis/menu-item') /*TODO: change in production to https://foodlinic.pythonanywhere.com/foodapis/menu-item*/
        .then(response => {
          this.ConstructMenuItemsObj(response.data)
          this.$emit('recvMenuItems')
          console.log(this.menuItems)
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
      console.log(cart);
      for (const [key, value] of Object.entries(cart)) {
        this.cartCounter += value;
      }
    }
  }
};
</script>
