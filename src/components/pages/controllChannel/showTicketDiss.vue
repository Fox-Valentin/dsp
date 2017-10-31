<template>
  <div style="margin-top: 30px;">
    <div style="float: left;">
      <router-link :to="{path:'/ticket'}">
        <el-button type="primary">返回</el-button>
      </router-link>
    </div>
    <el-form :inline="true"  class="demo-form-inline" style="float: right;">
      <el-form-item label="分销商id">
        <el-input  placeholder="分销商id" value=""></el-input>
      </el-form-item>
      <el-form-item label="分销商名称">
        <el-input  placeholder="分销商名称" value=""></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="">查询</el-button>
      </el-form-item>
    </el-form>
    <!--<div style="margin-top: 20px;margin-bottom: 30px;">-->
      <!--<el-button type="success" @click="enableDis()">允许分销</el-button>-->
      <!--<el-button type="danger" @click="forbiddenDis()">禁止分销</el-button>-->
      <!--<el-button type="danger" @click="openTip()">恢复默认分销价</el-button>-->
    <!--</div>-->
    <el-table
      :data="tableData"
      :default-sort = "{prop: 'date', order: 'descending'}"
      border
      @selection-change="handleSelectionChange">
      >
      <el-table-column
        type="selection">
      </el-table-column>
      <el-table-column
        label="id"
        sortable
        prop="id"
      >
      </el-table-column>
      <el-table-column
        label="分销商名称"
        sortable
        prop="dis_name"
      >
      </el-table-column>
      <el-table-column
        label="分销商类别"
        sortable
        prop="dis_type"
      >
      </el-table-column>
      <el-table-column
        label="分销状态"
        prop="dis_status"
      >
        <template scope="scope">
          <el-tag v-if="scope.row.dis_status === 1"
                  :type="'success'" close-transition>允许分销</el-tag>
          <el-tag v-else
                  :type="'primary'" close-transition>禁止分销</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
          <el-button @click="showDatePrice(scope.row.id)">
            价格日历
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block" style="float: right;margin-top: 20px;">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 8, 10, 20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog :visible.sync="dialogFormCalendar" size="full">
      <el-row>
        <el-col :span="16">
          <full-calendar class="test-fc" :events="fcEvents"
                         first-day='1' locale="zh_CN"
                         @changeMonth="changeMonth"
                         @moreClick="moreClick">
            <template slot="fc-header-right">
            </template>
            <template slot="fc-event-card" scope="p">
              <p>{{ p.event.title }}</p>
            </template>
            <template slot="body-card-form">
              <el-form ref="form" :model="form" label-width="120px">
                <el-form-item label="供应商结算价：">
                  <el-input v-model="form.settle_price" :disabled="true" size="small"></el-input>
                </el-form-item>
                <el-form-item label="默认分销价：">
                  <el-input v-model="form.sales_price" size="small"></el-input>
                </el-form-item>
                <el-form-item label="共享库存：">
                  <el-input v-model="form.share_stock" size="small"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="subOneDay" size="small">提交</el-button>
                </el-form-item>
              </el-form>
            </template>
          </full-calendar>
        </el-col>
        <el-col :span="8" style="margin-top: 100px;">
          <div class="datepicker-title"></div>
          <v-datepickerWithPrice @submitDatePrices="updateOrCreateDatePrices"></v-datepickerWithPrice>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
  import { dislist, getDisTicketDatePrice, updateOrCreateDatePrices, updateOrCreateDisDatePrice } from '@/api/api'
  import moment from 'moment'
  export default {
    components: {
      'full-calendar': require('@/components/calendar/fullCalendar'),
      vDatepickerWithPrice: require('@/components/datepicker/datepickerWithPrice')
    },
    data () {
      return {
        fcEvents: [],
        tableData: [],
        currentPage: 1,
        pageSize: 5,
        total: 0,
        dialogFormCalendar: false,
        distributorId: null,
        form: {
          share_stock: '',
          settle_price: '',
          sales_price: '',
          product_id: null,
          price_date: '',
          showCard: false
        },
        multipleSelection: [],
        current: ''
      }
    },
    methods: {
      handleSizeChange (val) {
        this.pageSize = val
        dislist({
          page: 1,
          page_size: this.pageSize
        }).then((response) => {
          this.total = response.data.data.total
          this.tableData = response.data.data.data
        })
      },
      handleCurrentChange (page) {
        dislist({
          page: page,
          page_size: this.pageSize
        }).then((response) => {
          this.total = response.data.data.total
          this.tableData = response.data.data.data
        })
      },
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      showDatePrice (id) {
        this.dialogFormCalendar = true
        this.distributorId = id
        this.current = moment()
        var params = {
          type: 'month',
          month: this.current.format('YYYY-MM'),
          product_id: this.$route.query.ticket_id,
          distributor_id: id
        }
        this.getDatePriceById(params)
      },
      changeMonth (start, end, current) {
        this.current = current
        var params = {
          type: 'month',
          month: this.current.format('YYYY-MM'),
          product_id: this.$route.query.ticket_id,
          distributor_id: this.distributorId
        }
        this.getDatePriceById(params)
      },
      moreClick (day, events, jsEvent) {
        this.form.settle_price = events[0].settlement
        this.form.sales_price = events[0].distribution
        this.form.share_stock = events[0].inventoryPooling
        this.form.product_id = events[0].product_id
        this.form.price_date = events[0].price_date
        // this.handleCurrentChange()
      },
      subOneDay () {
        var params = this.form
        params.distributor_id = this.distributorId
        // params.product_id = this.$route.query.id
        console.log(params)
        // params.distributor_id = this.$route.query.id
        updateOrCreateDisDatePrice(params).then((res) => {
          if (res.data.code === 10000) {
            this.$message({
              message: '提交成功',
              type: 'success'
            })
            this.$store.commit('updateCardShowStatus', false)
            this.showDatePrice(this.product_id)
          }
        })
      },
      updateOrCreateDatePrices (params) {
        updateOrCreateDatePrices(params).then((res) => {
          if (res.data.code === 10000) {
            this.$message({
              message: '提交成功',
              type: 'success'
            })
            var params = {
              type: 'month',
              month: this.current.format('YYYY-MM'),
              product_id: this.product_id,
              distributor_id: this.distributorId
            }
            this.getDatePriceById(params)
          }
        })
      },
      getDatePriceById (params) {
        getDisTicketDatePrice(params).then((res) => {
          res.data.data.map((ary) => {
            ary.start = ary.price_date
            ary.end = ary.price_date
            ary.inventoryPooling = 20
            ary.settlement = ary.settle_price
            ary.distribution = ary.sales_price
          })
          this.fcEvents = res.data.data
        })
      }
    },
    created: function () {
      dislist({
        page_size: this.pageSize
      }).then((response) => {
        this.total = response.data.data.total
        this.tableData = response.data.data.data
      })
    }
  }
</script>
