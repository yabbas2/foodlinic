<template>
  <v-card tile flat>
    <div>
      <v-text-field
        v-model="form.firstName"
        color="#39175c"
        label="First name"
        type="text"
        :rules="[val => val.length != 0, val => validateFirstName(val)]"
        :success="validFirstName.int"
        :error="!validFirstName.ext"
        @input="validFirstName.ext=true"
      ></v-text-field>
      <v-text-field
        v-model="form.secondName"
        color="#39175c"
        label="Second name"
        type="text"
        :rules="[val => val.length != 0, val => validateSecondName(val)]"
        :success="validSecondName.int"
        :error="!validSecondName.ext"
        @input="validSecondName.ext=true"
      ></v-text-field>
      <v-text-field
        v-model="form.email"
        color="#39175c"
        label="Email"
        type="text"
        :rules="[val => val.length != 0, val => validateEmail(val)]"
        :success="validEmail.int"
        :error="!validEmail.ext"
        @input="validEmail.ext=true"
      ></v-text-field>
      <v-text-field
        v-model="form.phoneNumber"
        color="#39175c"
        label="Phone number"
        type="text"
        :rules="[val => val.length != 0, val => validatePhone(val)]"
        :success="validPhone.int"
        :error="!validPhone.ext"
        @input="validPhone.ext=true"
      ></v-text-field>
    </div>
  </v-card>
</template>

<style scoped>

</style>

<script>
export default {
  name: "Contact",
  data() {
    return {
      form: {firstName:'', secondName:'', phoneNumber:'', email:''},
      validFirstName:   {int: false, ext: true},
      validSecondName:  {int: false, ext: true},
      validEmail:       {int: false, ext: true},
      validPhone:       {int: false, ext: true},
      namePattern: /^[a-zA-Z\-]+$/,
      emailPattern: /^[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/,
      phonePattern: /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/,
    }
  },
  methods: {
    collectInfo() {
      return this.form;
    },
    validateAllInputs() {
      this.validFirstName.ext   = this.validFirstName.int;
      this.validSecondName.ext  = this.validSecondName.int;
      this.validEmail.ext       = this.validEmail.int;
      this.validPhone.ext       = this.validPhone.int;
      return (this.validPhone.int && this.validEmail.int && this.validFirstName.int && this.validSecondName.int);
    },
    validateFirstName(val) {
      this.validFirstName.int = this.namePattern.test(val.toLowerCase());
      return this.validFirstName.int;
    },
    validateSecondName(val) {
      this.validSecondName.int = this.namePattern.test(val.toLowerCase());
      return this.validSecondName.int;
    },
    validateEmail(val) {
      this.validEmail.int = this.emailPattern.test(val.toLowerCase());
      return this.validEmail.int;
    },
    validatePhone(val) {
      this.validPhone.int = this.phonePattern.test(val.toLowerCase());
      return this.validPhone.int;
    },
  },
}
</script>