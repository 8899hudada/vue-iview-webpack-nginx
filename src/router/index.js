import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login'
import FaceSeach from '@/components/face_seach'
import Search from '@/components/search'
import Manege from '@/components/manege'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/face_seach',
      name: 'face_seach',
      component: FaceSeach,
      children: [{
        path: 'search',
        name: 'search',
        component: Search
      }, {
        path: 'manege',
        name: 'manege',
        component: Manege
      }]
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    // return 期望滚动到哪个的位置
    return { x: 0, y: 0 }
  }
})
