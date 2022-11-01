<template>
  <div>
    <MainComp></MainComp>
    <Intro h1="Diet" h2="Nutrition, Fitness"></Intro>
    <Diet></Diet>
  </div>
</template>

<style scoped>

</style>

<script>
import Intro from "@/components/Intro.vue";
import MainComp from "@/components/MainComp.vue";
import Diet from "@/components/Diet.vue";


export default {
  name: "DietView",
  components: {
    MainComp,
    Intro,
    Diet,
},
};
</script>
  