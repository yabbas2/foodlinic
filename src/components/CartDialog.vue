<template>
  <v-dialog
    :value="show"
    @input="$emit('show', $event)"
    transition="dialog-bottom-transition"
    max-width="800"
    content-class="mx-0 mb-0 v-dialog--fullscreen cart-dialog"
    :overlay-opacity="0.9"
  >
    <v-card tile flat class="v-card--scroll" height="100%">
      <v-card-title>
        <v-img 
          class="mx-auto my-auto" 
          max-width="50" 
          :src="require('../assets/cart.png')"
        />
        <v-spacer></v-spacer>
        <v-btn 
          small
          outlined
          rounded
          :ripple="{class: 'red--text'}"
          @click="$emit('show', false)"
        >
          <v-icon>mdi-close</v-icon>
          Close
        </v-btn>
      </v-card-title>
      <div v-show="checkoutOpStatus===undefined" class="v-card-text--scroll">
        <v-card-text class="px-0 py-0" v-if="cartItemsCount > 0">
          <v-stepper
            v-model="currStep"
            vertical
            tile
            flat
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
                  <ReviewCart ref="reviewCartComp" v-model="items" @cartChanged="cartChangedEvent"></ReviewCart>
                  <v-divider class="my-4"></v-divider>
                  <div>
                    <CartContBtn :showLoading="totalLoading" :totalPrice="total" @btnClicked="step.validator"></CartContBtn>
                    <CartOtherBtn :action="'clear'" @btnClicked="$emit('cartCleared')"></CartOtherBtn>
                  </div>
                </template>
                <template v-if="n == 1">
                  <Delivery ref="deliveryComp"></Delivery>
                  <v-divider class="my-4"></v-divider>
                  <div>
                    <CartContBtn :showLoading="totalLoading" :totalPrice="total" @btnClicked="step.validator"></CartContBtn>
                    <CartOtherBtn :action="'back'" @btnClicked="currStep--"></CartOtherBtn>
                  </div>
                </template>
                <template v-if="n == 2">
                  <Contact ref="contactComp"></Contact>
                  <v-divider class="my-4"></v-divider>
                  <div>
                    <CartContBtn :showLoading="totalLoading" :totalPrice="total" @btnClicked="step.validator"></CartContBtn>
                    <CartOtherBtn :action="'back'" @btnClicked="currStep--"></CartOtherBtn>
                  </div>
                </template>
                <template v-if="n == 3">
                  <Checkout ref="checkoutComp" :totalPrice="total" @checkout="actOnCheckout($event)"></Checkout>
                  <v-divider class="my-4"></v-divider>
                  <div>
                    <CartOtherBtn :action="'back'" @btnClicked="currStep--"></CartOtherBtn>
                  </div>
                </template>
              </v-stepper-content>
            </template>
          </v-stepper>
        </v-card-text>
        <v-card-text v-else class="text-h6 justify-center">Your cart is empty!</v-card-text>
      </div>
      <div v-show="checkoutOpStatus!==undefined">
        <v-card-text class="px-0 py-0">
          <CheckoutResult :result="checkoutOpStatus" @btnClicked="actOnCheckout(undefined)"></CheckoutResult>
        </v-card-text>
      </div>
    </v-card>
    <v-snackbar v-model="showSnackbar">
      Required field(s) missing/invalid!
      <template v-slot:action="{attrs}">
        <v-btn
          color="#f25b47"
          text
          v-bind="attrs"
          @click="showSnackbar=false"
        >Close</v-btn>
      </template>
    </v-snackbar>
  </v-dialog>
</template>

<style>
.cart-dialog {
  border-radius: 0 !important;
  margin: 0 !important;
  height: 90% !important;
  position: fixed !important;
  overflow-y: auto !important;
  bottom: 0 !important;
  top: auto !important;
  left: auto !important;
}

.v-card--scroll {
  display: flex !important;
  flex-direction: column;
}

.v-card-text--scroll {
  flex-grow: 1;
  overflow: auto;
}
</style>

<script>
import ReviewCart from "@/components/ReviewCart.vue"
import Delivery from "@/components/Delivery.vue"
import Contact from "@/components/Contact.vue"
import Checkout from "@/components/Checkout.vue"
import CartContBtn from "@/components/CartContBtn.vue";
import CartOtherBtn from "@/components/CartOtherBtn.vue";
import CheckoutResult from "@/components/CheckoutResult.vue"
import axios from 'axios'


export default {
  name: "CartDialog",
  components: {
    ReviewCart,
    Delivery,
    Contact,
    Checkout,
    CartContBtn,
    CartOtherBtn,
    CheckoutResult,
  },
  props: {
    value: Array,
    show: Boolean,
  },
  data() {
    return {
      currStep: 1,
      steps: [
        {name: "Review Order" , valid: true, validator: () => {this.checkReviewForm(0);}},
        {name: "Delivery"     , valid: true, validator: () => {this.checkDeliveryForm(1);}},
        {name: "Contact"      , valid: true, validator: () => {this.checkContactForm(2);}},
        {name: "Checkout"     , valid: true, validator: () => {this.checkCheckoutForm(3);}},
      ],
      lastStep: 4,
      totalLoading: false,
      showSnackbar: false,
      checkoutOpStatus: undefined,
    }
  },
  methods: {
    async pushOrderData() {
      let dataToPost = {
        cartItems: this.$refs.reviewCartComp[0].collectInfo(),
        contact: this.$refs.contactComp[0].collectInfo(),
        delivery: this.$refs.deliveryComp[0].collectInfo(),
        checkout: this.$refs.checkoutComp[0].collectInfo()
      };
      console.log(dataToPost);
      await axios.post('https://foodlinic.pythonanywhere.com/foodapis/order/', dataToPost)
        .then(response => {
          console.log(response);
        })
        .catch(error => {
          console.log(error) /*TODO: better error handling*/
        })
    },
    actOnCheckout(result) {
      this.checkoutOpStatus = result;
      if (this.checkoutOpStatus) {
        this.pushOrderData();
        this.$emit('cartCleared');
      }
      else {
        /* stop any processing */
        this.pushOrderData();
      }
    },
    cartChangedEvent() {
      this.totalLoading = true;
      setTimeout(() => {
        this.totalLoading = false
      }, 500);
      this.$emit('cartChanged');
    },

    stepComplete(step) {
      return this.currStep > step;
    },
    stepStatus(step) {
      return this.currStep > step ? 'green' : '#39175c';
    },
    checkReviewForm(stepIdx) {
      let isValid = true; // No logic is needed for now
      if (isValid)  {this.currStep++;this.steps[stepIdx].valid = true;}
      else          {this.showSnackbar = true;this.steps[stepIdx].valid = false;}
    },
    checkDeliveryForm(stepIdx) {
      let isValid = this.$refs.deliveryComp[0].validateAllInputs();
      if (isValid)  {this.currStep++;this.steps[stepIdx].valid = true;}
      else          {this.showSnackbar = true;this.steps[stepIdx].valid = false;}
    },
    checkContactForm(stepIdx) {
      let isValid = this.$refs.contactComp[0].validateAllInputs();
      if (isValid)  {this.currStep++;this.steps[stepIdx].valid = true;}
      else          {this.showSnackbar = true;this.steps[stepIdx].valid = false;}
    },
    checkCheckoutForm(stepIdx) {
      return true;
    },
  },
  computed: {
    total() {
      return this.items.reduce((acc, obj) => acc + obj.total_price, 0);
    },
    cartItems() {
      return this.items.filter(item => item.qty > 0);
    },
    cartItemsCount() {
      return this.cartItems.length;
    },
    items: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      }
    },
  },
  watch: {
    show(newState, oldState) {
      this.currStep = 1;
      if (newState == false) {
        this.checkoutOpStatus = undefined;
      }
    },
  },
};
</script>