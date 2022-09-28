<template>
  <div class="mt-5 ratio">
    <b-tabs v-model="tabIndex" pills content-class="mt-3" align="center">
      <b-tab v-for="(tab, index) in tabs" :key="tab.id" :title="tab.name" :title-link-class="linkClass(index)" class="container align-items-center justify-content-center">
        <b-card-group columns class="container align-items-center justify-content-center mx-0 mt-5">
          <b-card 
            v-for="(card, idx) in cardDecksLoc"
            v-if="card.refId === tab.id"
            :key="card.name"
            :title="card.name"
            :sub-title="String(card.price) + 'kr'"
            :img-src="card.imgSrc"
            img-alt="Image"
            img-top
            tag="article"
            style="max-width: 20rem; min-width: 30%;"
            class="mb-4 mx-4"
            :header="card.status"
            header-tag="header"
            :header-bg-variant="card.color"
            header-text-variant="white"
            :border-variant="card.color"
            align="center"
          >
            <b-card-text>{{card.ingredients}}</b-card-text>
            <b-card-text v-if="card.portion > 1">{{card.portion}} <b-icon icon="people-fill" style="width: 25px; height: 25px;"></b-icon></b-card-text>
            <b-card-text v-else>{{card.portion}} <b-icon icon="person-fill" style="width: 20px; height: 20px;"></b-icon></b-card-text>
            <b-form-spinbutton
              v-model="card.qty"
              min="0"
              :max="inputNumberLimit"
              step="1"
              class="w-100"
              @change="cardCountChangedEvent"
            ></b-form-spinbutton>
          </b-card>
        </b-card-group>
      </b-tab>
    </b-tabs>
  </div>
</template>

<style scoped>

</style>

<script>
export default {
  name: "Tabs",
  created() {
  },
  data() {
    return {
      tabIndex: 0,
      cardDecksLoc: this.cardDecks
    }
  },
  props: {
    tabs: Array,
    cardDecks: Array,
    inputNumberLimit: Number
  },
  methods: {
    linkClass(idx) {
      if (this.tabIndex === idx) {
        return ['bg-danger', 'text-white', 'font-weight-bold']
      } else {
        return ['bg-light', 'text-dark']
      }
    },
    cardCountChangedEvent() {
      this.$emit('cartChanged', this.cardDecksLoc);
    }
  },
  computed: {
  }
};
</script>