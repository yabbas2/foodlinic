<template>
  <q-stepper
    v-if="menuStore.cartItemsCount > 0"
    v-model="step"
    vertical
    animated
    keep-alive
    done-color="green"
    error-color="red"
    flat
    style="width: 370px"
    @transition="handlePanelTransEvt"
  >
    <q-step
      :name="steps.step1.id"
      color="primary"
      :title="steps.step1.name"
      :done="step > 1"
    >
      <div class="column">
        <template v-for="item in menuStore.menuItems" :key="item.id">
          <div v-if="item.qty > 0" class="col q-mt-xs q-mb-xs flex-center">
            <q-card class="item-card bg-white">
              <q-card-section>
                <div class="row justify-start items-center">
                  <!--<div class="col">
                    <q-img
                      :src="item.imgSrc"
                      height="80px"
                      width="80px"
                    ></q-img>
                  </div>-->
                  <div class="col">
                    <div class="row">
                      <div class="card-title-font">{{ item.name }}</div>
                    </div>
                    <div class="row justify-start items-center">
                      <q-btn color="red" round flat @click="item.qty = 0">
                        <q-icon size="35px" :name="outlinedDelete"></q-icon>
                      </q-btn>
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
                        @update:model-value="
                          item.total_price = item.qty * item.price
                        "
                      >
                        <template v-slot:prepend>
                          <q-icon
                            size="23px"
                            :name="outlinedShoppingBag"
                            @click.stop.prevent
                          />
                        </template>
                      </q-select>
                      <div class="q-ml-md">x</div>
                      <div class="card-subtitle-font q-ml-md">
                        {{ util.formatCurrency(item.price) }}
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
        <q-btn @click="step++" color="primary" label="Continue" />
        <q-btn
          outline
          @click="menuStore.clearCart"
          color="primary"
          label="Clear Cart"
          class="q-ml-sm"
        />
      </q-stepper-navigation>
    </q-step>

    <q-step
      :name="steps.step2.id"
      color="primary"
      :title="steps.step2.name"
      :done="step > 2"
    >
      <div class="column">
        <q-form ref="delvyForm">
          <q-select
            color="primary"
            label="Select Meeting Location"
            rounded
            outlined
            v-model="form.location"
            :options="locations"
            behavior="menu"
            class="q-mb-md"
            hide-bottom-space
            :lazy-rules="true"
            :rules="[(val) => val !== null]"
          >
            <template v-slot:prepend>
              <q-icon size="23px" :name="outlinedPlace" @click.stop.prevent />
            </template>
          </q-select>
          <q-input
            outlined
            rounded
            v-model="form.date"
            class="q-my-md"
            label="Select Meeting Date"
            hide-bottom-space
            :lazy-rules="true"
            :rules="[(val) => val !== '']"
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
                :options="getAllowedDates"
              >
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
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
            autogrow
            maxlength="100"
            class="q-mt-md"
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
        <q-btn @click="validdateDelvyForm" color="primary" label="Continue" />
        <q-btn
          outline
          @click="step--"
          color="primary"
          label="Back"
          class="q-ml-sm"
        />
      </q-stepper-navigation>
    </q-step>

    <q-step
      :name="steps.step3.id"
      color="primary"
      :title="steps.step3.name"
      :done="step > 3"
    >
      <q-card flat bordered>
        <q-card-section>
          <div class="row subtotal-text q-mb-sm">
            <div class="col text-left">Subtotal</div>
            <div class="col text-right">
              {{ util.formatCurrency(menuStore.totalPrice) }}
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
              :rules="[
                (val) => availPromoCodes.map((item) => item.name).includes(val),
              ]"
            />
          </q-form>
        </div>
        <div class="col-4 text-right">
          <q-btn color="primary" label="Apply" @click="validatePromoCodeForm" />
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
          color="primary"
          label="Back"
          class="q-ml-sm"
        />
      </q-stepper-navigation>
    </q-step>
  </q-stepper>
  <div v-else class="row flex-center">
    <q-img width="280px" src="~/assets/cart-empty.png"></q-img>
  </div>
  <q-inner-loading :showing="isLoading">
    <q-spinner-gears size="50px" color="secondary" />
  </q-inner-loading>
</template>

<style scoped>
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
  color: #f25b47 !important;
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
</style>

<script setup>
import axios from "axios";
import { onMounted, reactive, ref, computed, onBeforeMount } from "vue";
import util from "src/plugins/util";
import { useMenuStore } from "src/stores/menu";
import {
  outlinedShoppingBag,
  outlinedDelete,
  outlinedPlace,
  outlinedEvent,
  outlinedModeComment,
} from "@quasar/extras/material-icons-outlined";
import { date, useQuasar } from "quasar";

onMounted(() => {
  fetchDelvyLocations();
  fetchPromoCodes();
});

onBeforeMount(() => {
  const script = document.createElement("script");
  script.id = "paypal-script";
  script.src =
    "https://www.paypal.com/sdk/js?client-id=Afypn0F0ftWe0TzZ7w_MEF-h7p3kT-0bfsgULFkpf5qKy9K3o9arN84xlIwOw0Kw7HSKShpDrJjvzQKa&currency=SEK";
  //script.addEventListener("load", loadPaypal);
  document.body.appendChild(script);
});

const totalToPay = computed(() => {
  return discount.value > 0.0
    ? menuStore.totalPrice * (1.0 - discount.value)
    : menuStore.totalPrice;
});

const menuStore = useMenuStore();
const $q = useQuasar();
const selectItems = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const delvyForm = ref(null);
const promoCodeForm = ref(null);
const paypal = ref(null);
const steps = {
  step1: { id: 1, name: "Review cart" },
  step2: { id: 2, name: "Delivery" },
  step3: { id: 3, name: "Payment" },
};

let discount = ref(0.0);
let step = ref(1);
let form = reactive({ location: null, date: "", notes: "", promocode: "" });
let locations = [];
let availPromoCodes = [];
let isLoading = ref(false);

function notifyError(errMsg) {
  $q.notify({
    type: "negative",
    message: errMsg,
    position: "bottom",
  });
}

function handlePanelTransEvt(newVal, oldVal) {
  switch (newVal) {
    case steps.step3.id:
      loadPaypal();
      break;
    default:
      break;
  }
}

async function validdateDelvyForm() {
  await delvyForm.value.validate().then((result) => {
    step.value = result ? step.value + 1 : step.value;
  });
}

async function validatePromoCodeForm() {
  await promoCodeForm.value.validate().then((result) => {
    discount.value = result
      ? availPromoCodes.filter((item) => item.name === form.promocode)[0]
          .discount
      : discount.value;
  });
}

function handleLocationsFetchSuccess(jsonData) {
  jsonData.forEach((elm) => {
    locations.push({
      value: {
        lat: elm.coor_lat,
        lng: elm.coor_lng,
      },
      label: elm.name,
    });
  });
}

async function fetchDelvyLocations() {
  await axios
    .get(import.meta.env.VITE_BACKEND_SERVER + "/foodapis/location")
    .then((response) => {
      handleLocationsFetchSuccess(response.data);
    })
    .catch((error) => {
      console.log(error); /*TODO: better error handling*/
    });
}

function handlePromocodesFetchSuccess(jsonData) {
  // first element is empty -> pass validation if no promocode is provided by user
  availPromoCodes.push({ name: "", discount: 0.0 });
  // save server's promocodes
  jsonData.forEach((elm) => {
    availPromoCodes.push(elm);
  });
}

async function fetchPromoCodes() {
  await axios
    .get(import.meta.env.VITE_BACKEND_SERVER + "/foodapis/promocode")
    .then((response) => {
      handlePromocodesFetchSuccess(response.data);
    })
    .catch((error) => {
      console.log(error); /*TODO: better error handling*/
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

function handleOrderCreateSuccess(respData) {
  isLoading.value = false;
}

function handleOrderCreateError(errorCode) {
  isLoading.value = false;
  switch (errorCode) {
    case 401:
      notifyError("Invalid order data");
      break;
    case 401:
      notifyError("Invalid account credentials");
      break;
    case 500:
    default:
      notifyError("Error! Please contact us");
      break;
  }
}

async function submitOrder() {
  let orderData = {
    token: window.sessionStorage.getItem("x-access-token"),
    cart: menuStore.cartItemsMin,
    delivery: {
      location: form.location.value,
      date: form.date,
      notes: form.notes,
    },
    payment: totalToPay.value,
  };
  isLoading.value = true;
  await axios
    .post(
      import.meta.env.VITE_BACKEND_SERVER + "/foodapis/order/create/",
      orderData
    )
    .then((response) => {
      console.log(response);
      handleOrderCreateSuccess(response.data);
    })
    .catch((error) => {
      console.log(error.response);
      handleOrderCreateError(error.response.status);
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
        console.log(order);
        if (order) {
          submitOrder();
        }
      },
      onCancel: async (data) => {
        notifyError("Transaction cancelled");
      },
      onError: async (err) => {
        notifyError("Transaction failed");
      },
    })
    .render(paypal.value);
}
</script>
