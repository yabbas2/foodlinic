<template>
  <div>
    <MainComp></MainComp>
    <UserComp></UserComp>
    <Intro h1="Menu" h2="Homemade, Safe, Tasty"></Intro>
    <Menu></Menu>
    <CartDialog></CartDialog>
  </div>
</template>

<style scoped>

</style>

<script>
import {useVsbyStore} from '@/store/vsby'
import Intro from "@/components/Intro.vue";
import Menu from "@/components/Menu.vue";
import CartDialog from "@/components/CartDialog.vue";
import MainComp from "@/components/MainComp.vue";
import UserComp from "@/components/UserComp.vue";


export default {
  name: "MenuView",
  setup() {
    const vsbyStore = useVsbyStore()
    return {
      vsbyStore,
    }
  },
  components: {
    MainComp,
    UserComp,
    Intro,
    Menu,
    CartDialog,
  },
};
</script>
