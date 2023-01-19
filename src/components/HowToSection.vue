<template>
  <q-expansion-item
    class="shadow-1 overflow-hidden exp-item"
    :icon="outlinedHelpOutline"
    label="How it works?"
    header-class="bg-secondary text-white text-h5"
    expand-icon-class="text-white"
  >
    <q-card>
      <q-card-section>
        step1: add your favourite food to the cart step2: During checkout,
        select
      </q-card-section>
    </q-card>
  </q-expansion-item>
</template>

<style scoped lang="scss">
.exp-item {
  border-radius: 30px;
  width: 370px;
}
</style>

<script setup>
import { outlinedHelpOutline } from "@quasar/extras/material-icons-outlined";
</script>
