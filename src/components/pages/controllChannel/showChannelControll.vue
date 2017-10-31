<template>
  <div style="margin-top: 30px;">
    <!--<el-form :inline="true" :model="formInline" class="demo-form-inline">-->
      <!--<el-form-item label="景区id">-->
        <!--<el-input v-model="formInline.user" placeholder="景区id"></el-input>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="景区名称">-->
        <!--<el-input v-model="formInline.user" placeholder="景区名称"></el-input>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="分销状态">-->
        <!--<el-select v-model="formInline.region" placeholder="分销状态">-->
          <!--<el-option label="区域一" value="shanghai"></el-option>-->
          <!--<el-option label="区域二" value="beijing"></el-option>-->
        <!--</el-select>-->
      <!--</el-form-item>-->
      <!--<el-form-item>-->
        <!--<el-button type="primary" @click="onSubmit">查询</el-button>-->
      <!--</el-form-item>-->
    <!--</el-form>-->
      <!--<div style="margin-bottom: 20px">-->
        <!--<el-button>允许分销</el-button>-->
        <!--<el-button>禁止分销</el-button>-->
      <!--</div>-->
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
          prop="scenic_id"
          >
        </el-table-column>
        <el-table-column
          label="分销状态"
          sortable
          prop="status"
          >
        </el-table-column>
        <el-table-column
          label="名称"
          prop="scenic_name"
          >
        </el-table-column>
        <el-table-column
          label="创建人"
          prop="created_id"
          >
        </el-table-column>
        <!--<el-table-column label="操作">-->
          <!--<template scope="scope">-->
            <!--<router-link :to="{path:'/showChannelControllDetail',query:{scenic_id: scope.row.id}}">-->
              <!--<el-button size="small">详情</el-button>-->
            <!--</router-link>-->
          <!--</template>-->
        <!--</el-table-column>-->
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
      <!--<el-dialog title="分销商充值" :visible.sync="dialogFormVisible">-->
        <!--<el-form :model="form">-->
          <!--<el-form-item label="分销商名称" :label-width="formLabelWidth">-->
            <!--测试分销商-->
          <!--</el-form-item>-->
          <!--<el-form-item label="操作人" :label-width="formLabelWidth">-->
            <!--当前账号-->
          <!--</el-form-item>-->
          <!--<el-form-item label="当前可用金额" :label-width="formLabelWidth">-->
            <!--333-->
          <!--</el-form-item>-->
          <!--<el-form-item label="余额" :label-width="formLabelWidth">-->
            <!--333-->
          <!--</el-form-item>-->
          <!--<el-form-item label="充值金额" :label-width="formLabelWidth">-->
            <!--<el-input v-model="form.name" auto-complete="off"></el-input>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="备注" :label-width="formLabelWidth">-->
            <!--<el-input type="textarea" v-model="form.name" auto-complete="off"></el-input>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="活动区域" :label-width="formLabelWidth">-->
            <!--<el-select v-model="form.region" placeholder="请选择活动区域">-->
              <!--<el-option label="区域一" value="shanghai"></el-option>-->
              <!--<el-option label="区域二" value="beijing"></el-option>-->
            <!--</el-select>-->
          <!--</el-form-item>-->
        <!--</el-form>-->
        <!--<div slot="footer" class="dialog-footer">-->
          <!--<el-button @click="dialogFormVisible = false">取 消</el-button>-->
          <!--<el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>-->
        <!--</div>-->
      <!--</el-dialog>-->
  </div>
</template>
<script>
import { sceniclist } from '@/api/api'
export default {
  data () {
    return {
      tableData: [],
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
    }
  },
  created: function () {
    sceniclist().then((response) => {
      this.tableData = response.data.data.data
    })
  }
}
</script>
<style scoped>

</style>
