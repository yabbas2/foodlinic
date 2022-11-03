<template>
  <div>
    <v-app-bar
      fixed
      color="#fff"
      light
      elevation="5"
      bottom
      :width="300"
      class="mb-4 mx-auto"
      style="z-index: 999; border-radius: 25px;"
    >
      <v-btn style="margin-left: 0rem;" color="#f25b47" icon @click="profileBtnClicked">
        <v-icon size="30">{{mdiAccountOutlineSvg}}</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn color="#f25b47" icon @click="orderBtnClicked">
        <v-icon size="30">{{mdiFoodOutlineSvg}}</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-badge
        :content="menuStore.cartItemsCount"
        :value="menuStore.cartItemsCount"
        color="#f25b47"
        overlap
        bordered
        offset-x="17"
        offset-y="22"
      >
        <v-btn color="#f25b47" icon @click="cartBtnClicked">
          <v-icon size="30">{{mdiCartOutlineSvg}}</v-icon>
        </v-btn>
      </v-badge>
    </v-app-bar>
    <v-snackbar v-model="showSnackbar" top>
      {{msgSnackbar}}
      <template v-slot:action="{attrs}">
        <v-btn
          color="#f25b47"
          text
          v-bind="attrs"
          @click="showSnackbar=false"
        >Close</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<style scoped>

</style>

<script>
import {mdiAccountOutline, mdiCartOutline, mdiFoodOutline, mdiMenu} from '@mdi/js'
import {useUserStore} from '@/store/user'
import {useMenuStore} from '@/store/menu'
import {useVsbyStore} from '@/store/vsby'


export default {
  name: "BottomBar",
  setup() {
    const userStore = useUserStore()
    const menuStore = useMenuStore()
    const vsbyStore = useVsbyStore()
    return {
      userStore,
      menuStore,
      vsbyStore,
    }
  },
  data() {
    return {
      mdiCartOutlineSvg: mdiCartOutline,
      mdiMenuSvg: mdiMenu,
      mdiAccountOutlineSvg: mdiAccountOutline,
      mdiFoodOutlineSvg: mdiFoodOutline,
      showSnackbar: false,
      msgSnackbar: '',
    }
  },
  methods: {
    cartBtnClicked() {
      if (!this.userStore.isLoggedIn) {
        this.vsbyStore.openSigninDialog();
      }
      else if (this.menuStore.cartItemsCount == 0) {
        this.msgSnackbar = 'Cart is empty!';
        this.showSnackbar = true;
      }
      else {
        this.vsbyStore.openCartDialog();
      }
    },
    orderBtnClicked() {
      if (!this.userStore.isLoggedIn) {
        this.vsbyStore.openSigninDialog();
      }
      else {
        this.vsbyStore.openOrderDialog();
      }
    },
    profileBtnClicked() {
      if (!this.userStore.isLoggedIn) {
        this.vsbyStore.openSigninDialog();
      }
      else {
        this.vsbyStore.openProfileDialog();
      }
    },
  },
};
</script>