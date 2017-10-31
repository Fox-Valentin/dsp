<template>
  <div style="margin-top: 30px;">
    <router-link :to="{path:'/ticketAdd'}">
      <el-button type="primary" class="float-left">添加产品</el-button>
    </router-link>
    <el-form :inline="true" :model="formInline" class="demo-form-inline search-form">
      <el-form-item label="价格体系名称">
        <el-input v-model="formInline.user" placeholder="价格体系名称"></el-input>
      </el-form-item>
      <el-form-item label="价格体系id">
        <el-input v-model="formInline.user" placeholder="价格体系id"></el-input>
      </el-form-item>
      <el-form-item label="分销状态">
        <el-select v-model="formInline.region" placeholder="分销状态">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <div style="margin-bottom: 20px;float: left;margin-left: 40px;">
      <el-button @click="allowDis()">允许分销</el-button>
      <el-button type="danger" @click="forbiddenDis()">禁止分销</el-button>
    </div>
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
      >
        <template scope="scope">
            <el-tag v-if="scope.row.status"
              :type="'success'" close-transition>分销</el-tag>
            <el-tag v-else
              :type="'primary'" close-transition>禁止分销</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="创建人"
        prop="code"
      >
      </el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
          <router-link :to="{path:'/ticketAdd', query: {ticket_id: scope.row.id}}">
            <el-button size="small">编辑</el-button>
          </router-link>
          <el-button size="small" type="danger" @click="dropTicketById(scope.row.id)">
            删除
          </el-button>
          <router-link :to="{path:'/showTicketDiss', query: {ticket_id: scope.row.id}}">
            <el-button size="small">分销商管理</el-button>
          </router-link>
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
    <el-dialog title="分销商充值" :visible.sync="dialogFormVisible">
      <el-form :model="form">
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
          333
        </el-form-item>
        <el-form-item label="充值金额" :label-width="formLabelWidth">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="活动区域" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import { ticketsList, updateTicketsStatus, dropTicket } from '@/api/api'
  export default {
    data () {
      return {
        tableData: [],
        currentPage: 1,
        total: 0,
        per_page: 5,
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
        this.per_page = val
        ticketsList(1, this.per_page).then((response) => {
          this.tableData = response.data.data.data
        })
      },
      handleCurrentChange (val) {
        ticketsList(val, this.per_page).then((response) => {
          this.tableData = response.data.data.data
        })
      },
      onSubmit () {
        console.log('submit!')
      },
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      allowDis () {
        if (this.multipleSelection.length === 0) { return }
        let ids = this.multipleSelection.map((ele) => {
          return ele.id
        })
        updateTicketsStatus(ids, 'allow').then((response) => {
          console.log(response.data)
          this.getTicketList()
        })
      },
      forbiddenDis () {
        if (this.multipleSelection.length === 0) { return }
        let ids = this.multipleSelection.map((ele) => {
          return ele.id
        })
        updateTicketsStatus(ids, 'forbidden').then((response) => {
          console.log(response.data)
          this.getTicketList()
        })
      },
      getTicketList () {
        ticketsList().then((response) => {
          this.tableData = response.data.data.data
          this.total = response.data.data.total
        })
      },
      dropTicketById (id) {
        dropTicket(id)
        this.getTicketList()
      }
    },
    created: function () {
      this.getTicketList()
    }
  }
</script>
<style scoped>
  .search-form{
    float: right;
  }
  .float-left{
    float: left;
  }
</style>
