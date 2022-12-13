<template>
  <q-toolbar class="q-mt-sm">
    <q-btn
      round
      flat
      :ripple="false"
      :color="iconColor"
      @click="leftBtnClicked"
    >
      <q-icon
        v-if="props.leftBtn === 'nav-btn'"
        :size="iconSize"
        :name="outlinedMenu"
        :color="iconColor"
      ></q-icon>
      <q-icon
        v-if="props.leftBtn === 'back-btn'"
        :size="iconSize"
        :name="outlinedArrowBackIos"
        :color="iconColor"
      ></q-icon>
    </q-btn>
    <q-toolbar-title>
      <q-img src="~assets/logo-name-wbg.png" class="logo-img" />
    </q-toolbar-title>
    <!--<q-btn round flat :color="iconColor" @click="profileBtnClicked">
      <q-icon
        :size="iconSize"
        :name="outlinedPersonOutline"
        :color="iconColor"
      ></q-icon>
    </q-btn>
    <div class="icon-sep q-mx-sm">|</div>-->
    <q-btn
      round
      flat
      :ripple="false"
      :color="iconColor"
      @click="cartBtnClicked"
    >
      <q-badge floating rounded :color="iconColor">{{
        cartStore.cartItemsCount
      }}</q-badge>
      <q-icon
        :size="iconSize"
        :name="outlinedShoppingBag"
        :color="iconColor"
      ></q-icon>
    </q-btn>
  </q-toolbar>
</template>

<style lang="scss" scoped>
.logo-img {
  width: 130px;
}
//.icon-sep {
//  font-size: 25px;
//}
</style>

<script setup>
import {
  outlinedShoppingBag,
  /*outlinedPersonOutline,*/
  outlinedMenu,
  outlinedArrowBackIos,
} from "@quasar/extras/material-icons-outlined";
import Router from "../router";
import { useCartStore } from "../stores/cart";

const iconSize = "30px";
const iconColor = "secondary";
const props = defineProps(["leftBtn"]);
const cartStore = useCartStore();

function cartBtnClicked() {
  Router.push("/cart");
}

//function profileBtnClicked() {
//  Router.push("/user");
//}

function leftBtnClicked() {
  switch (props.leftBtn) {
    case "back-btn":
      Router.back();
      break;

    default:
      break;
  }
}
</script>
