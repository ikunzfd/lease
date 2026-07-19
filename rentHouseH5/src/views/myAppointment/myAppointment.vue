<template>
  <div class="my-appointment-page">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <div v-if="!loading && list.length === 0">
        <EmptyState description="暂无预约记录">
          <van-button type="primary" size="small" to="/search">去看看房源</van-button>
        </EmptyState>
      </div>

      <div v-for="item in list" :key="item.id" class="card appointment-card" @click="goDetail(item.id)">
        <div class="card-header">
          <van-image
            v-if="item.graphVoList?.[0]?.url"
            :src="item.graphVoList[0].url"
            width="80px"
            height="60px"
            fit="cover"
            radius="6px"
          />
          <div class="header-info">
            <div class="apartment-name">{{ item.apartmentName }}</div>
            <div class="appointment-time">
              <van-icon name="clock-o" size="12" />
              {{ item.appointmentTime }}
            </div>
          </div>
          <van-tag :type="statusType(item.appointmentStatus) as any" size="medium">
            {{ AppointmentStatusMap[item.appointmentStatus] || '未知' }}
          </van-tag>
        </div>
      </div>
    </van-pull-refresh>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getMyAppointmentList } from '@/api/search'
import type { AppointmentItemVo } from '@/api/search/types'
import { AppointmentStatusMap } from '@/enums/constEnums'
import EmptyState from '@/components/EmptyState/EmptyState.vue'

const router = useRouter()
const list = ref<AppointmentItemVo[]>([])
const loading = ref(true)
const refreshing = ref(false)

function goDetail(id: number) {
  router.push(`/appointmentDetail?id=${id}`)
}

function statusType(code: number): string {
  switch (code) {
    case 1: return 'warning'
    case 2: return 'default'
    case 3: return 'success'
    default: return 'default'
  }
}

async function fetchList() {
  try {
    const { data } = await getMyAppointmentList()
    list.value = data || []
  } finally {
    loading.value = false
  }
}

async function onRefresh() {
  refreshing.value = true
  await fetchList()
  refreshing.value = false
}

onMounted(fetchList)
</script>

<style lang="less" scoped>
.my-appointment-page {
  min-height: 100vh;
  padding: 12px;

  .appointment-card {
    .card-header {
      display: flex;
      gap: 10px;
      align-items: center;
    }

    .header-info {
      flex: 1;
      min-width: 0;
    }

    .apartment-name {
      font-size: 15px;
      font-weight: 600;
      margin-bottom: 4px;
    }

    .appointment-time {
      font-size: 12px;
      color: #969799;
    }
  }
}
</style>
