import { useTranslation } from "react-i18next"
import { InboxIcon } from "lucide-react"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "./ui/empty"



export function EmptyTableContent() {
    const { t } = useTranslation()
    const msgNoData = t("noData")

    return (
        <Empty>
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <InboxIcon />
                </EmptyMedia>
                <EmptyTitle>{msgNoData}</EmptyTitle>
            </EmptyHeader>
        </Empty>
    )
}

export function EmptyText() {
    return (
        <span className="app-text-caption">-</span>
    )
}