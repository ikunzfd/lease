<template>
  <div class="agreement-detail-page" v-if="detail">
    <!-- 公寓信息 -->
    <div class="card">
      <div class="section-title">签约公寓</div>
      <div class="info-row">
        <van-image
          v-if="detail.apartmentGraphVoList?.[0]?.url"
          :src="detail.apartmentGraphVoList[0].url"
          width="80px"
          height="60px"
          fit="cover"
          radius="6px"
        />
        <div class="info-text">
          <div class="name">{{ detail.apartmentName }}</div>
        </div>
      </div>
    </div>

    <!-- 房间信息 -->
    <div class="card">
      <div class="section-title">签约房间</div>
      <div class="info-row">
        <van-image
          v-if="detail.roomGraphVoList?.[0]?.url"
          :src="detail.roomGraphVoList[0].url"
          width="80px"
          height="60px"
          fit="cover"
          radius="6px"
        />
        <div class="info-text">
          <div class="name">{{ detail.roomNumber }}</div>
        </div>
      </div>
    </div>

    <!-- 承租人信息 -->
    <div class="card">
      <div class="section-title">承租人信息</div>
      <van-cell-group inset>
        <van-cell title="姓名" :value="detail.name" />
        <van-cell title="手机号" :value="detail.phone" />
        <van-cell title="身份证号" :value="detail.identificationNumber" />
      </van-cell-group>
    </div>

    <!-- 租约信息 -->
    <div class="card">
      <div class="section-title">租约信息</div>
      <van-cell-group inset>
        <van-cell title="租期" :value="`${detail.leaseTermMonthCount}${detail.leaseTermUnit}`" />
        <van-cell title="支付方式" :value="detail.paymentTypeName" />
        <van-cell title="起租日期" :value="detail.leaseStartDate" />
        <van-cell title="到期日期" :value="detail.leaseEndDate" />
        <van-cell title="租约来源" :value="detail.sourceType?.name" />
        <van-cell title="状态">
          <template #value>
            <van-tag :type="statusType(detail.status?.code)" size="small">
              {{ detail.status?.name }}
            </van-tag>
          </template>
        </van-cell>
      </van-cell-group>
    </div>

    <!-- 费用信息 -->
    <div class="card">
      <div class="section-title">费用信息</div>
      <van-cell-group inset>
        <van-cell title="月租金">
          <template #value>
            <span class="text-red-500 font-bold">¥{{ detail.rent }}</span>
          </template>
        </van-cell>
        <van-cell title="押金">¥{{ detail.deposit }}</van-cell>
      </van-cell-group>
    </div>

    <!-- 操作按钮 -->
    <div class="card" v-if="actionButtons.length > 0">
      <div class="action-buttons">
        <van-button
          v-for="btn in actionButtons"
          :key="btn.label"
          :type="btn.type"
          round
          block
          :loading="btn.loading"
          class="mb-2"
          @click="btn.action"
        >
          {{ btn.label }}
        </van-button>
      </div>
    </div>

    <PageLoading v-if="loading" type="detail" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showToast, showConfirmDialog } from 'vant'
import { getAgreementDetailById, updateAgreementStatusById } from '@/api/search'
import type { AgreementDetailVo } from '@/api/search/types'
import PageLoading from '@/components/PageLoading/PageLoading.vue'

const route = useRoute()
const router = useRouter()

const detail = ref<AgreementDetailVo | null>(null)
const loading = ref(true)
const btnLoading = ref<string | null>(null)

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

interface ActionButton {
  label: string
  type: 'primary' | 'warning' | 'danger' | 'default'
  action: () => void
  loading: boolean
}

const actionButtons = computed<ActionButton[]>(() => {
  if (!detail.value) return []
  const code = detail.value.status?.code
  const id = detail.value.id

  const btns: ActionButton[] = []

  if (code === 1) {
    // 签约待确认
    btns.push({
      label: '确认签约',
      type: 'primary',
      action: () => updateStatus(id, 2, '确认签约'),
      loading: btnLoading.value === 'confirm',
    })
    btns.push({
      label: '取消',
      type: 'default',
      action: () => updateStatus(id, 3, '取消租约'),
      loading: btnLoading.value === 'cancel',
    })
  } else if (code === 2) {
    // 已签约
    btns.push({
      label: '续约',
      type: 'primary',
      action: () => updateStatus(id, 7, '申请续约'),
      loading: btnLoading.value === 'renew',
    })
    btns.push({
      label: '提前退租',
      type: 'warning',
      action: () => updateStatus(id, 5, '申请退租'),
      loading: btnLoading.value === 'withdraw',
    })
  } else if (code === 5) {
    // 退租待确认
    btns.push({
      label: '确认退租',
      type: 'primary',
      action: () => updateStatus(id, 6, '确认退租'),
      loading: btnLoading.value === 'confirmWithdraw',
    })
  }

  return btns
})

async function updateStatus(id: number, status: number, actionLabel: string) {
  try {
    await showConfirmDialog({
      title: '确认操作',
      message: `确定要${actionLabel}吗？`,
    })
  } catch {
    return
  }

  btnLoading.value = actionLabel
  try {
    await updateAgreementStatusById(id, status)
    showToast('操作成功')
    // 重新加载数据
    const { data } = await getAgreementDetailById(id)
    detail.value = data
  } catch {
    // error handled in interceptor
  } finally {
    btnLoading.value = null
  }
}

onMounted(async () => {
  const id = Number(route.query.id)
  if (!id) return
  try {
    const { data } = await getAgreementDetailById(id)
    detail.value = data
  } finally {
    loading.value = false
  }
})
</script>

<style lang="less" scoped>
.agreement-detail-page {
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

.action-buttons {
  padding: 8px 0;
}
</style>
