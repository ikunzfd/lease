<template>
  <div class="appointment-page">
    <div class="card">
      <div class="apartment-preview" v-if="apartment">
        <van-image
          v-if="apartment.graphVoList?.[0]?.url"
          :src="apartment.graphVoList[0].url"
          width="100%"
          height="160px"
          fit="cover"
          radius="8px"
        />
        <h3 class="text-base font-semibold mt-2">{{ apartment.name }}</h3>
        <p class="text-sm text-gray-500 mt-1">
          {{ apartment.provinceName }}{{ apartment.cityName }}{{ apartment.districtName }}{{ apartment.addressDetail }}
        </p>
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
import { getApartmentDetailById, saveOrUpdateAppointment } from '@/api/search'
import type { ApartmentDetailVo } from '@/api/search/types'
import { useUserStore } from '@/store/modules/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const apartment = ref<ApartmentDetailVo | null>(null)
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
  // 预填用户手机号
  if (userStore.userInfo) {
    form.phone = userStore.userInfo.nickname || ''
  }

  const apartmentId = Number(route.query.apartmentId)
  if (apartmentId) {
    try {
      const { data } = await getApartmentDetailById(apartmentId)
      apartment.value = data
    } catch {}
  }
})

function onConfirmDate({ selectedValues }: { selectedValues: string[] }) {
  form.appointmentTime = selectedValues.join('-')
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
  } catch {
    // error handled in interceptor
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
