<template>
  <v-card tile flat>
    <v-container fluid>
      <v-row>
        <v-col>
          <v-text-field
            v-model="form.firstName"
            color="#f25b47"
            label="First name"
            type="text"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            v-model="form.secondName"
            color="#f25b47"
            label="Second name"
            type="text"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-container>
    <!--<vue-tel-input
      v-model="form.phoneNumber"
      defaultCountry="se"
      :autoDefaultCountry="false"
      :validCharactersOnly="true"
      :dropdownOptions="phoneDropdownOpts"
      :inputOptions="phoneInputOpts"
    ></vue-tel-input>-->
  </v-card>
</template>

<style scoped>

</style>

<script>
export default {
  name: "Checkout",
  data() {
    return {
      form: {firstName:'', secondName:'', phoneNumber:''},
      phoneDropdownOpts: {disabled:true, showDialCodeInList:true, showDialCodeInSelection:false, showFlags:true, showSearchBox:false, tabindex:0, width:'390px'},
      phoneInputOpts: {autocomplete:'off', autofocus:false, describedby:'', id:'', maxlength:12, name:'telephone', showDialCode:true, placeholder:'Phone number', readonly:false, required:false, tabindex:0, type:'tel', styleClasses:''},
    }
  },
  methods: {
  },
}
</script>