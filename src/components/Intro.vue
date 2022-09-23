<template>
  <section id="intro" class="intro d-flex align-items-center">
    <b-img data-aos="fade-up" data-aos-duration="1000" v-bind="mainProps" :src="require('../assets/' + imgSrc)" alt=""></b-img>
  </section>
</template>

<style scoped>
.intro {
  background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("../assets/intro-bg.jpg") center center;
  background-size: cover;
  padding: 100px 0;
}
</style>

<script>
export default {
  name: "Intro",
  data() {
    return {
      mainProps: {
        center: true,
        fluid: true,
        width: 200
      }
    }
  },
  props: {
    imgSrc: String
  }
}
</script>