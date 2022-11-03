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
          v-for="item in menuStore.menuItems"
          v-if="item.qty > 0"
          :key="item.id"
        >
          <td class="text-left">{{item.name}}</td>
          <td class="text-center">
            <div class="d-flex justify-center">
              <v-btn
                icon 
                color="#f25b47" 
                @click="item.qty=0;item.total_price=0"
              >
                <v-icon>{{mdiDeleteSvg}}</v-icon>
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
                @change="item.total_price=item.qty*item.price"
              >
                <template v-slot:append>
                  <v-icon>{{mdiCartSvg}}</v-icon>
                </template>
              </v-select>
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
import {mdiCart, mdiDelete} from '@mdi/js'
import {useMenuStore} from '@/store/menu'
import currency from 'currency.js'


export default {
  name: "ReviewCart",
  setup() {
    const menuStore = useMenuStore()
    return {
      menuStore,
    }
  },
  data() {
    return {
      tableFields: [
        {key: 'name', label: 'Item'}, 
        {key: 'qty', label: 'Qty'}, 
        {key: 'total_price', label: 'Price'}
      ],
      selectItems: [0,1,2,3,4,5,6,7,8,9,10],
      mdiDeleteSvg: mdiDelete,
      mdiCartSvg: mdiCart,
    }
  },
  methods: {
    formatCurrency(val) {
      return currency(val, {symbol: ':-', pattern: '#!'}).format();
    },
  },
}
</script>