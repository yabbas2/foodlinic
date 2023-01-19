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
              :class="
                idx % 2 == 0 ? 'item-card item-card2' : 'item-card item-card1'
              "
            >
              <q-card-section horizontal @click="nutFactsReveal[idx] = true">
                <q-card-section style="padding-bottom: 0px">
                  <div
                    :class="
                      idx % 2 == 0
                        ? 'q-mt-xs item-card-title item-card2-title'
                        : 'q-mt-xs item-card-title item-card1-title'
                    "
                  >
                    {{ item.name }}
                  </div>
                  <div
                    :class="
                      idx % 2 == 0
                        ? 'q-mt-xs item-card-subtitle item-card2-subtitle'
                        : 'q-mt-xs item-card-subtitle item-card1-subtitle'
                    "
                  >
                    {{ util.formatCurrency(item.price) }}
                  </div>
                </q-card-section>
                <q-card-section
                  class="col-5 flex flex-center"
                  style="margin-left: auto; padding-bottom: 0px"
                >
                  <q-img :src="item.img_src" />
                </q-card-section>
              </q-card-section>
              <q-card-actions style="padding-left: 16px; padding-top: 0px">
                <Transition name="cartBtn">
                  <q-btn
                    v-show="cartStore.cartItemById(item.id) === 0"
                    :color="idx % 2 == 0 ? 'secondary' : 'white'"
                    @click="cartStore.updateCart(item.id, 1)"
                    outline
                    rounded
                    style="width: 120px; border: 2px solid"
                  >
                    <q-icon :name="outlinedAddShoppingCart"></q-icon>
                  </q-btn>
                </Transition>
                <Transition name="qtyBtn">
                  <QtyBtn
                    v-show="cartStore.cartItemById(item.id) > 0"
                    :style="idx % 2 == 0 ? 'light' : 'dark'"
                    :modelValue="cartStore.cartItemById(item.id)"
                    @update:modelValue="
                      (val) => cartStore.updateCart(item.id, val)
                    "
                  />
                </Transition>
              </q-card-actions>
            </q-card>
            <MenuItemDialog
              :show="nutFactsReveal[idx]"
              @close="nutFactsReveal[idx] = false"
              :id="item.id"
            />
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
.item-card {
  border-radius: 30px;
  width: 340px;
  height: 180px;
  margin-left: auto;
  margin-right: auto;
}
.item-card1 {
  background-color: $secondary;
}
.item-card2 {
  border-color: $secondary;
  background-color: white;
}
.item-card-title {
  font-family: "Bebas Neue", cursive;
  font-size: 30px;
}
.item-card1-title {
  color: white;
}
.item-card2-title {
  color: $secondary;
}
.item-card-subtitle {
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.5rem;
  letter-spacing: 0.03125em;
}
.item-card1-subtitle {
  color: white;
}
.item-card2-subtitle {
  color: $secondary;
}
.cartBtn-enter-active {
  transition: opacity 0.5s ease;
}
.cartBtn-leave-active {
  opacity: 0;
}
.cartBtn-enter-from,
.cartBtn-leave-to {
  opacity: 0;
}
.qtyBtn-enter-active {
  transition: opacity 0.5s ease;
}
.qtyBtn-leave-active {
  opacity: 0;
}
.qtyBtn-enter-from,
.qtyBtn-leave-to {
  opacity: 0;
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
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";
import QtyBtn from "./QtyBtn.vue";
import MenuItemDialog from "./MenuItemDialog.vue";
import { outlinedAddShoppingCart } from "@quasar/extras/material-icons-outlined";

let nutFactsReveal = reactive([]);
let tab = ref("");
let menuCatgs = ref([]);

const cartStore = useCartStore();
const menuStore = useMenuStore();

onBeforeMount(() => {
  fetchMenuCatgs();
  fetchMenuItems();
});

function fetchMenuCatgs() {
  const menuCatgQ = query(
    collection(db, "menu-catg"),
    where("enabled", "==", true),
    orderBy("prio")
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
        img_src: `/src/assets/mi-${doc.id}-1.webp`,
        img_count: doc.data().img_count,
        nutr_facts: doc.data().nutr_facts,
      });
    });
    menuStore.menu = updatedMenuItems;
    /*TODO:some items might be removed, so remove them from cart as well*/
  });
}
</script>
