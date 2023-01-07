<template>
  <q-toolbar inset style="height: 100px">
    <div class="full-width column flex-center">
      <div class="col">
        <q-toolbar-title class="toolbar-title">
          {{ props.title }}
        </q-toolbar-title>
      </div>
      <div class="row full-width bg-grey-1 bottom-round"></div>
    </div>
  </q-toolbar>
</template>

<style scoped lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Pacifico&display=swap");
.toolbar-title {
  color: white;
  font-family: "Bebas Neue", cursive;
  text-align: left;
  font-size: 50px;
}
.bottom-round {
  //border: 1px solid $secondary;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  height: 30px;
}
.q-toolbar--inset {
  padding-left: 0px !important;
  padding-right: 0px !important;
}
</style>

<script setup>
const props = defineProps(["title"]);
</script>
