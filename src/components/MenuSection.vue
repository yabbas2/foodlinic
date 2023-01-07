<template>
  <q-tabs dense v-model="tab" indicator-color="transparent">
    <q-tab
      v-for="catg in menuCatgs"
      :key="catg.id"
      :tabindex="catg.id"
      :name="catg.name"
      :label="catg.name"
    />
  </q-tabs>

  <q-tab-panels v-model="tab" animated class="bg-transparent">
    <q-tab-panel v-for="catg in menuCatgs" :key="catg.id" :name="catg.name">
      <div class="column">
        <template v-for="(item, idx) in menuStore.menu" :key="item.id">
          <div
            v-if="item.menu_catg_ref.id === catg.id"
            class="col q-mt-md q-mb-md flex-center"
          >
            <q-card
              bordered
              :class="idx % 2 == 0 ? 'item-card2' : 'item-card1'"
            >
              <q-card-section horizontal>
                <q-card-section>
                  <div
                    :class="
                      idx % 2 == 0
                        ? 'q-mt-xs item-card2-title'
                        : 'q-mt-xs item-card1-title'
                    "
                  >
                    {{ item.name }}
                  </div>
                  <div
                    :class="
                      idx % 2 == 0
                        ? 'q-mt-xs item-card2-subtitle'
                        : 'q-mt-xs item-card1-subtitle'
                    "
                  >
                    {{ util.formatCurrency(item.price) }}
                  </div>
                </q-card-section>
                <q-card-section
                  class="col-5 flex flex-center"
                  style="margin-left: auto"
                >
                  <q-img :src="item.img_src" />
                </q-card-section>
              </q-card-section>
              <q-card-actions>
                <QtyBtn
                  :style="idx % 2 == 0 ? 'light' : 'dark'"
                  :modelValue="cartStore.cartItemById(item.id)"
                  @update:modelValue="
                    (val) => cartStore.updateCart(item.id, val)
                  "
                ></QtyBtn>
                <q-space />
                <q-btn
                  :color="idx % 2 == 0 ? 'secondary' : 'white'"
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
                <div
                  v-show="nutFactsReveal[idx]"
                  :class="idx % 2 == 0 ? 'text-secondary' : 'text-white'"
                >
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
                      <div class="col text-italic">Nutrition facts:</div>
                      <div class="col">
                        <q-markup-table
                          separator="none"
                          dense
                          flat
                          bordered
                          style="
                            color: inherit;
                            background-color: transparent;
                            border-color: inherit;
                          "
                        >
                          <tbody>
                            <tr
                              v-for="nutFact in nutDetails"
                              :key="`${item.id}_${nutFact.name}`"
                            >
                              <td class="text-center">{{ nutFact.name }}</td>
                              <td class="text-center">{{ nutFact.amount }}</td>
                            </tr>
                          </tbody>
                        </q-markup-table>
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

.q-tab--inactive {
  border-radius: 20px !important;
}
.q-tab--active {
  border-radius: 20px !important;
  background-color: $secondary !important;
  color: white !important;
}
.item-card1 {
  border-radius: 30px;
  width: 340px;
  min-height: 150px;
  margin-left: auto;
  margin-right: auto;
  background-color: $secondary;
}
.item-card1-title {
  font-family: "Bebas Neue", cursive;
  color: white;
  font-size: 30px;
}
.item-card1-subtitle {
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.5rem;
  letter-spacing: 0.03125em;
  color: white;
}
.item-card2 {
  border-radius: 30px;
  width: 340px;
  min-height: 150px;
  margin-left: auto;
  margin-right: auto;
  border-color: $secondary;
  background-color: white;
}
.item-card2-title {
  font-family: "Bebas Neue", cursive;
  color: $secondary;
  font-size: 30px;
}
.item-card2-subtitle {
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.5rem;
  letter-spacing: 0.03125em;
  color: $secondary;
}
</style>

<style lang="scss">
.q-tab__label {
  font-size: 16px !important;
}
</style>

<script setup>
import { reactive, ref, onBeforeMount } from "vue";
import util from "../plugins/util";
import { useCartStore } from "../stores/cart";
import { useMenuStore } from "../stores/menu";
import {
  outlinedInfo,
  outlinedExpandLess,
} from "@quasar/extras/material-icons-outlined";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import QtyBtn from "./QtyBtn.vue";

let nutFactsReveal = reactive([]);
let tab = ref("");
let menuCatgs = ref([]);

const cartStore = useCartStore();
const menuStore = useMenuStore();
/*TODO:remove this array and configure the nutrition facts in db*/
const nutDetails = [
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

function fetchMenuCatgs() {
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
    tab.value = updatedMenuCatgs[0].name;
  });
}

function fetchMenuItems() {
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
