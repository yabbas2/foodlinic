<template>
  <v-dialog
    v-model="vsbyStore.signinDiagVsby"
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
      <!--start: signin view-->
      <v-card-subtitle class="justify-center py-0 v-card__subtitle">
        SIGN IN
      </v-card-subtitle>
      <v-spacer></v-spacer>
      <v-card-text>
        <v-form
          ref="signinform"
          v-model="validForm"
          lazy-validation
        >
          <v-text-field
            v-model="form.email"
            color="#39175c"
            label="Email"
            type="text"
            :rules="[val => validateEmail(val)]"
            :success="validEmail"
          >
            <template v-slot:prepend>
              <v-icon>{{mdiAccountSvg}}</v-icon>
            </template>
          </v-text-field>
          <v-text-field
            v-model="form.password"
            color="#39175c"
            label="Password"
            :type="showPassword? 'text' : 'password'"
            :append-icon="showPassword? 'mdi-eye' : 'mdi-eye-off'"
            :rules="[val => validatePassword(val)]"
            :success="validPassword"
            @click:append="showPassword=!showPassword"
          >
            <template v-slot:prepend>
              <v-icon>{{mdiLockSvg}}</v-icon>
            </template>
          </v-text-field>
        </v-form>
        <div class="d-flex justify-start">
          &nbsp;Don't have an account?&nbsp;
          <a @click="openSignupDialog">Sign up</a>
        </div>
        <v-divider class="my-4"></v-divider>
        <v-btn
          color="#39175c"
          dark
          @click="signinUser"
          class="mx-1"
        >
          Sign in
        </v-btn>
      </v-card-text>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
      <!--end: signin view-->
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
        v-if="signinSuccess"
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
import {mdiClose, mdiAccount, mdiLock} from '@mdi/js'
import {useUserStore} from '@/store/user'
import {useVsbyStore} from '@/store/vsby'
import validator from 'validator';
import axios from 'axios'
import sha256 from 'crypto-js/sha256';

export default {
  name: "SigninDialog",
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
      form: {email:'', password:''},
      validForm: true,
      validEmail: false,
      validPassword: false,
      showPassword: false,
      msgSnackbar: '',
      showSnackbar: false,
      overlay: false,
      signinSuccess: false,
      mdiCloseSvg: mdiClose,
      mdiAccountSvg: mdiAccount,
      mdiLockSvg: mdiLock,
    }
  },
  methods: {
    validateEmail(val) {
      this.validEmail = validator.isEmail(val);
      return this.validEmail;
    },
    validatePassword(val) {
      this.validPassword = validator.isLength(val, {min:8, max:undefined});
      return this.validPassword;
    },
    validateForm() {
      return this.$refs.signinform.validate();
    },
    resetForm() {
      this.form.email = '';
      this.form.password = '';
      this.$refs.signinform.resetValidation();
    },
    showSnackbarError(errMsg) {
      this.msgSnackbar = errMsg;
      this.showSnackbar = true;
    },
    handleServerSigninError(errorJson) {
      this.overlay = false;
      let errorMsg = errorJson.response.data.hasOwnProperty('reason')? errorJson.response.data['reason'] : 'unknown-error';
      if (errorMsg === 'non-existing-data') {
        this.showSnackbarError('This account does not exist!');
        this.form.email = '';
        this.form.password = '';
      }
      else if (errorMsg === 'failed-authorization') {
        this.showSnackbarError('The password is incorrect!');
        this.form.password = '';
      }
      else {
        this.showSnackbarError('Login failed! Please contact us.');
      }
    },
    handleServerSigninSuccess(respJson) {
      this.signinSuccess = true;
      setTimeout(() => {
        this.vsbyStore.signinDiagVsby = false;
        this.overlay = false;
        this.resetForm();
      }, 1500);
      this.userStore.login(respJson.data[0]);
    },
    async signinUser() {
      let isValid = this.validateForm();
      if (isValid) {
        this.overlay = true;
        const hashDigest = sha256(JSON.stringify(this.form));
        await axios.post((process.env.VUE_APP_BACKEND_SERVER + '/accountapis/signin/' + hashDigest + '/'), this.form)
          .then(response => {
            console.log(response);
            this.handleServerSigninSuccess(response);
          })
          .catch(error => {
            console.log(error);
            this.handleServerSigninError(error);
          })
      }
      else {
        this.showSnackbarError('Required field(s) missing/invalid!');
      }
    },
    closeDialog() {
      this.signinSuccess = false;
      this.vsbyStore.signinDiagVsby = false;
      this.resetForm();
    },
    openSignupDialog() {
      this.vsbyStore.signupDiagVsby = true;
      this.vsbyStore.signinDiagVsby = false;
    },
  },
}
</script>