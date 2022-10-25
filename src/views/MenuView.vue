<template>
  <div>
    <MainView></MainView>
    <Intro img-src="menu.png"></Intro>
    <Menu></Menu>
    <CartDialog></CartDialog>
  </div>
</template>

<style scoped>

</style>

<script>
import Intro from "@/components/Intro.vue";
import Menu from "@/components/Menu.vue";
import CartDialog from "@/components/CartDialog.vue";
import MainView from "@/views/MainView.vue";


export default {
  name: "MenuView",
  components: {
    MainView,
    Intro,
    Menu,
    CartDialog,
},
};
</script>
