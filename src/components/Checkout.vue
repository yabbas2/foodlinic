<template>
  <v-card
    max-width="300"
    tile
    flat
    class="mx-auto"
  >
    <v-simple-table>
      <tbody>
        <tr>
          <td class="text-left text-subtitle-1 font-weight-medium">Subtotal</td>
          <td class="text-right text-subtitle-1 font-weight-medium">{{formatCurrency(totalPrice)}}</td>
        </tr>
        <tr>
          <td class="text-left text-subtitle-1 font-weight-medium">Delivery Fees</td>
          <td class="text-right text-subtitle-1 font-weight-medium">{{formatCurrency(0)}}</td>
        </tr>
        <tr>
          <td class="text-left text-subtitle-1 font-weight-medium">Taxes</td>
          <td class="text-right text-subtitle-1 font-weight-medium">—</td>
        </tr>
        <tr>
          <td class="text-left">
            <v-text-field
              v-model="promoCode"
              color="#39175c"
              label="Promo code"
              type="text"
              :rules="[val => checkPromoCode(val)]"
              :success="validPromoCode"
            ></v-text-field>
          </td>
          <td class="text-right text-subtitle-1 font-weight-medium">{{discount * -100}}%</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <th class="text-left text-h6 font-weight-bold">Total</th>
          <th class="text-right text-h6 font-weight-bold">{{formatCurrency(totalToPay)}}</th>
        </tr>
      </tfoot>
    </v-simple-table>
    <v-divider class="my-4"></v-divider>
    <div ref="paypal"></div>
  </v-card>
</template>

<style scoped>

</style>

<script>
import axios from 'axios'
import currency from 'currency.js'

export default {
  name: "Checkout",
  created() {
    this.fetchPromoCodes();
  },
  mounted() {
    const script = document.createElement("script");
    script.src = "https://www.paypal.com/sdk/js?client-id=Afypn0F0ftWe0TzZ7w_MEF-h7p3kT-0bfsgULFkpf5qKy9K3o9arN84xlIwOw0Kw7HSKShpDrJjvzQKa&currency=SEK";
    script.addEventListener("load", this.setLoaded);
    document.body.appendChild(script);
  },
  props: {
    totalPrice: Number,
  },
  data() {
    return {
      promoCode: '',
      availPromoCodes: [],
      discount: 0.0,
      validPromoCode: false,
    }
  },
  methods: {
    collectInfo() {
      return {total: currency(this.totalToPay)};
    },
    formatCurrency(val) {
      return currency(val, {symbol: ':-', pattern: '#!'}).format();
    },
    constructPromoCodeObj(jsonData) {
      this.availPromoCodes = jsonData;
    },
    async fetchPromoCodes() {
      await axios.get('https://foodlinic-backend.onrender.com/foodapis/promocode')
        .then(response => {
          this.constructPromoCodeObj(response.data);
        })
        .catch(error => {
          console.log(error) /*TODO: better error handling*/
        })
    },
    checkPromoCode(val) {
      this.validPromoCode = false;
      this.discount = 0.0;
      if (val.length == 8) {
        for(const elem of this.availPromoCodes) {
          if (val.toLowerCase() === elem.name) {
            this.discount = elem.discount;
            this.validPromoCode = true;
          }
        }
      }
      else if (val.length == 0) {
        this.validPromoCode = true;
      }
      else {
        /* still show error */
      }
      return this.validPromoCode;
    },
    setLoaded() {
      window.paypal
        .Buttons({
          style: {
            color:  'blue',
            shape:  'pill',
            label:  'pay',
            height: 40
          },
          // Set up the transaction
          createOrder: (data, actions) => {
            console.log(String(currency(this.totalToPay)));
            return actions.order.create({
              purchase_units: [{
                amount: {
                  currency_code: "SEK",
                  value: String(currency(this.totalToPay)),
                }
              }]
            });
          },
          // Finalize the transaction
          onApprove: async (data, actions) => {
            let order = await actions.order.capture();
            console.log(order);
            if (order) {this.$emit('checkout', true);}
          },
          onCancel: async (data) => {
            this.$emit('checkout', false);
          },
          onError: async (err) => {
            this.$emit('checkout', false);
          },
        }).render(this.$refs.paypal);
    },
  },
  computed: {
    totalToPay() {
      return (this.discount > 0.0)? (this.totalPrice * (1.0 - this.discount)) : (this.totalPrice);
    },
  }
}
</script>