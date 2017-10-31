<template>
  <div>
    <el-row>
      <el-col :span="9">
        <el-alert
        title="0表示不限"
        type="info"
        show-icon
        class="alert-text-wrap"
        :closable="false"
        >
        </el-alert>
      </el-col>
    </el-row>
    <el-form :model="ruleForm" ref="ruleForm" class="demo-ruleForm">
      
      <el-form-item>
        <el-row>
          <el-col :span="3">
            每个手机号
          </el-col>
          <el-col :span="5">
            <el-input type="text" v-model="ruleForm.phone_limit_days"></el-input>
          </el-col>
          <el-col :span="4" :offset="1">
            天内最多可预购
          </el-col>
          <el-col :span="5">
          <el-input type="text" v-model="ruleForm.phone_limit_count"></el-input>
          </el-col>
          <el-col :span="1" :offset="1">
            张
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item >
        <el-row>
          <el-col :span="3">
            每个身份证号
          </el-col>
          <el-col :span="5">
            <el-input type="text" v-model="ruleForm.id_limit_days"></el-input>
          </el-col>
          <el-col :span="4" :offset="1">
            天内最多可预购
          </el-col>
          <el-col :span="5">
          <el-input type="text" v-model="ruleForm.id_limit_count"></el-input>
          </el-col>
          <el-col :span="1" :offset="1">
            张
          </el-col>
        </el-row>
      </el-form-item>
      <!--<el-form-item label="每个账号订单最大可预天数:" prop="name">
        <el-row>
          <el-col :span="8">
            <el-input type="text" v-model="ruleForm.uid_limit_days"></el-input>
          </el-col>
          <el-col :span="3" :offset="1">
            (单位:天)
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="每个账号订单最大预订数量:" prop="name">
        <el-row>
          <el-col :span="8">
            <el-input type="text" v-model="ruleForm.uid_limit_count"></el-input>
          </el-col>
          <el-col :span="3" :offset="1">
            (单位:张)
          </el-col>
        </el-row>
      </el-form-item>-->
      <el-form-item>
        <el-button type="warning" @click="handleBack">返回上一步</el-button>
        <el-button type="primary" @click="handleSub">保存进入下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import { updateRiskControl, getRiskControl } from '@/api/api'
  export default {
    data () {
      return {
        ruleForm: {
          phone_limit_days: 0,
          phone_limit_count: 0,
          id_limit_days: 0,
          id_limit_count: 0,
          uid_limit_days: '',
          uid_limit_count: ''
        }
      }
    },
    methods: {
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!')
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      handleSub () {
        var params = this.ruleForm
        if (this.$route.query.ticket_id) {
          params.id = this.$route.query.ticket_id
        } else {
          params.id = this.$store.getters.getTicketId
        }
        updateRiskControl(params).then((res) => {
          if (res.data.code === 10000) {
            this.$message({
              message: '提交成功',
              type: 'success'
            })
            this.handleNext()
          } else {
            this.$message({
              message: '提交失败',
              type: 'warning'
            })
          }
        })
      },
      handleNext () {
        var key = Number(this.$store.getters.getActiveKey)
        var activeNames = this.$store.getters.getActiveNames
        if (key >= activeNames.length) {
          return
        }
        ++key
        var activeName = activeNames[key]
        this.$store.commit('updateActiveKey', key)
        this.$emit('changeTab', activeName)
      },
      handleBack () {
        var key = Number(this.$store.getters.getActiveKey)
        var activeNames = this.$store.getters.getActiveNames
        if (key <= 0) {
          return
        }
        key--
        var activeName = activeNames[key]
        this.$store.commit('updateActiveKey', key)
        this.$emit('changeTab', activeName)
      },
      handleGet () {
        if (!this.$store.getters.getProductId) {
          return
        }
        var params = {
          'id': this.$store.getters.getProductId
        }
        getRiskControl(params).then((res) => {
          this.ruleForm.phone_limit_days = res.data.data.phone_limit_days
          this.ruleForm.phone_limit_count = res.data.data.phone_limit_count
          this.ruleForm.id_limit_days = res.data.data.id_limit_days
          this.ruleForm.id_limit_count = res.data.data.id_limit_count
          this.ruleForm.uid_limit_days = res.data.data.uid_limit_days
          this.ruleForm.uid_limit_count = res.data.data.uid_limit_count
        })
      }
    },
    mounted () {
      this.handleGet()
    }
  }
</script>
<style scoped>
    .el-form--inline .el-form-item{
      margin-right: 0px;
    }
    .demo-ruleForm{
      width: 700px;
    }
    .alert-text-wrap{
      margin-bottom: 12px;
    }
</style>
