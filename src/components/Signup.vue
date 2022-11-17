<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-form
          ref="signupForm"
          v-model="validForm"
          lazy-validation
        >
          <v-text-field
            v-model="form.fullname"
            color="#39175c"
            label="Full name"
            type="text"
            variant="outlined"
            :rules="[val => validateFullname(val)]"
            :success="validFullname"
          >
            <template v-slot:prepend-inner>
              <v-icon>{{mdiAccountSvg}}</v-icon>
            </template>
          </v-text-field>
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
            v-model="form.phone"
            color="#39175c"
            type="text"
            variant="outlined"
            :rules="[val => validatePhone(val)]"
            :success="validPhone"
          >
            <template v-slot:prepend-inner>
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
            variant="outlined"
            :loading="showPasswordProgress"
            :type="showPassword? 'text' : 'password'"
            :append-inner-icon="showPassword? mdiEyeSvg : mdiEyeOffSvg"
            :rules="[val => validatePassword(val)]"
            :success="validPassword"
            @click:appendInner="showPassword=!showPassword"
          >
            <template v-slot:prepend-inner>
              <v-icon>{{mdiLockSvg}}</v-icon>
            </template>
            <template v-slot:loader>
              <v-progress-linear
                :model-value="progress"
                :color="color"
                absolute
                height="4"
              ></v-progress-linear>
            </template>
          </v-text-field>
        </v-form>
        <div class="d-flex justify-start">
          &nbsp;Already have an account?&nbsp;
          <router-link to="/user/signin">Sign in</router-link>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-btn 
          variant="outlined"
          block
          color="#39175c"
          @click="signupUser"
        >
          Sign up
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

</style>

<script setup>
import { mdiAccount, mdiEmail, mdiCellphone, mdiLock, mdiEye, mdiEyeOff } from '@mdi/js'
import { useUserStore } from '@/store/user'
import axios from 'axios'
import validator from 'validator';
import util from '@/plugins/util'
import { ref, reactive } from 'vue'
import router from '@/plugins/router'
import { computed } from '@vue/reactivity';

const userStore = useUserStore();

let overlay = ref(false);
let opSuccess = ref(false);
let form = reactive({fullname:'', phone:'', email:'', password:''});
let validForm = ref(true);
let validFullname = ref(false);
let validEmail = ref(false);
let validPhone = ref(false);
let validPassword = ref(false);
let showPassword = ref(false);
let strongLevelPassword = ref(0);
let showPasswordProgress = ref(false);
let msgAlert = ref('');
let showAlert = ref(false);

const signupForm = ref(null);
const mdiAccountSvg = mdiAccount;
const mdiEmailSvg = mdiEmail;
const mdiCellphoneSvg = mdiCellphone;
const mdiLockSvg = mdiLock;
const mdiEyeSvg = mdiEye;
const mdiEyeOffSvg = mdiEyeOff;

const progress = computed(() => {
  return Math.min(100, strongLevelPassword.value);
});

const color = computed(() => {
  return ['error', 'warning', 'success'][Math.floor(progress.value / 40)];
});

function showAlertError(errMsg) {
  msgAlert.value = errMsg;
  showAlert.value = true;
}

function HideAlertError() {
  msgAlert.value = '';
  showAlert.value = false;
}

function validateFullname(val) {
  validFullname.value = (validator.isAlpha(val, 'en-US', {ignore:" '-"}) && validator.isLength(val, {min:3, max:50}) && validator.matches(val, /^\S+\s\S+$/i))? true : '';
  return validFullname.value;
}

function validateEmail(val) {
  validEmail.value = validator.isEmail(val)? true : '';
  return validEmail.value;
}

function validatePhone(val) {
  validPhone.value = validator.isMobilePhone(val, 'any', {strictMode:true})? true : '';
  return validPhone.value;
}

function validatePassword(val) {
  if (val.length > 0) {showPasswordProgress.value = true;}
  else                {showPasswordProgress.value = false;}
  strongLevelPassword.value = validator.isStrongPassword(val, {minLength:8, minLowercase:1, minUppercase:1, minNumbers:1, minSymbols:1, returnScore:true, pointsPerUnique:2, pointsPerRepeat:1, pointsForContainingLower:10, pointsForContainingUpper:10, pointsForContainingNumber:10, pointsForContainingSymbol:10});
  validPassword.value = (validator.isLength(val, {min:8, max:undefined}) && (strongLevelPassword.value >= 50))? true : '';
  return validPassword.value;
}

function handleServerSignupSuccess(respData) {
  HideAlertError();
  opSuccess.value = true;
  setTimeout(() => {
    overlay.value = false;
    console.log(respData);
    userStore.login(respData);
    router.replace('/menu');
  }, 1500);
}

function handleServerSignupError(errorJson) {
  overlay.value = false;
  let errorMsg = errorJson.response.data.hasOwnProperty('reason')? errorJson.response.data['reason'] : 'unknown-error';
  if (errorMsg === 'existing-data') {
    showAlertError('This account already exists!');
  }
  else {
    showAlertError('Login failed! Please contact us.');
  }
}

async function validateForm() {
  let retVal = false;
  await signupForm.value.validate()
    .then(result => {
      retVal = result.valid;
    });
  return retVal;
}

async function signupUser() {
  let isValid = await validateForm();
  if (isValid) {
    overlay.value = true;
    await axios.post((import.meta.env.VITE_BACKEND_SERVER + '/accountapis/signup/'), form) 
      .then(response => {
        console.log(response);
        handleServerSignupSuccess(response.data);
      })
      .catch(error => {
        console.log(error);
        handleServerSignupError(error);
      })
  }
  else {
    showAlertError('Required field(s) missing/invalid!');
  }
}
</script>