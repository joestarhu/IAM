import { cn } from "cn"
import { useTranslation } from "react-i18next"

import { Badge } from "@/components/ui/badge"
import { EmptyText } from "@/components/empty-wrap"


interface AccountStatusProps {
    status?: number | null
}

export default function AccountStatus({ status }: AccountStatusProps) {
    const { t } = useTranslation()

    const accountStatusOptions = [
        { value: 0, label: t("accountStatusEnable"), class: "bg-green-400/10", textClass: "text-green-500", borderClass: "bg-green-500" },
        { value: 1, label: t("accountStatusDisable"), class: "bg-rose-400/10", textClass: "text-rose-500", borderClass: "bg-rose-500" },
    ]

    const item = accountStatusOptions.find(
        (item) => item.value === status
    )

    if (!item) {
        return <EmptyText />
    }

    return (
        <Badge className={item?.class}>
            <span className={cn(item?.borderClass, "size-1.5 rounded-full")}></span>
            <span className={item?.textClass}>{item.label}</span>
        </Badge>
    )
}