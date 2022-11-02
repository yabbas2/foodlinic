<template>
  <v-container>
    <v-row
      align="start"
      justify="start"
    >
      <v-col
        class="text-start"
        cols="12"
      >
        <div class="intro-welcome pl-2">
          Hi {{userStore.firstname}},
        </div>
      </v-col>
    </v-row>
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
</style>

<script>
import {useUserStore} from '@/store/user'

export default {
  name: "Intro",
  setup() {
    const userStore = useUserStore()
    return {
      userStore,
    }
  },
  props: {
    h1: String,
    h2: String
  }
}
</script>