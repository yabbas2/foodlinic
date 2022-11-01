<template>
  <div>
    <SignupDialog></SignupDialog>
    <SigninDialog></SigninDialog>
  </div>
</template>

<style scoped>

</style>

<script>
import SignupDialog from "@/components/SignupDialog.vue";
import SigninDialog from "@/components/SigninDialog.vue";


export default {
  name: "UserComp",
  components: {
    SignupDialog,
    SigninDialog,
  },
};
</script>