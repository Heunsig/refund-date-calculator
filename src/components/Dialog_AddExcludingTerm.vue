<template>
  <v-dialog v-model="is_active" persistent max-width="500">
    <v-card>
      <v-card-text class="green lighten-1">
        <h2 class="white--text">Excluding Term</h2>
        <p class="white--text">
          Please select the start date and end date, and then all dates between the start date and end date are excluded.
        </p>
      </v-card-text>
      <v-card-text>
        <el-form ref="form" :model="form" :rules="rules" label-position="top">
          <el-form-item label="Dates" prop="term">
            <el-date-picker
              style="width:100%;"
              v-model="form.term"
              type="daterange"
              range-separator="To"
              start-placeholder="Start date"
              end-placeholder="End date"
              format="MM/dd/yyyy"
              :clearable="false"
            >
            </el-date-picker>
          </el-form-item>
        </el-form>
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
  data () {
    return {
      is_active: false,
      form: {
        term: ''
      },
      rules: {
        term: [
          { required: true, message: 'Please input term', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    is_active (new_v) {
      if (new_v) {
        this.$refs['form'].resetFields()
      }
    }
  },
  methods: {
    confirm () {
      this.$refs['form'].validate((valid) => {
          if (valid) {
            bus.$emit('result:excluding_term', {
              result: this.get_dates_between_two_dates(this.form.term)
            })

            this.is_active = false
          }
      })
    },
    get_dates_between_two_dates (term_arr) {
      let start = this.$moment(term_arr[0])
      let end = this.$moment(term_arr[1])

      let diff_days = end.diff(start, 'days')
      let result = []

      result.push(start.format('MM/DD/Y'))
      for (let i = 0 ; i < diff_days ; i++)
      {
        result.push(start.add(1, 'days').format('MM/DD/Y'))
      }

      return result
    }
  },
  created () {
    bus.$on('dialog:excluding_term', payload => {
      this.is_active = true
    })
  }
}
</script>