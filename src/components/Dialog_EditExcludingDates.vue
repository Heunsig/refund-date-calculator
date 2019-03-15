<template>
  <v-dialog v-model="is_active" persistent max-width="550">
    <v-card>
      <v-card-text class="green lighten-1">
        <h2 class="white--text">Excluding Date Calendar</h2>
        <p class="white--text">Please select all dates that you want to exclude.</p>
      </v-card-text>
      <v-card-text>
        <v-date-picker v-model="excluding_dates" color="green lighten-1" :show-current="false" multiple no-title full-width class="elevation-0"></v-date-picker>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn flat color="grey" @click="is_active = false">Close</v-btn>
        <v-btn flat color="primary" @click="confirm()">Confirm</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import bus from '../bus.js'
export default {
  data (){
    return {
      is_active: false,
      excluding_dates: []
    }
  },
  watch: {
    is_active (new_v) {
      if (!new_v) {
        this.excluding_dates = []
      }
    }
  },
  methods :{
    confirm () {
      let formatted_dates = []

      this.excluding_dates.forEach(day => {
        formatted_dates.push(this.$moment(day).format('MM/DD/Y'))
      })

      bus.$emit('result:excluding_dates', {
        result: formatted_dates
      })

      this.is_active = false
    },
  },
  created () {
    bus.$on('dialog:excluding_dates_calendar', payload => {
      this.is_active = true
      let re_formatted_dates = []
      payload.excluding_dates.forEach(day => {
        re_formatted_dates.push(this.$moment(day, 'MM/DD/Y').format('YYYY-MM-DD'))
      })

      this.excluding_dates = re_formatted_dates
    })
  }
}
</script>