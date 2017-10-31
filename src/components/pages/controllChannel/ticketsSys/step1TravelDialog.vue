<template>
  <div>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="景区id">
        <el-input placeholder="景区id"></el-input>
      </el-form-item>
      <template v-if="priceType === '1'">
        <el-form-item label="景区名称">
          <el-input placeholder="景区名称"></el-input>
        </el-form-item>
      </template>
      <el-form-item>
        <el-button type="primary">查询</el-button>
      </el-form-item>
    </el-form>
    <div v-if="priceType === '1'">
      <el-collapse v-model="activeNames">
        <template v-for="list in lists">
          <el-collapse-item :title=" list.scenic_name ">
            <el-radio-group v-model="price_id">
              <template v-for="price in list.scenic_prices">
                <div class="scenicListWrap">
                  <el-radio :label="price.id">(id:{{price.id}})--{{price.price_name}}</el-radio>
                </div>
              </template>
            </el-radio-group>
          </el-collapse-item>
        </template>
      </el-collapse>
    </div>
    <div v-else>
      <el-radio-group v-model="price_id">
        <template v-for="list in lists">
          <div class="scenicListWrap">
            <el-radio :label="list.id">{{list.id}}--{{list.name}}</el-radio>
          </div>
        </template>
      </el-radio-group>
    </div>
    <div class="block pagination-wrap-poi pagination-wrap">
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
    <div slot="footer" class="dialog-footer dialog-footer-right">
        <el-button @click="closeTravelPoiDialog">取 消</el-button>
        <el-button type="primary" @click="submitPrice">确 定</el-button>
      </div>
  </div>
</template>
<script>
import { getTravelScenicToTicketsList, getTravelTicketGroup } from '@/api/api'
export default {
  props: ['priceType'],
  data () {
    return {
      lists: [],
      price_type: '1',
      currentPage: 1,
      total: 0,
      pageSize: 5,
      price_id: 0,
      activeNames: ['1']
    }
  },
  methods: {
    handleSizeChange (val) {
      this.pageSize = val
      this.getHandle()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getHandle()
    },
    closeTravelPoiDialog () {
      this.$emit('close')
    },
    submitPrice () {
      this.$emit('submitPriceId', this.price_id)
    },
    getHandle () {
      var params = {
        per_page: this.pageSize,
        page: this.currentPage
      }
      if (this.priceType === '1') {
        getTravelScenicToTicketsList(params).then((response) => {
          this.lists = response.data.data.data
          this.total = response.data.data.total
        })
      } else {
        getTravelTicketGroup(params).then((response) => {
          this.lists = response.data.data.data
          this.total = response.data.data.total
        })
      }
    }
  },
  created () {
    this.getHandle()
  }
}
</script>
<style scoped>
  .scenicListWrap{
    padding-top:10px;
    padding-bottom:10px;
  }
  .pagination-wrap-poi {
    margin-top:20px;
    margin-bottom:20px;
  }
  .dialog-footer-right{
    float:right;
    margin-bottom:20px;
  }
</style>
