<template>
  <div style="margin-top: 30px;">
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="id"
        label="id"
        width="180">
      </el-table-column>
      <el-table-column
        prop="oid"
        label="订单号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="refund_no"
        label="退款编号">
      </el-table-column>
      <el-table-column
        prop="master_order.order_name"
        label="退款编号">
      </el-table-column>
      <el-table-column
        prop="master_order.order_id"
        label="退款编号">
      </el-table-column>
      <el-table-column
        prop="master_order.user_name"
        label="退款编号">
      </el-table-column>
      <el-table-column label="退款审核">
        <template scope="scope">
          <el-button size="small" @click="approveOp(scope.row.id)">同意</el-button>
          <el-button size="small">拒绝</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import { orderList, approveOrderRefund } from '@/api/api'
  export default {
    data () {
      return {
        tableData: []
      }
    },
    methods: {
      approveOp (id) {
        console.log('同意')
        this.$confirm('此操作将同意退款, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          approveOrderRefund(id).then(response => console.log(response.data))
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    },
    created: function () {
      orderList().then((response) => {
        this.tableData = response.data
      })
    }
  }
</script>
