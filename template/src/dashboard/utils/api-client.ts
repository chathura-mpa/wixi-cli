import axios, { AxiosRequestConfig, Method, AxiosResponse, RawAxiosRequestHeaders } from 'axios'
import { getAppInstance } from '.'
import { echo } from './logger'
import { store } from '../store'
import { setFullLoader } from '../store/slices/loaderSlice'

interface RequestOptions extends AxiosRequestConfig { }

interface ApiClientResponse<T = Record<string, unknown>> {
  code: number
  message: string
  data: T
}

interface ApiError {
  code: number
  message: string
  data: unknown
}

const logRequest = (
  method: Method,
  url: string,
  headers: RawAxiosRequestHeaders | undefined,
  data: Record<string, unknown> | FormData | null
) => {
  echo.log(echo.asAlert('Start!'), '')
  echo.group(echo.asYellow('Request'))
  echo.log(echo.asWarning(method), url)
  echo.log(echo.asWarning('Headers'), headers)
  echo.log(echo.asWarning('Body'), data ? JSON.stringify(data, null, 2) : 'No Body')
  echo.groupEnd()
}

const logResponse = <T>(response: AxiosResponse<T>, url: string) => {
  echo.group(echo.asYellow('Response'))
  echo.log(echo.asWarning(`${response.status}`), url)
  echo.log(echo.asWarning('Data'), response.data)
  echo.log(echo.asAlert('End!'), '')
  echo.groupEnd()
}

const logError = (error: { response?: AxiosResponse }, url: string) => {
  if (error.response) {
    echo.group(echo.asAlert('Failed'))
    echo.log(echo.asWarning(`${error.response.status}`), url)
    echo.log(echo.asWarning('message'), error.response.statusText)
    echo.log(echo.asWarning('data'), error.response.data)
    echo.log(echo.asAlert('End!'), '')
    echo.groupEnd()
  }
}

const ApiClient = {
  request: async <T>(
    url: string,
    method: Method,
    data: Record<string, unknown> | FormData | null = null,
    secured: boolean = false,
    options: RequestOptions = {},
    showFullScreenLoader: boolean = false

  ): Promise<ApiClientResponse<T>> => {

    try {
      if (showFullScreenLoader) {
        store.dispatch(setFullLoader(true))
      }

      const headersObj: RawAxiosRequestHeaders = {
        Accept: 'application/json, text/plain'
      }

      const config: AxiosRequestConfig = {
        method,
        url,
        maxBodyLength: Infinity,
        headers: { ...headersObj, ...(options.headers ?? {}) },
        ...options
      }

      if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method) && data) {
        if (data instanceof FormData) {
          config.headers!['Content-Type'] = 'multipart/form-data'
          config.data = data
        } else {
          config.headers!['Content-Type'] = 'application/json;charset=UTF-8'
          config.data = JSON.stringify(data)
        }
      } else if (method === 'GET' && data && !(data instanceof FormData) && Object.keys(data).length !== 0) {
        config.url += '?' + ApiClient.jQueryLikeParamSerializer(data)
      }

      if (secured) {
        config.headers!['Authorization'] = getAppInstance()
      }

      logRequest(method, url, config.headers, data)

      const response: AxiosResponse<T> = await axios<T>(config)

      logResponse(response, url)

      return {
        code: response.status,
        message: response.statusText,
        data: response.data
      }
    } catch (error: unknown) {
      const er = error as { response?: AxiosResponse }
      logError(er, url)

      const customError: ApiError = {
        code: er.response?.status ?? 500,
        message: er.response?.statusText ?? 'Internal Server Error',
        data: er.response?.data ?? (error as Error).message
      }
      throw customError
    } finally {
      if (showFullScreenLoader) {
        store.dispatch(setFullLoader(false))
      }
    }
  },

  jQueryLikeParamSerializer: (params: Record<string, unknown>): string => {
    if (!params) return ''
    const parts: string[] = []
    const serialize = (obj: Record<string, unknown>, prefix?: string) => {
      Object.keys(obj).forEach((key) => {
        const value = obj[key]
        const prefixedKey = prefix ? `${prefix}[${key}]` : key
        if (typeof value === 'object' && value !== null) {
          serialize(value as Record<string, unknown>, prefixedKey)
        } else {
          parts.push(`${encodeURIComponent(prefixedKey)}=${encodeURIComponent(String(value))}`)
        }
      })
    }
    serialize(params)
    return parts.join('&')
  }
}

export default ApiClient
