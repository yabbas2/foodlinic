<template>
  <div class="q-pa-md items-width">
    <div v-if="!isLoading" class="column">
      <div class="col self-center">
        <div class="order-id">{{ props.orderId }}</div>
      </div>
      <div class="col q-mt-xl self-start">
        <q-card bordered class="timeline-card">
          <q-card-section>
            <q-timeline
              layout="dense"
              side="right"
              color="secondary"
              class="q-pa-md"
            >
              <q-timeline-entry
                v-if="isOrderStatusExist(orderProgress.step5)"
                :title="orderProgress.step5"
                :subtitle="getTimestamp(orderProgress.step5)"
                side="left"
              >
                <div>Enjoy your meal!</div>
              </q-timeline-entry>

              <q-timeline-entry
                v-if="isOrderStatusExist(orderProgress.step4)"
                :title="orderProgress.step4"
                :subtitle="getTimestamp(orderProgress.step4)"
                side="left"
              >
                <div>Waiting time: 15 minutes.</div>
              </q-timeline-entry>

              <q-timeline-entry
                v-if="isOrderStatusExist(orderProgress.step3)"
                :title="orderProgress.step3"
                :subtitle="getTimestamp(orderProgress.step3)"
                side="left"
              >
                <div>
                  <strong>Delivery details:</strong>
                  <ul>
                    <li>
                      <strong>When?</strong> {{ order.delivery.date }}
                      {{ order.delivery.time }}
                    </li>
                    <li>
                      <strong>Where?</strong> {{ order.delivery.location }}
                    </li>
                  </ul>
                </div>
              </q-timeline-entry>

              <q-timeline-entry
                v-if="isOrderStatusExist(orderProgress.step2)"
                :title="orderProgress.step2"
                :subtitle="getTimestamp(orderProgress.step2)"
                side="left"
              >
                <div>The chef is preparing your order.</div>
              </q-timeline-entry>

              <q-timeline-entry
                v-if="isOrderStatusExist(orderProgress.step1)"
                :title="orderProgress.step1"
                :subtitle="getTimestamp(orderProgress.step1)"
                side="left"
              >
                <div>The chef has received your order.</div>
              </q-timeline-entry>
            </q-timeline>
          </q-card-section>
        </q-card>
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
.order-id {
  //font-family: "Bebas Neue", cursive;
  //font-size: 30px;
  font-size: 20px;
  font-weight: bold;
  text-transform: uppercase;
  color: $secondary !important;
  border: 1px solid $secondary;
  border-radius: 12px;
  padding: 5px;
}
.timeline-card {
  min-width: 325px;
  margin-right: auto;
  margin-left: auto;
  border-radius: 20px;
}
</style>

<script setup>
import { onMounted, ref } from "vue";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "../firebase";

let order = ref({});
let isLoading = ref(true);

const props = defineProps(["orderId"]);
/*TODO: fetch from db in the future*/
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
          location: doc.data().delivery.location,
          date: doc.data().delivery.date,
          time: doc.data().delivery.time,
        },
        status: doc.data().status,
      };
      isLoading.value = false;
    }
  );
}
</script>
