<template>
  <v-dialog
    v-model="showDialog"
    persistent
    max-width="500"
  >
    <v-card tile flat>
      <v-card-title class="justify-center">
        <span><pre class="text-h6 font-weight-bold" style="color: #39175c;">SCREEN FIT</pre></span>
      </v-card-title>
      <v-spacer></v-spacer>
      <v-card-subtitle class="justify-center">
        <v-img :src="require('../assets/logo-name-wbg.png')" width="150" class="mx-auto"></v-img>
      </v-card-subtitle>
      <v-card-text class="text-start">
        This website is designed best for mobile phone browsers. For better experience, please switch to a mobile phone.
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="#f25b47"
          text
          @click="showDialog=false"
        >
          Continue Anyway
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>

</style>

<script>
export default {
  name: 'ScreenFitDialog',
  props: {
    value: Boolean,
  },
  computed: {
    showDialog: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      }
    },
  },
};
</script>