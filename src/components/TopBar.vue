<template>
  <v-app-bar
    fixed
    color="#39175c"
    dark
    elevation="5"
    clipped-left
  >
    <v-app-bar-nav-icon @click.stop="vsbyStore.navDrwrVsby=!vsbyStore.navDrwrVsby" style="margin-left: 0rem;">
      <v-icon v-show="!userStore.isLoggedIn">{{mdiMenuSvg}}</v-icon>
      <v-avatar v-show="userStore.isLoggedIn" color="#f25b47" size="33">
        <span class="white--text text-substitle-1 text-uppercase">{{userStore.firstname[0]}}{{userStore.lastname[0]}}</span>
      </v-avatar>
    </v-app-bar-nav-icon>
    <v-spacer></v-spacer>
    <v-toolbar-title>
      <v-container>
        <v-row no-gutters>
          <v-col class="my-auto">
            <v-img :src="require('../assets/logo.jpg')" width="60"></v-img>
          </v-col>
          <v-col class="my-auto">
            <v-img :src="require('../assets/logo-name-wbg.png')" width="120"></v-img>
          </v-col>
        </v-row>
      </v-container>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-badge
      :content="menuStore.cartItemsCount"
      :value="menuStore.cartItemsCount"
      color="#f25b47"
      overlap
      bordered
      offset-x="17"
      offset-y="22"
    >
      <v-btn icon @click="cartBtnClicked">
        <v-icon size="30">{{mdiCartSvg}}</v-icon>
      </v-btn>
    </v-badge>
  </v-app-bar>
</template>

<style scoped>

</style>

<script>
import {mdiCart, mdiMenu} from '@mdi/js'
import {useUserStore} from '@/store/user'
import {useMenuStore} from '@/store/menu'
import {useVsbyStore} from '@/store/vsby'


export default {
  name: "TopBar",
  setup() {
    const userStore = useUserStore()
    const menuStore = useMenuStore()
    const vsbyStore = useVsbyStore()
    return {
      userStore,
      menuStore,
      vsbyStore,
    }
  },
  data() {
    return {
      mdiCartSvg: mdiCart,
      mdiMenuSvg: mdiMenu,
    }
  },
  methods: {
    cartBtnClicked() {
      if ( (this.menuStore.cartItemsCount > 0) && (!this.userStore.isLoggedIn) ) {
        this.vsbyStore.signinDiagVsby = true;
      }
      else {
        this.vsbyStore.cartDiagVsby = true;
      }
    }
  },
};
</script>