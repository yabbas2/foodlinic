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
      <v-spacer style="min-height: 50px;"></v-spacer>
      <!--start: cart dialog view-->
      <v-card-subtitle class="justify-center py-0 v-card__subtitle">
        YOUR CART {{emptyCart}}
      </v-card-subtitle>
      <v-spacer style="min-height: 50px;"></v-spacer>
      <v-card-text v-if="menuStore.cartItemsCount>0" class="px-0 py-0 v-card-text--scroll">
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
              :color="stepStatus(n+1)"
              :complete-icon="mdiCheckSvg"
              :error-icon="mdiAlertCircleSvg"
            >
              {{step.name}}
            </v-stepper-step>
            <v-stepper-content
              v-if="true"
              :step="n+1" 
              :key="'step-content-'+String(n)"
            >
              <div v-if="n === 0">
                <ReviewCart ref="reviewCartComp"></ReviewCart>
                <v-divider class="my-4"></v-divider>
                <div>
                  <CartContBtn :showLoading="totalPriceLoading" :totalPrice="menuStore.totalPrice" @btnClicked="step.validator"></CartContBtn>
                  <CartOtherBtn :action="'clear'" @btnClicked="menuStore.clearCart"></CartOtherBtn>
                </div>
              </div>
              <div v-if="n === 1">
                <Delivery ref="deliveryComp"></Delivery>
                <v-divider class="my-4"></v-divider>
                <div>
                  <CartContBtn :showLoading="totalPriceLoading" :totalPrice="menuStore.totalPrice" @btnClicked="step.validator"></CartContBtn>
                  <CartOtherBtn :action="'back'" @btnClicked="currStep--"></CartOtherBtn>
                </div>
              </div>
              <div v-if="n === 2">
                <Checkout ref="checkoutComp" :totalPrice="menuStore.totalPrice" @checkoutStart="overlay=true" @checkoutEnd="actOnCheckout($event)"></Checkout>
                <v-divider class="my-4"></v-divider>
                <div>
                  <CartOtherBtn :action="'back'" @btnClicked="currStep--"></CartOtherBtn>
                </div>
              </div>
            </v-stepper-content>
          </template>
        </v-stepper>
      </v-card-text>
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

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');

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
</style>

<script>
import {mdiClose, mdiCheck, mdiAlertCircle} from '@mdi/js'
import {useMenuStore} from '@/store/menu'
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
  mounted() {
    console.log(this.$options.name + ' is mounted!');
  },
  created() {
    console.log(this.$options.name + ' is created!');
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
      this.$refs.deliveryComp[0].resetForm();
      this.$refs.deliveryComp[0].$refs.delvyform.resetValidate();
    },
    handleServerCreateOrderSuccess() {
      this.checkoutSuccess = true;
      setTimeout(() => {
        this.overlay = false;
        this.vsbyStore.cartDiagVsby = false;
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
        delivery: this.$refs.deliveryComp[0].getForm(),
        checkout: this.$refs.checkoutComp[0].getForm()
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
  computed: {
    emptyCart() {
      return (this.menuStore.cartItemsCount == 0)? 'IS EMPTY' : '';
    },
  },
};
</script>