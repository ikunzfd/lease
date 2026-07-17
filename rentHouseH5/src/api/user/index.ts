import http from '@/utils/http'
import type { LoginParams, UserInfo } from './types'

/** 登录 */
export function login(params: LoginParams) {
  return http.post<string>('/app/login', params)
}

/** 获取短信验证码 */
export function getSmsCode(phone: string) {
  return http.get<void>('/app/login/getCode', { phone })
}

/** 获取用户信息 */
export function getUserInfo() {
  return http.get<UserInfo>('/app/info')
}
