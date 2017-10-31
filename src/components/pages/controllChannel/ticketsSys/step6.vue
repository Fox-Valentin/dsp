<template>
  <el-row>
    <el-col :span="16">
      <full-calendar class="test-fc" :events="fcEvents"
        first-day='1' locale="zh_CN"
        @changeMonth="changeMonth"
        @eventClick="eventClick"
        @dayClick="dayClick"
        @moreClick="moreClick">
          <template slot="fc-header-right">
          </template>
          <template slot="fc-event-card" scope="p">
              <p>{{ p.event.title }}</p>
          </template>
          <template slot="body-card-form">
            <el-form ref="form" :model="form" label-width="120px">
               <el-form-item label="结算价(元)：">
                 <el-input v-model="form.daySettlement" :disabled="true" size="small"></el-input>
               </el-form-item>
               <el-form-item label="分销价(元)：">
                 <el-input v-model="form.dayDistribution" size="small"></el-input>
               </el-form-item>
               <el-form-item label="库存(张)：">
                 <el-input v-model="form.dayInventoryPooling" size="small"></el-input>
               </el-form-item>
               <el-form-item>
                  <el-button type="primary" @click="updateOrCreateDatePrice" size="small">提交</el-button>
               </el-form-item>
            </el-form>
          </template>
      </full-calendar>
      <div style="padding-left:80px;">
        <el-button type="warning" @click="handleBack">返回上一步</el-button>
      <el-button type="primary" @click="handleNext">进入下一步</el-button>
      </div>
    </el-col>
    <el-col :span="8">
      <div class="datepicker-title"></div>
      <v-datepickerWithPrice @submitDatePrices="updateOrCreateDatePrices"></v-datepickerWithPrice>
    </el-col>
  </el-row>
</template>
<script>
  import { getDatePriceById, updateOrCreateDatePrice, updateOrCreateDatePrices } from '@/api/api'
  export default {
    components: {
      'full-calendar': require('@/components/calendar/fullCalendar'),
      vDatepickerWithPrice: require('@/components/datepicker/datepickerWithPrice')
    },
    data () {
      return {
        fcEvents: [],
        form: {
          dayInventoryPooling: '',
          daySettlement: '',
          dayDistribution: '',
          productId: null,
          price_date: '',
          showCard: false
        }
      }
    },
    methods: {
      changeMonth (start, end, current) {
        var params = {
          type: 'month',
          month: current.format('YYYY-MM')
        }
        if (this.$route.query.ticket_id) {
          params.product_id = this.$route.query.ticket_id
          this.getDatePriceById(params)
        }
        if (this.$store.getters.getTicketId) {
          params.product_id = this.$route.query.ticket_id
          this.getDatePriceById(params)
        }
      },
      eventClick (event, jsEvent, pos) {
        console.log('eventClick', event, jsEvent, pos)
      },
      dayClick (day, jsEvent) {
        console.log('dayClick', day, jsEvent)
      },
      moreClick (day, events, jsEvent) {
        this.form.daySettlement = events[0].settlement
        this.form.dayDistribution = events[0].distribution
        this.form.dayInventoryPooling = events[0].inventoryPooling
        this.form.productId = events[0].product_id
        this.price_date = events[0].price_date
      },
      updateOrCreateDatePrice () {
        var params = {
          price_date: this.price_date,
          sales_price: this.form.dayDistribution,
          settle_price: this.form.daySettlement,
          share_stock: this.form.dayInventoryPooling
        }
        if (this.$route.query.ticket_id) {
          params.product_id = this.$route.query.ticket_id
        } else {
          params.product_id = this.$store.getters.getTicketId
        }
        var productId = params.product_id
        updateOrCreateDatePrice(params).then((res) => {
          this.$store.commit('updateCardShowStatus', false)
          if (res.data.code === 10000) {
            this.$message({
              message: '提交成功',
              type: 'success'
            })
            var params = {
              type: 'month',
              month: '2017-8',
              product_id: productId
            }
            this.getDatePriceById(params)
          }
        })
      },
      updateOrCreateDatePrices (params) {
        if (this.$route.query.ticket_id) {
          params.product_id = this.$route.query.ticket_id
        } else {
          params.product_id = this.$store.getters.getTicketId
        }
        var productId = params.product_id
        updateOrCreateDatePrices(params).then((res) => {
          if (res.data.code === 10000) {
            this.$message({
              message: '提交成功',
              type: 'success'
            })
            var params = {
              type: 'month',
              month: '2017-8',
              product_id: productId
            }
            this.getDatePriceById(params)
          }
        })
      },
      getDatePriceById (params) {
        getDatePriceById(params).then((res) => {
          res.data.map((ary) => {
            ary.start = ary.price_date
            ary.end = ary.price_date
            ary.inventoryPooling = 20
            ary.settlement = ary.distributor_settle_price
            ary.distribution = ary.sales_price / 100
          })
          this.fcEvents = res.data
        })
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
      }
    }
  }
</script>
<style scoped>
    .el-form--inline .el-form-item{
      margin-right: 0px;
    }
    .datepicker-title {
      height:80px;
      line-height:80px;
      text-align:center;
      font-size:30px;
    }
</style>
