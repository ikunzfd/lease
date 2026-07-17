export interface ReqPage {
  current: number
  size: number
}

export interface PageRes<T> {
  records: T[]
  current: number
  size: number
  total: number
}
