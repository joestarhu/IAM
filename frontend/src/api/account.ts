import { apiPost, apiGet, type PageData } from "@/lib/axios";


export interface ReqAccountList {
    nickname?: string
    account_status?: number
    page_num?: number
    page_size?: number
}


export interface RspAccountListItem {
    account_uuid: string
    account: string
    nickname: string
    account_status: number
    avatar_url: string
    phone_enc: string
    email: string
    created_at: Date
    phone_masked: string
}


export interface ReqCreateAccount {
    account: string
    nickname: string
    avatar_url: string
    email: string
    phone: string
    password_encrypted: string
}


export class AccountAPI {
    static async getList(data: ReqAccountList) {
        return await apiGet<PageData<RspAccountListItem>>("/account/list", { ...data })
    }

    static async create(data: ReqCreateAccount) {
        return await apiPost("/account/create", data)
    }
}