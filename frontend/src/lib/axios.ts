import axios from 'axios'
import type { AxiosError } from 'axios'

import { LocalStorageKey } from '@/constants'

type QueryParams = Record<string, unknown>

export interface Resp<T = unknown> {
    code: number
    message: string
    data: T
}

export interface PageData<T = unknown> {
    page_num: number
    page_size: number
    total_pages: number
    total_items: number
    items: T[]
}

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000",
    withCredentials: true, // 前后端跨域时必须；同域保留也没问题
})

// 请求拦截器
api.interceptors.request.use(
    config => {
        const token = localStorage.getItem(LocalStorageKey.accessToken)
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error: unknown) => {
        return Promise.reject(error)
    }
)

// 响应拦截器
api.interceptors.response.use(
    response => response,

    (error: AxiosError) => {
        // 没收到服务器响应
        if (!error.response) {
            return Promise.reject(
                new Error("NETWORK_ERROR")
            )
        }

        // 收到了服务器响应，但 HTTP 状态异常
        return Promise.reject(
            new Error(`HTTP_${error.response.status}`)
        )
    }
)

async function httpReq(
    method: string,
    url: string,
    body?: unknown,
    query?: QueryParams,
) {
    let resp = null

    switch (method) {
        case "post":
            resp = await api.post(url, body, { params: query })
            break;
        case "get":
        default:
            resp = await api.get(url, { params: query })
            break;
    }

    if (resp.data.code !== 0) {
        throw new Error(`${resp.data.code}`)
    }

    return resp.data.data
}

export async function apiPost<T = unknown>(
    url: string,
    body?: unknown,
    query?: QueryParams
): Promise<T> {
    return await httpReq("post", url, body, query)
}

export async function apiGet<T = unknown>(
    url: string,
    query?: QueryParams
): Promise<T> {
    return await httpReq("get", url, null, query)
}