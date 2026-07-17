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
