<template>
  <router-view v-if="allowedSize"></router-view>
  <Error406Page v-else></Error406Page>

  <q-resize-observer @resize="onResize" />
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import Error406Page from "./pages/Error406Page.vue";

let allowedSize = ref(true);

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
