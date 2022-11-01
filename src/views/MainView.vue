<template>
  <div>
    <TopBar></TopBar>
    <NavDrwr></NavDrwr>
    <SignupDialog></SignupDialog>
    <SigninDialog></SigninDialog>
    <OrderDialog></OrderDialog>
  </div>
</template>

<style scoped>

</style>

<script>
import TopBar from "@/components/TopBar.vue";
import NavDrwr from "@/components/NavDrwr.vue";
import SignupDialog from "@/components/SignupDialog.vue";
import SigninDialog from "@/components/SigninDialog.vue";
import OrderDialog from "@/components/OrderDialog.vue";


export default {
  name: "MainView",
  components: {
    TopBar,
    NavDrwr,
    SignupDialog,
    SigninDialog,
    OrderDialog,
  },
};
</script>