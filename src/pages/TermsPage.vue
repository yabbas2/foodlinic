<template>
  <q-page class="flex flex-center">
    <div class="column flex-center absolute-top">
      <div class="col q-my-md">
        <IntroSection h1="Terms and Conditions" h2="" img=""></IntroSection>
      </div>
      <div class="col q-pa-md">
        <TermsSection></TermsSection>
      </div>
    </div>
  </q-page>
</template>

<style scoped></style>

<script setup>
import IntroSection from "src/components/IntroSection.vue";
import TermsSection from "src/components/TermsSection.vue";
</script>
