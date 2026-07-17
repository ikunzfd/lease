<template>
  <van-tabbar v-model="active" route fixed placeholder>
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
import { useRoute } from 'vue-router'
import { tabBarRoutes } from '@/router/routes'

const route = useRoute()

const active = computed(() => {
  const idx = tabList.value.findIndex((t) => t.path === route.path)
  return idx >= 0 ? idx : 0
})

const tabList = computed(() =>
  tabBarRoutes.map((r) => ({
    path: r.path,
    title: r.meta?.title as string,
    icon: r.meta?.icon as string,
  })),
)
</script>
