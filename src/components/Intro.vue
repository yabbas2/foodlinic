<template>
  <v-container class="inner-container">
    <v-row v-if="props.h1 !== ''" align="stretch" align-content="center" justify="center">
      <v-col cols="12" class="text-center">
        <div class="intro-title">
          {{props.h1}}
        </div>
      </v-col>
    </v-row>
    <v-row v-if="props.h2 !== ''" align="stretch" align-content="center" justify="center">
      <v-col cols="12" class="text-center">
        <div class="intro-subtitle">
          {{props.h2}}
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Pacifico&display=swap');

.intro-title {
  font-family: 'Bebas Neue', cursive;
  font-size: 45px;
  color: #f25b47;
}
.intro-welcome {
  font-family: 'Bebas Neue', cursive;
  font-size: 50px;
  color: #39175c;
}
.intro-subtitle {
  font-family: 'Pacifico', cursive;
  font-size: 20px;
}
.inner-container {
  padding-bottom: 0 !important;
}
</style>

<script setup>
const props = defineProps(['h1', 'h2'])
</script>