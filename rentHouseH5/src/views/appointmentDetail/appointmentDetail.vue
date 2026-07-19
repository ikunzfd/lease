<template>
  <div class="appointment-detail-page" v-if="detail">
    <!-- 公寓信息 -->
    <div class="card">
      <div class="section-title">预约公寓</div>
      <div class="info-row" v-if="detail.apartmentItemVo">
        <van-image
          v-if="detail.apartmentItemVo.graphVoList?.[0]?.url"
          :src="detail.apartmentItemVo.graphVoList[0].url"
          width="80px"
          height="60px"
          fit="cover"
          radius="6px"
        />
        <div class="info-text">
          <div class="name">{{ detail.apartmentItemVo.name }}</div>
          <div class="addr text-sm text-gray-500 mt-1">
            {{ detail.apartmentItemVo.provinceName }}{{ detail.apartmentItemVo.cityName }}{{ detail.apartmentItemVo.districtName }}{{ detail.apartmentItemVo.addressDetail }}
          </div>
        </div>
      </div>
    </div>

    <!-- 预约人信息 -->
    <div class="card">
      <div class="section-title">预约人信息</div>
      <van-cell-group inset>
        <van-cell title="姓名" :value="detail.name" />
        <van-cell title="手机号" :value="detail.phone" />
        <van-cell title="预约时间" :value="detail.appointmentTime" />
        <van-cell title="备注" :value="detail.additionalInfo || '无'" />
      </van-cell-group>
    </div>

    <!-- 状态信息 -->
    <div class="card">
      <div class="section-title">预约状态</div>
      <div class="status-section">
        <van-tag :type="(statusType(detail.appointmentStatus) as any)" size="large">
          {{ AppointmentStatusMap[detail.appointmentStatus] || '未知' }}
        </van-tag>
      </div>
    </div>

    <!-- 加载中 -->
    <PageLoading v-if="loading" type="detail" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getAppointmentDetailById } from '@/api/search'
import type { AppointmentDetailVo } from '@/api/search/types'
import { AppointmentStatusMap } from '@/enums/constEnums'
import PageLoading from '@/components/PageLoading/PageLoading.vue'

const route = useRoute()

const detail = ref<AppointmentDetailVo | null>(null)
const loading = ref(true)

function statusType(code: number): string {
  switch (code) {
    case 1: return 'warning'
    case 2: return 'default'
    case 3: return 'success'
    default: return 'default'
  }
}

onMounted(async () => {
  const id = Number(route.query.id)
  if (!id) return
  try {
    const { data } = await getAppointmentDetailById(id)
    detail.value = data
  } finally {
    loading.value = false
  }
})
</script>

<style lang="less" scoped>
.appointment-detail-page {
  padding-bottom: 30px;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  color: #323233;
  margin-bottom: 10px;
  padding-left: 4px;
  border-left: 3px solid #1989fa;
}

.info-row {
  display: flex;
  gap: 10px;
  align-items: center;

  .info-text {
    .name {
      font-size: 15px;
      font-weight: 600;
    }
  }
}

.status-section {
  padding: 8px 0;
}
</style>
