import { useId } from "react"
import { useTranslation } from "react-i18next"
import { useMutation } from "@tanstack/react-query"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"

import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { SubmitDialog } from "@/components/dialog-wrap"
import { AuthAPI } from "@/api/auth"
import { AccountAPI, type RspAccountListItem } from "@/api/account"

export default function AccountDialog({
    open,
    mode = "create",
    actionData,
    onOpenChange,
    onSuccess,
}: {
    open: boolean
    mode?: "create" | "resetPassword"
    actionData: RspAccountListItem | null
    onOpenChange: (open: boolean) => void
    onSuccess?: () => void | Promise<void>
}) {
    const { t } = useTranslation()
    const id = useId()
    const isResetPassword = mode === "resetPassword"
    const accountSchema = z.object({
        account: isResetPassword ? z.string() : z.string().trim().min(3, "账号至少输入3个字符").max(32, "账号最多输入32个字符"),
        nickname: isResetPassword ? z.string() : z.string().trim().min(1, "请输入昵称"),
        password: z.string().min(1, "请输入密码"),
        passwordAgain: z.string().min(1, "请再次输入密码"),
        phone: z.string().trim(),
        email: isResetPassword ? z.string() : z.string().trim().pipe(z.union([z.email("请输入有效的邮箱地址"), z.literal("")])),
    }).refine(values => values.password === values.passwordAgain, {
        message: "两次输入的密码不一致",
        path: ["passwordAgain"],
    })

    type FormValues = z.infer<typeof accountSchema>
    const form = useForm<FormValues>({
        resolver: zodResolver(accountSchema),
        defaultValues: {
            account: "",
            nickname: "",
            password: "",
            passwordAgain: "",
            phone: "",
            email: "",
        },
    })

    const mutation = useMutation<void, Error, FormValues>({
        mutationFn: async (values): Promise<void> => {
            if (isResetPassword) {
                if (!actionData) throw new Error("请选择要重置密码的账号")
                // TODO: 调用 AuthAPI.encryptPassword(values.password) 后，
                // 向重置接口提交 account_uuid 和 password_encrypted。
                throw new Error("重置密码接口尚未接入")
            }
            if (actionData) throw new Error("编辑账号接口尚未接入")
            const password_encrypted = await AuthAPI.encryptPassword(values.password)
            await AccountAPI.create({
                account: values.account,
                nickname: values.nickname,
                avatar_url: "",
                phone: values.phone,
                email: values.email,
                password_encrypted,
            })
        },
        onSuccess: async () => {
            await onSuccess?.()
        },
    })

    const fields = [
        { name: "account", label: t("account"), type: "text", autoComplete: "off", required: true },
        { name: "nickname", label: t("nickname"), type: "text", autoComplete: "off", required: true },
        { name: "password", label: t("password"), type: "password", autoComplete: "new-password", required: true },
        { name: "passwordAgain", label: t("passwordAgain"), type: "password", autoComplete: "new-password", required: true },
        { name: "phone", label: t("phone"), type: "tel", autoComplete: "tel", required: false },
        { name: "email", label: t("email"), type: "email", autoComplete: "email", required: false },
    ] as const

    return (
        <SubmitDialog
            title={isResetPassword ? t("resetPassword") : actionData ? "编辑账号" : "新增账号"}
            open={open}
            loading={mutation.isPending}
            onOpenChange={onOpenChange}
            onOpenChangeComplete={(isOpen) => {
                if (!isOpen) form.reset()
            }}
            onSubmit={form.handleSubmit(async values => {
                await mutation.mutateAsync(values)
                onOpenChange(false)
            })}
        >
            {fields.filter(config => !isResetPassword || config.name === "password" || config.name === "passwordAgain").map(config => (
                <Controller key={config.name} name={config.name} control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={`${id}-${config.name}`}>
                                {config.label}
                                {config.required
                                    ? <span className="text-destructive" aria-hidden="true">*</span>
                                    : <span className="text-xs text-muted-foreground"></span>}
                            </FieldLabel>
                            <Input
                                {...field}
                                id={`${id}-${config.name}`}
                                type={config.type}
                                autoComplete={config.autoComplete}
                                aria-required={config.required}
                                aria-invalid={fieldState.invalid}
                                aria-describedby={fieldState.invalid ? `${id}-${config.name}-error` : undefined}
                                placeholder={t("pleaseEnter")}
                            />
                            {fieldState.invalid && (
                                <FieldError id={`${id}-${config.name}-error`} errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
            ))}
        </SubmitDialog>
    )
}
