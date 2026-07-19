<template>
  <div class="appointment-page">
    <div class="card">
      <!-- 房间信息 -->
      <div class="room-preview" v-if="roomInfo">
        <h3 class="text-base font-semibold">预约房间</h3>
        <div class="info-row mt-2">
          <van-image
            v-if="roomInfo.graphVoList?.[0]?.url"
            :src="roomInfo.graphVoList[0].url"
            width="80px"
            height="60px"
            fit="cover"
            radius="6px"
          />
          <div class="info-text">
            <div class="name">{{ roomInfo.roomNumber }}</div>
            <div class="rent">¥{{ roomInfo.rent }}/月</div>
          </div>
        </div>
      </div>

      <!-- 公寓信息 -->
      <div class="apartment-preview" v-if="apartment">
        <h3 class="text-base font-semibold" :class="{ 'mt-3': !!roomInfo }">
          {{ roomInfo ? '所属公寓' : '预约公寓' }}
        </h3>
        <div class="info-row mt-2">
          <van-image
            v-if="apartment.graphVoList?.[0]?.url"
            :src="apartment.graphVoList[0].url"
            width="80px"
            height="60px"
            fit="cover"
            radius="6px"
          />
          <div class="info-text">
            <div class="name">{{ apartment.name }}</div>
            <p class="text-sm text-gray-500 mt-1">
              {{ apartment.provinceName }}{{ apartment.cityName }}{{ apartment.districtName }}{{ apartment.addressDetail }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <van-form @submit="handleSubmit">
        <van-field
          v-model="form.name"
          label="姓名"
          placeholder="请输入您的姓名"
          :rules="[{ required: true, message: '请输入姓名' }]"
        />
        <van-field
          v-model="form.phone"
          label="手机号"
          placeholder="请输入手机号"
          type="tel"
          :rules="[
            { required: true, message: '请输入手机号' },
            { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' },
          ]"
        />
        <van-field
          v-model="form.appointmentTime"
          is-link
          readonly
          label="预约时间"
          placeholder="请选择预约时间"
          :rules="[{ required: true, message: '请选择预约时间' }]"
          @click="showDatetimePicker = true"
        />
        <van-field
          v-model="form.additionalInfo"
          label="备注"
          placeholder="有什么需要特别说明的（选填）"
          type="textarea"
          rows="3"
          autosize
        />

        <div class="p-3">
          <van-button round block type="primary" native-type="submit" :loading="submitting">
            提交预约
          </van-button>
        </div>
      </van-form>
    </div>

    <!-- 时间选择器 -->
    <van-popup v-model:show="showDatetimePicker" position="bottom" round>
      <van-date-picker
        v-model="currentDate"
        title="选择预约时间"
        :min-date="new Date()"
        @confirm="onConfirmDate"
        @cancel="showDatetimePicker = false"
      />
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showToast } from 'vant'
import { getApartmentDetailById, getRoomDetailById, saveOrUpdateAppointment } from '@/api/search'
import type { ApartmentDetailVo, RoomDetailVo } from '@/api/search/types'
import { useUserStore } from '@/store/modules/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const apartment = ref<ApartmentDetailVo | null>(null)
const roomInfo = ref<RoomDetailVo | null>(null)
const submitting = ref(false)
const showDatetimePicker = ref(false)
const currentDate = ref(['', '', ''])

const form = reactive({
  name: '',
  phone: '',
  appointmentTime: '',
  additionalInfo: '',
})

onMounted(async () => {
  const apartmentId = Number(route.query.apartmentId)
  const roomId = Number(route.query.roomId)

  // 加载房间信息（如有）
  if (roomId) {
    try {
      const { data } = await getRoomDetailById(roomId)
      roomInfo.value = data
    } catch {}
  }

  // 加载公寓信息
  if (apartmentId) {
    try {
      const { data } = await getApartmentDetailById(apartmentId)
      apartment.value = data
    } catch {}
  }
})

function onConfirmDate({ selectedValues }: { selectedValues: string[] }) {
  const [year, month, day] = selectedValues
  form.appointmentTime = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')} 00:00:00`
  showDatetimePicker.value = false
}

async function handleSubmit() {
  submitting.value = true
  try {
    await saveOrUpdateAppointment({
      apartmentId: Number(route.query.apartmentId),
      name: form.name,
      phone: form.phone,
      appointmentTime: form.appointmentTime,
      additionalInfo: form.additionalInfo,
    })
    showToast('预约成功')
    router.back()
  } catch (err: any) {
    showToast(err?.data?.message || err?.message || '预约失败')
  } finally {
    submitting.value = false
  }
}
</script>

<style lang="less" scoped>
.appointment-page {
  padding-bottom: 30px;
}
</style>
