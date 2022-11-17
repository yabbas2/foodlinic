<template>
  <v-tabs
    v-model="tab"
    show-arrows
    centered
    bg-color="white"
    color="#f25b47"
    align-tabs="center"
    :next-icon="mdiChevronRightSvg"
    :prev-icon="mdiChevronLeftSvg"
  >
    <v-tab 
      v-for="catg in menuCatgs" 
      :key="catg.id" 
      :value="catg.id"
      @click="tabChangedEvent(catg.id)"
    >
      {{catg.name}}
    </v-tab>
  </v-tabs>
  <v-window 
    v-model="tab"
    v-if="!loader"
  >
    <v-window-item
      v-for="catg in menuCatgs"
      :key="catg.id"
      :value="catg.id"
    >
      <v-container fluid>
        <v-row align="stretch" align-content="center" justify="center">
          <!--wrapping into template tag to fix usage of v-for and v-if together-->
          <template
            v-for="(item, idx) in menuItems"
            :key="item.id"
          >
            <v-col
              cols="auto"
              v-if="item.menu_category_id === catg.id"
              align-self="center"
            >
              <v-card 
                height="100%" 
                class="text-left mx-auto my-1 rounded-card" 
                width="300"
                max-height="450" 
                elevation="5"
              >
                <v-img height="200" :src="item.imgSrc"></v-img>
                <v-card-title class="card-title-font">{{item.name}}</v-card-title>
                <v-card-subtitle class="card-subtitle-font">{{util.formatCurrency(item.price)}}</v-card-subtitle>
                <v-card-text></v-card-text>
                <v-card-actions>
                  <v-btn
                    icon
                    variant="outlined"
                    elevation="3"
                    color="#f25b47"
                    @click="revealNutFacts[idx]=true"
                  >
                    <v-icon>{{mdiInformationVariantSvg}}</v-icon>
                  </v-btn>
                  <v-select
                    v-model="item.qty"
                    :items="selectItems"
                    :menu-props="{ auto: true, overflowY: true }"
                    hide-details
                    single-line
                    label="0"
                    class="mr-auto ml-5 my-0 py-0 cart-select"
                    color="#f25b47"
                    variant="solo"
                    density="comfortable"
                    :prepend-inner-icon="mdiCartSvg"
                    @update:modelValue="item.total_price=item.qty*item.price"
                  >
                  </v-select>
                </v-card-actions>
                <v-expand-transition>
                  <v-card
                    :id="item.id"
                    v-if="revealNutFacts[idx]"
                    class="transition-fast-in-fast-out v-card--reveal v-card--scroll rounded-card"
                    height="100%"
                  >
                    <!--<v-card-title>
                      <p class="text-h5 text--primary">Details</p>
                    </v-card-title>-->
                    <v-card-text class="v-card-text--scroll">
                      <v-container>
                        <v-row no-gutters>
                          <v-col>
                            <p class="text--primary font-italic"><pre>Portion: </pre></p>
                          </v-col>
                          <v-col>
                            <div class="text--secondary">
                              {{item.portion}} 
                              <v-icon small v-if="item.portion > 1">{{mdiAccountMultipleSvg}}</v-icon>
                              <v-icon small v-else>{{mdiAccountSvg}}</v-icon>
                            </div>
                          </v-col>
                        </v-row>
                        <v-row no-gutters>
                          <v-col>
                            <p class="text--primary font-italic"><pre>Ingredients: </pre></p>
                          </v-col>
                          <v-col>
                            <p class="text--secondary">{{item.ingredients}}</p>
                          </v-col>
                        </v-row>
                        <v-row no-gutters>
                          <v-col>
                            <p class="text--primary font-italic"><pre>Nutrition Facts (per 100g): </pre></p>
                            <v-table dense class="text-center">
                              <tbody class="text--secondary">
                                <tr>
                                  <td>fact1</td>
                                  <td>5%</td>
                                </tr>
                                <tr>
                                  <td>fact2</td>
                                  <td>10%</td>
                                </tr>
                                <tr>
                                  <td>fact3</td>
                                  <td>85%</td>
                                </tr>
                              </tbody>
                            </v-table>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card-text>
                    <v-card-actions class="card-actions">
                      <v-btn
                        icon
                        variant="outlined"
                        elevation="3"
                        color="#f25b47"
                        @click="revealNutFacts[idx]=false"
                      >
                        <v-icon dark>{{mdiChevronDownSvg}}</v-icon>
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-expand-transition>
              </v-card>
            </v-col>
          </template>
        </v-row>
      </v-container>
    </v-window-item>
  </v-window>
  <v-progress-circular
    v-if="loader"
    indeterminate
    size="50"
    color="#f25b47"
    class="mt-16"
  ></v-progress-circular>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Pacifico&display=swap');

.v-card--reveal {
  bottom: 0;
  opacity: 1 !important;
  position: absolute;
  width: 100%;
}
.v-card--scroll {
  display: flex !important;
  flex-direction: column;
}
.v-card-text--scroll {
  flex-grow: 1;
  overflow: auto;
}
.card-actions {
  position: absolute;
  bottom: 0.25rem;
}
.card-title-font {
  font-family: 'Bebas Neue', cursive;
  font-size: 30px;
}
.card-subtitle-font {
  font-family: 'Pacifico', cursive;
  font-size: 20px;
  color: #f25b47 !important;
}
.rounded-card {
  border-radius: 30px;
}
.cart-select {
  border-radius: 20px !important;
  max-width: 110px;
}
</style>

<script setup>
import { mdiInformationVariant, mdiAccountMultiple, mdiAccount, mdiChevronDown, mdiCart, mdiChevronRight, mdiChevronLeft } from '@mdi/js';
import axios from 'axios';
import { onBeforeMount, reactive, ref } from 'vue';
import util from '@/plugins/util';

let tab = ref(null);
let revealNutFacts = reactive([]);
let menuCatgs = reactive([]);
let menuItems = reactive([]);
let loader = ref(true);

const selectItems = [0,1,2,3,4,5,6,7,8,9,10];
const mdiInformationVariantSvg = ref(mdiInformationVariant);
const mdiAccountMultipleSvg = ref(mdiAccountMultiple);
const mdiAccountSvg = ref(mdiAccount);
const mdiChevronDownSvg = ref(mdiChevronDown);
const mdiCartSvg = ref(mdiCart);
const mdiChevronRightSvg = ref(mdiChevronRight);
const mdiChevronLeftSvg = ref(mdiChevronLeft);

onBeforeMount(() => {
  fetchMenuCatgs();
});

function tabChangedEvent(val) {
  //console.log(val);
}

function handleServerMenuCatgSuccess(jsonData) {
  jsonData.forEach(elm => menuCatgs.push(elm));
  fetchMenuItems();
}

function handleServerMenuItemSuccess(jsonData) {
  let locArry = [];
  for (var idx = 0; idx < jsonData.length; idx++) {
    var menuItemObj = jsonData[idx];
    menuItemObj['qty'] = 0;
    menuItemObj['total_price'] = 0;
    /*if      (menuItemObj.status == 'New')     {menuItemObj['color'] = "danger";}
    else if (menuItemObj.status == 'Try It')  {menuItemObj['color'] = "info";}
    else if (menuItemObj.status == 'Popular') {menuItemObj['color'] = "success";}
    else                                      {menuItemObj['color'] = "dark";}*/
    menuItemObj['imgSrc'] = util.transformImageUrl('../assets/menu-items/' + menuItemObj.name.replaceAll(' ', '-') + '.webp');
    locArry.push(menuItemObj);
  }
  locArry.forEach(elm => revealNutFacts.push(false));
  locArry.forEach(elm => menuItems.push(elm));
  loader.value = false;
}

async function fetchMenuCatgs() {
  await axios.get(import.meta.env.VITE_BACKEND_SERVER + '/foodapis/menu-category/')
    .then(response => {
      handleServerMenuCatgSuccess(response.data);
    })
    .catch(error => {
      console.log(error); /*TODO: better error handling*/
    })
}

async function fetchMenuItems() {
  await axios.get(import.meta.env.VITE_BACKEND_SERVER + '/foodapis/menu-item/')
    .then(response => {
      handleServerMenuItemSuccess(response.data);
    })
    .catch(error => {
      console.log(error); /*TODO: better error handling*/
    })
}
</script>