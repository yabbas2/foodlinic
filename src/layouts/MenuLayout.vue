<template>
  <q-layout view="lHh Lpr lFf" class="bg-grey-1">
    <q-header reveal class="bg-secondary">
      <TopBar :leftBtn="'nav-btn'" :rightBtn1="true" :showLogo="false"></TopBar>
      <ExtTopBarMin title="MENU"></ExtTopBarMin>
    </q-header>

    <NavDrawer></NavDrawer>

    <q-page-container>
      <router-view />
    </q-page-container>
    <q-footer></q-footer>
  </q-layout>
</template>

<style lang="scss" scoped></style>

<script setup>
import TopBar from "src/components/TopBar.vue";
import ExtTopBarMin from "src/components/ExtTopBarMin.vue";
import NavDrawer from "src/components/NavDrawer.vue";
</script>
