<template>
  <div class="q-pa-md items-width">
    <q-expansion-item
      v-for="order in orders"
      :key="order.id"
      expand-separator
      :label="`Order #${order.id}`"
      class="shadow-1 overflow-hidden q-my-md rounded-borders"
      header-class="bg-primary text-white items-width"
      expand-icon-class="text-white"
      group="orders"
    >
      <q-card>
        <q-card-section>
          <q-timeline layout="dense" side="right" color="secondary">
            <q-timeline-entry heading tag="h6">Order Progress</q-timeline-entry>
            <template
              v-for="timelineItem in order.timeline"
              :key="timelineItem"
            >
              <q-timeline-entry
                v-if="timelineItem === orderStatus.Delivered"
                title="Delivered"
                :subtitle="extractDate(order.delivery_datetime)"
                side="left"
              >
                <div>Enjoy your meal!</div>
              </q-timeline-entry>

              <q-timeline-entry
                v-if="timelineItem === orderStatus.ReadyToPickup"
                title="Ready to pickup"
                side="left"
              >
                <div>Waiting time: 15 minutes.</div>
              </q-timeline-entry>

              <q-timeline-entry
                v-if="timelineItem === orderStatus.OnTheWay"
                title="On the way"
                side="left"
              >
                <div>
                  Estimated delivery time:
                  {{ extractTime(order.delivery_datetime) }}
                </div>
              </q-timeline-entry>

              <q-timeline-entry
                v-if="timelineItem === orderStatus.InProgress"
                title="In the kitchen"
                side="left"
              >
              </q-timeline-entry>

              <q-timeline-entry
                v-if="timelineItem === orderStatus.Received"
                title="Received"
                side="left"
              >
              </q-timeline-entry>
            </template>
          </q-timeline>
        </q-card-section>
      </q-card>
    </q-expansion-item>
  </div>
</template>

<style lang="scss" scoped>
.rounded-borders {
  border-radius: 30px;
}
.items-width {
  min-width: 360px;
  max-width: 360px;
}
</style>

<script setup>
import { onMounted, reactive, ref, computed, onBeforeMount } from "vue";
import axios from "axios";
import { date } from "quasar";

onBeforeMount(() => {
  fetchOrderData();
});

let orders = ref([]);

const orderStatus = {
  Received: "RCVD",
  InProgress: "IP",
  OnTheWay: "OTW",
  ReadyToPickup: "RTP",
  Delivered: "DLVRD",
};

function extractDate(strDatetime) {
  let strDate = strDatetime.split("T")[0];
  strDate = date.formatDate(strDate, "MMMM DD, YYYY");
  return strDate;
}

function extractTime(strDatetime) {
  let strTime = strDatetime.split("T")[1].substring(0, 5);
  return strTime;
}

function handleOrderFetchSuccess(respData) {
  respData["data"].forEach((elm) => {
    //orders.push(elm);
    elm.timeline = [...elm.timeline.slice().reverse()];
    orders.value.unshift(elm);
    //panelArr.push(0);
  });
  console.log(orders);
}

function handleOrderFetchError(errCode) {}

async function fetchOrderData() {
  await axios
    .post(import.meta.env.VITE_BACKEND_SERVER + "/foodapis/order/fetch/", {
      token: window.sessionStorage.getItem("x-access-token"),
    })
    .then((response) => {
      console.log(response.data);
      handleOrderFetchSuccess(response.data);
    })
    .catch((error) => {
      console.log(error.response);
      handleOrderFetchError(error.response.status);
    });
}
</script>
