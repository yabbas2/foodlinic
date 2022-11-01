<template>
  <v-app id="app">
    <router-view v-if="!showScreenFitDialog"></router-view>
    <ScreenFitDialog v-model="showScreenFitDialog"></ScreenFitDialog>
  </v-app>
</template>

<style>
#app {
  /*font-family: Avenir, Helvetica, Arial, sans-serif;*/
  -webkit-font-smoothing: antialiased;
  /*-moz-osx-font-smoothing: grayscale;*/
  text-align: center;
  color: #2c3e50;
}
</style>

<script>
import ScreenFitDialog from '@/components/ScreenFitDialog.vue';

export default {
  name: "App",
  created() {
    if (this.windowWidth > 500) {
      this.showScreenFitDialog = true;
    }
  },
  data() {
    return {
      windowWidth: window.innerWidth,
      showScreenFitDialog: false,
    };
  },
  components: {
    ScreenFitDialog,
  },
};
</script>