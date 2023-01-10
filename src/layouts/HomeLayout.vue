<template>
  <q-layout view="lHh Lpr lFf" class="bg-grey-1">
    <q-header reveal class="toolbar-bg">
      <TopBar :leftBtn="'nav-btn'" :rightBtn1="false" :showLogo="false" />
      <ExtTopBar></ExtTopBar>
    </q-header>

    <NavDrawer></NavDrawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<style lang="scss" scoped>
.toolbar-bg {
  background-color: $secondary;
  background-image: url("assets/cover-photo.png");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  border-bottom-left-radius: 0%;
  border-bottom-right-radius: 50%;
}
</style>

<script setup>
import TopBar from "src/components/TopBar.vue";
import ExtTopBar from "src/components/ExtTopBar.vue";
import NavDrawer from "src/components/NavDrawer.vue";
</script>
