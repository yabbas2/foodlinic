<template>
  <template v-if="allowedSize">
    <template v-if="!maintenanceFlag">
      <router-view></router-view>
    </template>
    <Error503Page v-else></Error503Page>
  </template>
  <Error406Page v-else></Error406Page>

  <q-resize-observer @resize="onResize" />
</template>

<script setup>
import { ref, onBeforeMount, computed } from "vue";
import Error406Page from "./pages/Error406Page.vue";
import Error503Page from "./pages/Error503Page.vue";

let allowedSize = ref(true);

const maintenanceFlag = computed(() => {
  return import.meta.env.VITE_MAINTENANCE_EN === "1" ? true : false;
});

onBeforeMount(() => {
  onResize({ width: window.innerWidth });
});

function onResize(size) {
  if (size.width > parseInt(import.meta.env.VITE_VIEWPORT_WIDTH)) {
    allowedSize.value = false;
  } else {
    allowedSize.value = true;
  }
}
</script>
