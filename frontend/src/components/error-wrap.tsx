import { XCircleIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router";
import { HomeIcon, ArrowLeftIcon } from "lucide-react";
import { Button } from "./ui/button";

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






export function Page404() {
    const navi = useNavigate();

    return (
        <div className="w-full h-full min-h-0 min-w-0 flex">
            <div className="m-auto flex flex-col gap-2">
                <span className="font-semibold text-9xl animate-in fade-in slide-in-from-bottom-5 duration-700">404</span>
                <span className="font-semibold text-7xl animate-in fade-in slide-in-from-bottom-10 duration-1000 ">Page Not Found</span>
                <div className="space-x-4">
                    <Button variant={'outline'} className={'mt-4 w-48 h-10 animate-in fade-in slide-in-from-bottom-15 duration-1300'} onClick={() => (navi(-1))}>
                        <ArrowLeftIcon />
                        Go Back
                    </Button>

                    <Button className={'mt-4 w-48 h-10 animate-in fade-in slide-in-from-bottom-15 duration-1300'} onClick={() => (navi("/"))}>
                        <HomeIcon />
                        Back to Home
                    </Button>
                </div>

            </div>
        </div>
    )
}