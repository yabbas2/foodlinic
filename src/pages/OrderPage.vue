<template>
  <q-page class="flex flex-center">
    <div class="column flex-center absolute-top">
      <div class="col q-my-md">
        <IntroSection h1="Track Order" h2=""></IntroSection>
      </div>
      <div class="col q-mt-md">
        <OrderSection :orderId="id"></OrderSection>
      </div>
    </div>
  </q-page>
</template>

<style lang="scss" scoped></style>

<script setup>
import IntroSection from "src/components/IntroSection.vue";
import OrderSection from "src/components/OrderSection.vue";
import { useRoute } from "vue-router";

const route = useRoute();
const id = route.params.id;
</script>
