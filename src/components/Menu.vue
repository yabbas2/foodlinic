<template>
  <div class="mt-0">
    <template v-if="!preloaderEnabled">
      <v-tabs
        v-model="tab"
        align-with-title
        show-arrows="always"
        centered
        background-color="white"
        color="red"
        center-active
        light
      >
        <v-tabs-slider color="red"></v-tabs-slider>
        <v-tab 
          v-for="catg in menuCatgs" 
          :key="catg.id" 
          @click="tabChangedEvent(catg.id)"
        >
          {{catg.name}}
        </v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item
          v-for="catg in menuCatgs"
          :key="catg.id"
        >
          <v-container fluid class="my-10">
            <v-row>
              <v-col 
                v-for="(item, idx) in menuItems"
                v-if="item.menu_category_ref === catg.id"
                :key="item.name"
                align-self="center"
              >
                <v-card height="100%" class="text-left mx-auto my-1" max-width="300" max-height="450" elevation="5">
                  <v-img height="200" :src="item.imgSrc"></v-img>
                  <v-card-title class="text-h5">{{item.name}}</v-card-title>
                  <v-card-subtitle class="text-subtitle-1 red--text">{{formatCurrency(item.price)}}</v-card-subtitle>
                  <v-card-actions>
                    <v-btn
                      fab
                      dark
                      small
                      elevation="3"
                      color="red lighten-1"
                      @click="revealNutFacts[idx]=true;revealNutFacts=[...revealNutFacts]"
                    >
                      <v-icon dark>mdi-information-variant</v-icon>
                    </v-btn>
                    <v-select
                      v-model="item.qty"
                      :items="selectItems"
                      menu-props="auto"
                      label="Select"
                      hide-details
                      append-icon="mdi-cart"
                      single-line
                      class="mr-auto ml-5 my-0 py-0"
                      style="max-width:5rem;"
                      color="#f25b47"
                      solo
                      dense
                      @change="itemCountChangedEvent"
                    ></v-select>
                  </v-card-actions>
                  <v-expand-transition>
                    <v-card
                      :id="item.id"
                      v-if="revealNutFacts[idx]"
                      class="transition-fast-in-fast-out v-card--reveal v-card--scroll"
                      height="100%"
                    >
                      <v-card-title>
                        <p class="text-h5 text--primary">Details</p>
                      </v-card-title>
                      <v-card-text class="v-card-text--scroll">
                        <v-container>
                          <v-row no-gutters>
                            <v-col>
                              <p class="text--primary font-italic"><pre>Portion: </pre></p>
                            </v-col>
                            <v-col>
                              <div class="text--secondary">
                                {{item.portion}} 
                                <v-icon small v-if="item.portion > 1">mdi-account-multiple</v-icon>
                                <v-icon small v-else>mdi-account</v-icon>
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
                              <v-simple-table dense class="text-center">
                                <template v-slot:default>
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
                                </template>
                              </v-simple-table>
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-card-text>
                      <v-card-actions class="card-actions">
                        <v-btn
                          fab
                          dark
                          small
                          elevation="3"
                          color="red lighten-1"
                          @click="revealNutFacts[idx]=false;revealNutFacts=[...revealNutFacts]"
                        >
                          <v-icon dark>mdi-chevron-down</v-icon>
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-expand-transition>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-tab-item>
      </v-tabs-items>
    </template>
    <Preloader v-else></Preloader>
  </div>
</template>

<style scoped>
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
</style>

<script>
import Preloader from "@/components/Preloader.vue";
import axios from 'axios'
import currency from 'currency.js'

export default {
  name: "Menu",
  components: {
    Preloader,
  },
  created() {
    this.fetchMenuCatgs();
    this.fetchMenuItems();
    this.revealNutFacts = Array(this.menuItems.length).fill(false);
  },
  data() {
    return {
      tabIndex: 0,
      tab: null,
      revealNutFacts: [],
      selectItems: [0,1,2,3,4,5,6,7,8,9,10],
      menuCatgs: [],
      eventSuccessCount: 0,
      preloaderEnabled: true,
    }
  },
  props: {
    value: Array,
  },
  methods: {
    formatCurrency(val) {
      return currency(val, {symbol: ':-', pattern: '#!'}).format();
    },
    itemCountChangedEvent() {
      this.$emit('cartChanged');
    },
    tabChangedEvent(val) {
      console.log(val);
    },
    constructMenuCatgsObj(jsonData) {
      this.menuCatgs = jsonData;
    },
    constructMenuItemsObj(jsonData) {
      for (var idx = 0; idx < jsonData.length; idx++) {
        var menuItemObj = jsonData[idx];
        menuItemObj['qty'] = 0;
        menuItemObj['total_price'] = 0;
        /*if      (menuItemObj.status == 'New')     {menuItemObj['color'] = "danger";}
        else if (menuItemObj.status == 'Try It')  {menuItemObj['color'] = "info";}
        else if (menuItemObj.status == 'Popular') {menuItemObj['color'] = "success";}
        else                                      {menuItemObj['color'] = "dark";}*/
        try {menuItemObj['imgSrc'] = require('../assets/menu-items/' + menuItemObj.name.replaceAll(' ', '-') + '.png');}
        catch (e) {menuItemObj['imgSrc'] = require('../assets/no-image.png');}
        this.menuItems.push(menuItemObj);
      }
    },
    async fetchMenuCatgs() {
      await axios.get('https://foodlinic-backend.onrender.com/foodapis/menu-category')
        .then(response => {
          this.constructMenuCatgsObj(response.data)
          this.eventSuccessCount++
          /*console.log(this.menuCatgs)*/
        })
        .catch(error => {
          console.log(error) /*TODO: better error handling*/
        })
    },
    async fetchMenuItems() {
      await axios.get('https://foodlinic-backend.onrender.com/foodapis/menu-item')
        .then(response => {
          this.constructMenuItemsObj(response.data)
          this.eventSuccessCount++
          /*console.log(this.menuItems)*/
        })
        .catch(error => {
          console.log(error) /*TODO: better error handling*/
        })
    },
  },
  computed: {
    menuItems: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      }
    },
  },
  watch: {
    eventSuccessCount(newVal, oldVal) {
      if (newVal === 2) {
        if ( (this.menuCatgs.length > 0) && (this.menuItems.length > 0) ) {
          setTimeout(() => {
            this.preloaderEnabled = false
          }, 500);
        }
        else {
          /*TODO: better error handling */
        }
      }
    },
  },
};
</script>