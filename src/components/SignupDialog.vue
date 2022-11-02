<template>
  <v-dialog
    v-model="vsbyStore.signupDiagVsby"
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
      <v-spacer></v-spacer>
      <!--start: signup view-->
      <v-card-subtitle class="justify-center py-0 v-card__subtitle">
        SIGN UP
      </v-card-subtitle>
      <v-spacer></v-spacer>
      <v-card-text class="px-0 pt-0 pb-16">
        <v-form
          ref="signupform"
          v-model="validForm"
          lazy-validation
        >
          <v-text-field
            v-model="form.firstname"
            color="#39175c"
            label="First name"
            type="text"
            :rules="[val => validateFirstname(val)]"
            :success="validFirstname"
          >
            <template v-slot:prepend>
              <v-icon>{{mdiAccountSvg}}</v-icon>
            </template>
          </v-text-field>
          <v-text-field
            v-model="form.lastname"
            color="#39175c"
            label="Last name"
            type="text"
            :rules="[val => validateLastname(val)]"
            :success="validLastname"
          >
            <template v-slot:prepend>
              <v-icon>{{mdiAccountSvg}}</v-icon>
            </template>
          </v-text-field>
          <v-text-field
            v-model="form.email"
            color="#39175c"
            label="Email"
            type="text"
            :rules="[val => validateEmail(val)]"
            :success="validEmail"
          >
            <template v-slot:prepend>
              <v-icon>{{mdiEmailSvg}}</v-icon>
            </template>
          </v-text-field>
          <v-text-field
            v-model="form.phone"
            color="#39175c"
            label="Phone number"
            type="text"
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
          </v-text-field>
          <v-text-field
            v-model="form.password"
            color="#39175c"
            label="Password"
            hint="Minimum length: 8"
            :loading="showPasswordProgress"
            :type="showPassword? 'text' : 'password'"
            :append-icon="showPassword? 'mdi-eye' : 'mdi-eye-off'"
            :rules="[val => validatePassword(val)]"
            :success="validPassword"
            @click:append="showPassword=!showPassword"
          >
            <template v-slot:prepend>
              <v-icon>{{mdiLockSvg}}</v-icon>
            </template>
            <template v-slot:progress>
              <v-progress-linear
                :value="progress"
                :color="color"
                absolute
                height="3"
              ></v-progress-linear>
            </template>
          </v-text-field>
        </v-form>
        <div class="d-flex justify-start">
          &nbsp;Already have an account?&nbsp;
          <a @click="vsbyStore.openSigninDialog">Sign in</a>
        </div>
        <v-divider class="my-4"></v-divider>
        <v-btn
          color="#39175c"
          dark
          @click="signupUser"
          class="mx-1"
        >
          Create My Account
        </v-btn>
      </v-card-text>
      <v-spacer></v-spacer>
      <!--end: signup view-->
    </v-card>
    <v-snackbar v-model="showSnackbar">
      {{msgSnackbar}}
      <template v-slot:action="{attrs}">
        <v-btn
          color="#f25b47"
          text
          v-bind="attrs"
          @click="showSnackbar=false"
        >Close</v-btn>
      </template>
    </v-snackbar>
    <v-overlay 
      :value="overlay" 
      absolute
    >
      <v-img 
        v-if="signupSuccess"
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
</style>

<script>
import {mdiClose, mdiAccount, mdiEmail, mdiCellphone, mdiLock} from '@mdi/js'
import {useUserStore} from '@/store/user'
import {useVsbyStore} from '@/store/vsby'
import validator from 'validator';
import axios from 'axios'
import sha256 from 'crypto-js/sha256';

export default {
  name: "SignupDialog",
  setup() {
    const userStore = useUserStore()
    const vsbyStore = useVsbyStore()
    return {
      userStore,
      vsbyStore,
    }
  },
  data() {
    return {
      form: {firstname:'', lastname:'', phone:'', email:'', password:''},
      validForm: true,
      validFirstname: false,
      validLastname: false,
      validEmail: false,
      validPhone: false,
      validPassword: false,
      showPassword: false,
      strongLevelPassword: 0,
      showPasswordProgress: false,
      msgSnackbar: '',
      showSnackbar: false,
      overlay: false,
      signupSuccess: false,
      mdiCloseSvg: mdiClose,
      mdiAccountSvg: mdiAccount,
      mdiEmailSvg: mdiEmail,
      mdiCellphoneSvg: mdiCellphone,
      mdiLockSvg: mdiLock,
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
    validatePassword(val) {
      if (val.length > 0) {this.showPasswordProgress = true;}
      else                {this.showPasswordProgress = false;}
      this.strongLevelPassword = validator.isStrongPassword(val, {minLength:8, minLowercase:1, minUppercase:1, minNumbers:1, minSymbols:1, returnScore:true, pointsPerUnique:2, pointsPerRepeat:1, pointsForContainingLower:10, pointsForContainingUpper:10, pointsForContainingNumber:10, pointsForContainingSymbol:10});
      this.validPassword = validator.isLength(val, {min:8, max:undefined}) && (this.strongLevelPassword >= 50);
      return this.validPassword;
    },
    validateForm() {
      return this.$refs.signupform.validate();
    },
    resetForm() {
      this.form.firstname = '';
      this.form.lastname = '';
      this.form.phone = '';
      this.form.email = '';
      this.form.password = '';
      this.$refs.signupform.resetValidation();
    },
    showSnackbarError(errMsg) {
      this.msgSnackbar = errMsg;
      this.showSnackbar = true;
    },
    handleServerSignupError(errorJson) {
      this.overlay = false;
      let errorMsg = errorJson.response.data.hasOwnProperty('reason')? errorJson.response.data['reason'] : 'unknown-error';
      if (errorMsg === 'existing-data') {
        this.showSnackbarError('This account already exists!');
      }
      else {
        this.showSnackbarError('Server Error! Please contact us.');
      }
    },
    handleServerSignupSuccess(respJson) {
      this.signupSuccess = true;
      setTimeout(() => {
        this.vsbyStore.closeSignupDialog();
        this.overlay = false;
        this.resetForm();
      }, 1500);
      this.userStore.login(respJson.data[0]);
    },
    async signupUser() {
      let isValid = this.validateForm();
      if (isValid) {
        this.overlay = true;
        const hashDigest = sha256(JSON.stringify(this.form));
        await axios.post((process.env.VUE_APP_BACKEND_SERVER + '/accountapis/signup/' + hashDigest + '/'), this.form)
          .then(response => {
            console.log(response);
            this.handleServerSignupSuccess(response);
          })
          .catch(error => {
            console.log(error);
            this.handleServerSignupError(error);
          })
      }
      else {
        this.showSnackbarError('Required field(s) missing/invalid!');
      }
    },
    closeDialog() {
      this.signupSuccess = false;
      this.vsbyStore.closeSignupDialog();
      this.resetForm();
    },
  },
  computed: {
    progress () {
      return Math.min(100, this.strongLevelPassword)
    },
    color () {
      return ['error', 'warning', 'success'][Math.floor(this.progress / 40)]
    },
  },
}
</script>