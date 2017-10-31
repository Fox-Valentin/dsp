// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import 'element-ui/lib/theme-default/reset.css'
// import Mock from './mock'
// Mock.bootstrap()

Vue.use(ElementUI)

Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
  created () {
    this.checkLogin()
  },
  methods: {
    checkLogin () {
      // 检查是否token
      if (!localStorage.getItem('currentUser_token')) {
        // 如果没有登录状态则跳转到登录页
        this.$router.push('/login')
      }
    }
  }
})
