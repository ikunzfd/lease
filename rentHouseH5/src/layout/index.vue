<template>
  <div class="app-layout">
    <NavBar />
    <div class="layout-content" :class="{ 'with-tabbar': showTabbar }">
      <router-view v-slot="{ Component }">
        <keep-alive :include="['Search']">
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </div>
    <Tabbar v-if="showTabbar" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import NavBar from '@/components/NavBar/index.vue'
import Tabbar from '@/components/Tabbar/index.vue'
import { tabBarRoutes } from '@/router/routes'

const route = useRoute()

const showTabbar = computed(() => {
  const tabPaths = tabBarRoutes.map((r) => r.path)
  return tabPaths.includes(route.path)
})
</script>

<style lang="less" scoped>
.app-layout {
  min-height: 100vh;
  background-color: #f7f8fa;
}

.layout-content {
  padding-bottom: 16px;
  min-height: 100vh;

  &.with-tabbar {
    padding-bottom: 60px;
  }
}
</style>
