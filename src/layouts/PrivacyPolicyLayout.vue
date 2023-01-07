<template>
  <q-layout view="lHh Lpr lFf" class="bg-grey-1">
    <q-header reveal class="bg-secondary">
      <TopBar
        :leftBtn="'back-btn'"
        :rightBtn1="false"
        :showLogo="false"
      ></TopBar>
      <ExtTopBarMin title="PRIVACY POLICY"></ExtTopBarMin>
    </q-header>

    <q-drawer show-if-above bordered> </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<style lang="scss" scoped></style>

<script setup>
import TopBar from "src/components/TopBar.vue";
import ExtTopBarMin from "src/components/ExtTopBarMin.vue";
</script>
