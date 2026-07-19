import type { ReqPage } from '../types'

/** 图片信息 */
export interface GraphVo {
  name: string
  url: string
}

/** 标签信息 */
export interface LabelInfo {
  id: number
  type: number
  name: string
}

/** 公寓信息（嵌套在房间中） */
export interface ApartmentInfo {
  id: number
  name: string
  introduction: string
  provinceName: string
  cityName: string
  districtName: string
  addressDetail: string
  latitude: string
  longitude: string
  phone: string
}

/** 房间列表项 */
export interface RoomItemVo {
  id: number
  roomNumber: string
  rent: number
  graphVoList: GraphVo[]
  labelInfoList: LabelInfo[]
  apartmentInfo: ApartmentInfo
}

/** 公寓列表项 */
export interface ApartmentItemVo {
  id: number
  name: string
  introduction: string
  provinceName: string
  cityName: string
  districtName: string
  addressDetail: string
  latitude: string
  longitude: string
  phone: string
  graphVoList: GraphVo[]
  labelInfoList: LabelInfo[]
  minRent: number
}

/** 设施信息 */
export interface FacilityInfo {
  id: number
  type: number
  name: string
  icon: string
}

/** 属性信息 */
export interface AttrValueVo {
  id: number
  name: string
  attrKeyName: string
}

/** 费用信息 */
export interface FeeValueVo {
  id: number
  name: string
  unit: string
  feeKeyName: string
}

/** 支付方式 */
export interface PaymentType {
  id: number
  name: string
  payMonthCount: string
  additionalInfo: string
}

/** 租期 */
export interface LeaseTerm {
  id: number
  monthCount: number
  unit: string
}

/** 房间详情 */
export interface RoomDetailVo {
  id: number
  roomNumber: string
  rent: number
  apartmentId: number
  apartmentItemVo: ApartmentItemVo
  graphVoList: GraphVo[]
  attrValueVoList: AttrValueVo[]
  facilityInfoList: FacilityInfo[]
  labelInfoList: LabelInfo[]
  paymentTypeList: PaymentType[]
  feeValueVoList: FeeValueVo[]
  leaseTermList: LeaseTerm[]
}

/** 公寓详情 */
export interface ApartmentDetailVo {
  id: number
  name: string
  introduction: string
  provinceName: string
  cityName: string
  districtName: string
  addressDetail: string
  latitude: string
  longitude: string
  phone: string
  graphVoList: GraphVo[]
  labelInfoList: LabelInfo[]
  facilityInfoList: FacilityInfo[]
  minRent: number
}

/** 房间搜索参数 */
export interface RoomQueryParams extends ReqPage {
  provinceId?: number
  cityId?: number
  districtId?: number
  minRent?: number
  maxRent?: number
  paymentTypeId?: number
  orderType?: string
}

/** 地区信息 */
export interface RegionInfo {
  id: number
  name: string
}

/** 预约列表项 */
export interface AppointmentItemVo {
  id: number
  apartmentName: string
  graphVoList: GraphVo[]
  appointmentTime: string
  appointmentStatus: number
}

/** 预约详情 */
export interface AppointmentDetailVo {
  id: number
  userId: number
  name: string
  phone: string
  apartmentId: number
  appointmentTime: string
  additionalInfo: string
  appointmentStatus: { code: number; name: string }
  apartmentItemVo: ApartmentItemVo
}

/** 预约提交参数 */
export interface AppointmentParams {
  id?: number
  apartmentId: number
  name: string
  phone: string
  appointmentTime: string
  additionalInfo?: string
}

/** 租约列表项 */
export interface AgreementItemVo {
  id: number
  roomGraphVoList: GraphVo[]
  apartmentName: string
  roomNumber: string
  leaseStatus: number
  leaseStartDate: string
  leaseEndDate: string
  sourceType: number
  rent: number
}

/** 租约详情 */
export interface AgreementDetailVo {
  id: number
  phone: string
  name: string
  identificationNumber: string
  apartmentId: number
  roomId: number
  leaseStartDate: string
  leaseEndDate: string
  leaseTermId: number
  rent: number
  deposit: number
  paymentTypeId: number
  status: number
  sourceType: number
  additionalInfo: string
  apartmentName: string
  apartmentGraphVoList: GraphVo[]
  roomNumber: string
  roomGraphVoList: GraphVo[]
  paymentTypeName: string
  leaseTermMonthCount: number
  leaseTermUnit: string
}

/** 浏览历史项 */
export interface HistoryItemVo {
  id: number
  userId: number
  roomId: number
  browseTime: string
  roomNumber: string
  rent: number
  roomGraphVoList: GraphVo[]
  apartmentName: string
  provinceName: string
  cityName: string
  districtName: string
}
