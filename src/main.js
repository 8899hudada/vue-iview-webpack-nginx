// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import axios from 'axios'

import iview from 'iview'
import './assets/css/reset.css'
import 'iview/dist/styles/iview.css'

Vue.use(iview)

Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  iview.LoadingBar.start()
  if (to.name !== 'login') {
    if (!sessionStorage.getItem('token')) {
      // router.replace({
      //   name: 'login'
      // })
      next()
    } else {
      next()
    }
  } else {
    next()
  }
  iview.LoadingBar.finish()
})

router.afterEach(() => {
  iview.LoadingBar.finish()
  window.scrollTo(0, 0)
})

// 状态管理
const baseURL = {
  development: '/api/v1', // 后台通过 ngnix 跳转
  // development: 'http://172.16.2.104:5420/api/v1', // 暂时的假的接口
  production: '/api/v1'
}

let instance = axios.create({
  baseURL: baseURL[process.env.NODE_ENV]
})

// 请求拦截器
instance.interceptors.request.use(
  config => {
    let token = sessionStorage.getItem('token')
    if (token) { // 判断是否存在token，如果存在的话，则每个http header都加上token
      config.headers = {token: token}
    }
    return config
  },
  err => {
    return Promise.reject(err)
  })

instance.interceptors.response.use(function (res) {
  if (res.data.code === 403) {
    iview.Notice.error({
      title: 'request error',
      desc: `${res.data.result}`,
      duration: 7
    })
    this.$router.replace({
      name: 'login'
    })
  } else if (res.data.code !== 200) {
    iview.Notice.error({
      title: 'request error',
      desc: `${res.data.result}` || `${res.result}`,
      duration: 7
    })
    return false
  } else {
    return res
  }
})

Vue.prototype.$http = instance

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
