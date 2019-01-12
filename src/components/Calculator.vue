<template>
<el-form ref="form" :model="form" :rules="rules" label-position="top">
  <el-row :gutter="20">
    <el-col :span="13">
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
      <el-form-item label="Holidays" prop="holidays">
        <el-input
          type="textarea"
          :rows="4"
          placeholder="Please input holidays"
          v-model="form.holidays">
        </el-input>
      </el-form-item>
      <el-form-item label="Percentage" prop="percentage">
        <el-input 
          placeholder="Please input percentage" 
          v-model.number="form.percentage"
        >
           <template slot="append">%</template>
        </el-input>
      </el-form-item>
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
        <h2><strong>Result</strong><small style="margin-left: 5px;">({{ result.start_date }} ~ {{ result.completion_date }})</small></h2>
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
  export default {
    data() {
      var validate_holidays = (rule, value, callback) => {
        let holidays = this.split_holidays(value)
        let result = this.validate_date_format(holidays)

        if (result  || holidays.length === 0) {
          callback()
        } else {
          callback(new Error())
        }
      }
      return {
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
          holidays: '',
          percentage: null,
          dates: []
        },
        checkAll: false,
        isIndeterminate: false,
        rules: {
          business_days: [
            { required: true, message: 'Please select a day at least', trigger: 'blur' }
          ],
          holidays: [
            { validator: validate_holidays, message: 'Please check the date formats of holidays', trigger: 'blur' }
          ],
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
          refund_days: 0
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
      onSubmit () {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            let holidays = this.split_holidays(this.form.holidays)
            this.is_result_done = true
            this.result.refund_date = this.make_result(holidays, this.form.business_days, this.$moment(this.form.dates[0]).format('MM/DD/YYYY'), this.$moment(this.form.dates[1]).format('MM/DD/YYYY'), this.form.percentage/100)
            this.result.start_date = this.$moment(this.form.dates[0]).format('MM/DD/YYYY')
            this.result.completion_date = this.$moment(this.form.dates[1]).format('MM/DD/YYYY')
          } else {
            // console.log('error submit!!');
            return false;
          }
        });
      },
      split_holidays (holidays_string) {
        let holidays = []
        let split_holidays = holidays_string.split(',')
        if(split_holidays.length === 1 && split_holidays[0] === '') {
          split_holidays = []
        }

        split_holidays.forEach((item, index) => {
          holidays[index] = item.trim()
        })

        return holidays
      },
      validate_date_format (holidays) {
        let re = /^((((0[13578])|([13578])|(1[02]))[\/](([1-9])|([0-2][0-9])|(3[01])))|(((0[469])|([469])|(11))[\/](([1-9])|([0-2][0-9])|(30)))|((2|02)[\/](([1-9])|([0-2][0-9]))))[\/]\d{4}$|^\d{4}$/
        return holidays.every(item => {
          if (re.test(item.trim())) {
            return true
          }
        })
      },
      make_result (holidays, business_days, start_date, completion_date, percentage) {
        this.store_data_to_localstorage()
        this.$moment.updateLocale('us', {
          holidays: holidays,
          holidayFormat: 'MM/DD/YYYY',
          workingWeekdays: business_days
        })

        let diff = this.$moment(completion_date, 'MM/DD/YYYY').businessDiff(this.$moment(start_date, 'MM/DD/YYYY'), 'days')
        let a = Math.ceil((diff + 1) * percentage) - 1

        this.result.study_days = diff + 1
        this.result.refund_days = Math.ceil((diff + 1) * percentage)

        return this.$moment(start_date, 'MM/DD/YYYY').businessAdd(a).format('MM/DD/YYYY')
      },
      store_data_to_localstorage () {
        if (typeof(Storage) !== "undefined") {
          localStorage.setItem("business_days", this.form.business_days)
          localStorage.setItem("holidays", this.form.holidays)
          localStorage.setItem("percentage", this.form.percentage)
        }
      },
      clear_dates () {
        this.form.dates = []
        this.$refs['form'].clearValidate('dates')
      },
      clear_all () {
        this.form.business_days = []
        this.form.holidays = ''
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

      if (localStorage.getItem("holidays")) {
        this.form.holidays = localStorage.getItem("holidays")  
      }

      if (localStorage.getItem("percentage")) {
        this.form.percentage = parseInt(localStorage.getItem("percentage"))
      }

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