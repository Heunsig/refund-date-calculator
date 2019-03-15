<template>
  <div id="app">
    <v-app>
    <el-container>
      <el-main>
        <v-container fluid justify-center>
          <v-layout wrap>
            <v-flex xs10 offset-xs1>
              <div class="ca-title">
                <img src="./assets/icons8-genie-96.png" />
                <h1>Refund Date Calculator</h1>
              </div>
              <div style="display: flex;">
                <el-button type="danger" @click="clear_all()">Clear All Fields</el-button>  
                <div style="flex: 1 1 auto;"></div>
                <el-button type="warning" @click="clear_dates()">Clear Only Dates</el-button>
              </div>
            </v-flex>
            <v-flex xs10 offset-xs1>
              <Calculator ref="calculator"></Calculator>
            </v-flex>
          </v-layout>
        </v-container>
        <!-- <el-row :gutter="20">
          <el-col :span="16" :offset="4">
            <div class="ca-title">
              <img src="./assets/icons8-genie-96.png" />
              <h1>Refund Date Calculator</h1>
            </div>
            <div style="display: flex;">
              <el-button type="danger" @click="clear_all()">Clear All Fields</el-button>  
              <div style="flex: 1 1 auto;"></div>
              <el-button type="warning" @click="clear_dates()">Clear Only Dates</el-button>
            </div>
          </el-col>
          <el-col :span="16" :offset="4">
            <Calculator ref="calculator"></Calculator>
          </el-col>
        </el-row> -->
      </el-main>
      <el-footer>
        <el-row :gutter="20">
          <el-col :span="16" :offset="4">
            <div style="text-align: center;">
              Creator: Heunsig Jo / heun3344@gmail.com
            </div>
          </el-col>
        </el-row>
      </el-footer>
    </el-container>
    <Dialog_EditExcludingDates></Dialog_EditExcludingDates>
    <Dialog_EditExcludingDatesText></Dialog_EditExcludingDatesText>
    <Dialog_AddExcludingTerm></Dialog_AddExcludingTerm>
    </v-app>
  </div>
</template>
<script>
import Calculator from './components/Calculator.vue'
import Dialog_EditExcludingDates from './components/Dialog_EditExcludingDates.vue'
import Dialog_EditExcludingDatesText from './components/Dialog_EditExcludingDatesText.vue'
import Dialog_AddExcludingTerm from './components/Dialog_AddExcludingTerm.vue'

export default {
  name: 'app',
  components: {
    Calculator,
    Dialog_EditExcludingDates,
    Dialog_EditExcludingDatesText,
    Dialog_AddExcludingTerm
  },
  methods: {
    clear_dates () {
      this.$refs['calculator'].clear_dates()
    },
    clear_all () {
      this.$confirm('This will clear all fields. Continue?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        this.$refs['calculator'].clear_all()
        this.$message({
          type: 'success',
          message: 'Successfully cleared all fields',
          duration: 2000
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Canceled clearing all fields',
          duration: 2000
        });          
      });
    }
  }
}
</script>
<style>
  body {
    background: #f9f9f9;
    padding: 0;
    margin: 0;
  }
</style>
<style scoped>
  .ca-title {
    margin-bottom: 15px;
    text-align: center;
  }
  .ca-title > h1 {
    font-size: 20px;
  }
</style>