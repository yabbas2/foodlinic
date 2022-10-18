<template>
  <v-app-bar
    fixed
    color="#39175c"
    dark
    elevation="5"
    clipped-left
  >
    <v-app-bar-nav-icon @click.stop="showNavDrwr=!showNavDrwr"></v-app-bar-nav-icon>
    <v-toolbar-title>
      <v-container>
        <v-row no-gutters>
          <!--<v-col class="my-auto">
            <v-img :src="require('../assets/logo.png')" width="60"></v-img>
          </v-col>-->
          <v-col class="my-auto">
            <v-img :src="require('../assets/logo-name.png')" width="120"></v-img>
          </v-col>
        </v-row>
      </v-container>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-badge
      :content="cartCounter"
      :value="cartCounter"
      color="#f25b47"
      overlap
      bordered
      offset-x="17"
      offset-y="22"
    >
      <v-btn icon @click="$emit('cartBtnClicked')">
        <v-icon size="30">mdi-cart</v-icon>
      </v-btn>
    </v-badge>
  </v-app-bar>
</template>

<style scoped>
.logo-img {
  max-height: 40px;
  margin-right: 6px;
}

.logo-h1 {
  font-size: 28px;
  font-weight: 700;
  margin: 0;
  font-family: var(--font-inter);
  color: var(--color-primary);
}

.bg-navbar {
  background: #39175c;
}
</style>

<script>
export default {
  name: "TopBar",
  props: {
    value: Boolean,
    cartCounter: Number,
  },
  computed: {
    showNavDrwr: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      }
    }
  }
};
</script>