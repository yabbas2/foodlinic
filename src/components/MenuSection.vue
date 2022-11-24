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
        <template v-for="(item, idx) in menuStore.menuItems" :key="item.id">
          <div
            v-if="item.menu_category_id === catg.id"
            class="col q-mt-md q-mb-md flex-center"
          >
            <q-card class="item-card bg-white">
              <q-img :src="item.imgSrc" height="200px">
                <div class="absolute-bottom row justify-between">
                  <div class="col-8 text-left card-title-font">
                    {{ item.name }}
                  </div>
                  <div class="col-4 text-right card-subtitle-font">
                    {{ util.formatCurrency(item.price) }}
                  </div>
                </div>
              </q-img>
              <!--<q-card-section>
                <div class="card-title-font">{{ item.name }}</div>
                <div class="card-subtitle-font">
                  {{ util.formatCurrency(item.price) }}
                </div>
              </q-card-section>-->
              <q-card-actions>
                <q-select
                  color="secondary"
                  rounded
                  outlined
                  v-model="item.qty"
                  :options="selectItems"
                  dense
                  options-dense
                  behavior="menu"
                  @update:model-value="item.total_price = item.qty * item.price"
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
                  round
                  flat
                  @click="nutFactsReveal[idx] = !nutFactsReveal[idx]"
                >
                  <q-icon
                    size="35px"
                    v-if="nutFactsReveal[idx]"
                    :name="matExpandLess"
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
@import url("https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Pacifico&display=swap");

.card-title-font {
  font-family: "Bebas Neue", cursive;
  font-size: 25px;
}
.card-subtitle-font {
  font-family: "Pacifico", cursive;
  font-size: 23px;
  /*color: $secondary !important;*/
}
.item-card {
  border-radius: 30px;
  width: 280px;
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
import axios from "axios";
import { onBeforeMount, reactive, ref } from "vue";
import util from "src/plugins/util";
import { useMenuStore } from "src/stores/menu";
import {
  outlinedShoppingBag,
  outlinedInfo,
} from "@quasar/extras/material-icons-outlined";
import { matExpandLess } from "@quasar/extras/material-icons";

let nutFactsReveal = reactive([]);
let menuCatgs = reactive([]);
let tab = ref(null);
let loader = ref(true);

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
});

function handleServerMenuCatgSuccess(jsonData) {
  jsonData.forEach((elm) => menuCatgs.push(elm));
  // default selected tab is the first tab
  tab.value = menuCatgs[0].name;
  fetchMenuItems();
}

function handleServerMenuItemSuccess(jsonData) {
  let locArry = [];
  for (var idx = 0; idx < jsonData.length; idx++) {
    var menuItemObj = jsonData[idx];
    menuItemObj["qty"] = 0;
    menuItemObj["total_price"] = 0;
    /*if      (menuItemObj.status == 'New')     {menuItemObj['color'] = "danger";}
    else if (menuItemObj.status == 'Try It')  {menuItemObj['color'] = "info";}
    else if (menuItemObj.status == 'Popular') {menuItemObj['color'] = "success";}
    else                                      {menuItemObj['color'] = "dark";}*/
    menuItemObj["imgSrc"] =
      "src/assets/" + menuItemObj.name.replaceAll(" ", "-") + ".webp";
    locArry.push(menuItemObj);
  }
  locArry.forEach((elm) => nutFactsReveal.push(false));
  //locArry.forEach(elm => menuStore.menuItems.push(elm));
  menuStore.updateMenu(locArry);
  loader.value = false;
}

async function fetchMenuCatgs() {
  await axios
    .get(import.meta.env.VITE_BACKEND_SERVER + "/foodapis/menu-category/")
    .then((response) => {
      handleServerMenuCatgSuccess(response.data);
    })
    .catch((error) => {
      console.log(error); /*TODO: better error handling*/
    });
}

async function fetchMenuItems() {
  await axios
    .get(import.meta.env.VITE_BACKEND_SERVER + "/foodapis/menu-item/")
    .then((response) => {
      handleServerMenuItemSuccess(response.data);
    })
    .catch((error) => {
      console.log(error); /*TODO: better error handling*/
    });
}
</script>
