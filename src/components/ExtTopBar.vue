<template>
  <q-toolbar inset style="height: 250px">
    <div class="column">
      <div class="col">
        <q-img width="280px" src="~assets/logo-wfg-tbg.png" />
      </div>
      <div class="col q-mt-lg">
        <div class="toolbar-subtitle">The ultimate gift for your health.</div>
      </div>
      <div class="col text-white q-mt-md self-start">
        <q-btn
          fab-mini
          outline
          flat
          :ripple="false"
          href="https://www.facebook.com/foodlinic/"
          target="_blank"
        >
          <q-icon class="q-mx-xs" size="md">
            <img
              src="https://cdn.tools.unlayer.com/social/icons/circle-white/facebook.png"
            />
          </q-icon>
        </q-btn>
        <q-btn
          fab-mini
          flat
          :ripple="false"
          href="https://www.youtube.com/channel/UC4hrCT8Jp8sqSdchMxYNrqA"
          target="_blank"
        >
          <q-icon class="q-mx-xs" size="md">
            <img
              src="https://cdn.tools.unlayer.com/social/icons/circle-white/youtube.png"
            />
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

.toolbar-subtitle {
  text-align: left;
  font-size: large;
  color: white;
}
</style>

<script setup></script>
