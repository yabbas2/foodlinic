<template>
  <q-stepper
    v-if="cartStore.cartItemsCount > 0"
    v-model="step"
    vertical
    animated
    keep-alive
    flat
    done-color="positive"
    error-color="red"
    style="width: 370px"
    @transition="handlePanelTransEvt"
    class="bg-transparent"
  >
    <q-step
      :name="steps.step1.id"
      color="secondary"
      :title="steps.step1.name"
      :done="step > 1"
    >
      <div class="column">
        <template v-for="item in cartStore.cart" :key="item.id">
          <div v-if="item.qty > 0" class="col q-mt-xs q-mb-xs flex-center">
            <q-card class="item-card bg-white">
              <q-card-section>
                <div class="row justify-start items-center">
                  <div class="col">
                    <div class="row">
                      <div class="card-title-font">
                        {{ menuStore.menuProp(item.id, "name") }}
                      </div>
                      <q-space />
                      <q-btn
                        :ripple="false"
                        color="red"
                        round
                        flat
                        @click="item.qty = 0"
                      >
                        <q-icon size="35px" :name="outlinedDelete"></q-icon>
                      </q-btn>
                    </div>
                    <div class="row justify-start items-center">
                      <q-select
                        color="secondary"
                        rounded
                        outlined
                        v-model="item.qty"
                        :options="selectItems"
                        dense
                        options-dense
                        behavior="menu"
                        hide-hint
                      >
                        <template v-slot:prepend>
                          <q-icon
                            size="23px"
                            :name="outlinedShoppingBag"
                            @click.stop.prevent
                          />
                        </template>
                      </q-select>
                      <div class="q-ml-sm">x</div>
                      <div class="card-subtitle-font q-ml-sm">
                        {{
                          util.formatCurrency(
                            menuStore.menuProp(item.id, "price")
                          )
                        }}
                      </div>
                    </div>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </template>
      </div>
      <q-stepper-navigation>
        <q-btn @click="step++" color="secondary" label="Continue" />
        <q-btn
          outline
          @click="cartStore.clearCart"
          color="secondary"
          label="Clear Cart"
          class="q-ml-sm"
        />
      </q-stepper-navigation>
    </q-step>

    <q-step
      :name="steps.step2.id"
      color="secondary"
      :title="steps.step2.name"
      :done="step > 2"
    >
      <div class="column">
        <q-form ref="delvyForm">
          <q-select
            color="secondary"
            label="Select Location"
            rounded
            outlined
            v-model="form.location"
            :options="delvyOpts"
            behavior="menu"
            class="q-mb-md"
            hide-bottom-space
            :lazy-rules="true"
            :rules="[(val) => validateLocation(val)]"
          >
            <template v-slot:prepend>
              <q-icon size="23px" :name="outlinedPlace" @click.stop.prevent />
            </template>
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section>
                  <q-item-label>{{ scope.opt.label }}</q-item-label>
                  <q-item-label caption>{{
                    scope.opt.description
                  }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          <q-select
            color="secondary"
            label="Select Time"
            rounded
            outlined
            v-model="form.time"
            :disable="form.location === null"
            :options="form.location === null ? [] : form.location.value.time"
            behavior="menu"
            class="q-mb-md"
            hide-bottom-space
            :lazy-rules="true"
            :rules="[(val) => validateTime(val)]"
          >
            <template v-slot:prepend>
              <q-icon
                size="23px"
                :name="outlinedSchedule"
                @click.stop.prevent
              />
            </template>
          </q-select>
          <q-input
            color="secondary"
            outlined
            rounded
            v-model="form.date"
            class="q-my-md"
            label="Select Date"
            hide-bottom-space
            :lazy-rules="true"
            :rules="[(val) => validateDate(val)]"
          >
            <q-popup-proxy
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date
                v-model="form.date"
                first-day-of-week="1"
                mask="YYYY-MM-DD"
                color="secondary"
                :options="getAllowedDates"
              >
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Done" color="secondary" />
                </div>
              </q-date>
            </q-popup-proxy>
            <template v-slot:prepend>
              <q-icon :name="outlinedEvent"> </q-icon>
            </template>
          </q-input>
          <q-input
            v-model="form.notes"
            outlined
            rounded
            clearable
            type="textarea"
            label-slot
            counter
            maxlength="100"
            class="q-mt-md"
            color="secondary"
          >
            <template v-slot:label>
              Delivery notes <small>(optional)</small>
            </template>
            <template v-slot:prepend>
              <q-icon :name="outlinedModeComment"></q-icon>
            </template>
          </q-input>
        </q-form>
      </div>

      <q-stepper-navigation>
        <q-btn @click="validdateDelvyForm" color="secondary" label="Continue" />
        <q-btn
          outline
          @click="step--"
          color="secondary"
          label="Back"
          class="q-ml-sm"
        />
      </q-stepper-navigation>
    </q-step>

    <q-step
      :name="steps.step3.id"
      color="secondary"
      :title="steps.step3.name"
      :done="step > 3"
    >
      <div class="column">
        <q-form ref="contactForm">
          <q-input
            color="secondary"
            label="Name"
            rounded
            outlined
            v-model="form.name"
            class="q-mb-md"
            type="text"
            hint="e.g. John Alber"
            :lazy-rules="true"
            :rules="[(val) => validateName(val)]"
          >
            <template v-slot:prepend>
              <q-icon
                size="23px"
                :name="outlinedPersonOutline"
                @click.stop.prevent
              />
            </template>
          </q-input>
          <q-input
            color="secondary"
            label="Email"
            rounded
            outlined
            v-model="form.email"
            class="q-mb-md"
            type="text"
            hint="e.g. john.alber@mail.com"
            :lazy-rules="true"
            :rules="[(val) => validateEmail(val)]"
          >
            <template v-slot:prepend>
              <q-icon size="23px" :name="outlinedEmail" @click.stop.prevent />
            </template>
          </q-input>
          <q-input
            color="secondary"
            label="Phone"
            rounded
            outlined
            v-model="form.phone"
            class="q-mb-md"
            type="text"
            hint="e.g. +46559822657"
            :lazy-rules="true"
            :rules="[(val) => validatePhone(val)]"
          >
            <template v-slot:prepend>
              <q-icon size="23px" :name="outlinedPhone" @click.stop.prevent />
            </template>
          </q-input>
        </q-form>
      </div>

      <q-stepper-navigation>
        <q-btn
          @click="validdateContactForm"
          color="secondary"
          label="Continue"
        />
        <q-btn
          outline
          @click="step--"
          color="secondary"
          label="Back"
          class="q-ml-sm"
        />
      </q-stepper-navigation>
    </q-step>

    <q-step
      :name="steps.step4.id"
      color="secondary"
      :title="steps.step4.name"
      :done="step > 4"
    >
      <q-card flat bordered>
        <q-card-section>
          <div class="row subtotal-text q-mb-sm">
            <div class="col text-left">Subtotal</div>
            <div class="col text-right">
              {{ util.formatCurrency(totalPrice) }}
            </div>
          </div>
          <div class="row delvyfee-text q-my-sm">
            <div class="col text-left">Delivery fees</div>
            <div class="col text-right">{{ util.formatCurrency(0) }}</div>
          </div>
          <div class="row taxes-text q-my-sm">
            <div class="col text-left">Taxes</div>
            <div class="col text-right">{{ util.formatCurrency(0) }}</div>
          </div>
          <div class="row discount-text q-my-sm">
            <div class="col text-left">Discount</div>
            <div class="col text-right">{{ discount * -100 }}%</div>
          </div>
          <div class="row total-text q-mt-sm">
            <div class="col text-left">Total</div>
            <div class="col text-right">
              {{ util.formatCurrency(totalToPay) }}
            </div>
          </div>
        </q-card-section>
      </q-card>
      <div class="row promocode-text flex-center">
        <div class="col-8">
          <q-form ref="promoCodeForm">
            <q-input
              outlined
              rounded
              dense
              v-model="form.promocode"
              class="q-my-md"
              label="Promo Code"
              hide-bottom-space
              :lazy-rules="true"
              :rules="[(val) => validatePromoCode(val)]"
            />
          </q-form>
        </div>
        <div class="col-4 text-right">
          <q-btn
            color="secondary"
            label="Apply"
            @click="validatePromoCodeForm"
          />
        </div>
      </div>
      <q-card flat bordered>
        <q-card-section>
          <div ref="paypal"></div>
        </q-card-section>
      </q-card>

      <q-stepper-navigation>
        <q-btn
          outline
          @click="step--"
          color="secondary"
          label="Back"
          class="q-ml-sm"
        />
      </q-stepper-navigation>
    </q-step>
  </q-stepper>
  <div v-if="!isOrderSuccess && cartStore.cartItemsCount === 0">
    <div class="column flex-center">
      <div class="col">
        <q-img width="200px" src="~/assets/cart-empty.png"></q-img>
      </div>
      <div class="col q-pt-md">
        <div class="cart-primary-text">
          Looks like you haven't made up your mind yet.
        </div>
      </div>
      <div class="col q-pt-md">
        <div class="cart-secondary-text">
          <q-btn rounded color="secondary" :ripple="false" replace to="/"
            >Home</q-btn
          >
        </div>
      </div>
    </div>
  </div>
  <div v-if="isOrderSuccess">
    <div class="column flex-center">
      <div class="col q-py-sm">
        <q-img src="~assets/op-success.png" class="op-success-img" />
      </div>
      <div class="col q-py-sm" style="min-width: 300px">
        <div class="cart-primary-text">Thank you for your order!</div>
      </div>
      <div class="col q-py-md" style="max-width: 300px">
        <div class="cart-secondary-text">
          An order confirmation email will be sent to your email address soon!
        </div>
      </div>
    </div>
    <div class="row flex-center q-mt-lg">
      <q-btn
        outline
        color="secondary"
        label="Back to Home"
        class="q-mx-md"
        @click="Router.replace('/')"
      />
      <q-btn
        color="positive"
        label="Track My Order"
        class="q-mx-md"
        @click="Router.replace(`/order/${orderId}`)"
      />
    </div>
  </div>
  <q-inner-loading :showing="isLoading">
    <q-spinner-gears size="50px" color="secondary" />
  </q-inner-loading>
</template>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Pacifico&display=swap");

.item-card {
  max-width: 280px;
  margin-left: auto;
  margin-right: auto;
}
.card-title-font {
  font-family: "Bebas Neue", cursive;
  font-size: 25px;
}
.card-subtitle-font {
  font-family: "Bebas Neue", cursive;
  font-size: 20px;
}
.subtotal-text,
.delvyfee-text,
.taxes-text,
.discount-text {
  font-size: 17px;
  color: gray;
}
.total-text {
  font-size: 20px;
  font-weight: bold;
  color: black;
}
.cart-primary-text {
  font-size: 20px;
  text-align: center;
  color: gray;
  padding-left: 5%;
  padding-right: 5%;
}
.cart-secondary-text {
  font-size: 15px;
  text-align: center;
  color: gray;
}
.op-success-img {
  width: 60px;
}
</style>

<script setup>
import validator from "validator";
import CryptoJS from "crypto-js";
import { reactive, ref, computed, onBeforeMount } from "vue";
import util from "src/plugins/util";
import { useMenuStore } from "../stores/menu";
import { useCartStore } from "../stores/cart";
import {
  outlinedShoppingBag,
  outlinedDelete,
  outlinedPlace,
  outlinedEvent,
  outlinedModeComment,
  outlinedPersonOutline,
  outlinedEmail,
  outlinedPhone,
  outlinedSchedule,
} from "@quasar/extras/material-icons-outlined";
import { date, useQuasar } from "quasar";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  arrayUnion,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import Router from "../router";
import axios from "axios";

const cartStore = useCartStore();
const menuStore = useMenuStore();
const $q = useQuasar();
const selectItems = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const delvyForm = ref(null);
const contactForm = ref(null);
const promoCodeForm = ref(null);
const paypal = ref(null);
const steps = {
  step1: { id: 1, name: "Review" },
  step2: { id: 2, name: "Delivery" },
  step3: { id: 3, name: "Contact" },
  step4: { id: 4, name: "Payment" },
};

let discount = ref(0.0);
let step = ref(1);
let form = reactive({
  location: null,
  date: "",
  time: "",
  notes: "",
  promocode: "",
  name: "",
  email: "",
  phone: "",
});
let delvyOpts = ref([]);
let availPromoCodes = ref([]);
let isLoading = ref(false);
let validCartForm = ref(false);
let isOrderSuccess = ref(false);
let orderId = ref("");
let orderTrackLink = ref("");

onBeforeMount(() => {
  const paypalScript = document.createElement("script");
  //paypalScript.id = "paypal-script";
  paypalScript.src =
    "https://www.paypal.com/sdk/js?client-id=" +
    import.meta.env.VITE_PAYPAL_CLIENT_ID +
    "&currency=SEK";
  //script.addEventListener("load", loadPaypal);
  document.body.appendChild(paypalScript);
  fetchDelvyOpts();
  fetchPromoCodes();
});

const totalToPay = computed(() => {
  return discount.value > 0.0
    ? totalPrice.value * (1.0 - discount.value)
    : totalPrice.value;
});

const totalPrice = computed(() => {
  let total = 0;
  cartStore.cart.forEach((item) => {
    total += menuStore.menuProp(item.id, "price") * item.qty;
  });
  return total;
});

function notifyError(errMsg) {
  $q.notify({
    type: "negative",
    message: errMsg,
    position: "bottom",
  });
}

function handlePanelTransEvt(newVal, oldVal) {
  switch (newVal) {
    case steps.step4.id:
      loadPaypal();
      break;
    default:
      break;
  }
}

function validateName(val) {
  return validator.isAlpha(val, "en-US", { ignore: " '-" }) &&
    validator.isLength(val, { min: 3, max: 50 }) &&
    validator.matches(val, /^\S+\s\S+$/i)
    ? true
    : "";
}

function validateEmail(val) {
  return validator.isEmail(val) ? true : "";
}

function validatePhone(val) {
  return validator.isMobilePhone(val, "any", { strictMode: true }) ? true : "";
}

function validatePromoCode(val) {
  validCartForm.value = availPromoCodes.value
    .map((item) => item.name)
    .includes(val);
  return validCartForm.value ? true : "";
}

function validateLocation(val) {
  return val !== null ? true : "";
}

function validateDate(val) {
  return val !== "" ? true : "";
}

function validateTime(val) {
  return val !== "" ? true : "";
}

async function validdateContactForm() {
  await contactForm.value.validate().then((result) => {
    step.value = result ? step.value + 1 : step.value;
  });
}

async function validdateDelvyForm() {
  await delvyForm.value.validate().then((result) => {
    step.value = result ? step.value + 1 : step.value;
  });
}

async function validatePromoCodeForm() {
  discount.value = validCartForm.value
    ? availPromoCodes.value.filter((item) => item.name === form.promocode)[0]
        .discount
    : discount.value;
}

async function fetchDelvyOpts() {
  const delvyOptQ = query(
    collection(db, "delivery-opt"),
    where("enabled", "==", true)
  );
  // unsubscribe can be called as a function to stop listening to db changes
  const unsubscribe = onSnapshot(delvyOptQ, (delvyOptSnapshot) => {
    const updatedDelvyOpts = [];
    delvyOptSnapshot.forEach((doc) => {
      updatedDelvyOpts.push({
        value: {
          id: doc.id,
          lat: doc.data().loc._lat,
          lng: doc.data().loc._lng,
          time: doc.data().time,
        },
        label: doc.data().name,
        description: doc.data().description,
      });
    });
    delvyOpts.value = updatedDelvyOpts;
  });
}

async function fetchPromoCodes() {
  const promoCodeQ = query(
    collection(db, "promo-code"),
    where("enabled", "==", true)
  );
  // unsubscribe can be called as a function to stop listening to db changes
  const unsubscribe = onSnapshot(promoCodeQ, (promoCodeSnapshot) => {
    const updatedPromoCode = [];
    promoCodeSnapshot.forEach((doc) => {
      updatedPromoCode.push({
        id: doc.id,
        name: doc.data().name,
        discount: doc.data().discount,
      });
    });
    availPromoCodes.value = updatedPromoCode;
  });
}

/*TODO:include the orders time to determine the next available time for delivery - should not be next day only*/
function getMinDate() {
  /* Next available day */
  let minDay = new Date(Date.now());
  minDay.setDate(minDay.getDate() + 1);
  return date.formatDate(minDay.toISOString().substring(0, 10), "YYYY/MM/DD");
}

function getMaxDate() {
  /* Two-week time frame is the maximum */
  const numWeeks = 2;
  let maxDay = new Date(Date.now());
  maxDay.setDate(maxDay.getDate() + numWeeks * 7);
  return date.formatDate(maxDay.toISOString().substring(0, 10), "YYYY/MM/DD");
}

/*TODO:exclude holidays as well*/
function getAllowedDates(dateStr) {
  const excludedDays = date.formatDate(dateStr, "YYYY-MM-ddd").split("-")[2];
  return (
    dateStr >= getMinDate() &&
    dateStr <= getMaxDate() &&
    excludedDays != "Sat" &&
    excludedDays != "Sun"
  );
}

async function submitOrder() {
  isLoading.value = true;
  // prettier-ignore
  let cartRefs = cartStore.cart.map((cartItem) => true? { item: doc(db, `menu-item/${cartItem.id}`), qty: cartItem.qty } : cartItem);
  // prettier-ignore
  let usedPromoCode = doc(db, `promo-code/${availPromoCodes.value.find((code) => code.name === form.promocode).id}`);
  // send order to firestore
  addDoc(collection(db, "menu-order"), {
    cart: arrayUnion(...cartRefs),
    delivery: {
      location: form.location.label,
      date: form.date,
      time: form.time,
      notes: form.notes,
    },
    payment: totalToPay.value,
    contact: {
      name: form.name,
      email: form.email,
      phone: form.phone,
    },
    promocode: usedPromoCode,
    status: { received: serverTimestamp() },
  })
    .then((doc) => {
      // finish all steps as done
      step.value++;
      // save order ID
      orderId.value = doc.id;
      // set order track link
      orderTrackLink.value = `https://foodlinic.com/order/${doc.id}`;
      // send order confirmation email
      sendEmail({
        emailType: "food_order_confirmation",
        emailTo: form.email,
        firstName: form.name.split(" ")[0],
        totalPaid: totalToPay.value,
        paymentMethod: "PayPal",
        orderId: orderId.value,
        orderTrackLink: orderTrackLink.value,
        deliveryDate: form.date,
        deliveryTime: form.time,
        deliveryLocation: form.location.label,
        orderItems: cartStore.cart.map((item) =>
          true
            ? {
                name: menuStore.menuProp(item.id, "name"),
                qty: item.qty,
                price: menuStore.menuProp(item.id, "price"),
              }
            : ""
        ),
      });
      // clear cart
      cartStore.clearCart();
      // stop loading
      isLoading.value = false;
      // mark order as successful, to show successful order div
      isOrderSuccess.value = true;
    })
    .catch((error) => {
      // TODO: better error handling
      console.log(error);
      // stop loading
      isLoading.value = false;
      // mark order as failed, do nothing
      isOrderSuccess.value = false;
    });
}

async function sendEmail(emailData) {
  let emailCipher = CryptoJS.AES.encrypt(
    JSON.stringify(emailData),
    CryptoJS.enc.Utf8.parse(import.meta.env.VITE_EMAIL_API_KEY),
    {
      iv: CryptoJS.enc.Utf8.parse(import.meta.env.VITE_EMAIL_API_IV),
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC,
    }
  ).toString();
  await axios
    .post(import.meta.env.VITE_EMAIL_API_SERVER + "/emailapis/send-email/", {
      data: emailCipher,
    })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
}

function loadPaypal() {
  window.paypal
    .Buttons({
      style: {
        color: "blue",
        /*shape: "pill",*/
        label: "pay",
        height: 40,
      },
      // Set up the transaction
      createOrder: (data, actions) => {
        return actions.order.create({
          purchase_units: [
            {
              amount: {
                currency_code: "SEK",
                value: String(totalToPay.value),
              },
            },
          ],
        });
      },
      // Finalize the transaction
      onApprove: async (data, actions) => {
        let order = await actions.order.capture();
        if (order) {
          // send order to db
          submitOrder();
        }
      },
      onCancel: async (data) => {
        notifyError("Transaction cancelled");
        console.log(data);
      },
      onError: async (err) => {
        notifyError("Transaction failed");
        console.log(err);
      },
    })
    .render(paypal.value);
}
</script>
