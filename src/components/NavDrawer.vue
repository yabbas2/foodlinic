<template>
  <q-drawer
    v-model="drawer"
    show-if-above
    :width="200"
    :breakpoint="drawerBreakpoint"
    bordered
    class="bg-white"
  >
    <q-list class="fixed-top topbar-margin">
      <q-item clickable v-ripple @click="Router.replace('/')">
        <q-item-section avatar>
          <q-icon :name="outlinedHome" />
        </q-item-section>
        <q-item-section> Home </q-item-section>
      </q-item>
      <q-separator />
      <q-item clickable v-ripple @click="Router.replace('/menu')">
        <q-item-section avatar>
          <q-icon :name="outlinedMenuBook" />
        </q-item-section>
        <q-item-section> Food Menu </q-item-section>
      </q-item>
      <q-separator />
    </q-list>

    <q-list class="fixed-bottom">
      <q-separator />
      <q-item clickable v-ripple @click="Router.push('/terms-and-conditions')">
        <q-item-section> Terms and Conditions </q-item-section>
      </q-item>
      <q-separator />
      <q-item clickable v-ripple @click="Router.push('/privacy-policy')">
        <q-item-section> Privacy Policy </q-item-section>
      </q-item>
    </q-list>
  </q-drawer>
</template>

<style scoped>
.topbar-margin {
  margin-top: 70px;
}
</style>

<script setup>
import { inject, ref } from "vue";
import Router from "../router";
import {
  outlinedHome,
  outlinedMenuBook,
} from "@quasar/extras/material-icons-outlined";

const bus = inject("bus");
const drawerBreakpoint = parseInt(import.meta.env.VITE_VIEWPORT_WIDTH);

let drawer = ref(false);

bus.on("nav-drawer", (val) => {
  drawer.value = val;
});
</script>
