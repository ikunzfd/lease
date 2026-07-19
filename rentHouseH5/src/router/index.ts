import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { constantRoutes } from './routes'
import { useUserStore } from '@/store/modules/user'
import { LOGIN_URL, ROUTER_WHITE_LIST } from '@/config/config'
import NProgress from '@/config/nprogress'

const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes as RouteRecordRaw[],
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

router.beforeEach((to, from, next) => {
  NProgress.start()

  const userStore = useUserStore()

  // 1. 访问登录页，有 token 就跳转到首页
  if (to.path === LOGIN_URL) {
    if (userStore.token) return next('/search')
    return next()
  }

  // 2. 白名单直接放行
  if (ROUTER_WHITE_LIST.includes(to.path)) return next()

  // 3. 无 token 跳转登录页
  if (!userStore.token) {
    return next({ path: LOGIN_URL, query: { redirect: to.fullPath } })
  }

  // 4. 放行
  next()
})

router.afterEach(() => {
  NProgress.done()
})

router.onError(() => {
  NProgress.done()
})

export default router
