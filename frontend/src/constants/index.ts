import { RotateCcwIcon, PlusIcon } from "lucide-react"

// 分页参数
export const DEFAULT_PAGE_NUM = 1
export const DEFAULT_PAGE_SIZE = 10
export const PAGE_SIZE_OPTIONS = [
    { value: 10, label: 10 },
    { value: 20, label: 20 },
    { value: 50, label: 50 },
    { value: 100, label: 100 },
]

// LocalStorge Key
export const LocalStorageKey = {
    language: "language",
    accessToken: "accessToken",
}


export const resetButtonProps = {
    Icon: RotateCcwIcon,
    label: "common:reset",
}

export const newButtonProps = {
    Icon: PlusIcon,
    label: "common:new",
}