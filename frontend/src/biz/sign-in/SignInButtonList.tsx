import { useState } from "react"
import { useTranslation } from "react-i18next"
import { ArrowRightIcon, ArrowUpRightIcon, KeyRoundIcon, SmartphoneIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { DingTalkIcon } from '@/assets/icon'
import { cn } from "cn"


export type SignInType = "welcome" | "signInPassword" | "signInDingtalk"


export default function SignInButtonList({
    onClick
}: {
    onClick: (value: SignInType) => void
}
) {
    const { t } = useTranslation()
    const msg = {
        welcome: t("welcome"),
        signInPassword: t("signInPassword"),
        signInDingtalk: t("signInDingtalk"),
    }

    const [clicked, setClicked] = useState<string>("")

    const signInButtons = [
        { id: "signInPassword", logo: KeyRoundIcon, logoClass: "text-indigo-500", label: msg.signInPassword, btnIcon: ArrowRightIcon, },
        { id: "signInDingtalk", logo: DingTalkIcon, logoClass: "text-blue-500", label: msg.signInDingtalk, btnIcon: ArrowUpRightIcon },
    ]

    function selectSignInType(id: string) {
        setClicked(id)
        switch (id) {
            case "signInPassword":
                onClick(id)
                break;
            case "signInDingtalk":
                // TODO:钉钉三方登录
                break;
            default:
                break;
        }
    }


    return (
        <div className='flex flex-col gap-4'>
            {signInButtons.map(btn => (
                <Button
                    key={btn.id}
                    className='h-12 justify-start gap-4 px-4'
                    variant='outline'
                    onClick={() => selectSignInType(btn.id)}
                // disabled={loginMutation.isPending}
                >
                    <btn.logo className={cn("shrink-0", btn?.logoClass)} />
                    <span>{btn.label}</span>
                    <div className='ml-auto'>
                        {clicked === btn.id ? (<Spinner />) : (<btn.btnIcon />)}
                    </div>
                </Button>
            ))}
        </div>
    )

}