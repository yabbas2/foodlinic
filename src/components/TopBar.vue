<template>
	<div>
    <b-navbar toggleable="lg" fixed="top" type="dark" class="bg-navbar">
      <b-navbar-brand class="d-flex align-items-center" href="#">
        <img class="logo-img" src="../assets/logo.png" alt="">
        <h1 class="logo-h1">foodlinic</h1>
      </b-navbar-brand>
      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <b-nav-form>
          <b-button pill size="sm" class="cart-btn my-2 my-sm-0" type="button" variant="danger" @click="$emit('cartBtnClicked')">
            <b-icon font-scale="1.5" icon="cart-fill"></b-icon>
            <b-badge pill variant="light">{{cartCounter}}<span class="sr-only">cart counter</span></b-badge>
          </b-button>
        </b-nav-form>
      </b-navbar-nav>
    </b-navbar>
  </div>
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
    cartCounter: Number
  }
};
</script>