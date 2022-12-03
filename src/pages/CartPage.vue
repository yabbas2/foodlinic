<template>
  <q-page class="flex flex-center">
    <div class="column flex-center absolute-top">
      <div class="col q-my-md">
        <IntroSection h1="Cart & Checkout" h2="" img=""></IntroSection>
      </div>
      <div class="col q-mt-md">
        <CartSection></CartSection>
      </div>
    </div>
  </q-page>
</template>

<style scoped></style>

<script setup>
import IntroSection from "src/components/IntroSection.vue";
import CartSection from "src/components/CartSection.vue";
</script>
