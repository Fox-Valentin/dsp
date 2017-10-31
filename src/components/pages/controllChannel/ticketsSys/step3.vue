<template >
  <div>
    <el-form :model="ruleForm" ref="ruleForm" label-width="120px" class="demo-ruleForm">
      <el-form-item label="退款类型">
        <el-radio-group v-model="ruleForm.refund_type">
          <el-radio label="0">不可退</el-radio>
          <el-radio label="1">随时退</el-radio>
          <el-radio label="2">有条件退</el-radio>
        </el-radio-group>
        <el-popover
          ref="popover1"
          placement="top"
          title="退款类型"
          width="200"
          trigger="hover"
          >
          <div>
            0 不可退 订单不可退款。
          </div>
          <div>
            1 随时退 未消费（包含过期）订单随时可退，无退款手续费，订单可多次退款，退款状态异步获取（人工审核）。
          </div>
          <div>
            2 有条件退 未消费订单具有时间节点限制、手续费限制、只能整单退款。
          </div>
        </el-popover>
        <el-button v-popover:popover1 type="text" icon="information" style="float:right;"> 查看说明</el-button>
      </el-form-item>
      <el-form-item label="部分退">
        <el-radio-group v-model="ruleForm.part_refund" @change="changeRefundType">
          <el-radio label="0">支持部分退</el-radio>
          <el-radio label="1">不支持部分退</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="退款说明">
        <el-input type="textarea" v-model="ruleForm.refund_note"></el-input>
      </el-form-item>
      <el-form-item label="退款手续费类型">
        <el-select v-model="ruleForm.refund_fee_mode" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.text"
            :value="item.value">
            {{item.text}}
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="元退款手续费">
        <el-row>
          <el-col :span="5">
            <el-input v-model="ruleForm.refund_fee"></el-input>
          </el-col>
          <el-col :span="3" :offset="1">
            <div v-show="ruleForm.refund_fee_mode === '4'">
              (%)
            </div>
            <div v-show="!(ruleForm.refund_fee_mode === '4')">
              (单位:元)
            </div>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="退款时间类型">
        <el-radio-group v-model="ruleForm.refund_time_type">
          <el-radio label="0">无时间限制</el-radio>
          <el-radio label="2">截至到有效期前</el-radio>
          <el-radio label="3">截止到有效期后</el-radio>
        </el-radio-group>
        <el-popover
          ref="popover1"
          placement="top"
          title="退款时间类型说明"
          width="200"
          trigger="hover"
          >
          <div>
            0 退款时间无限制 refundTime 填写默认值0 
          </div>
          <div>
            2 退款时间截至到有效期结束前 refundTime不能为空。从有效期结束当天24点计算，往前递推。假设时间点为提前A天的B点C分，则refundTime = (A + 1) x 24 x 60 -(B x 60 + C) 假设有效期结束日期为1.19号,如果1.18号16点24分截止退款 则 A＝1 B＝16 C＝24
          </div>
          <div>
            3 退款时间在截止到有效期结束后 refundTime不能为空。从有效期结束日期后一天0点计算，往后递推。假设时间点为截止后A天的B点C分，则refundTime＝(A - 1) x 24 x 60 + B x 60 + C 假设预定日期1.19,1.20号10点33分截止退款 则 A＝1 B＝10 C＝33
          </div>
        </el-popover>
        <el-button v-popover:popover1 type="text" icon="information" style="float:right;"> 查看说明</el-button>
      </el-form-item>
      <el-form-item label="退款时间">
        <el-row>
          <el-col :span="6">
            <el-input v-model="refund_time_day"></el-input>
          </el-col>
          <el-col  :span="2" :offset="1">
            天
          </el-col>
          <el-col :span="6">
            <el-time-picker
              class="refund-time-hours-minutes-wrap"
              v-model="refund_time_hours_minutes"
              :picker-options="{selectableRange: '00:00:01 - 23:59:59'}"
              format="HH:mm"
              placeholder="任意时间点">
            </el-time-picker>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-button type="warning" @click="handleBack">返回上一步</el-button>
        <el-button type="primary" @click="handleSub">保存进入下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import { updateRefundRule, getRefundRule } from '@/api/api'
  export default {
    data () {
      return {
        type: 0,
        baseDate: new Date(2017, 1, 1, '00', '00'),
        refund_time_day: '0',
        refund_time_hours_minutes: '0',
        ruleForm: {
          refund_type: 0,
          part_refund: 0,
          refund_note: '',
          refund_fee_mode: 0,
          refund_fee: '',
          refund_time_type: '0',
          refund_time: ''
        },
        options: [
          {
            value: '1',
            text: '无手续费'
          },
          {
            value: '2',
            text: '每张票扣除多少手续费，精确到分'
          },
          {
            value: '3',
            text: '每笔订单扣除多少手续费，精确到分'
          },
          {
            value: '4',
            text: '扣除手续费为订单销售价格的百分比,小数点后保留两位'
          }
        ]
      }
    },
    methods: {
      handleSub () {
        var params = this.ruleForm
        var A1 = this.refund_time_day
        var B1 = new Date(this.refund_time_hours_minutes).getHours()
        var C1 = new Date(this.refund_time_hours_minutes).getMinutes()
        console.log(params.refund_time)
        if (this.ruleForm.refund_time_type === '2') {
          params.refund_time = (A1 + 1) * 24 * 60 - (B1 * 60 + C1)
        } else if (this.ruleForm.refund_time_type === '3') {
          params.refund_time = (A1 - 1) * 24 * 60 + (B1 * 60 + C1)
        } else {
          params.refund_time = 0
        }
        if (this.$route.query.ticket_id) {
          params.id = this.$route.query.ticket_id
        } else {
          params.id = this.$store.getters.getTicketId
        }
        updateRefundRule(params).then((res) => {
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
        key++
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
        if (!this.$store.getters.getTicketId) {
          return
        }
        var params = {
          'id': this.$store.getters.getTicketId
        }
        getRefundRule(params).then((res) => {
          this.ruleForm = res.data.data
          this.ruleForm.refund_time_type = res.data.data.refund_time_type !== undefined ? res.data.data.refund_time_type : null
          // this.ruleForm.part_refund = res.data.data.part_refund !== undefined ? res.data.data.part_refund : null
          this.refund_time_day = Math.floor(Math.floor(res.data.data.refund_time / 60) / 24)
          this.refund_time_hours_minutes = new Date(Number(this.baseDate.getTime()) + Number(res.data.data.refund_time % (60 * 24) * 60 * 1000))
          console.log(this.ruleForm.refund_time_type)
        })
      },
      changeRefundType () {
        if (this.ruleForm.part_refund === '1') {
          this.ruleForm.refund_type = '2'
        }
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
    width: 600px;
  }
  .refund-time-hours-minutes-wrap{
    width:120px;
  }
</style>
