<template>
  <v-card tile flat>
    <v-select
      ref="select"
      v-model="locSelected"
      :items="locOptions"
      menu-props="auto"
      label="Select Meeting Point"
      hide-details
      append-icon="mdi-map-marker"
      single-line
      class="mx-auto my-auto"
      color="#f25b47"
      solo
      @change="setMapLocation();inputChangedEvent();"
    ></v-select>
    <v-card class="mt-6">
      <GmapMap
        :center="locMapCenter"
        :zoom="locMapZoomLvl"
        style="min-width: 200px; min-height: 300px"
      >
        <GmapMarker
          :position="locMarkerPos"
          :clickable="true"
          :draggable="true"
        />
      </GmapMap>
    </v-card>
    <v-divider></v-divider>
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
          v-model="date"
          label="Select Date"
          prepend-icon="mdi-calendar"
          readonly
          color="#f25b47"
          v-bind="attrs"
          v-on="on"
        >
        </v-text-field>
      </template>
      <v-date-picker
        v-model="date"
        :min="minDate"
        :max="maxDate"
        :allowed-dates="allowedDates"
        show-week
        first-day-of-week="1"
        color="#39175c"
        @input="showDateMenu=false;inputChangedEvent();"
      >
      </v-date-picker>
    </v-menu>
    <v-menu
      v-model="showTimeMenu"
      :close-on-content-click="false"
      :nudge-right="40"
      transition="scale-transition"
      offset-y
      min-width="290px"
      max-width="290px"
    >
    <template v-slot:activator="{on, attrs}">
      <v-text-field
        v-model="time"
        label="Select time"
        prepend-icon="mdi-clock-time-four-outline"
        readonly
        color="#f25b47"
        v-bind="attrs"
        v-on="on"
      >
      </v-text-field>
    </template>
    <v-time-picker
      v-model="time"
      full-width
      format="24hr"
      :allowed-hours="allowedHours"
      :allowed-minutes="allowedMinutes"
      color="#39175c"
      @input="showTimeMenu=false;inputChangedEvent();"
    >
    </v-time-picker>
    </v-menu>
    <v-textarea
      v-model="notes"
      color="#f25b47"
      clearable
      clear-icon="mdi-close-circle"
      rows="1"
      prepend-icon="mdi-comment"
      auto-grow
      :rules="notesRule"
      counter
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
    this.fetchLocations();
  },
  mounted() {
    googleMapsApiInitializer({
      key: 'AIzaSyDIljYPhN1rAHUwXpJmL2YTE6oMSOz4VgQ',
    }, false);
  },
  data() {
    return {
      locSelected: null,
      locOptions: [],
      showDateMenu: false,
      showTimeMenu: false,
      date: null,
      allowedDates: val => new Date(val).getDay() !== 0 && new Date(val).getDay() !== 6, /*Sundays and Saturdays are not allowed*/
      time: null,
      allowedHours: [10, 17, 22],
      allowedMinutes: [0],
      notesRule: [v => v.length <= 100 || 'Max 100 characters'],
      notes: '',
    }
  },
  methods: {
    constructLocationObj(jsonData) {
      this.locOptions = [];
      for (var idx = 0; idx < jsonData.length; idx++) {
        this.locOptions[idx] = 
        {
          value: 
          {
            lat: jsonData[idx].coor_lat,
            lng: jsonData[idx].coor_lng,
            zoom_lvl: jsonData[idx].zoom_lvl
          }, 
          text: jsonData[idx].name
        };
      }
      console.log(this.locOptions);
    },
    async fetchLocations() {
      await axios.get('http://127.0.0.1:9000/foodapis/location') /*TODO: change in production to https://foodlinic.pythonanywhere.com/foodapis/location*/
        .then(response => {
          this.constructLocationObj(response.data);
        })
        .catch(error => {
          console.log(error) /*TODO: better error handling*/
        })
    },
    setMapLocation() {
      console.log(this.locSelected);
      console.log(this.notes.substring(0, 100));
    },
    inputChangedEvent() {
      this.$emit('inputChanged', (this.time!==null && this.date!==null && this.locSelected!==null));
    }
  },
  computed: {
    locMarkerPos() {
      if (this.locSelected === null)  {return {lat:57.71778786574879, lng:11.972795513941245};}
      else                            {return {lat: this.locSelected.lat, lng: this.locSelected.lng};}
    },
    locMapCenter() {
      if (this.locSelected === null)  {return {lat:57.71778786574879, lng:11.972795513941245};}
      else                            {return {lat: this.locSelected.lat, lng: this.locSelected.lng};}
    },
    locMapZoomLvl() {
      if (this.locSelected === null)  {return 10;}
      else                            {return 15;}
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