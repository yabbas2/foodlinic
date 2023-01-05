<template>
  <q-layout view="lHh Lpr lFf" class="bg-grey-1">
    <q-header reveal class="toolbar-bg">
      <TopBar :leftBtn="'nav-btn'" :rightBtn1="true" :showLogo="true"></TopBar>
      <ExtTopBarMin
        title="MENU"
        subtitle="Homemade, Healthy, Tasty!"
      ></ExtTopBarMin>
    </q-header>

    <NavDrawer></NavDrawer>

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
import NavDrawer from "src/components/NavDrawer.vue";
</script>
