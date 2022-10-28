<template>
  <v-parallax
    height="300"
    :src="require('../assets/intro.jpg')"
    class="mt-14"
  >
    <v-container>
      <v-row
        align="center"
        justify="center"
      >
        <v-col
          class="text-center"
          cols="12"
        >
          <div class="intro-title">
            {{h1}}
          </div>
          <div class="intro-subtitle">
            {{h2}}
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-parallax>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Pacifico&display=swap');

.intro-title {
  font-family: 'Bebas Neue', cursive;
  font-size: 60px;
  color: #f25b47;
}

.intro-subtitle {
  font-family: 'Pacifico', cursive;
  font-size: 20px;
}
</style>

<script>
export default {
  name: "Intro",
  props: {
    h1: String,
    h2: String
  }
}
</script>