<template>
  <v-card tile flat>
    <v-select
      v-model="delvySelected"
      :items="delvyOptions"
      menu-props="auto"
      label="Select Meeting Point"
      prepend-icon="mdi-map-marker"
      class="mx-auto my-auto"
      color="#39175c"
      :rules="[val => validateLocation(val)]"
      :success="validLocation.int"
      :error="!validLocation.ext"
      @input="validLocation.ext=true"
    ></v-select>
    <v-card class="mt-0 mb-6">
      <GmapMap
        :center="delvyMapCenter"
        :zoom="delvyMapZoomLvl"
        style="min-width: 200px; min-height: 300px"
      >
        <GmapMarker
          :position="delvyMarkerPos"
          :clickable="true"
          :draggable="true"
        />
      </GmapMap>
    </v-card>
    <v-menu
      v-model="showDateMenu"
      :close-on-content-click="false"
      :nudge-right="40"
      transition="scale-transition"
      offset-y
      min-width="290px"
      max-width="290px"
    >
      <template v-slot:activator="{on, attrs}">
        <v-text-field
          v-model="delvyDate"
          label="Select Date"
          prepend-icon="mdi-calendar"
          readonly
          color="#39175c"
          v-bind="attrs"
          v-on="on"
          :rules="[val => validateDate(val)]"
          :success="validDate.int"
          :error="!validDate.ext"
        >
        </v-text-field>
      </template>
      <v-date-picker
        v-model="delvyDate"
        :min="minDate"
        :max="maxDate"
        :allowed-dates="allowedDates"
        show-week
        first-day-of-week="1"
        color="#39175c"
        @input="showDateMenu=false;validDate.ext=true;"
      >
      </v-date-picker>
    </v-menu>
    <v-textarea
      v-model="delvyNotes"
      color="#39175c"
      clear-icon="mdi-close-circle"
      rows="1"
      prepend-icon="mdi-comment"
      auto-grow
      counter
      :rules="[val => validateNotes(val) || 'Max 100 characters']"
      :error="!validNotes.ext"
      @input="validNotes.ext=true"
    >
      <template v-slot:label>
        <div>
          Delivery notes <small>(optional)</small>
        </div>
      </template>
    </v-textarea>
  </v-card>
</template>

<style scoped>

</style>

<script>
import axios from 'axios'
import { helpers } from 'gmap-vue';
const { googleMapsApiInitializer } = helpers;

export default {
  name: "Delivery",
  created() {
    this.fetchDeliveryLocations();
  },
  mounted() {
    googleMapsApiInitializer({
      key: 'AIzaSyDIljYPhN1rAHUwXpJmL2YTE6oMSOz4VgQ',
    }, false);
  },
  data() {
    return {
      delvySelected: null,
      delvyOptions: [],
      showDateMenu: false,
      delvyDate: null,
      allowedDates: val => new Date(val).getDay() !== 0 && new Date(val).getDay() !== 6, /*Sundays and Saturdays are not allowed*/
      delvyNotes: '',
      validLocation:  {int: false, ext: true},
      validDate:      {int: false, ext: true},
      validNotes:     {int: false, ext: true},
      delvyDefault: {lat:57.71778786574879, lng:11.972795513941245, zoom_lvl:10},
    }
  },
  methods: {
    collectInfo() {
      return {location: this.delvySelected.name, date: this.delvyDate, notes: this.delvyNotes};
    },
    constructDeliveryObj(jsonData) {
      this.delvyOptions = [];
      for (var idx = 0; idx < jsonData.length; idx++) {
        this.delvyOptions[idx] = 
        {
          value: 
          {
            lat: jsonData[idx].coor_lat,
            lng: jsonData[idx].coor_lng,
            zoom_lvl: jsonData[idx].zoom_lvl,
            name: jsonData[idx].loc_name
          }, 
          text: jsonData[idx].loc_name
        };
      }
      console.log(this.delvyOptions);
    },
    async fetchDeliveryLocations() {
      await axios.get('http://127.0.0.1:9000/foodapis/delivery') /*TODO: change in production to https://foodlinic.pythonanywhere.com/foodapis/delivery*/
        .then(response => {
          this.constructDeliveryObj(response.data);
        })
        .catch(error => {
          console.log(error) /*TODO: better error handling*/
        })
    },
    validateAllInputs() {
      this.validLocation.ext  = this.validLocation.int;
      this.validDate.ext      = this.validDate.int;
      this.validNotes.ext     = this.validNotes.int;
      return (this.validLocation.int && this.validDate.int && this.validNotes.int);
    },
    validateLocation(val) {
      this.validLocation.int = (val !== null);
      return this.validLocation.int;
    },
    validateDate(val) {
      this.validDate.int = (val !== null);
      return this.validDate.int;
    },
    validateNotes(val) {
      this.validNotes.int = (val.length <= 100);
      return this.validNotes.int;
    },
  },
  computed: {
    delvyMarkerPos() {
      if (this.delvySelected === null)  {return {lat: this.delvyDefault.lat, lng: this.delvyDefault.lng};}
      else                              {return {lat: this.delvySelected.lat, lng: this.delvySelected.lng};}
    },
    delvyMapCenter() {
      if (this.delvySelected === null)  {return {lat: this.delvyDefault.lat, lng: this.delvyDefault.lng};}
      else                              {return {lat: this.delvySelected.lat, lng: this.delvySelected.lng};}
    },
    delvyMapZoomLvl() {
      if (this.delvySelected === null)  {return this.delvyDefault.zoom_lvl;}
      else                              {return this.delvySelected.zoom_lvl;}
    },
    minDate() { /*TODO:include the orders time to determine the next available time for delivery - should not be next day only*/
      /* Next available day */
      let minDay = new Date(Date.now());
      minDay.setDate(minDay.getDate() + 1);
      return minDay.toISOString().substring(0, 10);
    },
    maxDate() {
      /* Two-week time frame is the maximum */
      const numWeeks = 2;
      let maxDay = new Date(Date.now());
      maxDay.setDate(maxDay.getDate() + (numWeeks * 7));
      return maxDay.toISOString().substring(0, 10);
    },
  },
}
</script>