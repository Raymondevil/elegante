export interface D1Result<T = unknown> {
  success: boolean
  results?: T[]
  meta: { changes?: number; last_row_id?: number }
}
export interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement
  first<T = Record<string, unknown>>(): Promise<T | null>
  run<T = Record<string, unknown>>(): Promise<D1Result<T>>
}
export interface D1Database {
  prepare(query: string): D1PreparedStatement
}
export interface R2ObjectBody {
  body: ReadableStream
  httpMetadata?: { contentType?: string }
}
export interface R2Bucket {
  get(key: string): Promise<R2ObjectBody | null>
}
export type Bindings = {
  DB?: D1Database
  MEDIA?: R2Bucket
  ADMIN_TOKEN?: string
}
