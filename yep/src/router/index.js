import { createRouter, createWebHashHistory } from 'vue-router'

import CorePage from "@/views/CorePage";
import echarts from "@/views/echarts";

const routes = [
  {
    path: '/',
    name: 'echarts',
    component: echarts,
    //hidden : true   //zm注释掉的
  },
]
const router=createRouter({
  history:createWebHashHistory(),
  routes
})

export default router
