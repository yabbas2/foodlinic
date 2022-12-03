<template>
  <q-page class="flex flex-center">
    <div class="column flex-center absolute-top">
      <div class="col q-my-md">
        <IntroSection h1="Sign Up" h2="" img="avatar.png"></IntroSection>
      </div>
      <div class="col main-section">
        <SignupSection></SignupSection>
      </div>
    </div>
  </q-page>
</template>

<style lang="scss" scoped>
.main-section {
  margin-top: 100px;
}
</style>

<script setup>
import IntroSection from "src/components/IntroSection.vue";
import SignupSection from "src/components/SignupSection.vue";
</script>
