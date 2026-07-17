<template>
  <div class="apartment-detail-page" v-if="apartment">
    <!-- 图片轮播 -->
    <van-swipe :autoplay="3000" indicator-color="#1989fa" class="apartment-swipe">
      <van-swipe-item v-for="(img, idx) in apartment.graphVoList" :key="idx">
        <van-image :src="img.url" width="100%" height="240px" fit="cover" />
      </van-swipe-item>
    </van-swipe>

    <!-- 基本信息 -->
    <div class="card apartment-basic">
      <h2 class="apartment-name">{{ apartment.name }}</h2>
      <div class="price-tag" v-if="apartment.minRent">
        <span class="price-label">最低</span>
        <span class="price-value">¥{{ apartment.minRent }}/月起</span>
      </div>
      <div class="tags-row" v-if="apartment.labelInfoList?.length">
        <van-tag
          v-for="label in apartment.labelInfoList"
          :key="label.id"
          plain
          type="primary"
          size="medium"
          class="mr-1 mb-1"
        >
          {{ label.name }}
        </van-tag>
      </div>
      <div class="address-row">
        <van-icon name="location-o" size="14" />
        <span>{{ apartment.provinceName }}{{ apartment.cityName }}{{ apartment.districtName }}{{ apartment.addressDetail }}</span>
      </div>
    </div>

    <!-- 公寓介绍 -->
    <div class="card" v-if="apartment.introduction">
      <div class="section-title">公寓介绍</div>
      <p class="introduction-text">{{ apartment.introduction }}</p>
    </div>

    <!-- 配套设施 -->
    <div class="card" v-if="apartment.facilityInfoList?.length">
      <div class="section-title">社区配套</div>
      <van-grid :column-num="4" :border="false">
        <van-grid-item
          v-for="fac in apartment.facilityInfoList"
          :key="fac.id"
          :text="fac.name"
          icon="checked"
        />
      </van-grid>
    </div>

    <!-- 该公寓房间列表 -->
    <div class="card room-list-section">
      <div class="section-title">可选房间</div>
      <RoomCard
        v-for="room in roomList"
        :key="room.id"
        :room="room"
        class="mb-3"
      />
      <EmptyState v-if="!roomLoading && roomList.length === 0" description="暂无可用房间" />
      <div class="text-center py-2">
        <van-loading v-if="roomLoading" size="20" />
        <span v-else-if="roomFinished && roomList.length > 0" class="text-xs text-gray-400">没有更多了</span>
      </div>
    </div>

    <!-- 底部操作栏 -->
    <div class="bottom-bar">
      <van-button
        icon="phone-o"
        type="default"
        class="call-btn"
        v-if="apartment.phone"
        @click="callPhone"
      >
        电话咨询
      </van-button>
      <van-button type="primary" class="appointment-btn" @click="goAppointment">
        预约看房
      </van-button>
    </div>

    <PageLoading v-if="loading" type="detail" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showToast } from 'vant'
import { getApartmentDetailById, getRoomListByApartmentId } from '@/api/search'
import type { ApartmentDetailVo, RoomItemVo } from '@/api/search/types'
import RoomCard from '@/components/RoomCard/RoomCard.vue'
import EmptyState from '@/components/EmptyState/EmptyState.vue'
import PageLoading from '@/components/PageLoading/PageLoading.vue'

const route = useRoute()
const router = useRouter()

const apartment = ref<ApartmentDetailVo | null>(null)
const loading = ref(true)
const roomList = ref<RoomItemVo[]>([])
const roomLoading = ref(false)
const roomFinished = ref(false)
const roomCurrent = ref(1)

onMounted(async () => {
  const id = Number(route.query.id)
  if (!id) return
  try {
    const { data } = await getApartmentDetailById(id)
    apartment.value = data
    loadRooms(id)
  } finally {
    loading.value = false
  }
})

async function loadRooms(apartmentId: number) {
  roomLoading.value = true
  try {
    const { data } = await getRoomListByApartmentId({
      current: roomCurrent.value,
      size: 10,
      id: apartmentId,
    })
    if (data?.records) {
      roomList.value = [...roomList.value, ...data.records]
      roomFinished.value = data.records.length < 10
    } else {
      roomFinished.value = true
    }
  } catch {
    roomFinished.value = true
  } finally {
    roomLoading.value = false
  }
}

function goAppointment() {
  if (apartment.value) {
    router.push(`/appointment?apartmentId=${apartment.value.id}`)
  }
}

function callPhone() {
  if (apartment.value?.phone) {
    window.location.href = `tel:${apartment.value.phone}`
  }
}
</script>

<style lang="less" scoped>
.apartment-detail-page {
  padding-bottom: 80px;
}

.apartment-swipe {
  img {
    display: block;
  }
}

.apartment-basic {
  .apartment-name {
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 8px;
  }

  .price-tag {
    margin-bottom: 10px;

    .price-label {
      font-size: 12px;
      background: #ee0a24;
      color: #fff;
      padding: 1px 6px;
      border-radius: 4px;
      margin-right: 6px;
    }

    .price-value {
      font-size: 18px;
      font-weight: 600;
      color: #ee0a24;
    }
  }

  .address-row {
    margin-top: 10px;
    font-size: 13px;
    color: #646566;
    display: flex;
    align-items: flex-start;
    gap: 4px;
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

.introduction-text {
  font-size: 14px;
  line-height: 1.8;
  color: #646566;
}

.room-list-section {
  margin-top: 0;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  gap: 10px;
  padding: 10px 16px;
  padding-bottom: calc(10px + env(safe-area-inset-bottom));
  background: #fff;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.04);

  .call-btn {
    flex: 1;
    border-radius: 20px;
  }

  .appointment-btn {
    flex: 2;
    border-radius: 20px;
  }
}
</style>
