<template>
  <div style="margin-top: 30px;">
  <div style="margin-bottom: 30px;float: left">
    <el-button type="success" @click="enableDis()">允许分销</el-button>
    <el-button type="danger" @click="forbiddenDis()">禁止分销</el-button>
    <el-button type="danger" @click="openTip()">恢复默认分销价</el-button>
  </div>
    <el-form :inline="true" :model="formSearch" class="demo-form-inline search-from">
      <el-form-item label="">
        <el-input  placeholder="产品id或者产品名称" v-model="formSearch.search" value=""></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchResult()">查询</el-button>
      </el-form-item>
    </el-form>
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
      label="产品名称"
      sortable
      prop="ticket_name"
    >
    </el-table-column>
    <el-table-column
      label="产品类别"
      sortable
      prop="ticket_type"
    >
      <template scope="scope">
        <el-tag :type="scope.row.ticket_type?'success':'warning'">{{scope.row.ticket_type?'单票':'套票'}}</el-tag>
      </template>
    </el-table-column>
    <el-table-column
      label="分销状态"
      prop="status"
    >
      <template scope="scope">
        <el-tag v-if="scope.row.status === 1"
                :type="'success'" close-transition>允许分销</el-tag>
        <el-tag v-else
                :type="'primary'" close-transition>禁止分销</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="是否分销">
      <template scope="scope">
        <el-switch
          v-model="scope.row.status"
          on-color="#13ce66"
          off-color="#f7ba2a"
          :on-value="switchOnVal"
          :off-value="switchOffVal"
          on-text="是"
          off-text="否"
          @change="disAction(scope.row.id)"
          >
        </el-switch>
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
        :page-sizes="[5, 8, 20]"
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
                    <el-form-item label="结算价：">
                      <el-input v-model="form.settle_price" :disabled="true" size="small"></el-input>
                    </el-form-item>
                    <el-form-item label="分销价：">
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
          <el-col :span="8">
            <div class="datepicker-title"></div>
            <v-datepickerWithPrice @submitDatePrices="updateOrCreateDatePrices"></v-datepickerWithPrice>
          </el-col>
        </el-row>
      </el-dialog>
  </div>
</template>

<script>
  import { updateDisTicketRelation, ticketListByFilter, getDisTicketDatePrice, backDisDatePrice, updateOrCreateDatePrices, updateOrCreateDisDatePrice } from '@/api/api'
  import moment from 'moment'
  export default {
    components: {
      'full-calendar': require('@/components/calendar/fullCalendar'),
      vDatepickerWithPrice: require('@/components/datepicker/datepickerWithPrice')
    },
    filters: {
      toString (value) {
        return value.toString()
      }
    },
    data () {
      return {
        value3: 1,
        value1: '1',
        fcEvents: [],
        tableData: [],
        currentPage: 1,
        pageSize: 5,
        total: 0,
        dialogFormCalendar: false,
        form: {
          share_stock: '',
          settle_price: '',
          sales_price: '',
          product_id: null,
          price_date: '',
          showCard: false
        },
        value: '',
        multipleSelection: [],
        current: '',
        formSearch: {
          search: ''
        },
        switchOnVal: 1,
        switchOffVal: 0
      }
    },
    methods: {
      openTip () {
        if (this.multipleSelection.length === 0) {
          this.$alert('请先选择门票', '', {
            confirmButtonText: '确定',
            type: 'danger'
          })
          return
        }
        this.$confirm('此操作将恢复默认分销价, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.callbackDisDatePrice()
        }).catch(() => {})
      },
      callbackDisDatePrice () {
        let ids = this.multipleSelection.map(ele => ele.id)
        backDisDatePrice({
          ids: ids,
          dis: this.$route.query.id
        })
      },
      handleSizeChange (val) {
        this.pageSize = val
        this.handleCurrentChange()
      },
      handleCurrentChange (page) {
        ticketListByFilter(page, this.pageSize, this.$route.query.id).then((response) => {
          this.tableData = response.data.data.data
          this.total = response.data.data.total
        })
      },
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      disAction (id) {
        let _this = this
        updateDisTicketRelation(id, this.$route.query.id).then(function () {
          _this.handleCurrentChange()
        })
      },
      showDatePrice (id) {
        this.dialogFormCalendar = true
        this.distributorId = this.$route.query.id
        this.product_id = id
        var params = {
          type: 'month',
          month: moment().format('YYYY-MM'),
          product_id: this.product_id,
          distributor_id: this.distributorId
        }
        this.getDatePriceById(params)
      },
      changeMonth (start, end, current) {
        this.current = current
        var params = {
          type: 'month',
          month: this.current.format('YYYY-MM'),
          product_id: this.product_id,
          distributor_id: this.$route.query.id
        }
        this.getDatePriceById(params)
      },
      moreClick (day, events, jsEvent) {
        this.form.settle_price = events[0].settlement
        this.form.sales_price = events[0].distribution
        this.form.share_stock = events[0].inventoryPooling
        this.form.product_id = events[0].product_id
        this.form.price_date = events[0].price_date
        this.handleCurrentChange()
      },
      enableDis () {
        this.multipleSelection.forEach((obj) => {
          if (obj.status === 0) {
            updateDisTicketRelation(obj.id, this.$route.query.id)
          }
        })
        this.handleCurrentChange()
      },
      forbiddenDis () {
        this.multipleSelection.forEach((obj) => {
          if (obj.status === 1) {
            updateDisTicketRelation(obj.id, this.$route.query.id)
          }
        })
        this.handleCurrentChange()
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
              distributor_id: this.$route.query.id
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
      },
      searchResult () {
        ticketListByFilter(1, this.pageSize, this.$route.query.id, this.formSearch.search).then((response) => {
          this.tableData = response.data.data.data
          this.total = response.data.data.total
        })
      },
      subOneDay () {
        var params = this.form
        params.distributor_id = this.$route.query.id
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
      }
    },
    created: function () {
      this.handleCurrentChange()
    }
  }
</script>
<style scoped>
    .datepicker-title {
      height:80px;
      line-height:80px;
      text-align:center;
      font-size:30px;
    }
  .search-from{
    float: right;
  }
</style>
