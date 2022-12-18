<template>
  <q-layout view="lHh Lpr lFf">
    <q-header reveal elevated class="bg-white text-black z-top">
      <TopBar :leftBtn="'nav-btn'" :rightBtn1="true"></TopBar>
    </q-header>

    <NavDrawer></NavDrawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <!--<q-footer class="bg-transparent text-black">
      <div class="row flex-center">
        <BottomBar></BottomBar>
      </div>
    </q-footer>-->
  </q-layout>
</template>

<style lang="scss" scoped></style>

<script setup>
import TopBar from "src/components/TopBar.vue";
import NavDrawer from "src/components/NavDrawer.vue";
//import BottomBar from "src/components/BottomBar.vue";
</script>
