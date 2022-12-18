<template>
  <q-page class="flex flex-center">
    <div class="column flex-center absolute-top">
      <div class="col q-my-md">
        <IntroSection h1="Admin" h2="" img=""></IntroSection>
      </div>
      <div class="col q-mt-md">
        <AdminSection></AdminSection>
      </div>
    </div>
  </q-page>
</template>

<style lang="scss" scoped></style>

<script setup>
import IntroSection from "src/components/IntroSection.vue";
import AdminSection from "src/components/AdminSection.vue";
</script>
