<template>
  <v-app-bar
    color="#fff"
    light
    flat
  >
    <v-toolbar-title>
      <v-container class="pt-8 pl-2">
        <v-row no-gutters>
          <v-col class="my-auto pt-0">
            <v-img :src="require('../assets/logo-name-wbg.png')" width="130"></v-img>
          </v-col>
        </v-row>
      </v-container>
    </v-toolbar-title>
    <v-spacer></v-spacer>
  </v-app-bar>
</template>

<style scoped>

</style>

<script>
export default {
  name: "TopBar",
};
</script>