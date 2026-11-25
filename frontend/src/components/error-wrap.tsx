import { XCircleIcon } from "lucide-react"
import { useTranslation } from "react-i18next"

interface Props {
    message?: string;
}

export function ErrorPanel({ message = '' }: Props) {
    const { t } = useTranslation()

    // 默认值的处理
    if (!message.trim()) {
        message = t('common.serviceDisabled')
    }

    return (
        <div className="text-destructive bg-destructive/10 text-sm flex items-center p-4 rounded-xl w-full gap-1">
            <XCircleIcon className="size-5" />
            {message}
        </div>
    )
}