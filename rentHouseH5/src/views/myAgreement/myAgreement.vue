<template>
  <div class="my-agreement-page">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <div v-if="!loading && list.length === 0">
        <EmptyState description="暂无租约信息" />
      </div>

      <div v-for="item in list" :key="item.id" class="card agreement-card" @click="goDetail(item.id)">
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
            <div class="apartment-name">{{ item.apartmentName }}</div>
            <div class="room-number">{{ item.roomNumber }}</div>
            <div class="lease-date">{{ item.leaseStartDate }} ~ {{ item.leaseEndDate }}</div>
          </div>
          <div class="header-right">
            <van-tag :type="statusType(item.leaseStatus?.code)" size="medium">
              {{ item.leaseStatus?.name }}
            </van-tag>
            <span class="rent">¥{{ item.rent }}/月</span>
          </div>
        </div>
        <div class="card-footer" v-if="item.sourceType">
          <van-tag plain type="primary" size="small">{{ item.sourceType.name }}</van-tag>
          <van-icon name="arrow" color="#969799" />
        </div>
      </div>
    </van-pull-refresh>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getMyAgreementList } from '@/api/search'
import type { AgreementItemVo } from '@/api/search/types'
import EmptyState from '@/components/EmptyState/EmptyState.vue'

const router = useRouter()
const list = ref<AgreementItemVo[]>([])
const loading = ref(true)
const refreshing = ref(false)

function statusType(code: number): string {
  switch (code) {
    case 1:
    case 7: return 'primary'
    case 2: return 'success'
    case 3:
    case 4:
    case 6: return 'default'
    case 5: return 'warning'
    default: return 'default'
  }
}

function goDetail(id: number) {
  router.push(`/agreement?id=${id}`)
}

async function fetchList() {
  try {
    const { data } = await getMyAgreementList()
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
.my-agreement-page {
  min-height: 100vh;
  padding: 12px;

  .agreement-card {
    cursor: pointer;

    .card-header {
      display: flex;
      gap: 10px;
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

    .room-number {
      font-size: 13px;
      color: #646566;
      margin-bottom: 4px;
    }

    .lease-date {
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
        margin-top: 4px;
      }
    }

    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 10px;
      padding-top: 10px;
      border-top: 1px solid #f5f5f5;
    }
  }
}
</style>
