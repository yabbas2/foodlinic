<template>
  <div>
    <TopBar></TopBar>
    <NavDrwr></NavDrwr>
    <OrderDialog></OrderDialog>
  </div>
</template>

<style scoped>

</style>

<script>
import TopBar from "@/components/TopBar.vue";
import NavDrwr from "@/components/NavDrwr.vue";
import OrderDialog from "@/components/OrderDialog.vue";


export default {
  name: "MainView",
  components: {
    TopBar,
    NavDrwr,
    OrderDialog,
  },
};
</script>