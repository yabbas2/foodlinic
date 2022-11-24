<template>
  <q-toolbar class="q-mt-md">
    <q-btn round flat :color="iconColor" @click="leftBtnClicked">
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
    <q-btn round flat :color="iconColor" @click="profileBtnClicked">
      <q-icon
        :size="iconSize"
        :name="outlinedPerson"
        :color="iconColor"
      ></q-icon>
    </q-btn>
    <div class="icon-sep q-mx-sm">|</div>
    <q-btn round flat :color="iconColor" @click="cartBtnClicked">
      <q-badge floating rounded :color="iconColor">{{
        menuStore.cartItemsCount
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
.icon-sep {
  font-size: 25px;
}
</style>

<script setup>
import {
  outlinedShoppingBag,
  outlinedPerson,
  outlinedMenu,
  outlinedArrowBackIos,
} from "@quasar/extras/material-icons-outlined";
import Router from "src/router/index";
import { useMenuStore } from "src/stores/menu";

const iconSize = "30px";
const iconColor = "secondary";
const props = defineProps(["leftBtn"]);
const menuStore = useMenuStore();

function cartBtnClicked() {
  Router.push("/cart");
}

function profileBtnClicked() {}

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
