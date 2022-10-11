<template>
<div class="mt-0">
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
    <v-tab v-for="tab in tabs" :key="tab.id">{{tab.name}}</v-tab>
  </v-tabs>
  <v-tabs-items v-model="tab">
    <v-tab-item
      v-for="tab in tabs"
      :key="tab.id"
    >
      <v-container fluid class="my-10">
        <v-row>
          <v-col 
            v-for="(item, idx) in menuItems"
            v-if="item.refId === tab.id"
            :key="item.name"
            align-self="center"
          >
            <v-card height="100%" class="text-left mx-auto my-1" max-width="300" max-height="450" elevation="5">
              <v-img height="200" :src="item.imgSrc"></v-img>
              <v-card-title class="text-h5">{{item.name}}</v-card-title>
              <v-card-subtitle class="text-subtitle-1 red--text">{{item.price}}kr</v-card-subtitle>
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
                      <v-icon dark>mdi-arrow-down</v-icon>
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
export default {
  name: "Menu",
  mounted() {
  },
  data() {
    return {
      tabIndex: 0,
      menuItems: this.cardDecks,
      tab: null,
      revealNutFacts: Array(this.cardDecks.length).fill(false),
      selectItems: [0,1,2,3,4,5,6,7,8,9,10]
    }
  },
  props: {
    tabs: Array,
    cardDecks: Array,
  },
  methods: {
    itemCountChangedEvent() {
      this.$emit('cartChanged', this.menuItems);
    },
  },
  computed: {
  }
};
</script>