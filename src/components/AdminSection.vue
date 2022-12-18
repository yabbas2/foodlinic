<template>
  <div>Hamada</div>
</template>

<style scoped></style>

<script setup>
import { ref, onBeforeMount } from "vue";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";

let orders = ref({});

onBeforeMount(() => {
  fetchOrders();
});

async function fetchOrders() {
  let orderQ = query(
    collection(db, "menu-order"),
    where("delivery.date", ">=", getDate(0)),
    where("delivery.date", "<", getDate(14)),
    orderBy("delivery.date")
  );
  // unsubscribe can be called as a function to stop listening to db changes
  const unsubscribe = onSnapshot(orderQ, (orderSnapshot) => {
    const updatedOrders = {};
    orderSnapshot.forEach((doc) => {
      if (!doc.data().status.hasOwnProperty("delivered")) {
        updatedOrders.push({
          id: doc.id,
          data: doc.data(),
        });
      }
    });
    orders.value = updatedOrders;
    console.log(orders.value);
  });
}

function getDate(offset) {
  /* Next available day */
  let minDay = new Date(Date.now());
  minDay.setDate(minDay.getDate() + offset);
  return minDay.toISOString().substring(0, 10);
}
</script>
