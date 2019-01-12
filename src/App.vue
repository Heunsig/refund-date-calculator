<template>
  <div id="app">
    <el-container>
      <el-main>
        <el-row :gutter="20">
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
        </el-row>
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
  </div>
</template>

<script>
import Calculator from './components/Calculator.vue'

export default {
  name: 'app',
  components: {
    Calculator
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