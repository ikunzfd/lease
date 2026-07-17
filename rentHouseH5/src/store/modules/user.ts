import { defineStore } from 'pinia'
import { login, getSmsCode, getUserInfo } from '@/api/user'
import type { UserInfo, LoginParams } from '@/api/user/types'

interface UserState {
  token: string | null
  userInfo: UserInfo | null
}

export const useUserStore = defineStore({
  id: 'app-h5-user',
  state: (): UserState => ({
    token: null,
    userInfo: null,
  }),
  actions: {
    setToken(token: string) {
      this.token = token
    },
    setUserInfo(userInfo: UserInfo) {
      this.userInfo = userInfo
    },
    async getCode(phone: string) {
      const { data } = await getSmsCode(phone)
      return data
    },
    async loginAction(params: LoginParams) {
      const { data: token } = await login(params)
      this.setToken(token)
      await this.getInfoAction()
    },
    async getInfoAction() {
      const { data } = await getUserInfo()
      this.setUserInfo(data)
    },
    logout() {
      this.$reset()
    },
  },
  persist: true,
})
