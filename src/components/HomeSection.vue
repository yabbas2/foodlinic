<template>
  <div class="column">
    <div class="col">
      <q-card class="home-card1 q-my-sm" bordered @click="gotoFoodMenu">
        <q-card-section horizontal>
          <q-card-section>
            <div class="q-mt-xs">
              <span class="home-card1-title1">FOOD: </span>
              <span class="home-card1-title2">MENU</span>
            </div>
            <div class="text-body2 q-mt-xs text-white">
              Homemade, <br />Healthy, <br />Tasty!
            </div>
          </q-card-section>

          <q-card-section
            class="col-5 flex flex-center"
            style="margin-left: auto"
          >
            <q-img src="~assets/food_menu.png" />
          </q-card-section>
        </q-card-section>
      </q-card>
    </div>
    <div class="col">
      <q-card class="home-card2 q-my-sm" bordered @click="gotoClinicPlans">
        <q-card-section horizontal>
          <q-card-section>
            <div class="q-mt-xs">
              <span class="home-card2-title1">CLINIC: </span>
              <span class="home-card2-title2">PLANS</span>
            </div>
            <div class="text-body2 q-mt-xs text-secondary">
              Online, <br />Regular follow-up, <br />Affordable!
            </div>
          </q-card-section>

          <q-card-section
            class="col-5 flex flex-center"
            style="margin-left: auto"
          >
            <q-img src="~assets/clinic_plans.jpg" />
          </q-card-section>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Pacifico&display=swap");
.home-card1 {
  border-radius: 30px;
  width: 340px;
  max-height: 150px;
  margin-left: auto;
  margin-right: auto;
  background-color: $secondary;
}
.home-card1-title1 {
  font-family: "Bebas Neue", cursive;
  color: white;
  font-size: 35px;
}
.home-card1-title2 {
  font-family: "Pacifico", cursive;
  color: white;
  font-size: 22px;
}
.home-card2 {
  border-radius: 30px;
  width: 340px;
  max-height: 150px;
  margin-left: auto;
  margin-right: auto;
  border-color: $secondary;
  background-color: white;
}
.home-card2-title1 {
  font-family: "Bebas Neue", cursive;
  color: $secondary;
  font-size: 35px;
}
.home-card2-title2 {
  font-family: "Pacifico", cursive;
  color: $secondary;
  font-size: 22px;
}
</style>

<script setup>
import Router from "../router";

function gotoFoodMenu() {
  Router.push("/menu");
}

function gotoClinicPlans() {
  Router.push("/diet");
}
</script>
