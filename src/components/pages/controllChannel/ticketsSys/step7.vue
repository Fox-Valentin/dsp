<template>
  <div class="search-form-top">
    <el-button type="warning" @click="handleBack">返回上一步</el-button>
    <el-form :inline="true" :model="formInline" class="demo-form-inline search-form">
      <el-form-item label="订单号">
        <el-input v-model="formInline.user" placeholder="审批人"></el-input>
      </el-form-item>
      <el-form-item label="充值渠道">
        <el-select v-model="formInline.region" placeholder="活动区域">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="充值时间">
        <el-date-picker
          v-model="value7"
          type="daterange"
          align="right"
          placeholder="充值时间"
          :picker-options="pickerOptions2">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
      <el-table
        :data="tableData"
        :default-sort = "{prop: 'date', order: 'descending'}"
        border
        @selection-change="handleSelectionChange"
        >
        <el-table-column
          type="selection">
        </el-table-column>
        <el-table-column
          label="分销商id"
          sortable
          prop="id"
          >
        </el-table-column>
        <el-table-column
          label="分销商类型"
          sortable
          prop="type"
          >
        </el-table-column>
        <el-table-column
          label="分销商名称"
          prop="name"
          >
        </el-table-column>
        <el-table-column
          label="分销商code"
          prop="code"
          >
        </el-table-column>
        <el-table-column
          label="分销商sign"
          prop="sign"
          >
        </el-table-column>
        <el-table-column
          label="授信额度"
          prop="qouta"
          >
        </el-table-column>
        <el-table-column
          label="余额"
          prop="balance"
          >
        </el-table-column>
        <el-table-column
          label="可用金额"
          prop="available"
          >
        </el-table-column>
        <el-table-column
          label="状态"
          prop="status"
          >
        </el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button @click="showDatePrice(scope.row.id)">
              价格日历
            </el-button>
          </template>
        </el-table-column>
      </el-table>
       <div class="block pagination-wrap">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage4"
          :page-sizes="[100, 200, 300, 400]"
          :page-size="100"
          layout="total, sizes, prev, pager, next, jumper"
          :total="400">
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
                      <el-input v-model="form.daySettlement" :disabled="true" size="small"></el-input>
                    </el-form-item>
                    <el-form-item label="默认分销价：">
                      <el-input v-model="form.dayDistribution" size="small"></el-input>
                    </el-form-item>
                    <el-form-item label="共享库存：">
                      <el-input v-model="form.dayInventoryPooling" size="small"></el-input>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="" size="small">提交</el-button>
                    </el-form-item>
                  </el-form>
                </template>
            </full-calendar>
          </el-col>
          <el-col :span="8">
            <div class="datepicker-title"></div>
            <v-datepickerWithPrice @submitDatePrices=""></v-datepickerWithPrice>
          </el-col>
        </el-row>
      </el-dialog>
  </div>
</template>
<script>
export default {
  components: {
    'full-calendar': require('@/components/calendar/fullCalendar'),
    vDatepickerWithPrice: require('@/components/datepicker/datepickerWithPrice')
  },
  data () {
    return {
      dialogFormCalendar: false,
      fcEvents: [],
      tableData: [{
        id: '1',
        type: 'type',
        name: 'name',
        code: 'code',
        sign: 'sign',
        qouta: 'qouta',
        balance: 'balance',
        status: 'status'
      }],
      currentPage1: 5,
      currentPage2: 5,
      currentPage3: 5,
      currentPage4: 4,
      formInline: {
        user: '',
        region: ''
      },
      dialogFormVisible: false,
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      formLabelWidth: '120px',
      pickerOptions2: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      value7: '',
      multipleSelection: []
    }
  },
  methods: {
    handleEdit (index, row) {
      console.log(index, row)
    },
    handleDelete (index, row) {
      console.log(index, row)
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
    },
    onSubmit () {
      console.log('submit!')
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    showDatePrice (id) {
      this.dialogFormCalendar = true
    },
    changeMonth (start, end, current) {},
    moreClick (day, events, jsEvent) {},
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
    }
  }
}
</script>
<style scoped>
  .search-form-top{
    margin-top: 20px;
  }
  .search-form{
    margin-left: 100px;
    float: right;
  }
</style>
