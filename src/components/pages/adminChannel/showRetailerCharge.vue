<template>
  <div style="margin-top: 30px;">
    <div style="float: left;">
      <router-link :to="{path:'/showChannelAdmin'}">
        <el-button type="primary">返回</el-button>
      </router-link>
      <el-button type="primary" @click="dialogFormVisible = true">充值</el-button>
    </div>

    <el-form :inline="true" :model="formInline" class="demo-form-inline" style="float: right;">
      <el-form-item label="订单号">
        <el-input v-model="formInline.user" placeholder="订单号"></el-input>
      </el-form-item>
      <el-form-item label="充值渠道">
        <el-select v-model="formInline.region" placeholder="充值渠道">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="充值时间">
        <el-date-picker
          v-model="searchDate"
          type="daterange"
          align="right"
          placeholder="充值时间"
          :picker-options="pickerOptions2">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchByDate()">查询</el-button>
      </el-form-item>
    </el-form>
      <el-table
        :data="tableData"
        :default-sort = "{prop: 'date', order: 'descending'}"
        border
        >
        <el-table-column
          label="id"
          sortable
          prop="id"
          >
        </el-table-column>
        <el-table-column
          label="充值时间"
          >
          <template scope="scope">
            {{new Date(scope.row.created_at*1000).toLocaleString()}}
          </template>
        </el-table-column>
        <el-table-column
          label="金额(元)"
          prop="recharge_value"
          >
          <template scope="scope">
            {{(scope.row.recharge_value)/100}}
          </template>
        </el-table-column>
        <el-table-column
          label="备注"
          prop="remark"
          >
        </el-table-column>
        <el-table-column
          label="充值人"
          prop="distributor.dis_name"
          >
        </el-table-column>
      </el-table>
       <div class="block pagination-wrap">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[5, 8, 10, 20]"
          :page-size="per_page"
          layout="total, sizes, prev, pager, next, jumper"
          :total=total>
        </el-pagination>
      </div>
      <el-dialog title="分销商充值" :visible.sync="dialogFormVisible">
        <el-form :model="form" ref="form">
          <el-form-item label="分销商名称" :label-width="formLabelWidth">
            测试分销商
          </el-form-item>
          <el-form-item label="操作人" :label-width="formLabelWidth">
            当前账号
          </el-form-item>
          <el-form-item label="当前可用金额" :label-width="formLabelWidth">
            333
          </el-form-item>
          <el-form-item label="余额" :label-width="formLabelWidth">
            222
          </el-form-item>
          <el-form-item label="充值金额" :label-width="formLabelWidth"  prop="amount">
            <el-input v-model="form.value" auto-complete="off" placeholder="金额大于0"></el-input>
          </el-form-item>
          <el-form-item label="备注" :label-width="formLabelWidth">
            <el-input type="textarea" v-model="form.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth">
            <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
  </div>
</template>
<script>
import { getrechargelog, recharge } from '@/api/api'
export default {
  data () {
    return {
      tableData: [],
      formInline: {
        user: '',
        region: ''
      },
      dialogFormVisible: false,
      form: {
        dis_id: this.$route.query.dis_id,
        value: ''
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
      currentPage: 1,
      total: 0,
      per_page: 5,
      searchDate: [],
      rules: {
//        amount: [
//          {required: true, message: '金额不能为空'},
//          {type: 'number', message: '金额必须为数字值'}
//        ]
      }
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
      this.per_page = val
      this.handleGet()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.handleGet()
      console.log(`当前页: ${val}`)
    },
    searchByDate () {
      getrechargelog(this.$route.query.dis_id, this.searchDate).then((response) => {
        console.log(this.searchDate)
        this.tableData = response.data.data.data
      })
    },
    submitForm () {
      recharge(this.form).then((response) => {
        if (response.data.data) {
          this.$notify({
            title: '成功',
            message: `充值成功`,
            type: 'success'
          })
        }
      })
    },
    handleGet () {
      var params = {
        dis_id: this.$route.query.dis_id,
        page: this.currentPage,
        page_size: this.per_page
      }
      getrechargelog(params).then((response) => {
        this.tableData = response.data.data.data
        this.total = response.data.data.total
      })
    }
  },
  created () {
    this.handleGet()
  }
}
</script>
<style scoped>
  .search-from{
    float: right;
  }
</style>
