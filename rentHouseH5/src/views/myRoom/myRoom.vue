<template>
  <div class="my-room-page">
    <!-- 顶部 Banner -->
    <div class="room-banner">
      <div class="banner-content">
        <h2 class="banner-title">我的房间</h2>
        <p class="banner-subtitle">在这里管理您的租约</p>
      </div>
    </div>

    <!-- 租约列表 -->
    <div class="section-header">我的租约</div>

    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <div v-if="!loading && list.length === 0">
        <EmptyState description="暂无租约">
          <van-button type="primary" size="small" to="/search">去看看房源</van-button>
        </EmptyState>
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
            <div class="lease-date" v-if="item.leaseStartDate">
              {{ item.leaseStartDate }} ~ {{ item.leaseEndDate }}
            </div>
          </div>
          <div class="header-right">
            <van-tag :type="(statusType(item.leaseStatus) as any)" size="medium">
              {{ LeaseStatusMap[item.leaseStatus] || '未知' }}
            </van-tag>
            <span class="rent">¥{{ item.rent }}/月</span>
          </div>
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
import { LeaseStatusMap } from '@/enums/constEnums'
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
.my-room-page {
  min-height: 100vh;
}

.room-banner {
  background: linear-gradient(135deg, #1989fa 0%, #07c160 100%);
  padding: 24px 16px;

  .banner-title {
    font-size: 22px;
    font-weight: 700;
    color: #fff;
    margin-bottom: 4px;
  }

  .banner-subtitle {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.8);
  }
}

.section-header {
  font-size: 15px;
  font-weight: 600;
  padding: 12px 16px;
  color: #323233;
}

.agreement-card {
  margin: 0 12px 12px;
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
}
</style>
