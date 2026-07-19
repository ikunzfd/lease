import http from '@/utils/http'
import type {
  RoomItemVo,
  RoomDetailVo,
  RoomQueryParams,
  ApartmentDetailVo,
  RegionInfo,
  PaymentType,
  LeaseTerm,
  AppointmentItemVo,
  AppointmentDetailVo,
  AppointmentParams,
  AgreementItemVo,
  AgreementDetailVo,
  HistoryItemVo,
} from './types'
import type { PageRes } from '../types'

// ========== 房间 ==========
export function getRoomList(params: RoomQueryParams) {
  return http.get<PageRes<RoomItemVo>>('/app/room/pageItem', params)
}

export function getRoomDetailById(id: number) {
  return http.get<RoomDetailVo>('/app/room/getDetailById', { id })
}

export function getRoomListByApartmentId(params: { current: number; size: number; id: number }) {
  return http.get<PageRes<RoomItemVo>>('/app/room/pageItemByApartmentId', params)
}

// ========== 公寓 ==========
export function getApartmentDetailById(id: number) {
  return http.get<ApartmentDetailVo>('/app/apartment/getDetailById', { id })
}

// ========== 地区 ==========
export function getProvinceList() {
  return http.get<RegionInfo[]>('/app/region/province/list')
}

export function getCityList(provinceId: number) {
  return http.get<RegionInfo[]>('/app/region/city/listByProvinceId', { id: provinceId })
}

export function getDistrictList(cityId: number) {
  return http.get<RegionInfo[]>('/app/region/district/listByCityId', { id: cityId })
}

// ========== 支付方式 ==========
export function getPaymentTypeList() {
  return http.get<PaymentType[]>('/app/payment/list')
}

export function getPaymentListByRoomId(roomId: number) {
  return http.get<PaymentType[]>('/app/payment/listByRoomId', { id: roomId })
}

// ========== 租期 ==========
export function getTermListByRoomId(roomId: number) {
  return http.get<LeaseTerm[]>('/app/term/listByRoomId', { id: roomId })
}

// ========== 预约 ==========
export function saveOrUpdateAppointment(params: AppointmentParams) {
  return http.post<void>('/app/appointment/saveOrUpdate', params)
}

export function getMyAppointmentList() {
  return http.get<AppointmentItemVo[]>('/app/appointment/listItem')
}

export function getAppointmentDetailById(id: number) {
  return http.get<AppointmentDetailVo>('/app/appointment/getDetailById', { id })
}

// ========== 租约 ==========
export function getMyAgreementList() {
  return http.get<AgreementItemVo[]>('/app/agreement/listItem')
}

export function getAgreementDetailById(id: number) {
  return http.get<AgreementDetailVo>('/app/agreement/getDetailById', { id })
}

export function updateAgreementStatusById(id: number, leaseStatus: number) {
  return http.post<void>('/app/agreement/updateStatusById', undefined, {
    params: { id, leaseStatus },
  })
}

export function saveOrUpdateAgreement(params: any) {
  return http.post<void>('/app/agreement/saveOrUpdate', params)
}

// ========== 浏览历史 ==========
export function getHistoryList(params: { current: number; size: number }) {
  return http.get<PageRes<HistoryItemVo>>('/app/history/pageItem', params)
}
