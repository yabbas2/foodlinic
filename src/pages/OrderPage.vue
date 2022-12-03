<template>
  <q-page class="flex flex-center">
    <div class="column flex-center absolute-top">
      <div class="col q-my-md">
        <IntroSection h1="Orders" h2="" img=""></IntroSection>
      </div>
      <div class="col q-mt-md">
        <OrderSection></OrderSection>
      </div>
    </div>
  </q-page>
</template>

<style lang="scss" scoped></style>

<script setup>
import IntroSection from "src/components/IntroSection.vue";
import OrderSection from "src/components/OrderSection.vue";
</script>
