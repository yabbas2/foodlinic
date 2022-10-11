<template>
  <v-btn
    color="#39175c"
    dark
    @click="$emit('btnClicked')"
  >
    <div class="d-flex justify-space-between">
      <div style="width:3rem;" v-if="!showLoading" class="text-capitalize">{{totalPrice}}kr</div>
      <div style="width:3rem;" v-else>
        <v-progress-circular
          indeterminate
          size="20"
          color="#f25b47"
        >
        </v-progress-circular>
      </div>
      <div style="min-width:2rem;">|</div>
      <div>Continue</div>
    </div>
  </v-btn>
</template>

<style scoped>

</style>

<script>
export default {
  name: "CartContBtn",
  props: {
    showLoading: Boolean,
    totalPrice: Number,
  },
}
</script>