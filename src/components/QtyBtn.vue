<template>
  <div class="row inline no-wrap flex-center main-div">
    <q-btn
      color="secondary"
      flat
      rounded
      :ripple="false"
      @click="decrementCount"
      style="padding: 0px"
    >
      <q-icon size="35px" :name="outlinedRemoveCircleOutline"></q-icon>
    </q-btn>
    <q-input
      dense
      hide-bottom-space
      readonly
      rounded
      outlined
      :model-value="props.modelValue"
      type="number"
      bg-color="secondary"
      :input-style="{
        textAlign: 'center',
        fontWeight: 'bold',
        color: 'white',
        fontSize: '15px',
      }"
    />
    <q-btn
      color="secondary"
      flat
      rounded
      :ripple="false"
      @click="incrementCount"
      style="padding: 0px"
    >
      <q-icon size="35px" :name="outlinedAddCircleOutline"></q-icon>
    </q-btn>
  </div>
</template>

<style lang="scss" scoped>
.main-div {
  max-width: 120px;
}
</style>

<script setup>
import {
  outlinedRemoveCircleOutline,
  outlinedAddCircleOutline,
} from "@quasar/extras/material-icons-outlined";

const props = defineProps(["modelValue"]);
const emit = defineEmits(["update:modelValue"]);

function incrementCount() {
  if (props.modelValue < 10) {
    emit("update:modelValue", props.modelValue + 1);
  } else {
    /* do nothing, the upper limit is 10 */
  }
}

function decrementCount() {
  if (props.modelValue > 0) {
    emit("update:modelValue", props.modelValue - 1);
  } else {
    /* do nothing, the lower limit is 0 */
  }
}
</script>
