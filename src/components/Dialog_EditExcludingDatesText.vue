<template>
  <v-dialog v-model="is_active" persistent max-width="550">
    <v-card>
      <v-card-text class="green lighten-1">
        <h2 class="white--text">Excluding Date Textarea</h2>
        <p class="white--text">
          Please input all dates that you want to exclude.<br/>
          The format of a date must be "mm/dd/yyyy",and the dates are separated by ",".<br/>
          Ex) 03/25/2019, 04/17/2019
        </p>
      </v-card-text>
      <v-card-text>
        <el-form ref="form" :model="form" :rules="rules" label-position="top">
          <el-form-item label="Excluding dates" prop="excluding_dates">
            <el-input
              type="textarea"
              :rows="8"
              placeholder="Please input excluding dates"
              v-model="form.excluding_dates">
            </el-input>
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
    var validate_holidates = (rule, value, callback) => {
      let holidates = this.split_holidates(value)
      let result = this.validate_date_format(holidates)

      if (result  || holidates.length === 0) {
        callback()
      } else {
        callback(new Error())
      }
    }
    return {
      is_active: false,
      form: {
        excluding_dates: ''
      },
      rules: {
        excluding_dates: [
          { validator: validate_holidates, message: 'Please check the date formats of holidates', trigger: 'blur' }
        ],
      }
    }
  },
  watch: {
    is_active (new_v) {
      if (!new_v) {
        this.$refs['form'].resetFields()
      }
    }
  },
  methods: {
    confirm () {
      this.$refs['form'].validate((valid) => {
          if (valid) {
            bus.$emit('result:excluding_dates_text', {
              result: this.split_holidates(this.form.excluding_dates)
            })
            
            this.is_active = false
          }
      })
    },
    make_string (arr) {
      let result = ''
      for (let i = 0 ; i < arr.length ; i++) {
        if (i >= arr.length - 1) {
          result += arr[i]
        } else {
          result += arr[i] + ', '
        }
      }

      return result
    },
    split_holidates (holidates_string) {
      let holidates = []
      let split_holidates = holidates_string.split(',')
      if(split_holidates.length === 1 && split_holidates[0] === '') {
        split_holidates = []
      }

      split_holidates.forEach((item, index) => {
        holidates[index] = item.trim()
      })

      return holidates
    },
    validate_date_format (holidates) {
      let re = /^((((0[13578])|([13578])|(1[02]))[\/](([1-9])|([0-2][0-9])|(3[01])))|(((0[469])|([469])|(11))[\/](([1-9])|([0-2][0-9])|(30)))|((2|02)[\/](([1-9])|([0-2][0-9]))))[\/]\d{4}$|^\d{4}$/
      return holidates.every(item => {
        if (re.test(item.trim())) {
          return true
        }
      })
    },
  },
  created () {
    bus.$on('dialog:excluding_dates_text', payload => {
      this.is_active = true
      if (payload.excluding_dates) {
        console.log('hi')
        this.form.excluding_dates = this.make_string(payload.excluding_dates)  
      }
    })
  }
}
</script>