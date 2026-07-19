<template>
  <div class="login-page">
    <div class="login-container">
      <!-- Logo 区域 -->
      <div class="logo-section">
        <div class="logo-icon">
          <van-icon name="home-o" size="40" color="#fff" />
        </div>
        <h1 class="app-name">租房平台</h1>
        <p class="app-subtitle">轻松找到理想的家</p>
      </div>

      <!-- 表单区域 -->
      <van-form class="login-form" @submit="handleLogin">
        <van-field
          v-model="form.phone"
          name="phone"
          label="手机号"
          placeholder="请输入手机号"
          type="tel"
          maxlength="11"
          :rules="phoneRules"
          left-icon="phone-o"
        />
        <van-field
          v-model="form.code"
          name="code"
          label="验证码"
          placeholder="请输入验证码"
          type="digit"
          maxlength="6"
          :rules="codeRules"
          left-icon="shield-o"
        >
          <template #button>
            <van-button
              size="small"
              type="primary"
              :disabled="!!countdown || !isPhoneValid"
              @click="sendCode"
            >
              {{ countdown ? `${countdown}s` : '获取验证码' }}
            </van-button>
          </template>
        </van-field>

        <div class="agreement-section">
          <van-checkbox v-model="agreed" icon-size="14px" shape="square">
            已阅读并同意
            <span class="link">《用户服务协议》</span>和<span class="link">《隐私政策》</span>
          </van-checkbox>
        </div>

        <van-button
          round
          block
          type="primary"
          native-type="submit"
          :loading="loading"
          :disabled="!agreed"
          class="login-btn"
        >
          登录
        </van-button>
      </van-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast } from 'vant'
import { useUserStore } from '@/store/modules/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const form = reactive({
  phone: '',
  code: '',
})

const agreed = ref(false)
const loading = ref(false)
const countdown = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
})

const isPhoneValid = computed(() => /^1[3-9]\d{9}$/.test(form.phone))

const phoneRules = [
  { required: true, message: '请输入手机号' },
  { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' },
]

const codeRules = [
  { required: true, message: '请输入验证码' },
  { pattern: /^\d{4,6}$/, message: '验证码格式不正确' },
]

async function sendCode() {
  if (!isPhoneValid.value) {
    showToast('请输入正确的手机号')
    return
  }
  try {
    await userStore.getCode(form.phone)
    showToast('验证码已发送')
    countdown.value = 60
    timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        if (timer) clearInterval(timer)
      }
    }, 1000)
  } catch {
    // 错误已在拦截器中处理
  }
}

async function handleLogin() {
  if (!agreed.value) {
    showToast('请先同意服务协议')
    return
  }
  loading.value = true
  try {
    await userStore.loginAction({
      phone: form.phone,
      code: form.code,
    })
    showToast('登录成功')
    const redirect = (route.query.redirect as string) || '/search'
    router.replace(redirect === '/login' ? '/search' : redirect)
  } catch {
    // 错误已在拦截器中处理
  } finally {
    loading.value = false
  }
}
</script>

<style lang="less" scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #1989fa 0%, #07c160 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-container {
  width: 100%;
  max-width: 340px;
}

.logo-section {
  text-align: center;
  margin-bottom: 30px;
}

.logo-icon {
  width: 72px;
  height: 72px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  backdrop-filter: blur(10px);
}

.app-name {
  font-size: 24px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 8px;
}

.app-subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
}

.login-form {
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  padding: 8px 0;

  :deep(.van-field) {
    background: #fff;
  }
}

.agreement-section {
  padding: 12px 16px;

  .link {
    color: #1989fa;
  }
}

.login-btn {
  margin: 8px 16px 20px;
  height: 44px;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 2px;
}
</style>
