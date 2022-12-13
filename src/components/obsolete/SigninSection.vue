<template>
  <q-card class="form-card">
    <q-card-section>
      <q-form ref="signinForm" class="form" @submit="signinUser">
        <q-input
          color="primary"
          label="Email"
          rounded
          outlined
          v-model="form.email"
          class="q-mb-md"
          type="text"
          hide-bottom-space
          :lazy-rules="true"
          :rules="[(val) => validateEmail(val)]"
        >
          <template v-slot:prepend>
            <q-icon size="23px" :name="outlinedEmail" @click.stop.prevent />
          </template>
        </q-input>
        <q-input
          color="primary"
          label="Password"
          rounded
          outlined
          v-model="form.password"
          class="q-my-md"
          :type="showPassword ? 'text' : 'password'"
          hide-bottom-space
          :lazy-rules="true"
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
        <q-btn
          align="between"
          color="primary"
          type="submit"
          class="full-width q-mt-lg"
          rounded
        >
          Sign in
          <q-icon :name="outlinedLogin"></q-icon>
        </q-btn>
      </q-form>
    </q-card-section>
    <q-card-actions>
      <div class="q-ml-sm">
        &nbsp;Don't have an account?&nbsp;
        <router-link to="/user/signup">Sign up</router-link>
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
</style>

<script setup>
import { reactive, ref } from "vue";
import validator from "validator";
import {
  outlinedEmail,
  outlinedVpnKey,
  outlinedVisibility,
  outlinedVisibilityOff,
  outlinedLogin,
} from "@quasar/extras/material-icons-outlined";
import { useQuasar } from "quasar";
import Router from "../router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const $q = useQuasar();
const signinForm = ref(null);

let form = reactive({ email: "", password: "" });
let showPassword = ref(false);
let isLoading = ref(false);

function notifyError(errMsg) {
  $q.notify({
    type: "negative",
    message: errMsg,
    position: "bottom",
  });
}

function validateEmail(val) {
  return validator.isEmail(val) ? true : "";
}

function validatePassword(val) {
  return validator.isLength(val, { min: 8, max: undefined }) ? true : "";
}

function clearForm(email = true, password = true) {
  if (email === true) {
    form.email = "";
  }
  if (password === true) {
    form.password = "";
  }
}

function handleServerSigninSuccess(respData) {
  isLoading.value = false;
  Router.replace("/");
}

function handleServerSigninError(errorCode) {
  isLoading.value = false;
  switch (errorCode) {
    case 400:
      notifyError("Invalid account info");
      clearForm();
      break;
    case 401:
      notifyError("Incorrect password");
      clearForm(false, true);
      break;
    case 404:
      notifyError("This account does not exist");
      clearForm();
      break;
    case 500:
    default:
      notifyError("Error! Please contact us");
      clearForm();
      break;
  }
}

async function signinUser() {
  isLoading.value = true;
  signInWithEmailAndPassword(auth, form.email, form.password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log(user);
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
}
</script>
