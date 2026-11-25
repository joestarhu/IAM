import { useState } from "react"
import { useTranslation } from "react-i18next"
import { AtomIcon, ArrowLeftIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { LanguageSelector } from "@/components/language-selector"
import SignInButtonList, { type SignInType } from "@/biz/sign-in/SignInButtonList"
import PasswordSignIn from "@/biz/sign-in/PasswordSignIn"

export default function SignInLayout() {
    const { t } = useTranslation()

    const msg = {
        welcome: t("welcome"),
        signInPassword: t("signInPassword"),
        signInDingtalk: t("signInDingtalk"),
    }

    const [formType, setFormType] = useState<SignInType>("welcome")
    const formTitle = msg[formType]

    function closeForm() {
        setFormType("welcome")
    }


    return (
        <div className="flex flex-col min-h-svh">
            {/* 顶部Logo */}
            <section className="flex p-5 sm:px-10 sm:py-6">
                <div>
                    <span className="flex bg-primary size-8 text-primary-foreground rounded-lg items-center justify-center">
                        <AtomIcon className="size-6" />
                    </span>
                </div>

                <div className="ml-auto">
                    <LanguageSelector />
                </div>
            </section>


            {/* 登录Card */}
            <section className="flex flex-1 items-center justify-center">
                <Card className="w-sm shadow-sm [--card-spacing:--spacing(6)] sm:[--card-spacing:--spacing(8)]">
                    <CardHeader>
                        <CardTitle className="flex">
                            {formType !== 'welcome' && <Button variant={'ghost'} onClick={() => (closeForm())}><ArrowLeftIcon /></Button>}
                            <h1 className="text-2xl font-semibold leading-tight tracking-tight">{formTitle}</h1>
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        {formType === 'welcome' && <SignInButtonList onClick={setFormType} />}
                        {formType === 'signInPassword' && <PasswordSignIn />}
                    </CardContent>
                </Card>
            </section>


            {/* 底部信息 */}
            <footer className="flex flex-wrap app-text-caption items-center justify-center p-6">
                <span>@ 2023-{new Date().getFullYear()} All Rights Reserved</span>
            </footer>
        </div>
    )
}