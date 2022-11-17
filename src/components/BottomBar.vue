<template>
  <div>
    <v-app-bar
      fixed
      color="#fff"
      elevation="5"
      location="bottom"
      class="mx-auto bottom-bar"
    >
      <v-btn color="#f25b47" icon @click="menuBtnClicked">
        <v-icon size="30">{{mdiFoodOutlineSvg}}</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn color="#f25b47" icon @click="orderBtnClicked">
        <v-icon size="35">{{mdiViewListOutlineSvg}}</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn color="#f25b47" icon @click="cartBtnClicked">
        <v-badge
          :content="menuStore.cartItemsCount"
          color="#f25b47"
          bordered
        >
          <v-icon size="30">{{mdiCartOutlineSvg}}</v-icon>
        </v-badge>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn color="#f25b47" icon @click="profileBtnClicked">
        <v-icon size="35">{{mdiAccountOutlineSvg}}</v-icon>
      </v-btn>
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
.bottom-bar {
  border-radius: 50px;
  max-width: 300px !important;
  transform: translate(-50%, -50%) !important;
  left: 50% !important;
  right: 50% !important;
}
</style>

<script setup>
import { ref } from 'vue';
import { mdiAccountOutline, mdiCartOutline, mdiFoodOutline, mdiViewListOutline } from '@mdi/js';
import { useUserStore } from '@/store/user';
import { useMenuStore } from '@/store/menu';
import router from '@/plugins/router';

const userStore = useUserStore();
const menuStore = useMenuStore();

let showSnackbar = ref(false);
let msgSnackbar = ref('');

const mdiCartOutlineSvg = mdiCartOutline;
const mdiAccountOutlineSvg = mdiAccountOutline;
const mdiFoodOutlineSvg = mdiFoodOutline;
const mdiViewListOutlineSvg = mdiViewListOutline;

function cartBtnClicked() {
  //if (!this.userStore.isLoggedIn) {
  //  this.vsbyStore.openSigninDialog();
  //}
  //else if (this.menuStore.cartItemsCount == 0) {
  //  this.msgSnackbar = 'Cart is empty!';
  //  this.showSnackbar = true;
  //}
  //else {
  //  this.vsbyStore.openCartDialog();
  //}
  console.log('cartBtnClicked');
}

function orderBtnClicked() {
  console.log('orderBtnClicked');
}

function menuBtnClicked() {
  router.replace('/menu');
  console.log('menuBtnClicked');
}

function profileBtnClicked() {
  router.replace('/user/profile');
}
</script>