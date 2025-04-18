export interface IApiResponse<T> {
  code: number
  message: string
  data: {
    data: T
    pagination: IPagination
    success: boolean
    message: string
  }
}

export interface IPagination {
  limit: number
  total: number
  pages: number
  hasNext: boolean
  next: string | null
  hasPrevious: boolean
  previous: string | null
}
