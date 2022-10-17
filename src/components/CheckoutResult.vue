<template>
  <v-card
    tile
    flat
    class="mx-auto"
  >
    <template v-if="result">
      <v-card-title class="justify-center">
        <div>
          <v-img 
            class="mx-auto my-auto" 
            max-width="150" 
            :src="require('../assets/checkout-completed.jpg')"
          >
          </v-img>
          <div class="text-h5 text-center font-weight-medium">Order Successful</div>
        </div>
      </v-card-title>
      <v-card-text class="text-body-1 text-center">
        Thank you! Your order is currently being processed. You will receive an order confirmation email soon.
      </v-card-text>
    </template>
    <template v-else>
      <v-card-title class="justify-center">
        <div>
          <v-img 
            class="mx-auto my-auto" 
            max-width="150" 
            :src="require('../assets/checkout-cancelled-error.jpg')"
          >
          </v-img>
          <div class="text-h5 text-center font-weight-medium">Order Unsuccessful</div>
        </div>
      </v-card-title>
      <v-card-text class="text-body-1 text-center">
        Unfortunately, your order is not confirmed since the transaction is incomplete.
      </v-card-text>
      <v-card-actions class="justify-center">
        <v-btn
          color="red accent-1"
          dark
          elevation="1"
          @click="$emit('btnClicked')"
        >
          Try Again
          <v-icon
            right
            dark
          >
            mdi-reload
          </v-icon>
        </v-btn>
      </v-card-actions>
    </template>
  </v-card>
</template>

<style scoped>

</style>

<script>
export default {
  name: "CheckoutResult",
  props: {
    result: Boolean,
  },
  data() {
    return {

    }
  },
}
</script>