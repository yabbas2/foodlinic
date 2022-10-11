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
          <td class="text-right text-subtitle-1 font-weight-medium">{{subtotal}}kr</td>
        </tr>
        <tr>
          <td class="text-left text-subtitle-1 font-weight-medium">Delivery Fees</td>
          <td class="text-right text-subtitle-1 font-weight-medium">0kr</td>
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
          <td class="text-right text-subtitle-1 font-weight-medium">{{discount * -1}}kr</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <th class="text-left text-h6 font-weight-bold">Total</th>
          <th class="text-right text-h6 font-weight-bold">{{subtotal - discount}}kr</th>
        </tr>
      </tfoot>
    </v-simple-table>
    <v-divider></v-divider>
    <div ref="paypal"></div>
  </v-card>
</template>

<style scoped>

</style>

<script>
export default {
  name: "Checkout",
  mounted() {
    const script = document.createElement("script");
    script.src = "https://www.paypal.com/sdk/js?client-id=AUjd3Wob2Uqji05N-C6ITlLPuFW3FHGycZlOzQJHL2_bI_TzPv_xxJNuqdxcs5Mf4AVW2MukbixoKKgU&currency=SEK";
    script.addEventListener("load", this.setLoaded);
    document.body.appendChild(script);
  },
  props: {
    totalPrice: Number,
  },
  data() {
    return {
      promoCode: '',
      availPromoCodes: [
        {code: '', discount: 0},
        {code: 'new2022!', discount: 100}
      ],
      subtotal: this.totalPrice,
      discount: 0,
      validPromoCode: false,
    }
  },
  methods: {
    checkPromoCode(val) {
      this.validPromoCode = false;
      this.discount = 0;
      if (val.length == 8) {
        for(const elem of this.availPromoCodes) {
          if (val.toLowerCase() === elem.code) {
            this.discount = elem.discount;
            this.validPromoCode = true;
          }
        }
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
            return actions.order.create({
              purchase_units: [{
                amount: {
                  currency_code: "SEK",
                  value: String(this.subtotal - this.discount),
                }
              }]
            });
          },
          // Finalize the transaction
          onApprove: async (data, actions) => {
            const order = await actions.order.capture();
            console.log(order);
          },
          onError: err => {
            console.log(err);
          },
        }).render(this.$refs.paypal);
    },
  },
}
</script>