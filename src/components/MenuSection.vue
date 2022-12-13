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
      v-for="catg in menuCatgs"
      :key="catg.id"
      :tabindex="catg.id"
      :name="catg.name"
      :label="catg.name"
    />
  </q-tabs>

  <q-tab-panels v-model="tab" animated>
    <q-tab-panel v-for="catg in menuCatgs" :key="catg.id" :name="catg.name">
      <div class="column">
        <template v-for="(item, idx) in menuStore.menu" :key="item.id">
          <div
            v-if="item.menu_catg_ref.id === catg.id"
            class="col q-mt-md q-mb-md flex-center"
          >
            <q-card class="item-card bg-white">
              <q-img :src="item.img_src" height="200px">
                <div class="absolute-bottom row justify-between">
                  <div class="col-8 text-left card-title-font">
                    {{ item.name }}
                  </div>
                  <div class="col-4 text-right card-title-font">
                    {{ util.formatCurrency(item.price) }}
                  </div>
                </div>
              </q-img>
              <q-card-actions>
                <q-select
                  :model-value="cartStore.cartItemById(item.id)"
                  color="secondary"
                  rounded
                  outlined
                  :options="selectItems"
                  dense
                  options-dense
                  behavior="menu"
                  @update:model-value="
                    (val) => cartStore.updateCart(item.id, val)
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
                <q-space />
                <q-btn
                  color="secondary"
                  rounded
                  flat
                  :ripple="false"
                  @click="nutFactsReveal[idx] = !nutFactsReveal[idx]"
                >
                  <q-icon
                    size="35px"
                    v-if="nutFactsReveal[idx]"
                    :name="outlinedExpandLess"
                  ></q-icon>
                  <q-icon size="35px" v-else :name="outlinedInfo"></q-icon>
                </q-btn>
              </q-card-actions>
              <q-slide-transition>
                <div v-show="nutFactsReveal[idx]">
                  <q-separator />
                  <q-card-section>
                    <div class="row q-my-sm">
                      <div class="col text-italic">Portion:</div>
                      <div class="col">
                        {{ item.portion }}
                        <q-icon v-if="item.portion > 1" name="group"></q-icon>
                        <q-icon v-else name="person"></q-icon>
                      </div>
                    </div>
                    <div class="row q-my-sm">
                      <div class="col text-italic">Ingredients:</div>
                      <div class="col">{{ item.ingredients }}</div>
                    </div>
                    <div class="column q-my-sm">
                      <div class="col text-italic">
                        Nutrition facts (per 100g):
                      </div>
                      <div class="col">
                        <q-table
                          dense
                          table-colspan="2"
                          :rows="nutDetailsRows"
                          :columns="nutDetailsColumns"
                          row-key="name"
                          hide-header
                          hide-pagination
                          separator="cell"
                          wrap-cells
                          flat
                          bordered
                        ></q-table>
                      </div>
                    </div>
                  </q-card-section>
                </div>
              </q-slide-transition>
            </q-card>
          </div>
        </template>
      </div>
    </q-tab-panel>
  </q-tab-panels>
</template>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap");

.card-title-font {
  font-family: "Bebas Neue", cursive;
  font-size: 25px;
}
.item-card {
  border-radius: 30px;
  width: 280px;
  min-height: 260px;
  margin-left: auto;
  margin-right: auto;
}
</style>

<style lang="scss">
.q-tab__label {
  font-size: 16px !important;
}
</style>

<script setup>
import { reactive, ref, onBeforeMount } from "vue";
import util from "src/plugins/util";
import { useCartStore } from "../stores/cart";
import { useMenuStore } from "../stores/menu";
import {
  outlinedShoppingBag,
  outlinedInfo,
  outlinedExpandLess,
} from "@quasar/extras/material-icons-outlined";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

let nutFactsReveal = reactive([]);
let tab = ref("Salads");
let menuCatgs = ref([]);

const cartStore = useCartStore();
const menuStore = useMenuStore();
const selectItems = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const nutDetailsColumns = [
  {
    name: "fact",
    required: true,
    label: "Nutrition facts",
    align: "left",
    field: (row) => row.name,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "amount",
    align: "left",
    label: "Amount/Percentage",
    field: "amount",
    sortable: true,
  },
];
const nutDetailsRows = [
  {
    name: "Fact#1",
    amount: "10%",
  },
  {
    name: "Fact#2",
    amount: "5%",
  },
  {
    name: "Fact#3",
    amount: "20%",
  },
  {
    name: "Fact#4",
    amount: "30%",
  },
  {
    name: "Fact#5",
    amount: "12%",
  },
  {
    name: "Fact#5",
    amount: "11%",
  },
];

onBeforeMount(() => {
  fetchMenuCatgs();
  fetchMenuItems();
});

async function fetchMenuCatgs() {
  const menuCatgQ = query(
    collection(db, "menu-catg"),
    where("enabled", "==", true)
  );
  // unsubscribe can be called as a function to stop listening to db changes
  const unsubscribe = onSnapshot(menuCatgQ, (menuCatgSnapshot) => {
    const updatedMenuCatgs = [];
    menuCatgSnapshot.forEach((doc) => {
      updatedMenuCatgs.push({ id: doc.id, name: doc.data().name });
    });
    menuCatgs.value = updatedMenuCatgs;
  });
}

async function fetchMenuItems() {
  const menuItemQ = query(
    collection(db, "menu-item"),
    where("enabled", "==", true)
  );
  // unsubscribe can be called as a function to stop listening to db changes
  const unsubscribe = onSnapshot(menuItemQ, (menuItemSnapshot) => {
    const updatedMenuItems = [];
    menuItemSnapshot.forEach((doc) => {
      updatedMenuItems.push({
        id: doc.id,
        name: doc.data().name,
        portion: doc.data().portion,
        ingredients: doc.data().ingredients,
        menu_catg_ref: doc.data().menu_catg_ref,
        price: doc.data().price,
        img_src: `/src/assets/mi-${doc.id}.webp`,
      });
    });
    menuStore.menu = updatedMenuItems;
    /*TODO:some items might be removed, so remove them from cart as well*/
  });
}
</script>
