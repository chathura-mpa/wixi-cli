export interface GCloudQuery {
  limit?: number
  cursor?: string | null
  filters?: { fieldName: string; logic: string; value: unknown }[]
  sort?: { fieldName: string; direction: string }
  offset?: number
}
