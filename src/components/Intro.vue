<template>
  <v-card 
    class="mt-14"
    min-height="200" 
    :img="require('../assets/intro-bg.jpg')" 
    tile 
    elevation="0"
  >
    <v-card-text>
      <v-img 
        class="mx-auto my-auto" 
        width="150" 
        :src="require('../assets/' + imgSrc)"
      >
      </v-img>
    </v-card-text>
  </v-card>
</template>

<style scoped>

</style>

<script>
export default {
  name: "Intro",
  props: {
    imgSrc: String
  }
}
</script>