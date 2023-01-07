<template>
  <q-page class="flex flex-center">
    <div class="column flex-center absolute-top">
      <div class="col q-my-md">
        <OrderSection :orderId="id"></OrderSection>
      </div>
    </div>
  </q-page>
</template>

<style lang="scss" scoped></style>

<script setup>
import OrderSection from "src/components/OrderSection.vue";
import { useRoute } from "vue-router";

const route = useRoute();
const id = route.params.id;
</script>
