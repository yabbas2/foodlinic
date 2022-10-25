<template>
  <v-dialog
    v-model="vsbyStore.cartDiagVsby"
    transition="dialog-bottom-transition"
    max-width="800"
    @click:outside="closeDialog"
    @keydown.esc="closeDialog"
    content-class="mx-0 mb-0 v-dialog--fullscreen cart-dialog"
  ><!--:overlay-opacity="0.9"-->
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
          @click="closeDialog"
        >
          <v-icon>mdi-close</v-icon>
          Close
        </v-btn>
      </v-card-title>
      <v-spacer></v-spacer>
      <!--start: cart dialog view-->
      <v-card-subtitle v-show="!checkoutSuccess" class="justify-center py-0">
      </v-card-subtitle>
      <v-spacer v-show="!checkoutSuccess"></v-spacer>
      <v-card-text v-show="(cartStore.cartItemsCount>0)&&(!checkoutSuccess)" class="px-0 py-0 v-card-text--scroll">
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
                <ReviewCart ref="reviewCartComp"></ReviewCart>
                <v-divider class="my-4"></v-divider>
                <div>
                  <CartContBtn :showLoading="totalPriceLoading" :totalPrice="cartStore.totalPrice" @btnClicked="step.validator"></CartContBtn>
                  <CartOtherBtn :action="'clear'" @btnClicked="cartStore.clearCart"></CartOtherBtn>
                </div>
              </template>
              <template v-if="n == 1">
                <Delivery ref="deliveryComp"></Delivery>
                <v-divider class="my-4"></v-divider>
                <div>
                  <CartContBtn :showLoading="totalPriceLoading" :totalPrice="cartStore.totalPrice" @btnClicked="step.validator"></CartContBtn>
                  <CartOtherBtn :action="'back'" @btnClicked="currStep--"></CartOtherBtn>
                </div>
              </template>
              <template v-if="n == 2">
                <Checkout ref="checkoutComp" :totalPrice="cartStore.totalPrice" @checkout="actOnCheckout($event)"></Checkout>
                <v-divider class="my-4"></v-divider>
                <div>
                  <CartOtherBtn :action="'back'" @btnClicked="currStep--"></CartOtherBtn>
                </div>
              </template>
            </v-stepper-content>
          </template>
        </v-stepper>
      </v-card-text>
      <v-card-text v-show="(cartStore.cartItemsCount==0)&&(!checkoutSuccess)" class="text-h6 justify-center">Your cart is empty!</v-card-text>
      <v-spacer v-show="!checkoutSuccess"></v-spacer>
      <!--end: cart dialog view-->
      <!--start: checkout success view-->
      <v-card-subtitle v-show="checkoutSuccess" class="justify-center py-0">
        <v-img 
          class="mx-auto my-auto" 
          max-width="150" 
          :src="require('../assets/op-completed.png')"
        >
        </v-img>
        <div class="text-h5 text-center font-weight-bold">Order Successful</div>
      </v-card-subtitle>
      <v-card-text v-show="checkoutSuccess" class="text-body-1 text-center pt-8">
        Thank you! Your order is currently being processed. You will receive an order confirmation email soon.
      </v-card-text>
      <!--end: checkout success view-->
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
    </v-card>
    <v-snackbar v-model="showSnackbar">
      {{msgSnackbar}}
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
  border-radius: 30px 30px 0 0 !important;
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
import {useCartStore} from '@/store/cart'
import {useVsbyStore} from '@/store/vsby'
import ReviewCart from "@/components/ReviewCart.vue"
import Delivery from "@/components/Delivery.vue"
import Checkout from "@/components/Checkout.vue"
import CartContBtn from "@/components/ui-elems/CartContBtn.vue";
import CartOtherBtn from "@/components/ui-elems/CartOtherBtn.vue";
import axios from 'axios'


export default {
  name: "CartDialog",
  setup() {
    const cartStore = useCartStore()
    const vsbyStore = useVsbyStore()
    return {
      cartStore,
      vsbyStore,
    }
  },
  components: {
    ReviewCart,
    Delivery,
    Checkout,
    CartContBtn,
    CartOtherBtn,
  },
  data() {
    return {
      currStep: 1,
      steps: [
        {name: "Review Order" , valid: true, validator: () => {this.checkReviewForm(0);}},
        {name: "Delivery"     , valid: true, validator: () => {this.checkDeliveryForm(1);}},
        {name: "Checkout"     , valid: true, validator: () => {this.checkCheckoutForm(2);}},
      ],
      totalPriceLoading: false,
      showSnackbar: false,
      msgSnackbar: '',
      checkoutSuccess: false,
    }
  },
  methods: {
    showSnackbarError(errMsg) {
      this.showSnackbar = true;
      this.msgSnackbar = errMsg;
    },
    async pushOrderData() {
      let dataToPost = {
        cartItems: this.$refs.reviewCartComp[0].collectInfo(),
        delivery: this.$refs.deliveryComp[0].collectInfo(),
        checkout: this.$refs.checkoutComp[0].collectInfo()
      };
      console.log(dataToPost);
      await axios.post('http://127.0.0.1:9000/foodapis/order/', dataToPost)
        .then(response => {
          console.log(response);
        })
        .catch(error => {
          console.log(error) /*TODO: better error handling*/
        })
    },
    actOnCheckout(result) {
      this.checkoutSuccess = result;
      if (this.checkoutSuccess) {
        this.pushOrderData();
        this.$emit('cartCleared');
      }
      else {
        this.showSnackbarError('Transaction failed/cancelled!');
      }
    },
    stepComplete(step) {
      return this.currStep > step;
    },
    stepStatus(step) {
      return this.currStep > step ? 'green' : '#39175c';
    },
    checkReviewForm(stepIdx) {
      // No logic is needed for now
      this.currStep++;
      this.steps[stepIdx].valid = true;
      return true;
    },
    checkDeliveryForm(stepIdx) {
      let isValid = this.$refs.deliveryComp[0].$refs.delvyform.validate();
      if (isValid)  {this.currStep++;this.steps[stepIdx].valid = true;}
      else          {this.showSnackbarError('Required field(s) missing/invalid!');this.steps[stepIdx].valid = false;}
    },
    checkCheckoutForm(stepIdx) {
      return true;
    },
    closeDialog() {
      this.currStep = 1;
      this.checkoutSuccess = false;
      this.vsbyStore.cartDiagVsby = false;
    },
  },
};
</script>