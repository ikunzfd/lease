<template>
  <div class="user-center-page">
    <!-- 用户信息卡片 -->
    <div class="user-header">
      <div class="user-bg"></div>
      <div class="user-info">
        <van-image
          round
          width="64px"
          height="64px"
          fit="cover"
          :src="userStore.userInfo?.avatarUrl || ''"
          class="avatar"
        >
          <template #error>
            <div class="avatar-placeholder">
              <van-icon name="user-o" size="30" color="#fff" />
            </div>
          </template>
        </van-image>
        <div class="user-name">{{ userStore.userInfo?.nickname || '未设置昵称' }}</div>
      </div>
    </div>

    <!-- 功能菜单 -->
    <div class="menu-section">
      <van-cell-group inset>
        <van-cell
          title="我的预约"
          icon="orders-o"
          is-link
          to="/myAppointment"
          :value="appointmentCount"
        />
        <van-cell
          title="我的租约"
          icon="description-o"
          is-link
          to="/myAgreement"
        />
        <van-cell
          title="浏览历史"
          icon="clock-o"
          is-link
          to="/browsingHistory"
        />
      </van-cell-group>
    </div>

    <div class="menu-section">
      <van-cell-group inset>
        <van-cell title="联系客服" icon="service-o" is-link @click="callService" />
        <van-cell title="关于我们" icon="info-o" is-link @click="showAbout" />
        <van-cell title="深色模式" icon="bulb-o">
          <template #right-icon>
            <van-switch v-model="darkModeStore.darkMode" size="22px" @change="darkModeStore.toggleDarkMode()" />
          </template>
        </van-cell>
      </van-cell-group>
    </div>

    <!-- 退出登录 -->
    <div class="logout-section">
      <van-button round block type="default" @click="handleLogout">退出登录</van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showConfirmDialog, showToast } from 'vant'
import { useUserStore } from '@/store/modules/user'
import { useDarkModeStore } from '@/store/modules/darkMode'
import { getMyAppointmentList } from '@/api/search'
import { LOGIN_URL } from '@/config/config'

const router = useRouter()
const userStore = useUserStore()
const darkModeStore = useDarkModeStore()
const appointmentCount = ref('0')

onMounted(async () => {
  try {
    const { data } = await getMyAppointmentList()
    appointmentCount.value = String(data?.length || 0)
  } catch {}
})

async function handleLogout() {
  try {
    await showConfirmDialog({
      title: '提示',
      message: '确定要退出登录吗？',
    })
    userStore.logout()
    router.replace(LOGIN_URL)
  } catch {
    // user cancelled
  }
}

function callService() {
  showToast('客服电话：400-123-4567')
}

function showAbout() {
  showToast('租房平台 v1.0.0')
}
</script>

<style lang="less" scoped>
.user-center-page {
  min-height: 100vh;
  background: @bg-color;
}

.user-header {
  position: relative;
  padding-bottom: 20px;

  .user-bg {
    height: 120px;
    background: linear-gradient(135deg, #1989fa 0%, #07c160 100%);
    border-radius: 0 0 24px 24px;
  }

  .user-info {
    text-align: center;
    margin-top: -32px;

    .avatar {
      border: 3px solid #fff;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .avatar-placeholder {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: #c8c9cc;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .user-name {
      font-size: 16px;
      font-weight: 600;
      margin-top: 10px;
      color: #323233;
    }
  }
}

.menu-section {
  margin: 12px 0;
}

.logout-section {
  padding: 20px 16px;
}
</style>
