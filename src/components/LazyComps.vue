<template>
  <div>
    <CartDialog></CartDialog>
    <OrderDialog></OrderDialog>
    <SignupDialog></SignupDialog>
    <SigninDialog></SigninDialog>
    <ProfileDialog></ProfileDialog>
  </div>
</template>

<style scoped>

</style>

<script>
export default {
  name: "LazyComps",
  components: {
    CartDialog:     ()=>import("@/components/CartDialog.vue"),
    OrderDialog:    ()=>import("@/components/OrderDialog.vue"),
    SignupDialog:   ()=>import("@/components/SignupDialog.vue"),
    SigninDialog:   ()=>import("@/components/SigninDialog.vue"),
    ProfileDialog:  ()=>import("@/components/ProfileDialog.vue"),
  }
};
</script>
    