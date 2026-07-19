/** 租约状态 */
export const LeaseStatusMap: Record<number, string> = {
  1: '签约待确认',
  2: '已签约',
  3: '已取消',
  4: '已到期',
  5: '退租待确认',
  6: '已退租',
  7: '续约待确认',
}

/** 预约状态 */
export const AppointmentStatusMap: Record<number, string> = {
  1: '待看房',
  2: '已取消',
  3: '已看房',
}

/** 租约来源 */
export const LeaseSourceTypeMap: Record<number, string> = {
  1: '新签',
  2: '续约',
}

/** 排序方式 */
export const SearchOrderTypeMap: Record<string, string> = {
  asc: '价格从低到高',
  desc: '价格从高到低',
}

/** 通过值获取标签文本 */
export function getLabelByValue<T extends Record<string | number, string>>(
  map: T,
  value: string | number,
): string {
  return map[value as keyof T] || '未知'
}

/** 设施图标映射：数据库中文图标名 → Vant 内置图标 */
const facilityIconMap: Record<string, string> = {
  '健身房': 'fire-o',
  '停车位': 'guide-o',
  '停车场': 'guide-o',
  '电梯': 'up-down',
  '空调': 'wind-o',
  '洗衣机': 'brush-o',
  '冰箱': 'drink',
  'WIFI': 'wifi-o',
  '宽带': 'wifi-o',
  '床': 'home-o',
  '沙发': 'service-o',
  '微波炉': 'fire-o',
  '油烟机': 'filter-o',
  '抽油烟机': 'filter-o',
  '热水器': 'hot-o',
  '衣柜': 'orders-o',
  '电视机': 'tv-o',
  '书桌': 'desktop-o',
  '安全监控': 'eye-o',
  '监控': 'eye-o',
  '桌球区': 'bill-o',
  '台球': 'bill-o',
  '便利店': 'shop-o',
  '休息室': 'clock-o',
  '书吧': 'bookmark-o',
  '休闲区': 'smile-o',
  '安保': 'shield-o',
  '24H安保': 'shield-o',
  '社区活动': 'friends-o',
  '团建': 'friends-o',
  '智能门锁': 'lock',
  '智能锁': 'lock',
}

/** 获取设施对应 Vant 图标 */
export function getFacilityIcon(icon: string | null | undefined): string {
  if (!icon) return 'checked'
  return facilityIconMap[icon] || 'checked'
}
