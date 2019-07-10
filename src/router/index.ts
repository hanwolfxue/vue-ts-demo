import Vue from 'vue'
import Router from 'vue-router'
import Demo1 from '@/views/Demo1.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Demo1',
      component: Demo1
    }
  ]
})
