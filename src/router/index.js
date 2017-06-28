import Vue from 'vue'
import Router from 'vue-router'
import InteractiveBus from '@/components/InteractiveBus'
import RichEditor from '@/components/RichEditor'
import NotFound from '@/components/NotFound'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/topic'
    },
    {
      path: '/topic/:topic/messages/:id',
      component: InteractiveBus
    },
    {
      path: '/topic/:topic?',
      component: InteractiveBus
    },
    {
      path: '/editor',
      component: RichEditor
    },
    {
      path: '*',
      component: NotFound
    }
  ]
})
