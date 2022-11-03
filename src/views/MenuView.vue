<template>
  <div>
    <TopBar></TopBar>
    <Intro h1="Menu" h2="Homemade, Safe, Tasty"></Intro>
    <Menu></Menu>
    <BottomBar></BottomBar>
    <LazyComps v-if="vsbyStore.lazyLoad"></LazyComps>
  </div>
</template>

<style scoped>

</style>

<script>
import {useVsbyStore} from '@/store/vsby'
import Intro from "@/components/Intro.vue"
import Menu from "@/components/Menu.vue"
import TopBar from "@/components/TopBar.vue"
import BottomBar from "@/components/BottomBar.vue"


export default {
  name: "MenuView",
  setup() {
    const vsbyStore = useVsbyStore()
    return {
      vsbyStore,
    }
  },
  components: {
    TopBar,
    Intro,
    Menu,
    BottomBar,
    LazyComps: ()=>import("@/components/LazyComps.vue"),
  },
};
</script>
