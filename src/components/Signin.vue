<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-form
          ref="signinForm"
          v-model="validForm"
          lazy-validation
        >
          <v-text-field
            v-model="form.email"
            color="#39175c"
            label="Email"
            type="text"
            variant="outlined"
            :rules="[val => validateEmail(val)]"
            :success="validEmail"
          >
            <template v-slot:prepend-inner>
              <v-icon>{{mdiEmailSvg}}</v-icon>
            </template>
          </v-text-field>
          <v-text-field
            v-model="form.password"
            color="#39175c"
            label="Password"
            :type="showPassword? 'text' : 'password'"
            variant="outlined"
            :append-inner-icon="showPassword? mdiEyeSvg : mdiEyeOffSvg"
            :rules="[val => validatePassword(val)]"
            :success="validPassword"
            @click:appendInner="showPassword=!showPassword"
          >
            <template v-slot:prepend-inner>
              <v-icon>{{mdiLockSvg}}</v-icon>
            </template>
          </v-text-field>
        </v-form>
        <div class="d-flex justify-start">
          &nbsp;Don't have an account?&nbsp;
          <router-link to="/user/signup">Sign up</router-link>
        </div>
      </v-col>
    </v-row>
    <v-row align="stretch" align-content="center" justify="center">
      <v-col cols="12">
        <v-btn
          color="#39175c"
          @click="signinUser"
          class="mx-1"
          block
          variant="outlined"
        >
          Sign in
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
  <v-overlay 
    :model-value="overlay"
    absolute
    class="align-center justify-center"
  >
    <v-img 
      v-if="opSuccess"
      width="50" 
      :src="util.transformImageUrl('../assets/op-completed.png')"
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
  <v-snackbar
    v-model="showAlert"
    location="top"
    class="alert-font"
  >
    {{msgAlert}}
    <template v-slot:actions>
      <v-btn
        color="#f25b47"
        @click="showAlert=false"
      >Close</v-btn>
    </template>
  </v-snackbar>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');

.alert-font {
  font-size: small;
}

</style>

<script setup>
import { reactive, ref } from 'vue';
import { mdiEmail, mdiLock, mdiEye, mdiEyeOff } from '@mdi/js';
import { useUserStore } from '@/store/user';
import validator from 'validator';
import axios from 'axios';
import util from '@/plugins/util';
import router from '@/plugins/router';

const userStore = useUserStore();

let form =  reactive({email:'', password:''});
let validForm = ref(false);
let validEmail = ref(false);
let validPassword = ref(false);
let showPassword = ref(false);
let msgAlert = ref('');
let showAlert = ref(false);
let overlay = ref(false);
let opSuccess = ref(false);

const signinForm = ref(null);
const mdiEmailSvg = mdiEmail;
const mdiLockSvg = mdiLock;
const mdiEyeSvg = mdiEye;
const mdiEyeOffSvg = mdiEyeOff;


function validateEmail(val) {
  validEmail.value = validator.isEmail(val)? true : '';
  return validEmail.value;
}

function validatePassword(val) {
  validPassword.value = validator.isLength(val, {min:8, max:undefined})? true : '';
  return validPassword.value;
}

async function validateForm() {
  let retVal = false;
  await signinForm.value.validate()
    .then(result => {
      retVal = result.valid;
    });
  return retVal;
}

function showAlertError(errMsg) {
  msgAlert.value = errMsg;
  showAlert.value = true;
}

function HideAlertError() {
  msgAlert.value = '';
  showAlert.value = false;
}

function handleServerSigninError(errorJson) {
  overlay.value = false;
  let errorMsg = errorJson.response.data.hasOwnProperty('reason')? errorJson.response.data['reason'] : 'unknown-error';
  if (errorMsg === 'non-existing-data') {
    showAlertError('This account does not exist!');
    form.email = '';
    form.password = '';
  }
  else if (errorMsg === 'failed-authorization') {
    showAlertError('The password is incorrect!');
    form.password = '';
  }
  else {
    showAlertError('Login failed! Please contact us.');
  }
}

function handleServerSigninSuccess(respData) {
  HideAlertError();
  opSuccess.value = true;
  setTimeout(() => {
    overlay.value = false;
    userStore.login(respData);
    router.replace('/menu');
  }, 1500);
}

async function signinUser() {
  let isValid = await validateForm();
  if (isValid) {
    overlay.value = true;
    await axios.post((import.meta.env.VITE_BACKEND_SERVER + '/accountapis/signin/'), form)
      .then(response => {
        console.log(response);
        handleServerSigninSuccess(response.data);
      })
      .catch(error => {
        console.log(error);
        handleServerSigninError(error);
      })
  }
  else {
    showAlertError('Required field(s) missing/invalid!');
  }
}
</script>