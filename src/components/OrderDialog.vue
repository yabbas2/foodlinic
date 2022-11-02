<template>
  <v-dialog
    v-model="vsbyStore.orderDiagVsby"
    transition="dialog-bottom-transition"
    max-width="800"
    @click:outside="closeDialog"
    @keydown.esc="closeDialog"
    fullscreen
  >
    <v-card tile flat class="v-card--scroll" height="100%">
      <v-card-title class="pt-6">
        <v-img 
          class="mx-auto my-auto" 
          max-width="130" 
          :src="require('../assets/logo-name-wbg.png')"
        />
        <v-spacer></v-spacer>
        <v-btn 
          small
          outlined
          rounded
          :ripple="{class: 'red--text'}"
          @click="closeDialog"
        >
          <v-icon>{{mdiCloseSvg}}</v-icon>
          Close
        </v-btn>
      </v-card-title>
      <v-spacer style="min-height: 50px;"></v-spacer>
      <!--start: order dialog view-->
      <v-card-subtitle class="justify-center py-0 v-card__subtitle">
        YOUR ORDER LIST {{emptyOrder}}
      </v-card-subtitle>
      <v-spacer style="min-height: 50px;"></v-spacer>
      <v-card-text class="px-0 pt-0 pb-16 v-card-text--scroll">
      </v-card-text>
      <v-spacer></v-spacer>
      <!--end: order dialog view-->
    </v-card>
    <v-overlay 
      :value="overlay" 
      absolute
    >
      <v-progress-circular
        indeterminate
        size="40"
        width="5"
        color="#f25b47"
      ></v-progress-circular>
    </v-overlay>
  </v-dialog>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');

.v-card--scroll {
  display: flex !important;
  flex-direction: column;
}

.v-card__subtitle {
  font-size: 50px !important;
  color: #39175c !important;
  line-height: 3rem !important;
  font-family: 'Bebas Neue', cursive !important;
}
</style>

<script>
import {mdiClose} from '@mdi/js'
import {useVsbyStore} from '@/store/vsby'

export default {
  name: 'OrderDialog',
  /*mounted() {
    let email = 'yousef.abbas.2@outlook.com'
    const hashDigest = sha256(email);
    axios.get((process.env.VUE_APP_BACKEND_SERVER + '/foodapis/order/fetch/' + hashDigest + '/'), {params: {email: email}})
        .then(response => {
          console.log(response);
        })
        .catch(error => {
          console.log(error)
        })
  },*/
  setup() {
    const vsbyStore = useVsbyStore()
    return {
      vsbyStore,
    }
  },
  data() {
    return {
      overlay: false,
      mdiCloseSvg: mdiClose,
    }
  },
  methods: {
    closeDialog() {
      this.vsbyStore.closeOrderDialog();
    },
  },
  computed: {
    emptyOrder() {
      return 'is empty';
    },
  },
};
</script>