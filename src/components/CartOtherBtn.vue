<template>
  <v-btn 
    class="mx-1"
    dark
    @click="$emit('btnClicked')"
    color="red accent-1"
  >
    {{action}}
  </v-btn>
</template>

<style scoped>

</style>

<script>
export default {
  name: "CartOtherBtn",
  props: {
    action: String,
  },
}
</script>