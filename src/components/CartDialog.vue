<template>
  <v-dialog
    v-model="show"
    transition="dialog-bottom-transition"
    fullscreen
    hide-overlay
  >
    <v-toolbar
      dark
      color="#39175c"
    >
      <v-btn
        icon
        dark
        @click="show=false"
      >
        <v-icon>mdi-arrow-down</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card tile flat>
      <v-card 
        class="mt-0"
        max-height="100" 
        tile 
        flat
      >
        <v-card-text>
          <v-img 
            class="mx-auto my-auto" 
            width="85" 
            :src="require('../assets/cart.png')"
          >
          </v-img>
        </v-card-text>
      </v-card>
      <v-stepper
        v-model="currStep"
        vertical
        tile
        flat
        v-if="cartItemsCount > 0"
      >
        <template
          v-for="(step, n) in steps"
        >
          <v-stepper-step 
            v-if="true"
            :key="'step-'+String(n)"
            :complete="stepComplete(n+1)"
            :step="n+1"
            :rules="[value => step.valid]" 
            :color="stepStatus(n+1)">
            {{step.name}}
          </v-stepper-step>
          <v-stepper-content
            v-if="true"
            :step="n+1" 
            :key="'step-content-'+String(n)"
          >
            <template v-if="n == 0">
              <ReviewCart :tableItems="cartItems" @cartChanged="cartChangedEvent($event)"></ReviewCart>
              <v-divider></v-divider>
              <v-btn
                color="#39175c"
                dark
                @click="currStep++"
              >
                <div class="d-flex justify-space-between">
                  <div style="width:3rem;" v-if="!totalLoading" class="text-capitalize">{{total}}kr</div>
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
            <template v-if="n == 1">
              <Delivery @inputChanged="deliveryFormValid=$event"></Delivery>
              <v-divider></v-divider>
              <div>
                <v-btn
                  class="mx-1"
                  color="#39175c"
                  dark
                  @click="checkDeliveryForm"
                >
                  <div class="d-flex justify-space-between">
                    <div style="width:3rem;" v-if="!totalLoading" class="text-capitalize">{{total}}kr</div>
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
                <v-btn 
                  class="mx-1"
                  text 
                  @click="currStep--"
                  color="#f25b47"
                >Back</v-btn>
              </div>
            </template>
            <template v-if="n == 2">
              <Checkout></Checkout>
            </template>
            <template v-if="false">
              <v-card color="grey lighten-1" class="mb-12" height="200px">
                <v-card-text>
                  <v-form :ref="'stepForm'" v-model="step.valid" lazy-validation>
                    <v-text-field label="Enter something..." :rules="step.rules"></v-text-field>
                  </v-form>
                </v-card-text>
              </v-card>
              <v-btn v-if="n+1 < lastStep" dark color="#39175c" @click="validate(n)" :disabled="!step.valid">Continue</v-btn>
              <v-btn v-else dark color="success" @click="placeOrder()">Place Order</v-btn>
              <v-btn text @click="currStep = n">Back</v-btn>
            </template>
          </v-stepper-content>
        </template>
      </v-stepper>
      <v-card-title v-else class="justify-center">Your cart is empty!</v-card-title>
    </v-card>
    <v-snackbar v-model="showSnackbar">
      Required field(s) missing!
      <template v-slot:action="{ attrs }">
        <v-btn
          color="#f25b47"
          text
          v-bind="attrs"
          @click="showSnackbar=false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-dialog>
</template>

<style scoped>

</style>

<script>
import ReviewCart from "@/components/subcomponents/ReviewCart.vue"
import Delivery from "@/components/subcomponents/Delivery.vue"
import Checkout from "@/components/subcomponents/Checkout.vue"


export default {
  name: "CartDialog",
  components: {
    ReviewCart,
    Delivery,
    Checkout,
  },
  props: {
    value: Boolean,
    cartItems: Array
  },
  data() {
    return {
      currStep: 1,
      steps: [
        {name: "Review Order",  rules: [],                                                            valid: true},
        {name: "Delivery",      rules: [v => !!v || "Required."],                                     valid: true},
        {name: "Checkout",      rules: [v => (v && v.length >= 4) || "Enter at least 4 characters."], valid: true},
      ],
      lastStep: 3,
      stepForm: [],
      totalLoading: false,
      deliveryFormValid: false,
      showSnackbar: false,
    }
  },
  methods: {
    cartChangedEvent(eventValue) {
      this.totalLoading = true;
      setTimeout(() => {
        this.totalLoading = false
      }, 500);
      this.$emit('cartChanged', eventValue);
    },

    stepComplete(step) {
      return this.currStep > step;
    },
    stepStatus(step) {
      return this.currStep > step ? 'green' : '#39175c';
    },
    checkDeliveryForm() {
      if (this.deliveryFormValid)  {this.currStep++;this.steps[1].valid = true;}
      else                         {this.showSnackbar = true;this.steps[1].valid = false;}
    },
    validate(n) {
      this.steps[n].valid = false;
      let v = this.$refs.stepForm[n].validate();
      if (v) {
        this.steps[n].valid = true;
        /* continue to next step */
        this.currStep = (n+1) + 1;
      }
    },
    placeOrder() {
      this.currStep = 4;
    }
  },
  computed: {
    total() {
      return this.cartItems.reduce((acc, obj) => acc + obj.total_price, 0);
    },
    cartItemsCount() {
      return this.cartItems.filter(item => item.qty > 0).length;
    },
    show: {
      get() {
        return this.value
      },
      set(value) {
         this.$emit('input', value)
      }
    },
  },
  watch: {
    show(newState, oldState) {
      this.currStep = 1;
    },
  },
};
</script>