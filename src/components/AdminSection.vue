<template>
  <q-tabs
    v-model="tab"
    class="text-black"
    active-color="secondary"
    indicator-color="secondary"
    mobile-arrows
    outside-arrows
    narrow-indicator
  >
    <q-tab
      v-for="delvyDate in delvyDates"
      :key="delvyDate"
      :tabindex="delvyDate"
      :name="delvyDate"
      :label="delvyDate"
    />
  </q-tabs>
  <q-tab-panels v-model="tab" animated class="bg-transparent">
    <q-tab-panel
      v-for="delvyDate in delvyDates"
      :key="delvyDate"
      :name="delvyDate"
    >
      <div class="column">
        <template v-for="order in orders" :key="order.id">
          <div
            v-if="delvyDate === order.data.delivery.date"
            class="col q-my-sm"
          >
            <q-card>
              <q-card-section>
                <div class="text-h6">{{ order.id }}</div>
              </q-card-section>
              <q-card-section>
                <div class="text-subtitle2">
                  Who? {{ order.data.contact.name }},
                  {{ order.data.contact.phone }}
                </div>
                <div class="text-subtitle2">
                  Where? {{ order.data.delivery.location }}
                </div>
                <div class="text-subtitle2">
                  When? {{ order.data.delivery.time }}
                </div>
              </q-card-section>
              <q-card-section>
                <q-markup-table dense>
                  <thead>
                    <tr>
                      <th class="text-left">Item</th>
                      <th class="text-center"></th>
                      <th class="text-left">Qty</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="cartItem in order.data.cart"
                      :key="cartItem.item.id"
                    >
                      <td class="text-left">{{ cartItem.item.data.name }}</td>
                      <td class="text-center">x</td>
                      <td class="text-left">{{ cartItem.qty }}</td>
                    </tr>
                  </tbody>
                </q-markup-table>
              </q-card-section>
              <q-card-actions>
                <div class="column">
                  <div
                    class="col"
                    v-for="opt in OrderStatusOpts"
                    :key="order.id + opt.value"
                  >
                    <q-checkbox
                      :modelValue="Object.keys(order.data.status)"
                      checked-icon="task_alt"
                      unchecked-icon="highlight_off"
                      :val="opt.value"
                      :label="opt.label"
                      @update:model-value="
                        (val, evt) => updateOrderStatus(order.id, val)
                      "
                    />
                  </div>
                </div>
              </q-card-actions>
            </q-card>
          </div>
        </template>
      </div>
    </q-tab-panel>
  </q-tab-panels>
</template>

<style lang="scss" scoped></style>

<script setup>
import { ref, onBeforeMount, reactive } from "vue";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  updateDoc,
  doc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";

const OrderStatusOpts = [
  { label: "Received", value: "received" },
  { label: "In the kitchen", value: "inthekitchen" },
  { label: "On the way", value: "ontheway" },
  { label: "Ready to pickup", value: "readytopickup" },
  { label: "Delivered", value: "delivered" },
];

let orders = ref([]);
let menuItems = ref([]);
let delvyDates = reactive(new Set());
let tab = ref("");

onBeforeMount(() => {
  fetchMenuItems();
  fetchOrders();
});

function fetchMenuItems() {
  const menuItemQ = query(collection(db, "menu-item"));
  // unsubscribe can be called as a function to stop listening to db changes
  const unsubscribe = onSnapshot(menuItemQ, (menuItemSnapshot) => {
    const updatedMenuItems = [];
    menuItemSnapshot.forEach((doc) => {
      updatedMenuItems.push({
        id: doc.id,
        data: doc.data(),
      });
    });
    menuItems.value = updatedMenuItems;
  });
}

function fetchOrders() {
  let orderQ = query(
    collection(db, "menu-order"),
    where("delivery.date", ">=", getDate(0)),
    where("delivery.date", "<", getDate(14)),
    orderBy("delivery.date")
  );
  // unsubscribe can be called as a function to stop listening to db changes
  const unsubscribe = onSnapshot(orderQ, (orderSnapshot) => {
    const updatedOrders = [];
    delvyDates.clear();
    orderSnapshot.forEach((doc) => {
      if (!doc.data().status.hasOwnProperty("delivered")) {
        updatedOrders.push({
          id: doc.id,
          data: doc.data(),
        });
        delvyDates.add(doc.data().delivery.date);
      } else {
        /* ignore already-delivered orders */
      }
    });
    updatedOrders.forEach((order) => {
      order.data.cart.forEach((cartItem, idx, arr) => {
        arr[idx].item = menuItems.value.find(
          (menuItem) => menuItem.id === cartItem.item.id
        );
      });
    });
    console.log(updatedOrders);
    orders.value = updatedOrders;
    /* first tab is "orders of today" */
    if (updatedOrders.length > 0) {
      tab.value = updatedOrders[0].data.delivery.date;
    } else {
      /* do nothing, there are no orders */
    }
  });
}

function getDate(offset) {
  let tempDate = new Date(Date.now());
  tempDate.setDate(tempDate.getDate() + offset);
  return tempDate.toISOString().substring(0, 10);
}

async function updateOrderStatus(id, val) {
  const key = val[val.length - 1];
  await updateDoc(doc(db, "menu-order", id), {
    [`status.${key}`]: serverTimestamp(),
  });
}
</script>
