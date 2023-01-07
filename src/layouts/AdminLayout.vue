<template>
  <q-layout view="lHh Lpr lFf" class="bg-grey-1">
    <q-header reveal class="bg-secondary">
      <TopBar
        :leftBtn="'nav-btn'"
        :rightBtn1="false"
        :showLogo="false"
      ></TopBar>
      <ExtTopBarMin title="ADMIN"></ExtTopBarMin>
    </q-header>

    <NavDrawer></NavDrawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<style scoped></style>

<script setup>
import TopBar from "src/components/TopBar.vue";
import ExtTopBarMin from "src/components/ExtTopBarMin.vue";
import NavDrawer from "src/components/NavDrawer.vue";
</script>
