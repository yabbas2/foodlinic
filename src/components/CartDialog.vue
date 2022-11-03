<template>
  <v-dialog
    v-model="vsbyStore.cartDiagVsby"
    transition="dialog-bottom-transition"
    max-width="800"
    @click:outside="closeDialog"
    @keydown.esc="closeDialog"
    fullscreen
  >
    <v-card tile flat class="v-card--scroll" height="100%">
      <v-card-title class="pt-6">
        <v-img 
          class="mx-auto my-auto" 
          max-width="130" 
          :src="require('../assets/logo-name-wbg.png')"
        />
        <v-spacer></v-spacer>
        <v-btn 
          small
          outlined
          rounded
          :ripple="{class: 'red--text'}"
          @click="closeDialog"
        >
          <v-icon>{{mdiCloseSvg}}</v-icon>
          Close
        </v-btn>
      </v-card-title>
      <!--start: cart dialog view-->
      <v-card-text class="pt-16 px-0 v-card-text--scroll">
        <v-container>
          <v-row>
            <v-col cols="12">
              <span class="v-card__subtitle">CART & CHECKOUT</span>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-stepper
                v-model="currStep"
                alt-labels
                tile
                flat
                class="stepper"
              >
                <v-stepper-header class="v-stepper__header white sticky">
                  <v-stepper-step 
                    step="1"
                    :complete="stepComplete(1)"
                    :rules="[value => steps[0].valid]" 
                    :color="stepStatus(1)"
                    :complete-icon="mdiCheckSvg"
                    :error-icon="mdiAlertCircleSvg"
                  >
                    Review Order
                  </v-stepper-step>
                  <v-divider></v-divider>
                  <v-stepper-step 
                    step="2"
                    :complete="stepComplete(2)"
                    :rules="[value => steps[1].valid]" 
                    :color="stepStatus(2)"
                    :complete-icon="mdiCheckSvg"
                    :error-icon="mdiAlertCircleSvg"
                  >
                    Delivery
                  </v-stepper-step>
                  <v-divider></v-divider>
                  <v-stepper-step 
                    step="3"
                    :complete="stepComplete(3)"
                    :rules="[value => steps[2].valid]" 
                    :color="stepStatus(3)"
                    :complete-icon="mdiCheckSvg"
                    :error-icon="mdiAlertCircleSvg"
                  >
                    Payment
                  </v-stepper-step>
                </v-stepper-header>

                <v-stepper-items>
                  <v-stepper-content step="1">
                    <ReviewCart ref="reviewCartComp"></ReviewCart>
                  </v-stepper-content>
                  <v-stepper-content step="2">
                    <Delivery ref="deliveryComp"></Delivery>
                  </v-stepper-content>
                  <v-stepper-content step="3">
                    <Payment ref="paymentComp" :totalPrice="menuStore.totalPrice" @paymentStart="overlay=true" @paymentEnd="actOnPayment($event)"></Payment>
                  </v-stepper-content>
                </v-stepper-items>
              </v-stepper>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions style="padding-bottom: 80px;">
        <v-container>
          <v-row>
            <v-col cols="12">
              <div v-if="currStep === 1">
                <CartContBtn :showLoading="totalPriceLoading" :totalPrice="menuStore.totalPrice" @btnClicked="steps[0].validator"></CartContBtn>
                <CartOtherBtn :action="'clear'" @btnClicked="menuStore.clearCart"></CartOtherBtn>
              </div>
              <div v-if="currStep === 2">
                <CartContBtn :showLoading="totalPriceLoading" :totalPrice="menuStore.totalPrice" @btnClicked="steps[1].validator"></CartContBtn>
                <CartOtherBtn :action="'back'" @btnClicked="currStep--"></CartOtherBtn>
              </div>
              <div v-if="currStep === 3">
                <CartOtherBtn :action="'back'" @btnClicked="currStep--"></CartOtherBtn>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-card-actions>
      <!--end: cart dialog view-->
    </v-card>
    <v-snackbar v-model="showSnackbar" top>
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

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');

.stepper {
  overflow: visible;
}

.sticky {
  position: sticky;
  top: 0;
  z-index: 1;
}
.v-card--scroll {
  display: flex !important;
  flex-direction: column;
}
.v-card-text--scroll {
  flex-grow: 1;
  overflow: auto;
}
.v-card__subtitle {
  font-size: 50px !important;
  color: #39175c !important;
  line-height: 3rem !important;
  font-family: 'Bebas Neue', cursive !important;
}
.v-stepper__header {
  align-items: stretch !important;
  display: flex !important;
  flex-wrap: wrap !important;
  justify-content: space-between !important;
  box-shadow: none !important;
}
.v-stepper__label {
  display: block !important;
}
</style>

<style>
@media only screen and (min-width: 375px) {
  .v-stepper:not(.v-stepper--vertical) .v-stepper__label {
    display: flex;
  }
}
</style>

<script>
import {mdiClose, mdiCheck, mdiAlertCircle} from '@mdi/js'
import {useMenuStore} from '@/store/menu'
import {useVsbyStore} from '@/store/vsby'
import {useUserStore} from '@/store/user'
import ReviewCart from "@/components/ReviewCart.vue"
import Delivery from "@/components/Delivery.vue"
import Payment from "@/components/Payment.vue"
import CartContBtn from "@/components/ui-elems/CartContBtn.vue"
import CartOtherBtn from "@/components/ui-elems/CartOtherBtn.vue"
import axios from 'axios'
import sha256 from 'crypto-js/sha256'


export default {
  name: "CartDialog",
  setup() {
    const menuStore = useMenuStore()
    const vsbyStore = useVsbyStore()
    const userStore = useUserStore()
    return {
      menuStore,
      vsbyStore,
      userStore,
    }
  },
  components: {
    ReviewCart,
    Delivery,
    Payment,
    CartContBtn,
    CartOtherBtn,
  },
  data() {
    return {
      currStep: 1,
      steps: [
        {name: "Review Order" , valid: true, validator: () => {this.checkReviewForm(0);}},
        {name: "Delivery"     , valid: true, validator: () => {this.checkDeliveryForm(1);}},
        {name: "Payment"     , valid: true, validator: () => {this.checkPaymentForm(2);}},
      ],
      totalPriceLoading: false,
      showSnackbar: false,
      msgSnackbar: '',
      checkoutSuccess: false,
      mainClass: 'v-dialog--fullscreen cart-dialog-large',
      secondClass: 'v-dialog--fullscreen cart-dialog-small',
      overlay: false,
      mdiCloseSvg: mdiClose,
      mdiCheckSvg: mdiCheck,
      mdiAlertCircleSvg: mdiAlertCircle,
    }
  },
  methods: {
    showSnackbarError(errMsg) {
      this.showSnackbar = true;
      this.msgSnackbar = errMsg;
    },
    resetForm() {
      this.$refs.deliveryComp.resetForm();
      this.$refs.deliveryComp.resetValidateForm();
    },
    handleServerCreateOrderSuccess() {
      this.checkoutSuccess = true;
      setTimeout(() => {
        this.overlay = false;
        this.vsbyStore.closeCartDialog();
        this.menuStore.clearCart();
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
        cartItems: this.menuStore.cartItemsMin,
        delivery: this.$refs.deliveryComp.getForm(),
        payment: this.$refs.paymentComp.getForm()
      };
      const hashDigest = sha256(JSON.stringify(orderData));
      await axios.post((process.env.VUE_APP_BACKEND_SERVER + '/foodapis/order/create/' + hashDigest + '/'), orderData)
        .then(response => {
          console.log(response);
          this.handleServerCreateOrderSuccess();
        })
        .catch(error => {
          console.log(error);
          this.handleServerCreateOrderError();
        })
    },
    actOnPayment(result) {
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
      let isValid = this.$refs.deliveryComp.validateForm();
      if (isValid)  {this.currStep++;this.steps[stepIdx].valid = true;}
      else          {this.showSnackbarError('Required field(s) missing/invalid!');this.steps[stepIdx].valid = false;}
    },
    checkPaymentForm(stepIdx) {
      return true;
    },
    closeDialog() {
      this.currStep = 1;
      this.checkoutSuccess = false;
      this.vsbyStore.closeCartDialog();
    },
  },
};
</script>