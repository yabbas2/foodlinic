<template>
  <div class="column">
    <div v-if="props.h1 !== ''" class="col text-center">
      <div class="intro-title">
        {{ props.h1 }}
      </div>
    </div>
    <div v-if="props.h2 !== ''" class="col text-center">
      <div class="intro-subtitle">
        {{ props.h2 }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Pacifico&display=swap");

.intro-title {
  font-size: 45px;
  font-family: "Bebas Neue", cursive;
  color: $secondary;
}
.intro-subtitle {
  font-family: "Pacifico", cursive;
  font-size: 20px;
}
</style>

<script setup>
const props = defineProps(["h1", "h2"]);
</script>
