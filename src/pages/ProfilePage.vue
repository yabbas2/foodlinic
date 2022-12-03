<template>
  <q-page class="flex flex-center">
    <div class="column flex-center absolute-top">
      <div class="col q-my-md">
        <IntroSection h1="Profile" h2="" img="avatar.png"></IntroSection>
      </div>
      <div class="col main-section">
        <ProfileSection></ProfileSection>
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
import ProfileSection from "src/components/ProfileSection.vue";
</script>
