<template>
  <div class="search-page">
    <!-- 搜索栏 -->
    <div class="search-bar-section">
      <van-search
        v-model="searchText"
        shape="round"
        placeholder="搜索公寓或房源"
        @search="onSearch"
      />
      <van-dropdown-menu>
        <van-dropdown-item title="区域" ref="regionDropdown">
          <div class="region-selector">
            <div class="region-column">
              <div
                v-for="p in provinceList"
                :key="p.id"
                class="region-item"
                :class="{ active: selectedProvince?.id === p.id }"
                @click="selectProvince(p)"
              >
                {{ p.name }}
              </div>
            </div>
            <div class="region-column">
              <div
                v-for="c in cityList"
                :key="c.id"
                class="region-item"
                :class="{ active: selectedCity?.id === c.id }"
                @click="selectCity(c)"
              >
                {{ c.name }}
              </div>
            </div>
            <div class="region-column">
              <div
                v-for="d in districtList"
                :key="d.id"
                class="region-item"
                :class="{ active: selectedDistrict?.id === d.id }"
                @click="selectDistrict(d)"
              >
                {{ d.name }}
              </div>
            </div>
          </div>
        </van-dropdown-item>

        <van-dropdown-item title="租金" ref="rentDropdown">
          <div class="rent-selector">
            <div
              v-for="item in rentRanges"
              :key="item.label"
              class="rent-chip"
              :class="{ active: activeRentRange === item.label }"
              @click="selectRentRange(item)"
            >
              {{ item.label }}
            </div>
          </div>
        </van-dropdown-item>

        <van-dropdown-item title="筛选" ref="filterDropdown">
          <div class="filter-section">
            <div class="filter-group">
              <div class="filter-title">排序方式</div>
              <div class="filter-chips">
                <div
                  v-for="item in orderOptions"
                  :key="item.value"
                  class="filter-chip"
                  :class="{ active: activeOrder === item.value }"
                  @click="activeOrder = item.value"
                >
                  {{ item.label }}
                </div>
              </div>
            </div>
            <van-button type="primary" round block class="confirm-btn" @click="applyFilter">
              确认筛选
            </van-button>
          </div>
        </van-dropdown-item>
      </van-dropdown-menu>
    </div>

    <!-- 房间列表 -->
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <RoomCard
          v-for="room in roomList"
          :key="room.id"
          :room="room"
          class="mx-3 mb-3"
        />
        <EmptyState v-if="!loading && roomList.length === 0" description="暂无房源信息" />
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { showToast } from 'vant'
import { getRoomList, getProvinceList, getCityList, getDistrictList } from '@/api/search'
import type { RoomItemVo, RegionInfo } from '@/api/search/types'
import RoomCard from '@/components/RoomCard/RoomCard.vue'
import EmptyState from '@/components/EmptyState/EmptyState.vue'

// 搜索文本
const searchText = ref('')

// 地区选择
const provinceList = ref<RegionInfo[]>([])
const cityList = ref<RegionInfo[]>([])
const districtList = ref<RegionInfo[]>([])
const selectedProvince = ref<RegionInfo | null>(null)
const selectedCity = ref<RegionInfo | null>(null)
const selectedDistrict = ref<RegionInfo | null>(null)

const rentRanges = [
  { label: '不限', min: undefined, max: undefined },
  { label: '1000元以下', min: 0, max: 1000 },
  { label: '1000-1500元', min: 1000, max: 1500 },
  { label: '1500-2000元', min: 1500, max: 2000 },
  { label: '2000-2500元', min: 2000, max: 2500 },
  { label: '2500-3000元', min: 2500, max: 3000 },
  { label: '3000元以上', min: 3000, max: 99999 },
]
const activeRentRange = ref('不限')

const orderOptions = [
  { label: '默认', value: '' },
  { label: '价格从低到高', value: 'asc' },
  { label: '价格从高到低', value: 'desc' },
]
const activeOrder = ref('')

// 列表状态
const roomList = ref<RoomItemVo[]>([])
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)
const current = ref(1)
const pageSize = 10

// Dropdown refs
const regionDropdown = ref()
const rentDropdown = ref()
const filterDropdown = ref()

// 搜索参数
const queryParams = reactive<Record<string, any>>({})

// 初始加载省份
async function initRegion() {
  try {
    const { data } = await getProvinceList()
    provinceList.value = data || []
  } catch {}
}

async function selectProvince(p: RegionInfo) {
  selectedProvince.value = p
  selectedCity.value = null
  selectedDistrict.value = null
  districtList.value = []
  delete queryParams.provinceId
  delete queryParams.cityId
  delete queryParams.districtId
  try {
    const { data } = await getCityList(p.id)
    cityList.value = data || []
  } catch {}
}

async function selectCity(c: RegionInfo) {
  selectedCity.value = c
  selectedDistrict.value = null
  delete queryParams.cityId
  delete queryParams.districtId
  try {
    const { data } = await getDistrictList(c.id)
    districtList.value = data || []
  } catch {}
}

function selectDistrict(d: RegionInfo) {
  selectedDistrict.value = d
  queryParams.provinceId = selectedProvince.value?.id
  queryParams.cityId = selectedCity.value?.id
  queryParams.districtId = d.id
  regionDropdown.value?.toggle()
  resetAndLoad()
}

function selectRentRange(item: (typeof rentRanges)[number]) {
  activeRentRange.value = item.label
  queryParams.minRent = item.min
  queryParams.maxRent = item.max
  rentDropdown.value?.toggle()
  resetAndLoad()
}

function applyFilter() {
  queryParams.orderType = activeOrder.value
  filterDropdown.value?.toggle()
  resetAndLoad()
}

function onSearch() {
  queryParams.searchText = searchText.value || undefined
  resetAndLoad()
}

function resetAndLoad() {
  current.value = 1
  roomList.value = []
  finished.value = false
  onLoad()
}

async function onLoad() {
  if (refreshing.value) return
  loading.value = true
  try {
    const { data } = await getRoomList({
      current: current.value,
      size: pageSize,
      ...queryParams,
    })
    if (data?.records) {
      roomList.value = [...roomList.value, ...data.records]
      if (data.records.length < pageSize) {
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
  roomList.value = []
  finished.value = false
  try {
    const { data } = await getRoomList({
      current: 1,
      size: pageSize,
      ...queryParams,
    })
    if (data?.records) {
      roomList.value = data.records
      if (data.records.length < pageSize) {
        finished.value = true
      } else {
        current.value = 2
      }
    }
  } catch {
    // ignore
  } finally {
    refreshing.value = false
  }
}

initRegion()
</script>

<style lang="less" scoped>
.search-page {
  background-color: @bg-color;
  min-height: 100vh;
}

.search-bar-section {
  position: sticky;
  top: 0;
  z-index: 10;
  background: #fff;
}

.region-selector {
  display: flex;
  height: 300px;

  .region-column {
    flex: 1;
    overflow-y: auto;
    background: #f7f8fa;

    &:nth-child(2),
    &:nth-child(3) {
      background: #fff;
    }
  }

  .region-item {
    padding: 12px 16px;
    font-size: 14px;
    color: #323233;
    cursor: pointer;

    &.active {
      color: #1989fa;
      background: #fff;
      font-weight: 500;
    }

    &:nth-child(2) &.active,
    &:nth-child(3) &.active {
      background: #f7f8fa;
    }
  }
}

.rent-selector {
  display: flex;
  flex-wrap: wrap;
  padding: 12px;

  .rent-chip {
    width: calc(33.33% - 8px);
    margin: 4px;
    padding: 10px 0;
    text-align: center;
    background: #f7f8fa;
    border-radius: 4px;
    font-size: 13px;
    color: #323233;

    &.active {
      background: #e8f2ff;
      color: #1989fa;
    }
  }
}

.filter-section {
  padding: 12px;
}

.filter-group {
  margin-bottom: 16px;
}

.filter-title {
  font-size: 13px;
  color: #969799;
  margin-bottom: 8px;
}

.filter-chips {
  display: flex;
  flex-wrap: wrap;
}

.filter-chip {
  padding: 8px 16px;
  margin: 0 8px 8px 0;
  background: #f7f8fa;
  border-radius: 4px;
  font-size: 13px;
  color: #323233;

  &.active {
    background: #e8f2ff;
    color: #1989fa;
  }
}

.confirm-btn {
  margin-top: 8px;
}
</style>
