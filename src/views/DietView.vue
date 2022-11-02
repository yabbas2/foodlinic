<template>
  <div>
    <Intro h1="Diet" h2="Nutrition, Fitness"></Intro>
    <Diet></Diet>
  </div>
</template>

<style scoped>

</style>

<script>
import Intro from "@/components/Intro.vue";
import Diet from "@/components/Diet.vue";


export default {
  name: "DietView",
  components: {
    Intro,
    Diet,
  },
};
</script>
  