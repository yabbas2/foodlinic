<template>
  <div>
    <TopBar></TopBar>
    <Intro h1="Menu" h2="Homemade, Safe, Tasty"></Intro>
    <Menu></Menu>
    <CartDialog></CartDialog>
    <OrderDialog></OrderDialog>
    <SignupDialog></SignupDialog>
    <SigninDialog></SigninDialog>
    <ProfileDialog></ProfileDialog>
    <BottomBar></BottomBar>
  </div>
</template>

<style scoped>

</style>

<script>
import Intro from "@/components/Intro.vue";
import Menu from "@/components/Menu.vue";
import CartDialog from "@/components/CartDialog.vue";
import TopBar from "@/components/TopBar.vue";
import OrderDialog from "@/components/OrderDialog.vue";
import BottomBar from "@/components/BottomBar.vue";
import SigninDialog from "@/components/SigninDialog.vue";
import SignupDialog from "@/components/SignupDialog.vue";
import ProfileDialog from "@/components/ProfileDialog.vue";


export default {
  name: "MenuView",
  components: {
    TopBar,
    Intro,
    Menu,
    CartDialog,
    OrderDialog,
    SignupDialog,
    SigninDialog,
    ProfileDialog,
    BottomBar,
  },
};
</script>
