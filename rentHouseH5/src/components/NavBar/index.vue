<template>
  <van-nav-bar
    v-if="showNavBar"
    :title="title"
    :left-arrow="showBackArrow"
    fixed
    placeholder
    @click-left="onClickLeft"
  >
    <template #right>
      <van-icon name="setting-o" size="20" @click="toggleDark" />
    </template>
  </van-nav-bar>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDarkModeStore } from '@/store/modules/darkMode'
import { tabBarRoutes } from '@/router/routes'

const route = useRoute()
const router = useRouter()
const darkModeStore = useDarkModeStore()

const tabPaths = tabBarRoutes.map((r) => r.path)

const showNavBar = computed(() => {
  return !tabPaths.includes(route.path)
})

const showBackArrow = computed(() => {
  return !tabPaths.includes(route.path)
})

const title = computed(() => {
  return (route.meta.title as string) || ''
})

function onClickLeft() {
  router.back()
}

function toggleDark() {
  darkModeStore.toggleDarkMode()
}
</script>
