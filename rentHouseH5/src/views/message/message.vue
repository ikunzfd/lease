<template>
  <div class="message-page">
    <EmptyState description="暂无消息">
      <template #default>
        <p class="empty-hint">系统消息和租房提醒会显示在这里</p>
      </template>
    </EmptyState>
  </div>
</template>

<script setup lang="ts">
import EmptyState from '@/components/EmptyState/EmptyState.vue'
</script>

<style lang="less" scoped>
.message-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-hint {
  font-size: 13px;
  color: #969799;
  text-align: center;
}
</style>
