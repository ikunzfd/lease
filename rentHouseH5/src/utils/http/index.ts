import axios, { AxiosInstance, AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { showToast } from 'vant'
import { useUserStore } from '@/store/modules/user'
import { ResultEnum } from '@/enums/httpEnums'
import { ResultData } from './type'
import { LOGIN_URL } from '@/config/config'
import { RESETSTORE } from '@/utils/reset'
import router from '@/router'

const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.PROD ? import.meta.env.VITE_APP_BASE_URL : '/',
  timeout: ResultEnum.TIMEOUT as number,
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    const token = userStore.token
    if (token) {
      config.headers.set('access-token', token)
    }
    return config
  },
  (error: AxiosError) => {
    showToast(error.message)
    return Promise.reject(error)
  },
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const { data } = response

    // token 失效
    if (ResultEnum.EXPIRE.includes(data.code)) {
      RESETSTORE()
      showToast(data.message || '登录已过期，请重新登录')
      router.replace(LOGIN_URL)
      return Promise.reject(data)
    }

    // 业务错误
    if (data.code && data.code !== ResultEnum.SUCCESS) {
      showToast(data.message || ResultEnum.ERRMESSAGE)
      return Promise.reject(data)
    }

    return data
  },
  (error: AxiosError) => {
    const status = error.response?.status
    let message = '网络连接故障'
    switch (status) {
      case 401:
        message = '登录已过期，请重新登录'
        break
      case 403:
        message = '拒绝访问'
        break
      case 404:
        message = '请求地址不存在'
        break
      case 500:
        message = '服务器故障'
        break
    }
    showToast(message)
    return Promise.reject(error)
  },
)

const http = {
  get<T>(url: string, params?: object, config?: AxiosRequestConfig): Promise<ResultData<T>> {
    return service.get(url, { params, ...config })
  },

  post<T>(url: string, data?: object, config?: AxiosRequestConfig): Promise<ResultData<T>> {
    return service.post(url, data, config)
  },

  put<T>(url: string, data?: object, config?: AxiosRequestConfig): Promise<ResultData<T>> {
    return service.put(url, data, config)
  },

  delete<T>(url: string, data?: object, config?: AxiosRequestConfig): Promise<ResultData<T>> {
    return service.delete(url, { data, ...config })
  },
}

export default http
