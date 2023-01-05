<template>
  <q-layout view="lHh Lpr lFf" class="bg-grey-1">
    <q-header reveal class="toolbar-bg">
      <TopBar
        :leftBtn="'back-btn'"
        :rightBtn1="false"
        :showLogo="true"
      ></TopBar>
      <ExtTopBarMin title="CART & CHECKOUT" subtitle=""></ExtTopBarMin>
    </q-header>

    <q-drawer show-if-above bordered> </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<style lang="scss" scoped>
.toolbar-bg {
  background-color: black;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  border-bottom-left-radius: 50%;
  border-bottom-right-radius: 50%;
}
</style>

<script setup>
import TopBar from "src/components/TopBar.vue";
import ExtTopBarMin from "src/components/ExtTopBarMin.vue";
</script>
