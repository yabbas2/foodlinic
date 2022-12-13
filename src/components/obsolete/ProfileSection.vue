<template>
  <q-card class="form-card">
    <q-card-section>
      <q-form ref="profileForm" class="form">
        <q-input
          color="primary"
          label="Full name"
          rounded
          disable
          outlined
          v-model="form_fullname"
          class="q-mb-md"
          type="text"
          hide-bottom-space
        >
          <template v-slot:prepend>
            <q-icon
              size="23px"
              :name="outlinedPersonOutline"
              @click.stop.prevent
            />
          </template>
          <template v-slot:after>
            <q-btn outline round :size="editIconSize">
              <q-icon :name="outlinedEdit" @click.stop.prevent />
            </q-btn>
          </template>
        </q-input>
        <q-input
          color="primary"
          label="Email"
          rounded
          disable
          outlined
          v-model="form.email"
          class="q-mb-md"
          type="text"
          hide-bottom-space
        >
          <template v-slot:prepend>
            <q-icon size="23px" :name="outlinedEmail" @click.stop.prevent />
          </template>
          <template v-slot:after>
            <q-btn outline round :size="editIconSize">
              <q-icon :name="outlinedEdit" @click.stop.prevent />
            </q-btn>
          </template>
        </q-input>
        <q-input
          color="primary"
          label="Phone"
          rounded
          disable
          outlined
          v-model="form.phone"
          class="q-mb-md"
          type="text"
          hide-bottom-space
        >
          <template v-slot:prepend>
            <q-icon size="23px" :name="outlinedPhone" @click.stop.prevent />
          </template>
          <template v-slot:after>
            <q-btn outline round :size="editIconSize">
              <q-icon :name="outlinedEdit" @click.stop.prevent />
            </q-btn>
          </template>
        </q-input>
        <q-input
          color="primary"
          label="Password"
          rounded
          disable
          outlined
          v-model="form.password"
          class="q-my-md"
          type="password"
          hide-bottom-space
        >
          <template v-slot:prepend>
            <q-icon size="23px" :name="outlinedVpnKey" @click.stop.prevent />
          </template>
          <template v-slot:after>
            <q-btn outline round :size="editIconSize">
              <q-icon :name="outlinedEdit" @click.stop.prevent />
            </q-btn>
          </template>
        </q-input>
        <q-btn
          align="between"
          color="secondary"
          type="button"
          class="full-width q-mt-lg"
          outline
          rounded
          @click="signoutUser"
        >
          Sign out
          <q-icon :name="outlinedLogout"></q-icon>
        </q-btn>
      </q-form>
    </q-card-section>
  </q-card>
  <q-inner-loading :showing="isLoading">
    <q-spinner-gears size="50px" color="secondary" />
  </q-inner-loading>
</template>

<style scoped>
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
import { reactive, ref, computed, onBeforeMount } from "vue";
import axios from "axios";
import { useUserStore } from "src/stores/user";
import {
  outlinedEmail,
  outlinedVpnKey,
  outlinedLogout,
  outlinedEdit,
  outlinedPersonOutline,
  outlinedPhone,
} from "@quasar/extras/material-icons-outlined";
import { useQuasar } from "quasar";
import Router from "src/router";

const userStore = useUserStore();
const $q = useQuasar();
const profileForm = ref(null);
const editIconSize = "12px";

const form_fullname = computed(() => {
  return form.firstname + " " + form.lastname;
});

let form = reactive({
  firstname: "",
  lastname: "",
  email: "",
  phone: "",
  password: "12345678",
});
let isLoading = ref(true);

onBeforeMount(() => {
  fetchUserInfo();
});

function notifyError(errMsg) {
  $q.notify({
    type: "negative",
    message: errMsg,
    position: "bottom",
  });
}

function handleUserFetchSuccess(respData) {
  let userInfo = respData["data"];
  form.email = userInfo.email;
  form.firstname = userInfo.firstname;
  form.lastname = userInfo.lastname;
  form.phone = userInfo.phone;
  isLoading.value = false;
}

function handleUserFetchError(errCode) {
  isLoading.value = false;
  switch (errCode) {
    case 401:
      notifyError("Invalid account credentials");
      userStore.logout();
      break;
    case 500:
    default:
      notifyError("Error! Please contact us");
      userStore.logout();
      break;
  }
}

async function fetchUserInfo() {
  await axios
    .post(import.meta.env.VITE_BACKEND_SERVER + "/accountapis/fetch/", {
      token: window.sessionStorage.getItem("x-access-token"),
    })
    .then((response) => {
      console.log(response);
      handleUserFetchSuccess(response.data);
    })
    .catch((error) => {
      console.log(error.response);
      handleUserFetchError(error.response.status);
    });
}

function signoutUser() {
  userStore.logout();
  Router.replace("/");
}
</script>
