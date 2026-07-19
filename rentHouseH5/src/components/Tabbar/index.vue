<template>
  <van-tabbar route fixed placeholder>
    <van-tabbar-item
      v-for="item in tabList"
      :key="item.path"
      :to="item.path"
      :icon="item.icon"
    >
      {{ item.title }}
    </van-tabbar-item>
  </van-tabbar>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { tabBarRoutes } from '@/router/routes'

const tabList = computed(() =>
  tabBarRoutes.map((r) => ({
    path: r.path,
    title: r.meta?.title as string,
    icon: r.meta?.icon as string,
  })),
)
</script>
