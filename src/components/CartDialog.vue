<template>
  <v-dialog
    v-model="vsbyStore.cartDiagVsby"
    transition="dialog-bottom-transition"
    max-width="800"
    @click:outside="closeDialog"
    @keydown.esc="closeDialog"
    :content-class="cartStore.cartItemsCount? mainClass : secondClass"
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
      <v-card-subtitle class="justify-center py-0">
      </v-card-subtitle>
      <v-spacer></v-spacer>
      <v-card-text v-show="cartStore.cartItemsCount>0" class="px-0 py-0 v-card-text--scroll">
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
                <Checkout ref="checkoutComp" :totalPrice="cartStore.totalPrice" @checkoutStart="overlay=true" @checkoutEnd="actOnCheckout($event)"></Checkout>
                <v-divider class="my-4"></v-divider>
                <div>
                  <CartOtherBtn :action="'back'" @btnClicked="currStep--"></CartOtherBtn>
                </div>
              </template>
            </v-stepper-content>
          </template>
        </v-stepper>
      </v-card-text>
      <v-card-text v-show="cartStore.cartItemsCount==0" class="text-h6 justify-center">Your cart is empty!</v-card-text>
      <v-spacer></v-spacer>
      <!--end: cart dialog view-->
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
    <v-overlay 
      :value="overlay" 
      absolute
    >
      <v-img 
        v-if="checkoutSuccess"
        class="mx-auto my-auto" 
        max-width="50" 
        :src="require('../assets/op-completed.png')"
      >
      </v-img>
      <v-progress-circular
        v-else
        indeterminate
        size="40"
        width="5"
        color="#f25b47"
      ></v-progress-circular>
    </v-overlay>
  </v-dialog>
</template>

<style>
.cart-dialog-large {
  border-radius: 30px 30px 0 0 !important;
  margin: 0 !important;
  height: 90% !important;
  position: fixed !important;
  overflow-y: auto !important;
  bottom: 0 !important;
  top: auto !important;
  left: auto !important;
}

.cart-dialog-small {
  border-radius: 30px 30px 0 0 !important;
  margin: 0 !important;
  height: 20% !important;
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
import {useUserStore} from '@/store/user'
import ReviewCart from "@/components/ReviewCart.vue"
import Delivery from "@/components/Delivery.vue"
import Checkout from "@/components/Checkout.vue"
import CartContBtn from "@/components/ui-elems/CartContBtn.vue";
import CartOtherBtn from "@/components/ui-elems/CartOtherBtn.vue";
import axios from 'axios'
import sha256 from 'crypto-js/sha256';


export default {
  name: "CartDialog",
  mounted() {
    let email = 'yousef.abbas.2@outlook.com'
    const hashDigest = sha256(email);
    axios.get('http://127.0.0.1:9000/foodapis/order/fetch/' + hashDigest + '/', {params: {email: email}})
        .then(response => {
          console.log(response);
        })
        .catch(error => {
          console.log(error) /*TODO: better error handling*/
        })
  },
  setup() {
    const cartStore = useCartStore()
    const vsbyStore = useVsbyStore()
    const userStore = useUserStore()
    return {
      cartStore,
      vsbyStore,
      userStore,
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
      mainClass: 'v-dialog--fullscreen cart-dialog-large',
      secondClass: 'v-dialog--fullscreen cart-dialog-small',
      overlay: false,
    }
  },
  methods: {
    showSnackbarError(errMsg) {
      this.showSnackbar = true;
      this.msgSnackbar = errMsg;
    },
    resetForm() {
      this.$refs.deliveryComp[0].resetForm();
      this.$refs.deliveryComp[0].$refs.delvyform.resetValidate();
    },
    handleServerCreateOrderSuccess() {
      this.checkoutSuccess = true;
      setTimeout(() => {
        this.overlay = false;
        this.vsbyStore.cartDiagVsby = false;
        this.cartStore.clearCart();
        this.resetForm();
      }, 1500);
    },
    handleServerCreateOrderError() {
      this.overlay = false;
      this.showSnackbarError('Server Error! Please contact us.');
    },
    async pushOrderData() {
      let orderData = {
        userEmail: this.userStore.email,
        cartItems: this.cartStore.cartItemsMin,
        delivery: this.$refs.deliveryComp[0].getForm(),
        checkout: this.$refs.checkoutComp[0].getForm()
      };
      const hashDigest = sha256(JSON.stringify(orderData));
      await axios.post('http://127.0.0.1:9000/foodapis/order/create/' + hashDigest + '/', orderData)
        .then(response => {
          console.log(response);
          this.handleServerCreateOrderSuccess();
        })
        .catch(error => {
          console.log(error);
          this.handleServerCreateOrderError();
        })
    },
    actOnCheckout(result) {
      if (result) {this.pushOrderData();}
      else        {this.showSnackbarError('Transaction failed/cancelled!');}
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