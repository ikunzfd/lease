<template>
  <div class="room-detail-page">
    <!-- 加载中 -->
    <PageLoading v-if="loading" type="detail" />

    <!-- 错误状态 -->
    <EmptyState
      v-else-if="!room"
      description="房间信息加载失败"
      action-text="返回上一页"
      @action="router.back"
    />

    <template v-else>
    <!-- 图片轮播 -->
    <van-swipe :autoplay="3000" indicator-color="#1989fa" class="room-swipe">
      <van-swipe-item v-for="(img, idx) in room.graphVoList" :key="idx">
        <van-image :src="img.url" width="100%" height="260px" fit="cover" />
      </van-swipe-item>
      <template #indicator>
        <div class="swipe-indicator">{{ room.graphVoList.length }}张图片</div>
      </template>
    </van-swipe>

    <!-- 基本信息 -->
    <div class="card room-basic">
      <div class="price-row">
        <span class="price"><em>¥</em>{{ room.rent }}<span class="unit">/月</span></span>
        <span class="room-num">{{ room.roomNumber }}</span>
      </div>
      <div class="tags-row" v-if="room.labelInfoList?.length">
        <van-tag
          v-for="label in room.labelInfoList"
          :key="label.id"
          plain
          type="primary"
          size="medium"
          class="mr-1 mb-1"
        >
          {{ label.name }}
        </van-tag>
      </div>
    </div>

    <!-- 房间属性 -->
    <div class="card" v-if="room.attrValueVoList?.length">
      <div class="section-title">基本信息</div>
      <van-grid :column-num="3" :border="false">
        <van-grid-item
          v-for="attr in room.attrValueVoList"
          :key="attr.id"
          :text="attr.attrKeyName"
          :icon="getAttrIcon(attr.attrKeyName)"
        >
          <template #text>
            <div class="attr-item">
              <span class="attr-key">{{ attr.attrKeyName }}</span>
              <span class="attr-value">{{ attr.name }}</span>
            </div>
          </template>
        </van-grid-item>
      </van-grid>
    </div>

    <!-- 配套设施 -->
    <div class="card" v-if="room.facilityInfoList?.length">
      <div class="section-title">配套设施</div>
      <van-grid :column-num="4" :border="false">
        <van-grid-item
          v-for="fac in room.facilityInfoList"
          :key="fac.id"
          :text="fac.name"
          :icon="getFacilityIcon(fac.icon)"
        />
      </van-grid>
    </div>

    <!-- 费用说明 -->
    <div class="card" v-if="room.feeValueVoList?.length">
      <div class="section-title">费用说明</div>
      <div class="fee-list">
        <div class="fee-item" v-for="fee in room.feeValueVoList" :key="fee.id">
          <span class="fee-name">{{ fee.feeKeyName }} - {{ fee.name }}</span>
          <span class="fee-unit">{{ fee.unit }}</span>
        </div>
      </div>
    </div>

    <!-- 租期选择 -->
    <div class="card" v-if="room.leaseTermList?.length">
      <div class="section-title">可选租期</div>
      <div class="term-list">
        <van-tag
          v-for="term in room.leaseTermList"
          :key="term.id"
          plain
          size="medium"
          class="mr-2 mb-2"
        >
          {{ term.monthCount }}{{ term.unit }}
        </van-tag>
      </div>
    </div>

    <!-- 支付方式 -->
    <div class="card" v-if="room.paymentTypeList?.length">
      <div class="section-title">支付方式</div>
      <div class="payment-item" v-for="pay in room.paymentTypeList" :key="pay.id">
        <span class="payment-name">{{ pay.name }}</span>
        <span class="payment-info">{{ pay.payMonthCount }} / {{ pay.additionalInfo }}</span>
      </div>
    </div>

    <!-- 公寓信息 -->
    <div class="card apartment-card" v-if="room.apartmentItemVo" @click="goApartment">
      <div class="section-title">所属公寓</div>
      <div class="apartment-info">
        <van-image
          v-if="room.apartmentItemVo.graphVoList?.[0]?.url"
          :src="room.apartmentItemVo.graphVoList[0].url"
          width="80px"
          height="60px"
          fit="cover"
          radius="6px"
        />
        <div class="apartment-text">
          <div class="apartment-name">{{ room.apartmentItemVo.name }}</div>
          <div class="apartment-addr text-ellipsis">
            {{ room.apartmentItemVo.provinceName }}{{ room.apartmentItemVo.cityName }}{{ room.apartmentItemVo.districtName }}{{ room.apartmentItemVo.addressDetail }}
          </div>
          <div class="apartment-phone">电话：{{ room.apartmentItemVo.phone }}</div>
        </div>
        <van-icon name="arrow" color="#969799" />
      </div>
    </div>

    <!-- 底部操作栏 -->
    <div class="bottom-bar">
      <van-button type="primary" size="large" round @click="goAppointment">
        预约看房
      </van-button>
    </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getRoomDetailById } from '@/api/search'
import type { RoomDetailVo } from '@/api/search/types'
import { getFacilityIcon } from '@/enums/constEnums'
import PageLoading from '@/components/PageLoading/PageLoading.vue'

const route = useRoute()
const router = useRouter()

const room = ref<RoomDetailVo | null>(null)
const loading = ref(true)

onMounted(async () => {
  const id = Number(route.query.id)
  if (!id) return
  try {
    const { data } = await getRoomDetailById(id)
    room.value = data
  } finally {
    loading.value = false
  }
})

function goAppointment() {
  if (room.value) {
    router.push(`/appointment?apartmentId=${room.value.apartmentId}&roomId=${room.value.id}`)
  }
}

function goApartment() {
  if (room.value?.apartmentItemVo) {
    router.push(`/apartmentDetail?id=${room.value.apartmentItemVo.id}`)
  }
}

// 根据属性名称映射 Vant 图标
function getAttrIcon(attrKeyName: string): string {
  const iconMap: Record<string, string> = {
    '面积': 'chart-trending-o',
    '楼层': 'smile-comment-o',
    '朝向': 'eye-o',
    '户型': 'home-o',
    '装修': 'brush-o',
    '配置': 'gem-o',
    '类型': 'label-o',
    '付款方式': 'gold-coin-o',
  }
  for (const [key, val] of Object.entries(iconMap)) {
    if (attrKeyName.includes(key)) return val
  }
  return 'records'
}
</script>

<style lang="less" scoped>
.room-detail-page {
  padding-bottom: 80px;
}

.room-swipe {
  position: relative;

  .swipe-indicator {
    position: absolute;
    right: 12px;
    bottom: 12px;
    background: rgba(0, 0, 0, 0.5);
    color: #fff;
    font-size: 12px;
    padding: 2px 8px;
    border-radius: 10px;
  }
}

.room-basic {
  .price-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 10px;

    .price {
      color: #ee0a24;
      em {
        font-size: 16px;
        font-style: normal;
      }
      font-size: 26px;
      font-weight: 700;

      .unit {
        font-size: 13px;
        font-weight: 400;
      }
    }

    .room-num {
      font-size: 14px;
      color: #969799;
    }
  }
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  color: #323233;
  margin-bottom: 10px;
  padding-left: 4px;
  border-left: 3px solid #1989fa;
}

.attr-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;

  .attr-key {
    font-size: 12px;
    color: #969799;
  }

  .attr-value {
    font-size: 14px;
    font-weight: 600;
    color: #323233;
  }
}

.fee-list {
  .fee-item {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid #f5f5f5;

    &:last-child {
      border-bottom: none;
    }
  }

  .fee-name {
    font-size: 14px;
    color: #323233;
  }

  .fee-unit {
    font-size: 13px;
    color: #969799;
  }
}

.payment-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }

  .payment-name {
    font-size: 14px;
    font-weight: 500;
  }

  .payment-info {
    font-size: 13px;
    color: #969799;
  }
}

.apartment-card {
  cursor: pointer;

  .apartment-info {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .apartment-text {
    flex: 1;
    min-width: 0;
  }

  .apartment-name {
    font-size: 15px;
    font-weight: 600;
    margin-bottom: 4px;
  }

  .apartment-addr {
    font-size: 12px;
    color: #969799;
    margin-bottom: 2px;
  }

  .apartment-phone {
    font-size: 12px;
    color: #1989fa;
  }
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10px 16px;
  padding-bottom: calc(10px + env(safe-area-inset-bottom));
  background: #fff;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.04);
}
</style>
