<template>
  <div class="search-form-top">
    <!--<router-link :to="{path:'/addChanelAdmin'}">-->
    <!--</router-link>-->
    <el-button type="primary" @click="handleAdd()">添加分销商</el-button>
    <el-form :inline="true"   class="demo-form-inline search-form">
      <el-form-item label="分销商id">
        <el-input  placeholder="分销商id" v-model="search_id"></el-input>
      </el-form-item>
      <el-form-item label="分销商名称">
        <el-input  placeholder="分销商名称" v-model="search_dis_name"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">查询</el-button>
      </el-form-item>
    </el-form>
      <el-table
        :data="tableData"
        style="width: 100%"
        :default-sort = "{prop: 'date', order: 'descending'}"
        border
        >
        <el-table-column
          label="分销商id"
          sortable
          prop="id"
          >
        </el-table-column>
        <el-table-column
          label="分销商类型"
          prop="dis_type"
          >
        </el-table-column>
        <el-table-column
          label="分销商名称"
          prop="dis_name"
          >
        </el-table-column>
        <el-table-column
          label="分销商code"
          prop="dis_code"
          >
        </el-table-column>
        <el-table-column
          label="分销商sign"
          prop="dis_sign"
          >
        </el-table-column>
        <el-table-column
          label="授信额度(元)"
          prop="credit_value"
          >
          <template scope="scope">
            {{scope.row.credit_value/100}}
          </template>
        </el-table-column>
        <el-table-column
          label="余额(元)"
          prop="balance"
          >
          <template scope="scope">
            {{scope.row.balance/100}}
          </template>
        </el-table-column>
        <el-table-column
          label="可用金额(元)"
          prop="available"
          >
          <template scope="scope">
            {{(scope.row.credit_value+scope.row.balance)/100}}
          </template>
        </el-table-column>
        <el-table-column
          label="分销状态"
          prop="dis_status"
          >
          <template scope="scope">
            <el-tag v-if="scope.row.dis_status"
                    :type="'success'" close-transition>分销</el-tag>
            <el-tag v-else
                    :type="'primary'" close-transition>禁止分销</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="预警值(元)"
          prop="warning_value"
          >
          <template scope="scope">
            {{(scope.row.warning_value)/100}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="240">
          <template scope="scope">
            <el-button size="small"  @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="small"  @click="ticketMan(scope.row.id)">门票管理</el-button>
            <el-dropdown>
            <el-button type="primary" size="small">
              更多<i class="el-icon-caret-bottom el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item><el-button size="small" type="text"  @click="resetSign(scope.$index, scope.row)">重置sign</el-button></el-dropdown-item>
              <el-dropdown-item><router-link :to="{path:'/showRetailerCharge', query: { dis_id: scope.row.id }}">充值记录</router-link></el-dropdown-item>
              <el-dropdown-item><router-link :to="{path:'/showRetailerCash', query: { dis_id: scope.row.id }}">提现记录</router-link></el-dropdown-item>
              <el-dropdown-item><el-button size="small" type="text"  @click="showAccount(scope.$index, scope.row)">账户设置</el-button></el-dropdown-item>
              <el-dropdown-item><router-link :to="{path:'/showRetailerCashRecord', query: { dis_id: scope.row.id }}">消费记录</router-link></el-dropdown-item>
              <el-dropdown-item><router-link :to="{path:'/showRetailerStatements', query: { dis_id: scope.row.id }}">流水记录</router-link></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          </template>
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
          :total="total">
        </el-pagination>
      </div>
      <el-dialog title="编辑分销商" :visible.sync="dialogFormVisible" size="tiny">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm" style="width: 500px;">
          <el-form-item label="分销商类型" prop="dis_type">
            <el-radio-group v-model="ruleForm.dis_type">
              <el-radio label="ota"></el-radio>
              <el-radio label="其他"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="分销商名称" prop="dis_name" style="width: 500px;">
            <el-input v-model="ruleForm.dis_name"  placeholder="请输入分销商名称">></el-input>
          </el-form-item>
          <el-form-item label="分销商code" prop="dis_code" style="width: 500px;">
            <el-input v-model="ruleForm.dis_code"  placeholder="请输入分销商code">></el-input>
          </el-form-item>
          <el-form-item label="分销状态" prop="dis_status">
              <el-radio-group v-model="ruleForm.dis_status">
                <el-radio label="1">允许分销</el-radio>
                <el-radio label="0">禁止分销</el-radio>
              </el-radio-group>
          </el-form-item>
          <!--<el-form-item label="开启通知" prop="dis_status">-->
            <!--<el-radio-group v-model="">-->
              <!--<el-radio label="1">启用</el-radio>-->
              <!--<el-radio label="0">禁用</el-radio>-->
            <!--</el-radio-group>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="通知URL地址" prop="name">-->
            <!--<el-input v-model="ruleForm.name"  placeholder="请输入通知URL地址">></el-input>-->
          <!--</el-form-item>-->
          <el-form-item label="开启余额" prop="credit_status">
            <el-radio-group v-model="ruleForm.credit_status">
              <el-radio label="1">启用</el-radio>
              <el-radio label="0">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <el-dialog title="账户设置" :visible.sync="dialogFormVisible1" size="tiny">
        <el-form :model="accountForm" label-width="150px" class="demo-ruleForm">
          <el-form-item label="余额(人民币/元)" prop="name">
            <el-input v-model="accountForm.balance"></el-input>
          </el-form-item>
          <el-form-item label="信用额度(人民币/元)" prop="name">
            <el-input v-model="accountForm.credit_value"></el-input>
          </el-form-item>
          <el-form-item label="报警额度(人民币/元)" prop="name">
            <el-input v-model="accountForm.warning_value"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="updateAccount">立即创建</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
  </div>
</template>
<script>
import { dislist, modifydis, addsign, addcredit } from '../../../api/api'
export default {
  data () {
    return {
      tableData: [],
      currentPage: 1,
      total: 0,
      per_page: 5,
      dialogFormVisible: false,
      dialogFormVisible1: false,
      ruleForm: {
        id: 0,
        dis_type: '',
        dis_name: '',
        dis_code: '',
        dis_sign: '',
        credit_value: 0,
        balance: 0,
        dis_status: 1,
        credit_status: 1
      },
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        region: [
          { required: true, message: '请选择活动区域', trigger: 'change' }
        ],
        date1: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
        date2: [
          { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
        ],
        type: [
          { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
        ],
        resource: [
          { required: true, message: '请选择活动资源', trigger: 'change' }
        ],
        desc: [
          { required: true, message: '请填写活动形式', trigger: 'blur' }
        ]
      },
      search_id: null,
      search_dis_name: '',
      accountForm: {
        dis_id: null,
        credit_value: '',
        balance: '',
        warning_value: ''
      }
    }
  },
  methods: {
    handleEdit (index, row) {
      this.dialogFormVisible = true
      this.ruleForm = row
      this.ruleForm.credit_status = this.ruleForm.credit_status.toString()
      this.ruleForm.dis_status = this.ruleForm.dis_status.toString()
      this.dis_title = '编辑分销商'
      console.log(index, row)
    },
    handleAdd () {
      this.dis_title = '增加分销商'
      this.ruleForm = {
        id: 0,
        dis_type: '',
        dis_name: '',
        dis_code: '',
        dis_sign: '',
        credit_value: 0,
        balance: 0,
        dis_status: 1,
        credit_status: 1
      }
      this.dialogFormVisible = true
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
    resetSign (index, row) {
      addsign(row.id).then((response) => {
        row.dis_sign = response.data.data
      })
    },
    submitForm () {
      const params = {
        'dis_id': this.ruleForm.id,
        'dis_name': this.ruleForm.dis_name,
        'dis_type': this.ruleForm.dis_type,
        'dis_code': this.ruleForm.dis_code,
        'dis_status': this.ruleForm.dis_status,
        'credit_status': this.ruleForm.credit_status
      }
      if (this.dis_title === '编辑分销商') {
        params.id = null
      }
      modifydis(params).then((response) => {
        if (response.data.msg === 'success') {
          this.dialogFormVisible = false
          this.$notify({
            title: '成功',
            message: ` ${this.dis_title} 成功`,
            type: 'success'
          })
        }
      })
    },
    ticketMan (id) {
      this.$router.push({path: '/showDisTickets', query: {id: id}})
    },
    handleGet () {
      var params = {
        page: this.currentPage,
        page_size: this.per_page
      }
      dislist(params).then((response) => {
        this.tableData = response.data.data.data
        this.total = response.data.data.total
      })
    },
    handleSearch () {
      var params = {
        search: {
          dis_name: this.search_dis_name,
          id: this.search_id
        }
      }
      dislist(params).then((response) => {
        this.tableData = response.data.data.data
        this.total = response.data.data.total
      })
    },
    showAccount (index, row) {
      this.dialogFormVisible1 = true
      this.accountForm.credit_value = row.credit_value
      this.accountForm.balance = row.balance
      this.accountForm.warning_value = row.warning_value
      this.accountForm.dis_id = row.id
    },
    updateAccount () {
      var params = this.accountForm
      addcredit(params).then((response) => {
        if (response.data.data) {
          this.$notify({
            title: '成功',
            message: `设置成功`,
            type: 'success'
          })
          this.dialogFormVisible1 = false
          this.handleGet()
        }
      })
    }
  },
  created: function () {
    this.handleGet()
  },
  computed: {
    rest_value: () => {}
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
