<template>
  <div style="margin-top: 50px;">
    <el-dialog title="请选择门票" :visible.sync="dialogVisible" size="small">
        <v-step1TravelDialog @submitPriceId="submitPriceId" @close="dialogVisible = false" :priceType="ruleForm.price_type"></v-step1TravelDialog>
    </el-dialog>
    <el-dialog title="请选择travel poi" :visible.sync="poidialogFormVisible" size="small">
      <v-step1TravelPoiDialog :checkList="checkList" :secnicList="secnicList" @close="poidialogFormVisible = false" @submit="submitScenic"></v-step1TravelPoiDialog>
    </el-dialog>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px">
      <el-form-item label="门票类型:">
        <el-radio-group v-model="ruleForm.price_type" @change="price_name = ''">
          <el-radio label="1">单票</el-radio>
          <el-radio label="2">套票</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="产品名称" prop="ticket_name">
        <el-row>
          <el-col :span="12">
            <el-input v-model="ruleForm.ticket_name"></el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="travel产品" prop="name">
        <el-button type="primary" @click="selectTicket">请选择travel门票</el-button>
        <el-tag v-if="price_name" type="warning">{{price_name}}</el-tag>
      </el-form-item>
      <el-form-item label="travel poi">
        <el-button type="primary" @click="selectScenic">请选择travel poi</el-button>
        <el-tag type="success" v-for="secnic in checkScenicList" :closable="true" @close="tagHandleClose(secnic)">{{secnic}}</el-tag>
      </el-form-item>
      <el-form-item label="有效期类型" class="valid_type">
        <template>
          <el-radio-group v-model="ruleForm.travel.exchange_valid_type">
            <el-radio label="0">不限</el-radio>
            <el-radio label="1">绝对有效期</el-radio>
            <el-radio label="2">相对有效期</el-radio>
          </el-radio-group>
        </template>
      </el-form-item>
      <el-form-item label="凭证有效天数" prop="name" v-if="ruleForm.travel.exchange_valid_type === '2'">
        <el-row>
          <el-col :span="5">
            <el-input v-model="ruleForm.travel.validityDays"></el-input>
          </el-col>
          <el-col :span="11" :offset="1">
            (单位:天)
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="有效期开始时间" required v-if="ruleForm.travel.exchange_valid_type === '1'">
        <el-form-item>
          <el-date-picker type="date" placeholder="选择开始日期" v-model="ruleForm.travel.exchange_valid_start"></el-date-picker>
        </el-form-item>
      </el-form-item>
      <el-form-item label="有效期结束时间" required v-if="ruleForm.travel.exchange_valid_type === '1'">
          <el-form-item>
            <el-date-picker type="date" placeholder="选择结束日期" v-model="ruleForm.travel.exchange_valid_end"></el-date-picker>
          </el-form-item>
      </el-form-item>
      <el-form-item label="至少提前购买时间" prop="name">
        <el-row>
          <el-col :span="5">
            <el-input v-model="ruleForm.travel.book_early_min"></el-input>
          </el-col>
          <el-col  :span="1" :offset="1">
            天
          </el-col>
          <el-col :span="10">
            <el-time-picker
              class="book_early_time"
              v-model="lastTimePicker"
              format="HH:mm"
              placeholder="任意时间点"
              :picker-options="{
                start: '00:00',
                step: '00:01',
                end: '23:59'
              }"
              >
            </el-time-picker>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="最多提前购买时间" prop="name">
        <el-row>
          <el-col :span="5">
            <el-input v-model="ruleForm.travel.book_early_max"></el-input>
          </el-col>
          <el-col  :span="1" :offset="1">
            天
          </el-col>
          <el-col :span="10">
            <el-time-picker
              class="book_early_time"
              v-model="mostTimePicker"
              :picker-options="{selectableRange: '00:00:01 - 23:59:59'}"
              format="HH:mm"
              placeholder="任意时间点">
            </el-time-picker>
          </el-col>
        </el-row>
      </el-form-item>
      <!--<el-form-item label="生效时间(暂无)" prop="name" class="el-form-item&#45;&#45;width">-->
        <!--<el-input></el-input>-->
      <!--</el-form-item>-->
      <el-form-item label="单次最小购买数" prop="name">
        <el-row>
          <el-col :span="5">
          <el-input v-model="ruleForm.travel.least_buy_quantity"></el-input>
          </el-col>
        </el-row>
        <!--{{ruleForm.travel.least_buy_quantity}}-->
      </el-form-item>
      <el-form-item label="单次最大购买数" prop="name">
        <el-row>
          <el-col :span="5">
            <el-input v-model="ruleForm.travel.most_buy_quantity"></el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="上下线" prop="status">
        <el-radio-group v-model="ruleForm.status">
          <el-radio :label="status_upline">上线</el-radio>
          <el-radio :label="status_downline">下线</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSub">保存进入下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import { getTravelTicketById, getTravelScenicList, getTravelTicketGroupById, getTicketById, addTicket, updateTicket } from '@/api/api'
  export default {
    components: {
      vStep1TravelDialog: require('./step1TravelDialog'),
      vStep1TravelPoiDialog: require('./step1TravelPoiDialog')
    },
    data () {
      return {
        currentPage: 1,
        total: 0,
        per_page: 5,
        lastTimePicker: new Date(2017, 1, 1, '00', '00'),
        mostTimePicker: new Date(2017, 1, 1, '00', '00'),
        baseDate: new Date(2017, 1, 1, '00', '00'),
        dialogVisible: false,
        poidialogFormVisible: false,
        activeNames: ['1'],
        secnicList: [],
        checkList: [],
        checkScenicList: [],
        price_id: 0,
        price_name: '',
        ruleForm: {
          price_type: '1',
          ticket_name: '',
          ticket_type: 0,
          status: 1,
          travel: {
            validityDays: 1,
            exchange_valid_type: '0',
            exchange_valid_start: '',
            exchange_valid_end: '',
            book_early_min: 1,
            book_early_max: 1,
            least_buy_quantity: 1,
            most_buy_quantity: 9
          }
        },
        dialogTableVisible: false,
        formInline: {
          user: '',
          region: ''
        },
        rules: {},
        valueDateEnd: '',
        valueDateStart: '',
        status_upline: 1,
        status_downline: 0
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
      submitPriceId (priceId) {
        this.price_id = priceId
        this.submitPrice()
      },
      selectTicket () {
        this.dialogVisible = true
        // if (this.ruleForm.price_type === '1') {
        //   getTravelScenicToTicketsList().then((response) => {
        //     this.lists = response.data.data.data
        //   })
        // } else {
        //   getTravelTicketGroup().then((response) => {
        //     this.lists = response.data.data.data
        //   })
        // }
      },
      selectScenic () {
        this.poidialogFormVisible = true
        getTravelScenicList().then((response) => {
          this.secnicList = response.data.data.data
        })
      },
      showSelectScenic () {
        getTravelScenicList().then((response) => {
          this.secnicList = response.data.data.data
          this.secnicList.forEach((value) => {
            this.checkList.forEach((val) => {
              if (value.id === Number(val)) {
                if (this.checkScenicList.indexOf(value.scenic_name) < 0) {
                  this.checkScenicList.push(value.scenic_name)
                }
              }
            })
          })
        })
      },
      submitPrice () {
        this.dialogVisible = false
        if (this.ruleForm.price_type === '1') {
          getTravelTicketById(this.price_id).then((response) => {
            this.price_name = response.data.data.price_name
            this.ruleForm.travel.scenic_id = response.data.data.scenic_id
            this.ruleForm.travel.price_name = response.data.data.price_name
          })
        } else {
          getTravelTicketGroupById(this.price_id).then((response) => {
            this.price_name = response.data.data.name
            this.ruleForm.travel.scenic_id = response.data.data.scenic_id
            this.ruleForm.travel.price_name = response.data.data.price_name
          })
        }
      },
      submitScenic (checkList) {
        this.checkList = checkList
        this.poidialogFormVisible = false
        this.checkScenicList = []
        this.secnicList.forEach((value) => {
          this.checkList.forEach((val) => {
            if (value.id === Number(val)) {
              if (this.checkScenicList.indexOf(value.scenic_name) < 0) {
                this.checkScenicList.push(value.scenic_name)
              }
            }
          })
        })
      },
      handleSub () {
        var params = {
          travel: {}
        }
        params.price_id = this.price_id
        params.price_name = this.price_name
        var A1 = this.ruleForm.travel.book_early_min
        var B1 = new Date(this.lastTimePicker).getHours()
        var C1 = new Date(this.lastTimePicker).getMinutes()
        var A2 = this.ruleForm.travel.book_early_max
        var B2 = new Date(this.mostTimePicker).getHours()
        var C2 = new Date(this.mostTimePicker).getMinutes()
        params.travel.book_early_min = (A1 + 1) * 24 * 60 - (B1 * 60 + C1)
        params.travel.book_early_max = (A2 + 1) * 24 * 60 - (B2 * 60 + C2)
        params.price_type = this.ruleForm.price_type
        params.ticket_name = this.ruleForm.ticket_name
        params.ticket_type = this.ruleForm.ticket_type
        params.status = this.ruleForm.status
        params.travel.validityDays = this.ruleForm.travel.validityDays
        params.travel.exchange_valid_type = this.ruleForm.travel.exchange_valid_type
        params.travel.exchange_valid_start = new Date(this.ruleForm.travel.exchange_valid_start).getTime()
        params.travel.exchange_valid_end = new Date(this.ruleForm.travel.exchange_valid_end).getTime()
        params.travel.least_buy_quantity = this.ruleForm.travel.least_buy_quantity
        params.travel.most_buy_quantity = this.ruleForm.travel.most_buy_quantity
        params.scenic_id = this.checkList.join(',')
        if (this.$route.query.ticket_id) {
          params.id = this.$route.query.ticket_id
          updateTicket(params).then((res) => {
            if (res.data.code === 10000) {
              this.$message({
                message: '提交成功',
                type: 'success'
              })
              this.handleNext()
              this.$emit('changeStatus', false)
            } else {
              this.$message({
                message: '提交失败',
                type: 'warning'
              })
            }
          })
          return
        }
        addTicket(params).then((res) => {
          if (res.data.code === 10000) {
            this.$message({
              message: '提交成功',
              type: 'success'
            })
            this.$store.commit('updateProductId', res.data.data)
            this.handleNext()
            this.$emit('changeStatus', false)
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
      tagHandleClose (secnic) {
        console.log(secnic)
        this.secnicList.map((item) => {
          if (item.scenic_name === secnic) {
            console.log(item.id)
            this.checkList.splice(this.checkList.indexOf(item.id), 1)
          }
        })
        this.checkScenicList.splice(this.checkScenicList.indexOf(secnic), 1)
      }
    },
    mounted: function () {
      this.$store.commit('updateProductId', this.$route.query.ticket_id)
      if (this.$route.query.ticket_id) {
        getTicketById(this.$route.query.ticket_id).then((response) => {
          this.ruleForm.ticket_type = response.data.data.ticket_type
          this.ruleForm.ticket_name = response.data.data.ticket_name
          this.ruleForm.status = response.data.data.status
          this.price_id = response.data.data.price_id
          this.ruleForm.travel.validityDays = response.data.data.validity_days
          this.ruleForm.travel.exchange_valid_type = response.data.data.validity_type.toString()
          this.ruleForm.travel.least_buy_quantity = response.data.data.min_num
          this.ruleForm.travel.most_buy_quantity = response.data.data.max_num
          this.ruleForm.travel.book_early_min = Math.floor(Math.floor(response.data.data.book_early_min / 60) / 24)
          this.lastTimePicker = new Date(Number(this.baseDate.getTime()) + Number(response.data.data.book_early_min % (60 * 24) * 60 * 1000))
          this.ruleForm.travel.book_early_max = Math.floor(Math.floor(response.data.data.book_early_max / 60) / 24)
          this.mostTimePicker = new Date(Number(this.baseDate.getTime()) + Number(response.data.data.book_early_max % (60 * 24) * 60 * 1000))
          response.data.data.scenic_id.split(',').map((val) => {
            this.checkList.push(Number(val))
          })
          this.submitPrice()
          this.showSelectScenic()
        })
      }
    }
  }
</script>
<style scoped>
  .book_early{
    width: 100px;
  }
  .book_early_time{
    width:120px;
  }
  .valid_type{
    width:420px;
  }
</style>
