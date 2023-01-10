<template>
  <q-toolbar class="q-pt-sm">
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
      <q-img
        v-if="props.showLogo"
        src="~assets/logo-wfg-cbg.png"
        class="logo-img"
      />
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
      v-if="props.rightBtn1"
      round
      flat
      :ripple="false"
      :color="iconColor"
      @click="cartBtnClicked"
    >
      <q-badge floating rounded :color="iconColor" text-color="secondary">{{
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
  width: 145px;
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
import { inject, ref } from "vue";

const iconSize = "30px";
const iconColor = "white";
const props = defineProps(["leftBtn", "rightBtn1", "showLogo"]);
const cartStore = useCartStore();
const bus = inject("bus");

let drawer = ref(false);

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
    case "nav-btn":
      drawer.value = !drawer.value;
      bus.emit("nav-drawer", drawer.value);
      break;
    default:
      break;
  }
}
</script>
