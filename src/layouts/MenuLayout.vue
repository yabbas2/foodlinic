<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-white text-black"></q-header>
    <TopBar :leftBtn="'nav-btn'"></TopBar>

    <q-drawer show-if-above bordered> </q-drawer>

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

<style scoped></style>

<script setup>
import TopBar from "src/components/TopBar.vue";
//import BottomBar from "src/components/BottomBar.vue";
</script>
