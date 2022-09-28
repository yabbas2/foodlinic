<template>
  <b-modal 
    :id="modalId" 
    size="lg" 
    title="Extra Large Modal" 
    scrollable
    cancel-disabled
    ok-disabled
    header-class="p-2 border-bottom-0 justify-content-end"
    footer-class="p-2 border-top-0"
    @hidden="$emit('modalClosed')"
  >
    <template #modal-header="{ hide }">
      <b-button pill size="sm" variant="danger" @click="hide">
        <b-icon icon="x" style="width: 25px; height: 25px;"></b-icon>
      </b-button>
    </template>
    <template #modal-footer>
      <p></p>
    </template>

    <b-container>

      <b-row class="text-center mb-3">
        <b-col><h5><b>YOUR ORDER</b></h5></b-col>
      </b-row>
      
      <b-row v-if="getTableItems.length > 0">
        <b-col>

          <b-row>
            <b-col>
              <b-table-simple
                responsive 
                hover 
                no-border-collapse 
                id="cartTable"
              >
                <b-thead head-variant="dark">
                  <b-tr>
                    <b-th>Item</b-th>
                    <b-th></b-th>
                    <b-th>Qty</b-th>
                    <b-th>Price</b-th>
                  </b-tr>
                </b-thead>
                <b-tbody>
                  <b-tr 
                    v-for="item in getTableItems"
                    :key="item.id"
                  >
                    <b-td>{{item.name}}</b-td>
                    <b-td>
                      <b-button pill href="#" variant="danger" @click="deleteItem(item.id)">
                        <b-icon icon="trash" scale="1" class="align-middle"></b-icon>
                      </b-button>
                    </b-td>
                    <b-td>{{item.qty}}x</b-td>
                    <b-td>{{item.total_price}}kr</b-td>
                  </b-tr>
                </b-tbody>
                <b-tfoot foot-variant="dark">
                  <b-tr>
                    <b-th>TOTAL</b-th>
                    <b-th></b-th>
                    <b-th></b-th>
                    <b-th>{{total}}kr</b-th>
                  </b-tr>
                </b-tfoot>
              </b-table-simple>
            </b-col>
          </b-row>

          <b-row>
            <b-col>
              <div class="accordion" role="tablist">
                <b-card no-body class="mb-1">
                  <b-card-header header-tag="header" class="p-1" role="tab">
                    <b-button block v-b-toggle.accordion-1 variant="dark">Delivery</b-button>
                  </b-card-header>
                  <b-collapse id="accordion-1" accordion="accordion-1" role="tabpanel" @shown="fetchLocations">
                    <b-card-body>
                      <div class="text-center text-danger" v-if="locationOptions.length == 0">
                        <b-spinner class="align-middle"></b-spinner>
                      </div>
                      <b-form-select v-else v-model="locationSelected" :options="locationOptions"></b-form-select>
                    </b-card-body>
                  </b-collapse>
                </b-card>
              </div>
            </b-col>
          </b-row>
          
        </b-col>
      </b-row>
      
      <b-row v-else>
        <b-col class="text-center">
          <h6><b>Your cart is empty!</b></h6>
        </b-col>
      </b-row>

    </b-container>

  </b-modal>
</template>

<style scoped>
#cartTable td,
#cartTable th {
  text-align: center !important;
  vertical-align: middle !important;
}
</style>

<script>
import axios from 'axios'

export default {
  name: "CartModal",
  props: {
    showModal: Boolean,
    tableItems: Array
  },
  mounted() {
    this.$bvModal.hide(this.modalId);
  },
  data() {
    return {
      tableFields: [
        {key: 'name', label: 'Item'}, 
        {key: 'qty', label: 'Qty'}, 
        {key: 'total_price', label: 'Price'}
      ],
      items: this.tableItems,
      modalId: 'cartModalId',
      locationSelected: null,
      locationOptions: []
    }
  },
  watch: {
    showModal: function(newVal, oldVal) {
      if (newVal) {this.$bvModal.show(this.modalId);}
      else        {this.$bvModal.hide(this.modalId);}
    }
  },
  methods: {
    deleteItem(itemId) {
      for (var idx = 0; idx < this.items.length; idx++) {
        if (this.items[idx].id == itemId) {
          this.items[idx].qty = 0;
        }
      }
      this.$emit('cartChanged', this.items);
    },
    constructLocationObj(jsonData) {
      this.locationOptions = [];
      this.locationOptions[0] = {value: null, text: "Select Meeting Point"};
      for (var idx = 0; idx < jsonData.length; idx++) {
        this.locationOptions[idx+1] = 
        {
          value: 
          {
            lat: jsonData[idx].lat,
            lng: jsonData[idx].lng,
            zoom_lvl: jsonData[idx].zoom_lvl
          }, 
          text: jsonData[idx].name
        };
      }
      console.log(this.locationOptions);
    },
    async fetchLocations() {
      await axios.get('http://127.0.0.1:9000/foodapis/location') /*TODO: change in production to https://foodlinic.pythonanywhere.com/foodapis/location*/
        .then(response => {
          this.constructLocationObj(response.data)
        })
        .catch(error => {
          console.log(error) /*TODO: better error handling*/
        })
    }
  },
  
  computed: {
    total() {
      return this.items.reduce((acc, obj) => acc + obj.total_price, 0);
    },
    getTableItems() {
      return this.items.filter(item => item.qty > 0);
    }
  }
};
</script>