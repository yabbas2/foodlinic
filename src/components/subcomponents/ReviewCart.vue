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
                :value="item.qty"
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
          <td class="text-right">{{item.total_price}}kr</td>
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
export default {
  name: "ReviewCart",
  props: {
    tableItems: Array,
  },
  data() {
    return {
      tableFields: [
        {key: 'name', label: 'Item'}, 
        {key: 'qty', label: 'Qty'}, 
        {key: 'total_price', label: 'Price'}
      ],
      items: this.tableItems,
      selectItems: [0,1,2,3,4,5,6,7,8,9,10],
    }
  },
  methods: {
    itemCountChanged(itemId, value) {
      this.totalLoading = true;
      for (var idx = 0; idx < this.items.length; idx++) {
        if (this.items[idx].id == itemId) {
          this.items[idx].qty = value;
        }
      }
      this.$emit('cartChanged', this.items);
    },
  },
  computed: {
    getTableItems() {
      return this.items.filter(item => item.qty > 0);
    },
  },
}
</script>