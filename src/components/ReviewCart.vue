<template>
  <v-simple-table
    id="cart-table"
  >
    <template v-slot:default>
      <thead>
        <tr>
          <th class="text-left">Item</th>
          <th class="text-center">Qty</th>
          <th class="text-right">Price</th>
        </tr>
      </thead>
      <tbody name="fade" is="transition-group">
        <tr 
          v-for="item in getTableItems"
          :key="item.id"
        >
          <td class="text-left">{{item.name}}</td>
          <td class="text-center">
            <div class="d-flex justify-center">
              <v-btn
                icon 
                color="#f25b47" 
                @click="itemCountChanged(item.id, 0)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
              <v-select
                v-model="item.qty"
                :items="selectItems"
                menu-props="auto"
                label="Select"
                hide-details
                append-icon="mdi-cart"
                single-line
                class="ml-1 my-0 py-0"
                style="max-width:5rem;"
                color="red"
                solo
                dense
                @change="itemCountChanged(item.id, $event)"
              ></v-select>
            </div>
          </td>
          <td class="text-right">{{formatCurrency(item.total_price)}}</td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s
}

.fade-enter,
.fade-leave-to {
  opacity: 0
}
</style>

<script>
import currency from 'currency.js'

export default {
  name: "ReviewCart",
  props: {
    value: Array,
  },
  data() {
    return {
      tableFields: [
        {key: 'name', label: 'Item'}, 
        {key: 'qty', label: 'Qty'}, 
        {key: 'total_price', label: 'Price'}
      ],
      selectItems: [0,1,2,3,4,5,6,7,8,9,10],
    }
  },
  methods: {
    collectInfo() {
      let orderObj = [];
      for (var idx = 0; idx < this.getTableItems.length; idx++) {
        orderObj.push({id: this.getTableItems[idx].id, qty: this.getTableItems[idx].qty});
      }
      return orderObj;
    },
    formatCurrency(val) {
      return currency(val, {symbol: ':-', pattern: '#!'}).format();
    },
    itemCountChanged(itemId, value) {
      for (var idx = 0; idx < this.items.length; idx++) {
        if (this.items[idx].id == itemId) {
          this.items[idx].qty = value;
        }
      }
      this.$emit('cartChanged');
    },
  },
  computed: {
    getTableItems() {
      return this.items.filter(item => item.qty > 0);
    },
    items: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      }
    },
  },
}
</script>