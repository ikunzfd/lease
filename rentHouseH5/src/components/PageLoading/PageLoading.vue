<template>
  <div class="page-loading">
    <van-skeleton title :row="type === 'detail' ? 10 : type === 'card' ? 3 : 5" />
    <van-skeleton v-if="type === 'card'" title :row="3" class="mt-4" />
    <van-skeleton v-if="type === 'card'" title :row="3" class="mt-4" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  type?: 'card' | 'detail' | 'list'
}>()
</script>

<style lang="less" scoped>
.page-loading {
  padding: 16px;
}
</style>
