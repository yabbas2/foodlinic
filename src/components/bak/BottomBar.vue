<template>
  <q-toolbar elevated class="bg-white shadow-2 q-mb-md btm-bar">
    <q-btn stack flat round color="primary" @click="menuBtnClicked">
      <q-icon
        :size="iconSize"
        color="primary"
        :name="outlinedMenuBook"
      ></q-icon>
      menu
    </q-btn>
    <q-space />
    <q-space />
    <q-btn stack flat round color="primary" @click="cartBtnClicked">
      <q-icon :size="iconSize" color="primary" :name="outlinedShoppingBag">
        <q-badge floating rounded color="primary">{{
          menuStore.cartItemsCount
        }}</q-badge>
      </q-icon>
      cart
    </q-btn>
    <q-space />
    <q-space />
    <q-btn stack flat round color="primary" @click="profileBtnClicked">
      <q-icon :size="iconSize" color="primary" :name="outlinedPerson"></q-icon>
      profile
    </q-btn>
  </q-toolbar>
</template>

<style lang="scss" scoped>
.btm-bar {
  border-radius: 20px;
  max-width: 280px;
  height: 65px;
}
</style>

<script setup>
import {
  outlinedShoppingBag,
  outlinedPerson,
  outlinedMenuBook,
} from "@quasar/extras/material-icons-outlined";
import { useMenuStore } from "src/stores/menu";
import Router from "src/router/index";

const menuStore = useMenuStore();
const iconSize = "32px";

function menuBtnClicked() {
  Router.replace("/menu");
}

function cartBtnClicked() {
  Router.replace("/cart");
}

function profileBtnClicked() {
  Router.replace("/user");
}
</script>
