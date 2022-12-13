<template>
  <q-layout view="lHh Lpr lFf">
    <q-header reveal elevated class="bg-white text-black">
      <TopBar :leftBtn="'back-btn'"></TopBar>
    </q-header>

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
