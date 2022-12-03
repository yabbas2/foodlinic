<template>
  <q-card class="form-card">
    <q-card-section>
      <q-form ref="signupForm" class="form" @submit="signupUser">
        <q-input
          color="primary"
          label="Full name"
          rounded
          outlined
          v-model="form_fullname"
          class="q-mb-md"
          type="text"
          hint="e.g. John Alber"
          :lazy-rules="true"
          :rules="[(val) => validateFullname(val)]"
        >
          <template v-slot:prepend>
            <q-icon
              size="23px"
              :name="outlinedPersonOutline"
              @click.stop.prevent
            />
          </template>
        </q-input>
        <q-input
          color="primary"
          label="Email"
          rounded
          outlined
          v-model="form.email"
          class="q-mb-md"
          type="text"
          hint="e.g. john.alber@mail.com"
          :lazy-rules="true"
          :rules="[(val) => validateEmail(val)]"
        >
          <template v-slot:prepend>
            <q-icon size="23px" :name="outlinedEmail" @click.stop.prevent />
          </template>
        </q-input>
        <q-input
          color="primary"
          label="Phone"
          rounded
          outlined
          v-model="form.phone"
          class="q-mb-md"
          type="text"
          hint="e.g. +46559822657"
          :lazy-rules="true"
          :rules="[(val) => validatePhone(val)]"
        >
          <template v-slot:prepend>
            <q-icon size="23px" :name="outlinedPhone" @click.stop.prevent />
          </template>
        </q-input>
        <q-input
          color="primary"
          label="Password"
          rounded
          outlined
          v-model="form.password"
          class="q-mt-md q-mb-xs"
          hide-bottom-space
          :type="showPassword ? 'text' : 'password'"
          :rules="[(val) => validatePassword(val)]"
        >
          <template v-slot:prepend>
            <q-icon size="23px" :name="outlinedVpnKey" @click.stop.prevent />
          </template>
          <template v-slot:append>
            <q-icon
              size="23px"
              :name="showPassword ? outlinedVisibility : outlinedVisibilityOff"
              @click="showPassword = !showPassword"
            />
          </template>
        </q-input>
        <q-linear-progress
          animation-speed="500"
          rounded
          :value="progress"
          :color="color"
          class="password-progress"
        />
        <q-btn
          align="between"
          color="primary"
          type="submit"
          class="full-width q-mt-lg"
          rounded
        >
          Sign up
          <q-icon :name="outlinedAddCircleOutline"></q-icon>
        </q-btn>
      </q-form>
    </q-card-section>
    <q-card-actions>
      <div class="q-ml-sm">
        &nbsp;Already have an account?&nbsp;
        <router-link to="/user/signin">Sign in</router-link>
      </div>
    </q-card-actions>
  </q-card>
  <q-inner-loading :showing="isLoading">
    <q-spinner-gears size="50px" color="secondary" />
  </q-inner-loading>
</template>

<style lang="scss" scoped>
.form {
  min-width: 280px;
}
.form-card {
  border-radius: 30px;
  background: radial-gradient(circle, white 0%, #fafafa 100%);
  margin-left: auto;
  margin-right: auto;
}
.password-progress {
  max-width: 240px;
  margin-left: auto;
  margin-right: auto;
}
</style>

<script setup>
import { reactive, ref, computed } from "vue";
import axios from "axios";
import { useUserStore } from "src/stores/user";
import validator from "validator";
import {
  outlinedEmail,
  outlinedVpnKey,
  outlinedAddCircleOutline,
  outlinedPersonOutline,
  outlinedPhone,
  outlinedVisibility,
  outlinedVisibilityOff,
} from "@quasar/extras/material-icons-outlined";
import { useQuasar } from "quasar";
import Router from "src/router/index";

const userStore = useUserStore();
const $q = useQuasar();
const signupForm = ref(null);
let showPassword = ref(false);

let form_fullname = ref("");
let form = reactive({
  firstname: "",
  lastname: "",
  email: "",
  phone: "",
  password: "",
});
let isLoading = ref(false);
let strongLevelPassword = ref(0);

const progress = computed(() => {
  return strongLevelPassword.value / 100;
});

const color = computed(() => {
  return ["red", "orange", "green"][Math.floor(progress.value / 0.4)];
});

function notifyError(errMsg) {
  $q.notify({
    type: "negative",
    message: errMsg,
    position: "bottom",
  });
}

function validateFullname(val) {
  return validator.isAlpha(val, "en-US", { ignore: " '-" }) &&
    validator.isLength(val, { min: 3, max: 50 }) &&
    validator.matches(val, /^\S+\s\S+$/i)
    ? true
    : "";
}

function validateEmail(val) {
  return validator.isEmail(val) ? true : "";
}

function validatePhone(val) {
  return validator.isMobilePhone(val, "any", { strictMode: true }) ? true : "";
}

function validatePassword(val) {
  strongLevelPassword.value = validator.isStrongPassword(val, {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    returnScore: true,
    pointsPerUnique: 2,
    pointsPerRepeat: 1,
    pointsForContainingLower: 10,
    pointsForContainingUpper: 10,
    pointsForContainingNumber: 10,
    pointsForContainingSymbol: 10,
  });
  return validator.isLength(val, { min: 8, max: undefined }) &&
    strongLevelPassword.value >= 50
    ? true
    : "";
}

function handleUserSignupError(errCode) {
  isLoading.value = false;
  switch (errCode) {
    case 302:
      notifyError("This account already exists");
      break;
    case 400:
      notifyError("Invalid account info");
      break;
    case 500:
    default:
      notifyError("Error! Please contact us");
      break;
  }
}

function handleUserSignupSuccess(respData) {
  let tokenData = JSON.parse(respData["token"]);
  userStore.login(tokenData);
  isLoading.value = false;
  Router.replace("/");
}

async function signupUser() {
  isLoading.value = true;
  let formToPost = {
    firstname: form_fullname.value.split(" ")[0],
    lastname: form_fullname.value.split(" ")[1],
    email: form.email,
    phone: form.phone,
    password: form.password,
  };
  await axios
    .post(import.meta.env.VITE_BACKEND_SERVER + "/accountapis/signup/", {
      data: JSON.stringify(formToPost),
    })
    .then((response) => {
      console.log(response);
      handleUserSignupSuccess(response.data);
    })
    .catch((error) => {
      console.log(error.response);
      handleUserSignupError(error.response.status);
    });
}
</script>
