import { useTranslation } from "react-i18next"
import { LanguagesIcon } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectGroup, SelectValue, } from "@/components/ui/select"
import { LocalStorageKey } from "@/constants"

const languageNames: Record<string, string> = {
    "zh-CN": "简体中文",
    "en-US": "English",
    "ja-JP": "日本語",
}

export function LanguageSelector() {
    const { i18n } = useTranslation()

    const languages = (
        i18n.options.supportedLngs || Object.keys(i18n.store.data)
    ).filter((lng) => lng !== "cimode")

    const items = languages.map((lng) => ({
        value: lng,
        label: languageNames[lng] ?? lng,
    }))

    // 切换语言并保存到本地
    const handleLanguageChange = (value: string | null) => {
        if (!value) return

        void i18n.changeLanguage(value)
        localStorage.setItem(LocalStorageKey.language, value)
    }

    return (

        <Select
            items={items}
            value={i18n.resolvedLanguage ?? i18n.language}
            onValueChange={handleLanguageChange}
        >
            <SelectTrigger className={'border-0 bg-transparent'}>
                <LanguagesIcon />
                <SelectValue />
            </SelectTrigger>

            <SelectContent>
                <SelectGroup>
                    {items.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                            {item.label}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
