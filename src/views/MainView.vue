<template>
  <div>
    <TopBar></TopBar>
    <NavDrwr></NavDrwr>
    <SignupDialog></SignupDialog>
    <SigninDialog></SigninDialog>
  </div>
</template>

<style scoped>

</style>

<script>
import TopBar from "@/components/TopBar.vue";
import NavDrwr from "@/components/NavDrwr.vue";
import SignupDialog from "@/components/SignupDialog.vue";
import SigninDialog from "@/components/SigninDialog.vue";


export default {
  name: "MainView",
  components: {
    TopBar,
    NavDrwr,
    SignupDialog,
    SigninDialog,
  },
};
</script>