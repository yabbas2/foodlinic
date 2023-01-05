<template>
  <q-toolbar inset style="height: 400px">
    <div class="column">
      <div class="col">
        <q-img width="70px" src="~assets/logo.png" />
      </div>
      <div class="col">
        <q-toolbar-title class="toolbar-title">Foodlinic</q-toolbar-title>
      </div>
      <div class="col">
        <div class="toolbar-subtitle">The ultimate gift for your health.</div>
      </div>
      <div class="col text-white q-mt-md self-center">
        <q-btn
          fab-mini
          outline
          flat
          :ripple="false"
          href="https://www.facebook.com/foodlinic/"
          target="_blank"
        >
          <q-icon class="text-white q-mx-xs" size="md">
            <img src="~assets/icons/icon-facebook.svg" />
          </q-icon>
        </q-btn>
        <q-btn
          fab-mini
          flat
          :ripple="false"
          href="https://www.youtube.com/channel/UC4hrCT8Jp8sqSdchMxYNrqA"
          target="_blank"
        >
          <q-icon class="text-white q-mx-xs" size="md">
            <img src="~assets/icons/icon-youtube.svg" />
          </q-icon>
        </q-btn>
        <!--<q-btn fab-mini flat :ripple="false" href="" target="_blank">
              <q-icon class="text-white q-mx-xs" size="md">
                <img src="~assets/icons/icon-instagram.svg" />
              </q-icon>
            </q-btn>-->
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
  font-size: 80px;
}
.toolbar-subtitle {
  text-align: left;
  font-size: large;
  color: white;
}
</style>

<script setup></script>
