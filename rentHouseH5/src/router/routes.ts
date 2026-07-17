import type { RouteRecordRaw } from 'vue-router'
import Layout from '@/layout/index.vue'

// Tab 页面路由
const tabBarRoutes: RouteRecordRaw[] = [
  {
    path: '/search',
    name: 'Search',
    component: () => import('@/views/search/search.vue'),
    meta: { title: '找房', icon: 'search', tabbar: true },
  },
  {
    path: '/group',
    name: 'Group',
    component: () => import('@/views/group/group.vue'),
    meta: { title: '圈子', icon: 'star-o', tabbar: true },
  },
  {
    path: '/myRoom',
    name: 'MyRoom',
    component: () => import('@/views/myRoom/myRoom.vue'),
    meta: { title: '我的房间', icon: 'home-o', tabbar: true },
  },
  {
    path: '/message',
    name: 'Message',
    component: () => import('@/views/message/message.vue'),
    meta: { title: '消息', icon: 'comment-o', tabbar: true },
  },
  {
    path: '/userCenter',
    name: 'UserCenter',
    component: () => import('@/views/userCenter/userCenter.vue'),
    meta: { title: '个人中心', icon: 'user-o', tabbar: true },
  },
]

// 详情/独立页面路由
const otherRoutes: RouteRecordRaw[] = [
  {
    path: '/roomDetail',
    name: 'RoomDetail',
    component: () => import('@/views/roomDetail/roomDetail.vue'),
    meta: { title: '房间详情' },
  },
  {
    path: '/apartmentDetail',
    name: 'ApartmentDetail',
    component: () => import('@/views/apartmentDetail/apartmentDetail.vue'),
    meta: { title: '公寓详情' },
  },
  {
    path: '/appointment',
    name: 'Appointment',
    component: () => import('@/views/appointment/appointment.vue'),
    meta: { title: '预约看房' },
  },
  {
    path: '/myAppointment',
    name: 'MyAppointment',
    component: () => import('@/views/myAppointment/myAppointment.vue'),
    meta: { title: '我的预约' },
  },
  {
    path: '/myAgreement',
    name: 'MyAgreement',
    component: () => import('@/views/myAgreement/myAgreement.vue'),
    meta: { title: '我的租约' },
  },
  {
    path: '/agreement',
    name: 'Agreement',
    component: () => import('@/views/agreement/agreement.vue'),
    meta: { title: '租约详情' },
  },
  {
    path: '/browsingHistory',
    name: 'BrowsingHistory',
    component: () => import('@/views/browsingHistory/browsingHistory.vue'),
    meta: { title: '浏览历史' },
  },
]

// 登录页（独立路由，不使用 Layout）
const loginRoute: RouteRecordRaw = {
  path: '/login',
  name: 'Login',
  component: () => import('@/views/login/login.vue'),
  meta: { title: '登录' },
}

export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Root',
    component: Layout,
    redirect: '/search',
    children: [...tabBarRoutes, ...otherRoutes],
  },
  loginRoute,
  {
    path: '/:pathMatch(.*)*',
    redirect: '/search',
  },
]

export { tabBarRoutes }
