<template>
  <v-app-bar
    color="#fff"
    flat
    location="top"
  >
    <v-spacer></v-spacer>
    <v-container>
      <v-row no-gutters align="stretch" align-content="center" justify="center">
        <v-col cols="auto" class="text-center">
          <v-img :src="util.transformImageUrl('../assets/logo-name-wbg.png')" width="130"></v-img>
        </v-col>
      </v-row>
    </v-container>
    <v-spacer></v-spacer>
  </v-app-bar>
</template>

<style scoped>

</style>

<script setup>
import util from '@/plugins/util';
</script>