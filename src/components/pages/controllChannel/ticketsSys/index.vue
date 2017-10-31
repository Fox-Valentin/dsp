<template>
    <div class="activePublic ">
          <el-tabs  @tab-click="handleClick" :activeName="activeName">
            <el-tab-pane label="基本信息" name="first">
              <el-row>
                <el-col :span="12">
                  <v-ticketStep1 @changeTab="changeTab" @changeStatus="changeStatus"></v-ticketStep1>
                </el-col>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="购买须知" name="second" :disabled="isDisabled">
              <v-ticketStep2 @changeTab="changeTab"></v-ticketStep2>
            </el-tab-pane>
            <el-tab-pane label="退改规则" name="third" :disabled="isDisabled">
              <v-ticketStep3 @changeTab="changeTab"></v-ticketStep3>
            </el-tab-pane>
            <el-tab-pane label="基本风控" name="fourth" :disabled="isDisabled">
              <v-ticketStep4 @changeTab="changeTab"></v-ticketStep4>
            </el-tab-pane>
            <el-tab-pane label="游客信息" name="fifth" :disabled="isDisabled">
              <v-ticketStep5 @changeTab="changeTab"></v-ticketStep5>
            </el-tab-pane>
            <el-tab-pane label="库存价格" name="sixth" :disabled="isDisabled">
              <v-ticketStep6 @changeTab="changeTab"></v-ticketStep6>
            </el-tab-pane>
            <el-tab-pane label="单票价格" name="seventh" :disabled="isDisabled">
              <v-ticketStep7 @changeTab="changeTab"></v-ticketStep7>
            </el-tab-pane>
          </el-tabs>
    </div>
</template>

<script>
   export default {
     components: {
       vTicketStep1: require('./step1'),
       vTicketStep2: require('./step2'),
       vTicketStep3: require('./step3'),
       vTicketStep4: require('./step4'),
       vTicketStep5: require('./step5'),
       vTicketStep6: require('./step6'),
       vTicketStep7: require('./step7')
     },
     name: 'ticketStep1',
     data: function () {
       return {
         isRouter: false,
         preview: true,
         preStep: false,
         nextStep: true,
         publish: false,
         activeName: 'first',
         isDisabled: true
       }
     },
     methods: {
       handleClick (tab, event) {
         this.activeName = tab.name
         this.$store.commit('updateActiveKey', tab.index)
       },
       changeTab (activeName) {
         this.activeName = activeName
       },
       changeStatus (status) {
         this.isDisabled = status
       }
     },
     watch: {
       '$route': function (to, from) {
         this.isRouter = true
       }
     },
     mounted () {
       if (this.$route.query.ticket_id) {
         this.$store.commit('updateProductId', this.$route.query.ticket_id)
         this.isDisabled = false
       }
       this.$store.commit('updateActiveKey', 0)
     }
   }

</script>
<style>
  .activePublic {margin-left: 100px;}
  .activePublic .router-link{color:#fff;}
  .activePublic .but-group .el-button{margin-right: 20px;}
  .submit-but-right {margin-left: 600px;}
</style>
