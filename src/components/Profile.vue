<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-avatar
          size="100"
          class="mx-auto"
        >
          <v-img :src="util.transformImageUrl('../assets/avatar.webp')" width="100"></v-img>
        </v-avatar>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-form>
          <v-text-field
            :model-value="fullName"
            color="#39175c"
            label="Full name"
            type="text"
            variant="outlined"
            disabled
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
            disabled
          >
            <template v-slot:prepend-inner>
              <v-icon>{{mdiEmailSvg}}</v-icon>
            </template>
          </v-text-field>
          <v-text-field
            v-model="form.phone"
            color="#39175c"
            label="Phone number"
            type="text"
            variant="outlined"
            disabled
          >
            <template v-slot:prepend-inner>
              <v-icon>{{mdiCellphoneSvg}}</v-icon>
            </template>
          </v-text-field>
        </v-form>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-btn 
          variant="outlined"
          block
          color="#f25b47"
          :append-icon="mdiLogoutSvg"
          @click="signoutUser"
        >
          Sign out
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
</template>

<style scoped>

</style>

<script setup>
import { mdiAccount, mdiEmail, mdiCellphone, mdiLogout } from '@mdi/js'
import {useUserStore} from '@/store/user'
import axios from 'axios'
import util from '@/plugins/util'
import { ref, reactive, onBeforeMount } from 'vue'
import router from '@/plugins/router'
import { computed } from '@vue/reactivity'

const userStore = useUserStore();

let form = reactive({firstname:'', lastname:'', phone:'', email:''});
let overlay = ref(true);
let opSuccess = ref(false);

const mdiAccountSvg = mdiAccount;
const mdiEmailSvg = mdiEmail;
const mdiCellphoneSvg = mdiCellphone;
const mdiLogoutSvg = mdiLogout;

onBeforeMount(() => {
  fetchUserInfo();
});

const fullName = computed(() => {
  return form.firstname + ' ' + form.lastname;
});

function handleServerFetchSuccess(data) {
  form.email = data.email;
  form.firstname = data.firstname;
  form.lastname = data.lastname;
  form.phone = data.phone;
  overlay.value = false;
}

async function fetchUserInfo() {
  await axios.get((import.meta.env.VITE_BACKEND_SERVER + '/accountapis/fetch/'), {params: {[import.meta.env.VITE_USER_ID_KEY]: userStore[import.meta.env.VITE_USER_ID_KEY]}}) 
    .then(response => {
      console.log(response);
      handleServerFetchSuccess(response.data[0]);
    })
    .catch(error => {
      console.log(error);
      userStore.logout();
      router.replace('/user/signin');
    })
}

function handleSignoutSuccess() {
  setTimeout(() => {
    overlay.value = false;
    opSuccess.value = false;
    router.replace('/menu');
  }, 500);
}

function signoutUser() {
  overlay.value = true;
  setTimeout(() => {
    userStore.logout();
    opSuccess.value = true;
    handleSignoutSuccess();
  }, 500);
}
</script>