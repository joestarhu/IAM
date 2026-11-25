import { apiGet, apiPost, type Resp } from "@/lib/axios";



export interface ArgPasswordSignIn {
    account: string
    password: string
}


export interface ReqPasswordSignIn {
    account: string
    password_encrypted: string
}


export interface RspSignIn {
    access_token: string
}


export interface RspProfile {
    account: string
    nickname: string
    avatar_url: string
}


async function encryptPassword(password: string, publicKeyPem: string): Promise<string> {
    const body = publicKeyPem
        .replace(/-----BEGIN PUBLIC KEY-----/g, "")
        .replace(/-----END PUBLIC KEY-----/g, "")
        .replace(/\s/g, "");

    const publicKey = await crypto.subtle.importKey(
        "spki",
        Uint8Array.from(atob(body), ch => ch.charCodeAt(0)),
        { name: "RSA-OAEP", hash: "SHA-256" },
        false,
        ["encrypt"]
    );

    const encrypted = await crypto.subtle.encrypt(
        { name: "RSA-OAEP" },
        publicKey,
        new TextEncoder().encode(password)
    );

    return btoa(String.fromCharCode(...new Uint8Array(encrypted)));
}


export class AuthAPI {
    static async encryptPassword(password: string): Promise<string> {
        const publicKeyPem = await apiGet<string>("/auth/public_key")
        return await encryptPassword(password, publicKeyPem)
    }

    static async signIn(data: ArgPasswordSignIn): Promise<RspSignIn> {
        const password_encrypted = await AuthAPI.encryptPassword(data.password)
        const reqData: ReqPasswordSignIn = {
            account: data.account,
            password_encrypted: password_encrypted
        }
        return await apiPost<RspSignIn>("/auth/sign_in", reqData)
    }

    static async profile(): Promise<RspProfile> {
        return await apiGet<RspProfile>("/auth/profile")
    }
}