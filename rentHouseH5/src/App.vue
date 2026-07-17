<template>
  <van-config-provider :theme="darkMode ? 'dark' : 'light'">
    <router-view />
  </van-config-provider>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDarkModeStore } from '@/store/modules/darkMode'

const darkModeStore = useDarkModeStore()
const darkMode = computed(() => darkModeStore.darkMode)
</script>
