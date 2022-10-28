<template>
  <v-dialog
    v-model="vsbyStore.signupDiagVsby"
    transition="dialog-bottom-transition"
    max-width="800"
    @click:outside="closeDialog"
    @keydown.esc="closeDialog"
    content-class="v-dialog--fullscreen signup-dialog"
  ><!--:overlay-opacity="0.9"-->
    <v-card tile flat class="v-card--scroll" height="100%">
      <v-card-title>
        <v-img 
          class="mx-auto my-auto" 
          max-width="35" 
          :src="require('../assets/avatar.jpg')"
        />
        <v-spacer></v-spacer>
        <v-btn 
          small
          outlined
          rounded
          :ripple="{class: 'red--text'}"
          @click="closeDialog"
        >
          <v-icon>mdi-close</v-icon>
          Close
        </v-btn>
      </v-card-title>
      <v-spacer></v-spacer>
      <!--start: signup view-->
      <v-card-subtitle class="justify-center py-0">
        <span><pre class="text-h6 font-weight-bold" style="color: #39175c;">WELCOME TO</pre></span>
        <v-img :src="require('../assets/logo-name-wbg.png')" width="200" class="mx-auto"></v-img>
      </v-card-subtitle>
      <v-spacer></v-spacer>
      <v-card-text>
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
            prepend-icon="mdi-account"
            :rules="[val => validateFirstname(val)]"
            :success="validFirstname"
          ></v-text-field>
          <v-text-field
            v-model="form.lastname"
            color="#39175c"
            label="Last name"
            type="text"
            prepend-icon="mdi-account"
            :rules="[val => validateLastname(val)]"
            :success="validLastname"
          ></v-text-field>
          <v-text-field
            v-model="form.email"
            color="#39175c"
            label="Email"
            type="text"
            prepend-icon="mdi-email"
            :rules="[val => validateEmail(val)]"
            :success="validEmail"
          ></v-text-field>
          <v-text-field
            v-model="form.phone"
            color="#39175c"
            label="Phone number"
            type="text"
            prepend-icon="mdi-cellphone"
            :rules="[val => validatePhone(val)]"
            :success="validPhone"
          >
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
            prepend-icon="mdi-lock"
            :loading="showPasswordProgress"
            :type="showPassword? 'text' : 'password'"
            :append-icon="showPassword? 'mdi-eye' : 'mdi-eye-off'"
            :rules="[val => validatePassword(val)]"
            :success="validPassword"
            @click:append="showPassword=!showPassword"
          >
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
          <a @click="openSigninDialog">Sign in</a>
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

<style>
.signup-dialog {
  border-radius: 30px 30px 0 0 !important;
  margin: 0 !important;
  height: 85% !important;
  position: fixed !important;
  overflow-y: auto !important;
  bottom: 0 !important;
  top: auto !important;
  left: auto !important;
}

.v-card--scroll {
  display: flex !important;
  flex-direction: column;
}
</style>

<script>
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
        this.vsbyStore.signupDiagVsby = false;
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
      this.vsbyStore.signupDiagVsby = false;
      this.resetForm();
    },
    openSigninDialog() {
      this.vsbyStore.signinDiagVsby = true;
      this.vsbyStore.signupDiagVsby = false;
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