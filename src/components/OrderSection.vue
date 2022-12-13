<template>
  <div class="q-pa-md items-width">
    <div v-if="!isLoading" class="column">
      <div class="col self-center">
        <div class="order-id-font">ORDER # {{ props.orderId }}</div>
      </div>
      <div class="col q-mt-xl self-start">
        <q-timeline layout="dense" side="right" color="secondary">
          <!--<q-timeline-entry
            v-if="timelineItem === orderStatus.Delivered"
            title="Delivered"
            :subtitle="extractDate(order.delivery_datetime)"
            side="left"
          >
            <div>Enjoy your meal!</div>
          </q-timeline-entry>-->

          <!--<q-timeline-entry
            v-if="timelineItem === orderStatus.ReadyToPickup"
            title="Ready to pickup"
            side="left"
          >
            <div>Waiting time: 15 minutes.</div>
          </q-timeline-entry>-->

          <q-timeline-entry
            v-if="isOrderStatusExist(orderProgress.step3)"
            :title="orderProgress.step3"
            :subtitle="getTimestamp(orderProgress.step3)"
            side="left"
          >
            <div>
              Delivery details:
              <ul>
                <li>where? {{ order.delivery.location }}</li>
                <li>when? {{ order.delivery.date }} TODO_add_time</li>
              </ul>
            </div>
          </q-timeline-entry>

          <q-timeline-entry
            v-if="isOrderStatusExist(orderProgress.step2)"
            :title="orderProgress.step2"
            :subtitle="getTimestamp(orderProgress.step2)"
            side="left"
          >
            <div>
              The chef is preparing your order.<br />Delivery time selection
              email has been sent.
            </div>
          </q-timeline-entry>

          <q-timeline-entry
            v-if="isOrderStatusExist(orderProgress.step1)"
            :title="orderProgress.step1"
            :subtitle="getTimestamp(orderProgress.step1)"
            side="left"
          >
            <div>
              The chef has received your order.<br />Order confirmation email
              has been sent.
            </div>
          </q-timeline-entry>
        </q-timeline>
      </div>
    </div>
    <q-inner-loading :showing="isLoading">
      <q-spinner-gears size="50px" color="secondary" />
    </q-inner-loading>
  </div>
</template>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Pacifico&display=swap");
.items-width {
  min-width: 360px;
  max-width: 360px;
}
.order-id-font {
  font-family: "Bebas Neue", cursive;
  font-size: 30px;
  color: #f25b47 !important;
}
</style>

<script setup>
import { onMounted, ref } from "vue";
import { onSnapshot, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

let order = ref({});
let isLoading = ref(true);

const props = defineProps(["orderId"]);
const orderProgress = {
  step1: "Received",
  step2: "In the kitchen",
  step3: "On the way",
  step4: "Ready to pickup",
  step5: "Delivered",
};

onMounted(() => {
  fetchOrderData();
});

function isOrderStatusExist(orderStatus) {
  return orderStatus.replace(/\s+/g, "").toLowerCase() in order.value.status;
}

function getTimestamp(feStatus) {
  var beStatus = feStatus.replace(/\s+/g, "").toLowerCase();
  return order.value.status[beStatus].toDate().toString().substring(0, 21); //`${date}, ${time}`;
}

async function fetchOrderData() {
  // unsubscribe can be called as a function to stop listening to db changes
  const unsubscribe = onSnapshot(
    doc(db, "menu-order", props.orderId),
    (doc) => {
      order.value = {
        id: doc.id,
        delivery: {
          location: "",
          date: doc.data().delivery.date,
        },
        status: doc.data().status,
      };
      getDoc(doc.data().delivery.location).then((resp) => {
        order.value.delivery.location = resp.data().name;
      });
      isLoading.value = false;
    }
  );
}
</script>
