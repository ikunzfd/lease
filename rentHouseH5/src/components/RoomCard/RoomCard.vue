<template>
  <div class="room-card card" @click="handleClick">
    <van-image
      v-if="room.graphVoList?.length"
      :src="firstImage"
      width="100%"
      height="180px"
      fit="cover"
      radius="8px"
    >
      <template #error>
        <div class="image-placeholder">
          <van-icon name="photo-o" size="40" color="#dcdee0" />
        </div>
      </template>
    </van-image>
    <div v-else class="image-placeholder">
      <van-icon name="photo-o" size="40" color="#dcdee0" />
    </div>
    <div class="room-info">
      <div class="room-header">
        <span class="room-number">{{ room.roomNumber }}</span>
        <span class="room-rent">
          <span class="currency">¥</span>
          <span class="price">{{ room.rent }}</span>
          <span class="unit">/月</span>
        </span>
      </div>
      <div class="room-tags" v-if="room.labelInfoList?.length">
        <van-tag
          v-for="label in room.labelInfoList.slice(0, 3)"
          :key="label.id"
          plain
          type="primary"
          size="medium"
          class="mr-1"
        >
          {{ label.name }}
        </van-tag>
      </div>
      <div class="apartment-name text-ellipsis">
        <van-icon name="location-o" size="12" />
        {{ apartmentName }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { RoomItemVo } from '@/api/search/types'

const props = defineProps<{
  room: RoomItemVo
}>()

const router = useRouter()

const firstImage = computed(() => {
  return props.room.graphVoList?.[0]?.url || ''
})

const apartmentName = computed(() => {
  const a = props.room.apartmentInfo
  if (!a) return ''
  return `${a.name} · ${a.districtName || a.cityName || ''}`
})

function handleClick() {
  router.push(`/roomDetail?id=${props.room.id}`)
}
</script>

<style lang="less" scoped>
.room-card {
  overflow: hidden;
}

.image-placeholder {
  width: 100%;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
}

.room-info {
  padding: 10px 0 0;
}

.room-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.room-number {
  font-size: 15px;
  font-weight: 600;
  color: #323233;
}

.room-rent {
  .currency {
    font-size: 12px;
    color: #ee0a24;
  }
  .price {
    font-size: 18px;
    font-weight: 700;
    color: #ee0a24;
  }
  .unit {
    font-size: 11px;
    color: #ee0a24;
  }
}

.room-tags {
  margin-bottom: 6px;
}

.apartment-name {
  font-size: 12px;
  color: #969799;
}
</style>
