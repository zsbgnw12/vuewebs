import type { AxiosProgressEvent, AxiosResponse, GenericAbortSignal } from 'axios'
import request from './axios'

//请求参数的类型定义
export interface HttpOption {
  url: string
  data?: any
  method?: string
  headers?: any
  onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void
  signal?: GenericAbortSignal
  beforeRequest?: () => void
  afterRequest?: () => void
}

// 响应参数的定义
export interface Response<T = any> {
  code?: number
  data: T
  message: string | null
  status: string
}

function http<T = any>(
  { url, data, method, headers, onDownloadProgress, signal, beforeRequest, afterRequest }: HttpOption,
) {
  const successHandler = (res: AxiosResponse<Response<T>>) => {

    if (res.data.status === 'Success' || typeof res.data === 'string')
      return res.data

    if (res.data.status === 'Unauthorized') {
      window.location.reload()
    }


    return res.data
  }

  const failHandler = (error: Response<Error>) => {
    afterRequest?.()
    throw new Error(error?.message || 'Error')
  }

  beforeRequest?.()

  method = method || 'GET'

  const params = Object.assign(typeof data === 'function' ? data() : data ?? {}, {})

  return method === 'GET'
    ? request.get(url, { params, signal, onDownloadProgress }).then(successHandler, failHandler)
    : request.post(url, params, { headers, signal, onDownloadProgress }).then(successHandler, failHandler)
}

export async function get<T = any>(
  { url, data, method = 'GET', onDownloadProgress, signal, beforeRequest, afterRequest }: HttpOption,
): Promise<Response<T>> {
  return await http<T>({
    url,
    method,
    data,
    onDownloadProgress,
    signal,
    beforeRequest,
    afterRequest,
  })
}

export function post<T = any>(
  { url, data, method = 'POST', headers, onDownloadProgress, signal, beforeRequest, afterRequest }: HttpOption,
): Promise<Response<T>> {
  return http<T>({
    url,
    method,
    data,
    headers,
    onDownloadProgress,
    signal,
    beforeRequest,
    afterRequest,
  })
}

// 不需要异步返回的请求
export async function noSyncpost<T = any>(
  { url, data, method = 'POST', headers, onDownloadProgress, signal, beforeRequest, afterRequest }: HttpOption,
): Promise<Response<T>> {

  return await http<T>({
    url,
    method,
    data,
    headers,
		onDownloadProgress,
		signal,
		beforeRequest,
		afterRequest,
  })
}

export default post
