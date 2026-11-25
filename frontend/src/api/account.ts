import { apiPost, apiGet, type PageData } from "@/lib/axios";

export interface ReqAccountList {
    nickname?: string
    account_status?: number
    page_num?: number
    page_size?: number
}


export interface RspAccountList {
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



export class AccountAPI {
    static async getList(data: ReqAccountList) {
        return await apiGet<PageData<RspAccountList>>("/account/list", { ...data })
    }
}