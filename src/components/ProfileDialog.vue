<template>
  <v-dialog
    v-model="vsbyStore.profileDiagVsby"
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
      <!--start: profile dialog view-->
      <v-card-subtitle class="pt-16 pb-0">
        <v-container>
          <v-row>
            <v-col cols="12">
              <span class="v-card__subtitle">PROFILE</span>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-avatar
                size="100"
                class="mx-auto"
              >
                <v-img :src="require('@/assets/avatar.webp')" width="100"></v-img>
              </v-avatar>
            </v-col>
          </v-row>
        </v-container>
      </v-card-subtitle>
      <v-card-text class="pt-1 v-card-text--scroll">
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-btn 
                outlined
                width="150"
                color="#f25b47"
                @click="doSignout"
              >
                Sign out
                <v-icon right light>{{mdiLogoutSvg}}</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-form
                ref="profileform"
                v-model="validForm"
                lazy-validation
              >
                <v-text-field
                  v-model="form.firstname"
                  color="#39175c"
                  label="First name"
                  type="text"
                  disabled
                  :rules="[val => validateFirstname(val)]"
                  :success="validFirstname"
                >
                  <template v-slot:prepend>
                    <v-icon>{{mdiAccountSvg}}</v-icon>
                  </template>
                  <template v-slot:append-outer>
                    <v-btn icon>
                      <v-icon>{{mdiPencilSvg}}</v-icon>
                    </v-btn>
                  </template>
                </v-text-field>
                <v-text-field
                  v-model="form.lastname"
                  color="#39175c"
                  label="Last name"
                  type="text"
                  disabled
                  :rules="[val => validateLastname(val)]"
                  :success="validLastname"
                >
                  <template v-slot:prepend>
                    <v-icon>{{mdiAccountSvg}}</v-icon>
                  </template>
                  <template v-slot:append-outer>
                    <v-btn icon>
                      <v-icon>{{mdiPencilSvg}}</v-icon>
                    </v-btn>
                  </template>
                </v-text-field>
                <v-text-field
                  v-model="form.email"
                  color="#39175c"
                  label="Email"
                  type="text"
                  disabled
                  :rules="[val => validateEmail(val)]"
                  :success="validEmail"
                >
                  <template v-slot:prepend>
                    <v-icon>{{mdiEmailSvg}}</v-icon>
                  </template>
                  <template v-slot:append-outer>
                    <v-btn icon>
                      <v-icon>{{mdiPencilSvg}}</v-icon>
                    </v-btn>
                  </template>
                </v-text-field>
                <v-text-field
                  v-model="form.phone"
                  color="#39175c"
                  label="Phone number"
                  type="text"
                  disabled
                  :rules="[val => validatePhone(val)]"
                  :success="validPhone"
                >
                  <template v-slot:prepend>
                    <v-icon>{{mdiCellphoneSvg}}</v-icon>
                  </template>
                  <template v-slot:label>
                    <div>
                      Phone number <small>(include country code)</small>
                    </div>
                  </template>
                  <template v-slot:append-outer>
                    <v-btn icon>
                      <v-icon>{{mdiPencilSvg}}</v-icon>
                    </v-btn>
                  </template>
                </v-text-field>
              </v-form>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions style="padding-bottom: 80px;">
        <v-container>
          <v-row>
            <v-col cols="12">
              <!--dark is assigned to boolean var -> refer to bug report #4482-->
              <v-btn 
                color="#39175c"
                :dark="saveBtnEnabled"
                class="mx-1"
                width="200"
                :disabled="!saveBtnEnabled"
              >
                Save
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-card-actions>
      <!--end: profile dialog view-->
    </v-card>
    <v-overlay 
      :value="overlay" 
      absolute
    >
      <v-img 
        v-if="opSuccess"
        class="mx-auto my-auto" 
        max-width="50" 
        :src="require('../assets/op-completed.png')"
      >
      </v-img>
      <v-progress-circular
        v-else
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
.v-card-text--scroll {
  flex-grow: 1;
  overflow: auto;
}
</style>

<script>
import {mdiClose, mdiAccount, mdiEmail, mdiCellphone, mdiEye, mdiEyeOff, mdiPencil, mdiLogout} from '@mdi/js'
import {useVsbyStore} from '@/store/vsby'
import {useUserStore} from '@/store/user'
import validator from 'validator'
import sha256 from 'crypto-js/sha256'
import axios from 'axios'


export default {
  name: 'ProfileDialog',
  setup() {
    const vsbyStore = useVsbyStore()
    const userStore = useUserStore()
    return {
      vsbyStore,
      userStore,
    }
  },
  mounted() {
    this.fetchUserInfo();
  },
  data() {
    return {
      form: {firstname:'', lastname:'', phone:'', email:''},
      validForm: true,
      validFirstname: false,
      validLastname: false,
      validEmail: false,
      validPhone: false,
      overlay: false,
      saveBtnEnabled: false,
      opSuccess: false,
      mdiCloseSvg: mdiClose,
      mdiAccountSvg: mdiAccount,
      mdiEmailSvg: mdiEmail,
      mdiCellphoneSvg: mdiCellphone,
      mdiEyeSvg: mdiEye,
      mdiEyeOffSvg: mdiEyeOff,
      mdiPencilSvg: mdiPencil,
      mdiLogoutSvg: mdiLogout,
    }
  },
  methods: {
    validateFirstname(val) {
      this.validFirstname = validator.isAlpha(val, 'en-US', {ignore:"'-"}) && validator.isLength(val, {min:3, max:10});
      return this.validFirstname;
    },
    validateLastname(val) {
      this.validLastname = validator.isAlpha(val, 'en-US', {ignore:"'-"}) && validator.isLength(val, {min:3, max:10});
      return this.validLastname;
    },
    validateEmail(val) {
      this.validEmail = validator.isEmail(val);
      return this.validEmail;
    },
    validatePhone(val) {
      this.validPhone = validator.isMobilePhone(val, 'any', {strictMode:true});
      return this.validPhone;
    },
    handleServerFetchSuccess(data) {
      this.form.email = data.email;
      this.form.firstname = data.firstname;
      this.form.lastname = data.lastname;
      this.form.phone = data.phone;
    },
    async fetchUserInfo() {
      if (this.userStore.isLoggedIn) {
        const hashDigest = sha256(this.userStore.email);
        await axios.get((process.env.VUE_APP_BACKEND_SERVER + '/accountapis/fetch/' + hashDigest + '/'), {params: {email: this.userStore.email}}) 
          .then(response => {
            console.log(response);
            this.handleServerFetchSuccess(response.data[0]);
          })
          .catch(error => {
            console.log(error)
          })
      }
    },
    closeDialog() {
      this.vsbyStore.closeProfileDialog();
    },
    handleSignoutSuccess() {
      setTimeout(() => {
        this.overlay = false;
        this.opSuccess = false;
        this.vsbyStore.closeProfileDialog();
      }, 500);
    },
    doSignout() {
      this.overlay = true;
      setTimeout(() => {
        this.userStore.logout();
        this.opSuccess = true;
        this.handleSignoutSuccess();
      }, 500);
    },
  },
};
</script>