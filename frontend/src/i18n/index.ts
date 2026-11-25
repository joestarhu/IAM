import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { LocalStorageKey } from '@/constants'

import zhCommon from "./locales/zh-CN/common.json"

import enCommon from "./locales/en-US/common.json"

i18n.use(initReactI18next).init({
    resources: {
        "zh-CN": {
            common: zhCommon,
        },
        "en-US": {
            common: enCommon,
        },
    },
    // 默认使用
    lng: localStorage.getItem(LocalStorageKey.language) || "zh-CN",
    // 备用语言
    fallbackLng: "zh-CN",
    // 默认NameSpace
    defaultNS: "common",

    interpolation: {
        escapeValue: false,
    },
})

export default i18n
