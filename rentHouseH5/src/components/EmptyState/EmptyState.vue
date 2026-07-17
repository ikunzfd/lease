<template>
  <van-empty :description="description" :image="showImage ? 'default' : undefined">
    <slot />
  </van-empty>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    description?: string
    showImage?: boolean
  }>(),
  {
    description: '暂无数据',
    showImage: true,
  },
)
</script>
