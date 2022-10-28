<template>
  <v-navigation-drawer
    v-model="vsbyStore.navDrwrVsby"
    app
    absolute
    clipped
    color="#39175c"
    dark
    :height="windowHeight"
    class="nav-drawer"
  >
    <v-list v-show="userStore.isLoggedIn">
      <v-list-group
        color="white"
        v-show="userStore.isLoggedIn"
      >
        <template v-slot:activator>
          <v-list-item-content class="text-start">
            <v-list-item-title class="text-h6">{{userStore.firstname}} {{userStore.lastname}}</v-list-item-title>
            <v-list-item-subtitle class="text-subtitle-1">{{userStore.email}}</v-list-item-subtitle>
          </v-list-item-content>
        </template>
        <v-list-item link dense>
          <v-list-item-icon>
            <v-icon size="20">mdi-cog</v-icon>
          </v-list-item-icon>
          <v-list-item-content class="text-start">
            <v-list-item-title class="text-body-2">Settings</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link dense>
          <v-list-item-icon>
            <v-icon size="20">mdi-view-dashboard</v-icon>
          </v-list-item-icon>
          <v-list-item-content class="text-start">
            <v-list-item-title class="text-body-2">Dashboard</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
    </v-list>

    <v-divider></v-divider>

    <v-list>
      <v-list-item link @click="checkRoute('/menu')">
        <v-list-item-icon>
          <v-icon>mdi-food</v-icon>
        </v-list-item-icon>
        <v-list-item-content class="text-start">
          <v-list-item-title class="text-body-1">Food: Menu</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item link @click="checkRoute('/diet')">
        <v-list-item-icon>
          <v-icon>mdi-nutrition</v-icon>
        </v-list-item-icon>
        <v-list-item-content class="text-start">
          <v-list-item-title class="text-body-1">Clinic: Diet Plans</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <template v-slot:append>
      <v-divider></v-divider>
      <v-list dense v-show="userStore.isLoggedIn">
        <v-list-item>
          <v-list-item-content>
            <v-btn 
              @click="doSignout"
              outlined 
            >
              <v-icon
                left
                dark
              >
                mdi-logout
              </v-icon>
              Sign out
            </v-btn>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-list dense v-show="!userStore.isLoggedIn">
        <v-list-item>
          <v-list-item-content>
            <v-btn 
              @click="openSigninDialog"
              outlined 
            >
              <v-icon
                left
                dark
              >
                mdi-login
              </v-icon>
              Sign in
            </v-btn>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-btn 
              @click="openSignupDialog"
              outlined  
            >
              <v-icon
                left
                dark
              >
                mdi-account-plus
              </v-icon>
              Sign up
            </v-btn>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </template>
    <v-overlay 
      :value="overlay" 
      absolute
    >
      <v-progress-circular
        indeterminate
        size="40"
        width="5"
        color="#f25b47"
      ></v-progress-circular>
    </v-overlay>
  </v-navigation-drawer>
</template>

<style scoped>
.nav-drawer {
  padding-top: 56px;
  position:fixed;
  top:0;
  left:0;
  overflow:hidden;
}
</style>

<script>
import {useUserStore} from '@/store/user'
import {useVsbyStore} from '@/store/vsby'


export default {
  name: "NavDrwr",
  setup() {
    const userStore = useUserStore()
    const vsbyStore = useVsbyStore()
    return {
      userStore,
      vsbyStore,
    }
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener('resize', this.onResize);
    });
  },
  data () {
    return {
      windowHeight: window.innerHeight,
      signoutSuccess: false,
      overlay: false,
    }
  },
  methods: {  
    onResize() {
      this.windowHeight = window.innerHeight;
    },
    openSigninDialog() {
      this.vsbyStore.signinDiagVsby = true;
      this.vsbyStore.navDrwrVsby = false;
    },
    openSignupDialog() {
      this.vsbyStore.signupDiagVsby = true;
      this.vsbyStore.navDrwrVsby = false;
    },
    doSignout() {
      this.overlay = true;
      setTimeout(() => {
        this.userStore.logout();
        this.overlay = false;
      }, 1000);
    },
    checkRoute(path) {
      this.vsbyStore.navDrwrVsby = false;
      if (this.$route.path !== path) {this.$router.push(path);}
      else                           {}
    },
  },
};
</script>