<template>
  <router-view v-if="allowedSize"></router-view>
  <incorrect-size v-else></incorrect-size>
  <q-resize-observer @resize="onResize" />
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import IncorrectSize from "./pages/IncorrectSize.vue";

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
