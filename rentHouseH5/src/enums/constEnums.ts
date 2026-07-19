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
  '健身房': 'medal-o',       // 奖牌→运动健身
  '停车位': 'logistics',     // 运输/物流→停车
  '停车场': 'logistics',
  '电梯': 'exchange',        // 上下箭头→升降
  '空调': 'flower-o',        // 花瓣→送风/凉爽
  '洗衣机': 'records',       // 列表记录→清洗程序
  '冰箱': 'shop-o',          // 商店→储物/保鲜
  'WIFI': 'cluster-o',       // 节点→网络
  '宽带': 'cluster-o',
  '床': 'home-o',            // 房子→家居
  '沙发': 'home-o',          // 同上
  '微波炉': 'fire-o',        // 火焰→加热
  '油烟机': 'filter-o',      // 过滤→净化油烟
  '抽油烟机': 'filter-o',
  '热水器': 'hot-o',         // 热气→热水
  '衣柜': 'bag-o',           // 包→衣物收纳
  '电视机': 'tv-o',          // 电视
  '书桌': 'desktop-o',       // 桌面→书桌
  '安全监控': 'video-o',     // 视频→监控
  '监控': 'video-o',
  '桌球区': 'play-circle-o', // 播放→娱乐
  '台球': 'play-circle-o',
  '便利店': 'shop-o',        // 商店
  '休息室': 'smile-comment-o', // 微笑→休闲
  '书吧': 'bookmark-o',      // 书签→阅读
  '休闲区': 'smile-o',       // 笑脸→休闲
  '安保': 'shield-o',        // 盾牌→安全
  '24H安保': 'shield-o',
  '社区活动': 'friends-o',   // 好友→社交
  '团建': 'friends-o',
  '智能门锁': 'lock',        // 锁
  '智能锁': 'lock',
}

/** 获取设施对应 Vant 图标 */
export function getFacilityIcon(icon: string | null | undefined): string {
  if (!icon) return 'checked'
  return facilityIconMap[icon] || 'checked'
}
