<template>
  <div>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="景区id">
        <el-input placeholder="景区id"></el-input>
      </el-form-item>
      <el-form-item label="景区名称">
        <el-input placeholder="景区名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      ref="multipleTable"
      :data="secnicList"
      border
      tooltip-effect="dark"
      style="width: 100%"
      @select="selectTravelPoi"
      >
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        prop="id"
        label="ID"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="scenic_name"
        label="名称"
        show-overflow-tooltip>
      </el-table-column>
    </el-table>
    <div class="block pagination-wrap-travel pagination-wrap">
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
    <div slot="footer" class="dialog-footer dialog-footer-right">
      <el-button @click="closePoidialog">取 消</el-button>
      <el-button type="primary" @click="submitScenic">确 定</el-button>
    </div>
  </div>
</template>
<script>
export default {
  props: ['secnicList', 'checkList'],
  data () {
    return {
      currentPage: 1,
      total: 0,
      per_page: 5,
      checkedList: this.checkList
    }
  },
  methods: {
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.per_page = val
      // this.handleGet()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      // this.handleGet()
      console.log(`当前页: ${val}`)
    },
    selectTravelPoi (selection, row) {
      if (this.checkedList.indexOf(row.id) === -1) {
        this.checkList.push(row.id)
      }
    },
    closePoidialog () {
      this.$emit('close')
    },
    submitScenic () {
      this.$emit('submit', this.checkList)
    }
  }
}
</script>
<style scoped>
  .pagination-wrap-travel {
    margin-top:20px;
    margin-bottom:20px;
  }
  .dialog-footer-right{
    float:right;
    margin-bottom:20px;
  }
  . {

  }
</style>
