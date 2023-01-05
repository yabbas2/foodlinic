<template>
  <q-toolbar inset style="height: 200px">
    <div class="column">
      <div class="col">
        <q-toolbar-title class="toolbar-title">
          {{ props.title }}
        </q-toolbar-title>
      </div>
      <div class="col">
        <div class="toolbar-subtitle">{{ props.subtitle }}</div>
      </div>
    </div>
  </q-toolbar>
</template>

<style scoped lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Pacifico&display=swap");
.toolbar-title {
  color: $secondary;
  font-family: "Bebas Neue", cursive;
  text-align: left;
  font-size: 50px;
}
.toolbar-subtitle {
  text-align: left;
  color: white;
  font-family: "Pacifico", cursive;
  font-size: 20px;
}
</style>

<script setup>
const props = defineProps(["title", "subtitle"]);
</script>
