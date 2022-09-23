<template>
  <b-modal 
    :id="modalId" 
    size="lg" 
    title="Extra Large Modal" 
    scrollable
    cancel-disabled
    ok-disabled
    header-class="p-2 border-bottom-0 justify-content-end"
    footer-class="p-2 border-top-0"
    @close="$emit('modalClosed')"
    @hidden="$emit('modalClosed')"
  >
    <template #modal-header="{ close }">
      <b-button pill size="sm" variant="danger" @click="close()">
        <b-icon icon="x" style="width: 25px; height: 25px;"></b-icon>
      </b-button>
    </template>
    <template #modal-footer>
      <p></p>
    </template>

    <b-container>
      <b-row align-v="center" class="text-center">
        <b-col><h4><b>YOUR ORDER</b></h4></b-col>
      </b-row>
      <b-row cols="6" align-v="center" class="item-row mt-4 py-3">
        <b-col cols="6">
          <h6><b>Pasta with Fried Chicken</b></h6>
        </b-col>
        <b-col></b-col>
        <b-col>
          <p><b>1x</b></p>
        </b-col>
        <b-col>
          <p><b>199kr</b></p>
        </b-col>
        <b-col>
          <b-button pill href="#" variant="danger">
            <b-icon icon="trash" scale="1" class="align-middle"></b-icon>
          </b-button>
        </b-col>
        <b-col></b-col>
        <b-col cols="6">
          <b-button pill href="#" variant="danger">
            <b-icon icon="trash" scale="1" class="align-middle"></b-icon>
          </b-button>
        </b-col>
      </b-row>
    </b-container>

  </b-modal>
</template>

<style scoped>
.item-row{
  border-top: 2px dotted black;
  border-bottom: 2px dotted black;
  margin-left: auto;
  margin-right: auto;
}

.input-style {
  max-width: 2rem;
}

/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}
</style>

<script>
export default {
  name: "CartModal",
  props: {
    showModal: Boolean
  },
  mounted() {
    this.$bvModal.hide(this.modalId);
  },
  data() {
    return {
      modalId: 'cartModalId'
    }
  },
  watch: {
    showModal: function(newVal, oldVal) {
      if (newVal) {this.$bvModal.show(this.modalId);}
      else        {this.$bvModal.hide(this.modalId);}
    }
  },
  methods: {
  }
};
</script>