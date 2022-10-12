import { createRouter, createWebHashHistory } from 'vue-router'

import CorePage from "@/views/CorePage";

const routes = [
  {
    path: '/',
    name: 'CorePage',
    component: CorePage,
    //hidden : true   //zm注释掉的
  },
]
const router=createRouter({
  history:createWebHashHistory(),
  routes
})

export default router
