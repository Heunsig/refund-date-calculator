<template>
<el-form ref="form" :model="form" :rules="rules" label-position="top">
  <el-row :gutter="20">
    <el-col :span="13">
      <v-container grid-list-lg fluid class="pa-0">
        <v-layout wrap>
          <v-flex xs12>
            <el-form-item label="Business Days" prop="business_days">
              <el-checkbox 
                :indeterminate="isIndeterminate" 
                v-model="checkAll" 
                @change="handleCheckAllChange"
              >
                Check all
              </el-checkbox>
              <el-checkbox-group v-model="form.business_days" @change="handleCheckedCitiesChange">
                <el-checkbox v-for="day in days" :label="day.value" :key="day.value">{{day.label}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </v-flex>
          <v-flex xs6>
            <v-card class="elevation-0 transparent">
              <v-card-title class="pa-0">
                <h5>Excluding Dates</h5>
                <v-spacer></v-spacer>
                <v-btn small icon @click="dialog_edit_excluding_date_calendar()" class="pa-0 ma-0">
                  <v-icon small color="success">event</v-icon>
                </v-btn>
                <v-btn small icon @click="dialog_edit_excluding_date_text()" class="pa-0 ma-0">
                  <v-icon small color="success">edit</v-icon>
                </v-btn>
                <v-btn small icon @click="clear_excluding_dates()" class="pa-0 ma-0">
                  <v-icon small color="red darken-1">clear</v-icon>
                </v-btn>
              </v-card-title>
              <v-card-text class="pa-0" style="height: 150px; overflow: auto;">
                <v-list dense class="transparent">
                  <template v-for="day in form.excluding_dates">
                    <v-list-tile style="border-bottom: 1px solid #fff; background:#efefef;">
                      <v-list-tile-content>
                        <v-list-tile-title>{{ day }}</v-list-tile-title>
                      </v-list-tile-content>
                      <v-list-tile-action>
                        <v-btn icon small @click="delete_day(day)">
                          <v-icon small color="grey lighten-1">clear</v-icon>
                        </v-btn>
                      </v-list-tile-action>
                    </v-list-tile>
                  </template>
                </v-list>
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex xs6>
            <v-card class="elevation-0 transparent">
              <v-card-title class="pa-0">
                <h5>Excluding Terms</h5>
                <v-spacer></v-spacer>
                <v-btn small icon @click="dialog_add_excluding_term()" class="pa-0 ma-0">
                  <v-icon small color="success">add</v-icon>
                </v-btn>
                <v-btn small icon @click="clear_excluding_terms()" class="pa-0 ma-0">
                  <v-icon small color="red darken-1">clear</v-icon>
                </v-btn>
              </v-card-title>
              <v-card-text class="pa-0" style="height: 150px; overflow: auto;" >
                <v-list dense class="transparent">
                  <template v-for="term in form.excluding_terms">
                    <v-list-tile style="border-bottom: 1px solid #fff; background:#efefef;">
                      <v-list-tile-content>
                        <v-list-tile-title>{{ term[0] }} ~ {{ term[term.length - 1] }}</v-list-tile-title>
                      </v-list-tile-content>
                      <v-list-tile-action>
                        <v-btn icon small @click="delete_term(term)">
                          <v-icon small color="grey lighten-1">clear</v-icon>
                        </v-btn>
                      </v-list-tile-action>
                    </v-list-tile>
                  </template>
                </v-list>
              </v-card-text>
            </v-card>
          </v-flex>
          <!-- <el-form-item label="Holidays" prop="holidays">
            <el-input
              type="textarea"
              :rows="4"
              placeholder="Please input holidays"
              v-model="form.holidays">
            </el-input>
          </el-form-item> -->
          <v-flex xs12>
            <el-form-item label="Percentage" prop="percentage">
              <el-input 
                placeholder="Please input percentage" 
                v-model.number="form.percentage"
              >
                 <template slot="append">%</template>
              </el-input>
            </el-form-item>
          </v-flex>
        </v-layout>
      </v-container>
    </el-col>
    <el-col :span="11">
      <el-form-item label="Dates" prop="dates">
        <el-date-picker
          style="width:100%;"
          v-model="form.dates"
          type="daterange"
          range-separator="To"
          start-placeholder="Start date"
          end-placeholder="End date"
          format="MM/dd/yyyy"
          :clearable="false"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" style="width:100%;margin-top:20px;">Get Result</el-button>
      </el-form-item>
      <el-card shadow="always" :body-style="{width: '100%'}" v-if="is_result_done">
        <h2><strong>Result</strong><small style="margin-left: 5px;">{{ result.start_date }} ~ {{ result.completion_date }} <!-- ({{result.weeks}} {{result.weeks === 1 ? 'week':'weeks'}}) --></small></h2>
        <ul class="ca-list">
          <li>
            <div class="ca-list-item-title"><strong>Refund Date</strong></div>
            <div class="ca-list-item-value">{{ result.refund_date }}</div>
          </li>
          <li>
            <div class="ca-list-item-title"><strong>Study Days</strong></div>
            <div class="ca-list-item-value">{{ result.study_days }}</div>
          </li>
          <li>
            <div class="ca-list-item-title"><strong>Refund Days</strong></div>
            <div class="ca-list-item-value">{{ result.refund_days }}</div>
          </li>
        </ul>
      </el-card>
    </el-col>
  </el-row>
</el-form>
</template>
<script>
  import bus from '../bus.js'

  export default {
    data() {
      // var validate_holidays = (rule, value, callback) => {
      //   let holidays = this.split_holidays(value)
      //   let result = this.validate_date_format(holidays)

      //   if (result  || holidays.length === 0) {
      //     callback()
      //   } else {
      //     callback(new Error())
      //   }
      // }
      return {
        // picker: [],
        // menu1: false,
        days: [
          { label: 'Sun', value: 0 },
          { label: 'Mon', value: 1 },
          { label: 'Tue', value: 2 },
          { label: 'Wed', value: 3 },
          { label: 'Thu', value: 4 },
          { label: 'Fri', value: 5 },
          { label: 'Sat', value: 6 }
        ],
        form: {
          business_days: [],
          // holidays: '',
          percentage: null,
          dates: [],
          excluding_dates: [],
          excluding_terms: []
        },
        checkAll: false,
        isIndeterminate: false,
        rules: {
          business_days: [
            { required: true, message: 'Please select a day at least', trigger: 'blur' }
          ],
          // holidays: [
          //   { validator: validate_holidays, message: 'Please check the date formats of holidays', trigger: 'blur' }
          // ],
          percentage: [
            { required: true, message: 'Please input percentage', trigger: 'blur' },
            { min: 1, max: 100, type:'number', message: 'Length should be 1 to 100', trigger: 'blur' } 
          ],
          dates: [
            { required: true, message: 'Please input dates', trigger: 'blur' }
          ]
        },
        is_result_done: false,
        result: {
          start_date: '',
          completion_date: '',
          refund_date: '',
          study_days: 0,
          refund_days: 0,
          // weeks: 0
        }
      }
    },
    watch: {
      form: {
        handler () {
          this.is_result_done = false
        },
        deep: true
      }
    },
    methods: {
      delete_day (day) {
        this.$confirm('Do you want to remove this day?', 'Warning', {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          let index = this.form.excluding_dates.indexOf(day)
          this.form.excluding_dates.splice(index, 1)

          this.$message({
            type: 'success',
            message: 'Successfully removed the day',
            duration: 2000
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: 'Canceled removing the day',
            duration: 2000
          });         
        })
      },
      delete_term (term) {
        this.$confirm('Do you want to remove this term?', 'Warning', {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          let index = this.form.excluding_terms.indexOf(term)
          this.form.excluding_terms.splice(index, 1)

          this.$message({
            type: 'success',
            message: 'Successfully removed the term',
            duration: 2000
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: 'Canceled removing the term',
            duration: 2000
          });         
        })
      },
      clear_excluding_terms () {
        this.$confirm('Do you want to clear all excluding terms?', 'Warning', {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          this.form.excluding_terms = []
          // this.$refs['calculator'].clear_all()
          this.$message({
            type: 'success',
            message: 'Successfully cleared all excluding terms',
            duration: 2000
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: 'Canceled clearing excluding terms',
            duration: 2000
          });          
        });
      },
      clear_excluding_dates () {
        this.$confirm('Do you want to clear all excluding dates?', 'Warning', {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          this.form.excluding_dates = []
          // this.$refs['calculator'].clear_all()
          this.$message({
            type: 'success',
            message: 'Successfully cleared all excluding dates',
            duration: 2000
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: 'Canceled clearing excluding dates',
            duration: 2000
          });          
        });
      },
      dialog_add_excluding_term () {
        bus.$emit('dialog:excluding_term')
      },
      dialog_edit_excluding_date_calendar () {
        bus.$emit('dialog:excluding_dates_calendar', {
          excluding_dates: this.form.excluding_dates
        })
      },
      dialog_edit_excluding_date_text () {
        bus.$emit('dialog:excluding_dates_text', {
          excluding_dates: this.form.excluding_dates
        })
      },  
      handleCheckAllChange(val) {
        let all_days = []
        this.days.forEach(day => {
          all_days.push(day.value)
        })

        this.form.business_days = val ? all_days : [];
        this.isIndeterminate = false
      },
      handleCheckedCitiesChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.days.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.days.length;
      },
      concat_excluding_dates (excluding_dates, excluding_terms) {
        let result = excluding_dates

        for(let i = 0 ; i < excluding_terms.length ; i++) {
          result = result.concat(excluding_terms[i])
          // result = result.concat(
          //   this.get_dates_between_two_dates(excluding_terms[i])
          // )
        }

        return result
      },
      onSubmit () {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            // let holidays = this.split_holidays(this.form.holidays)
            // let holidays = this.form.excluding_dates
            let holidays = this.concat_excluding_dates(this.form.excluding_dates, this.form.excluding_terms)
            console.log('holi', holidays)
            // console.log('holidays', holidays)
            this.is_result_done = true
            this.result.refund_date = this.make_result(holidays, this.form.business_days, this.$moment(this.form.dates[0]).format('MM/DD/YYYY'), this.$moment(this.form.dates[1]).format('MM/DD/YYYY'), this.form.percentage/100)
            this.result.start_date = this.$moment(this.form.dates[0]).format('MM/DD/YYYY')
            this.result.completion_date = this.$moment(this.form.dates[1]).format('MM/DD/YYYY')
            // this.result.weeks = this.$moment(this.form.dates[1]).diff(this.$moment(this.form.dates[0]), 'weeks') + 1
            // console.log('ee', this.result.weeks)
          } else {
            // console.log('error submit!!');
            return false;
          }
        });
      },
      // split_holidays (holidays_string) {
      //   let holidays = []
      //   let split_holidays = holidays_string.split(',')
      //   if(split_holidays.length === 1 && split_holidays[0] === '') {
      //     split_holidays = []
      //   }

      //   split_holidays.forEach((item, index) => {
      //     holidays[index] = item.trim()
      //   })

      //   return holidays
      // },
      // validate_date_format (holidays) {
      //   let re = /^((((0[13578])|([13578])|(1[02]))[\/](([1-9])|([0-2][0-9])|(3[01])))|(((0[469])|([469])|(11))[\/](([1-9])|([0-2][0-9])|(30)))|((2|02)[\/](([1-9])|([0-2][0-9]))))[\/]\d{4}$|^\d{4}$/
      //   return holidays.every(item => {
      //     if (re.test(item.trim())) {
      //       return true
      //     }
      //   })
      // },
      make_result (holidays, business_days, start_date, completion_date, percentage) {
        this.store_data_to_localstorage()
        this.$moment.updateLocale('us', {
          holidays: holidays,
          holidayFormat: 'MM/DD/YYYY',
          workingWeekdays: business_days
        })

        let diff = this.$moment(completion_date, 'MM/DD/YYYY').businessDiff(this.$moment(start_date, 'MM/DD/YYYY'))
        if (!holidays.includes(completion_date)) {
          diff = diff + 1
        }

        let a = Math.ceil((diff) * percentage) - 1
        this.result.study_days = diff
        this.result.refund_days = Math.ceil((diff) * percentage)

        return this.$moment(start_date, 'MM/DD/YYYY').businessAdd(a).format('MM/DD/YYYY')
      },
      // test (business_days, start_date, completion_date) {

      //   // date = moment(date); // use a clone
      //   // while (days > 0) {
      //   //   date = date.add(1, 'days');
      //   //   // decrease "days" only if it's a weekday.
      //   //   if (date.isoWeekday() !== 6 && date.isoWeekday() !== 7) {
      //   //     days -= 1;
      //   //   }
      //   // }
      //   // return date;
      // },
      store_data_to_localstorage () {
        if (typeof(Storage) !== "undefined") {
          // localStorage.setItem("business_days", this.form.business_days)
          // localStorage.setItem("holidays", this.form.holidays)
          // localStorage.setItem("percentage", this.form.percentage)
          // 
          localStorage.setItem("business_days", this.form.business_days)
          localStorage.setItem("excluding_dates", JSON.stringify(this.form.excluding_dates))
          localStorage.setItem("excluding_terms", JSON.stringify(this.form.excluding_terms))
          localStorage.setItem("percentage", this.form.percentage)
        }
      },
      clear_dates () {
        this.form.dates = []
        this.$refs['form'].clearValidate('dates')
      },
      clear_all () {
        this.form.business_days = []
        // this.form.holidays = ''
        this.form.excluding_dates = []
        this.form.excluding_terms = []
        this.form.percentage = null
        this.form.dates = []
        this.isIndeterminate = false
        this.checkAll = false
        this.$refs['form'].clearValidate()
      }
    },
    created () {
      if (localStorage.getItem("business_days")) {
        let a = localStorage.getItem("business_days").split(',')
        let hi = []
        a.forEach(item => {
          hi.push(parseInt(item))
        })
        this.isIndeterminate = true
        this.form.business_days = hi
      }

      // if (localStorage.getItem("holidays")) {
      //   this.form.holidays = localStorage.getItem("holidays")  
      // }

      if (localStorage.getItem("excluding_dates")) {
        this.form.excluding_dates = JSON.parse(localStorage.getItem("excluding_dates")).sort(function(a,b){
                                      var c = new Date(a)
                                      var d = new Date(b)
                                      return c-d
                                    })
      }

      if (localStorage.getItem("excluding_terms")) {
        this.form.excluding_terms = JSON.parse(localStorage.getItem("excluding_terms"))
      }

      if (localStorage.getItem("percentage")) {
        this.form.percentage = parseInt(localStorage.getItem("percentage"))
      }


      bus.$on('result:excluding_dates', payload => {
        this.form.excluding_dates = []
        this.form.excluding_dates = payload.result.sort(function(a,b){
                                      var c = new Date(a)
                                      var d = new Date(b)
                                      return c-d
                                    })
      })

      bus.$on('result:excluding_dates_text', payload => {
        this.form.excluding_dates = []
        this.form.excluding_dates = payload.result.sort(function(a,b){
                                      var c = new Date(a)
                                      var d = new Date(b)
                                      return c-d
                                    })
      })

      bus.$on('result:excluding_term', payload => {
        this.form.excluding_terms.push(payload.result)
      })
    }
  }
</script>
<style scoped>
  .ca-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .ca-list > li {
    padding: 5px 0;
  }
  .el-form-item {
    margin-bottom: 18px;
  }

  /*.ca-list-item-title {
    font-
  }*/
</style>