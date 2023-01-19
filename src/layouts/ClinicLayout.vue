<template>
  <q-layout v-if="!maintenanceFlag" view="lHh Lpr lFf" class="bg-grey-1">
    <q-header reveal class="bg-secondary">
      <TopBar :leftBtn="'nav-btn'" :rightBtn1="true" :showLogo="false"></TopBar>
      <ExtTopBarMin title="CLINIC SECTION"></ExtTopBarMin>
    </q-header>

    <NavDrawer></NavDrawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
  <Error503Page v-else></Error503Page>
</template>

<style lang="scss" scoped></style>

<script setup>
import TopBar from "src/components/TopBar.vue";
import ExtTopBarMin from "src/components/ExtTopBarMin.vue";
import NavDrawer from "src/components/NavDrawer.vue";
import Error503Page from "src/pages/Error503Page.vue";
import { ref } from "vue";

const maintenanceFlag = ref(false);
</script>
