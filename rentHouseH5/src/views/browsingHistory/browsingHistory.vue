<template>
  <div class="browsing-history-page">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <div v-for="item in list" :key="item.id" class="card history-card" @click="goRoom(item.roomId)">
          <div class="card-header">
            <van-image
              v-if="item.roomGraphVoList?.[0]?.url"
              :src="item.roomGraphVoList[0].url"
              width="80px"
              height="60px"
              fit="cover"
              radius="6px"
            />
            <div class="header-info">
              <div class="room-number">{{ item.roomNumber }}</div>
              <div class="apartment-name">{{ item.apartmentName }}</div>
              <div class="location">
                {{ item.provinceName }}{{ item.cityName }}{{ item.districtName }}
              </div>
            </div>
            <div class="header-right">
              <span class="rent">¥{{ item.rent }}/月</span>
              <span class="time">{{ formatTime(item.browseTime) }}</span>
            </div>
          </div>
        </div>

        <EmptyState v-if="!loading && list.length === 0" description="暂无浏览记录" />
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getHistoryList } from '@/api/search'
import type { HistoryItemVo } from '@/api/search/types'
import EmptyState from '@/components/EmptyState/EmptyState.vue'
import dayjs from 'dayjs'

const router = useRouter()
const list = ref<HistoryItemVo[]>([])
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)
const current = ref(1)

function formatTime(time: string) {
  return dayjs(time).format('MM-DD HH:mm')
}

function goRoom(roomId: number) {
  router.push(`/roomDetail?id=${roomId}`)
}

async function onLoad() {
  if (refreshing.value) return
  loading.value = true
  try {
    const { data } = await getHistoryList({ current: current.value, size: 10 })
    if (data?.records) {
      list.value = [...list.value, ...data.records]
      if (data.records.length < 10) {
        finished.value = true
      } else {
        current.value++
      }
    } else {
      finished.value = true
    }
  } catch {
    finished.value = true
  } finally {
    loading.value = false
  }
}

async function onRefresh() {
  refreshing.value = true
  current.value = 1
  list.value = []
  finished.value = false
  try {
    const { data } = await getHistoryList({ current: 1, size: 10 })
    if (data?.records) {
      list.value = data.records
      if (data.records.length < 10) {
        finished.value = true
      } else {
        current.value = 2
      }
    }
  } catch {}
  refreshing.value = false
}
</script>

<style lang="less" scoped>
.browsing-history-page {
  padding: 12px;
  min-height: 100vh;
}

.history-card {
  cursor: pointer;
  margin-bottom: 8px;

  .card-header {
    display: flex;
    gap: 10px;
  }

  .header-info {
    flex: 1;
    min-width: 0;
  }

  .room-number {
    font-size: 15px;
    font-weight: 600;
    margin-bottom: 4px;
  }

  .apartment-name {
    font-size: 13px;
    color: #646566;
    margin-bottom: 2px;
  }

  .location {
    font-size: 12px;
    color: #969799;
  }

  .header-right {
    text-align: right;

    .rent {
      display: block;
      font-size: 16px;
      font-weight: 700;
      color: #ee0a24;
    }

    .time {
      display: block;
      font-size: 11px;
      color: #969799;
      margin-top: 2px;
    }
  }
}
</style>
