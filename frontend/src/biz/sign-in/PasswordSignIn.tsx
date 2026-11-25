import { useState } from "react"
import { useRevalidator } from "react-router"
import { useTranslation } from "react-i18next"
import * as z from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import { EyeIcon, EyeClosedIcon, ArrowRightIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { ErrorPanel } from "@/components/error-wrap"
import { LocalStorageKey } from "@/constants";
import { AuthAPI, type RspSignIn } from '@/api/auth'




export default function PasswordSignIn() {
    const { t } = useTranslation()
    const revalidator = useRevalidator()

    const msg = {
        title: t("signInPassword"),
        signIn: t("signIn"),
        account: t("account"),
        password: t("password"),
        pleaseEnter: t("pleaseEnter"),
    }

    const [errorMessage, setErrorMessage] = useState<string>('')
    const [passwordShowType, setPasswordShowType] = useState<string>('password')

    const signInSchema = z.object({
        account: z.string().trim().min(1, msg.pleaseEnter),
        password: z.string().min(1, msg.pleaseEnter),
    })

    const formData = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            account: "",
            password: "",
        },
    })

    const signInMutation = useMutation({
        mutationFn: async (data: z.infer<typeof signInSchema>) => {
            return await AuthAPI.signIn(data)
        },

        onSuccess: (data: RspSignIn) => {
            localStorage.setItem(LocalStorageKey.accessToken, data.access_token)
            revalidator.revalidate()
        },

        onError: (error) => {
            setErrorMessage(t(`err:${error.message}`))
        },

        onSettled: () => {
            // setClicked('')
        }
    })

    async function signIn(data: z.infer<typeof signInSchema>) {
        await signInMutation.mutateAsync(data)
    }



    return (
        <form className="space-y-5" onSubmit={formData.handleSubmit(signIn)}>
            <Controller name='account' control={formData.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>{msg.account}</FieldLabel>
                        <Input className='h-10' {...field} aria-invalid={fieldState.invalid} placeholder={msg.pleaseEnter} autoComplete="off" disabled={signInMutation.isPending} />
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                    </Field>
                )}
            />

            <Controller name='password' control={formData.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <div className="flex items-center">
                            <FieldLabel>{msg.password}</FieldLabel>
                            {/* <span className="ml-auto cursor-pointer app-text-caption hover:underline">{t("forgotPassword")}</span> */}
                        </div>

                        <InputGroup className='h-10'>
                            <InputGroupInput {...field} aria-invalid={fieldState.invalid} placeholder={msg.pleaseEnter} type={passwordShowType} autoComplete="off" disabled={signInMutation.isPending} />
                            <InputGroupAddon align="inline-end" className="cursor-pointer" onClick={() => {
                                if (passwordShowType === 'text') {
                                    setPasswordShowType('password')
                                } else {
                                    setPasswordShowType('text')
                                }
                            }}>
                                {passwordShowType === 'text' ? <EyeClosedIcon /> : <EyeIcon />}
                            </InputGroupAddon>
                        </InputGroup>
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                    </Field>
                )}
            />

            <Button className='w-full h-10'
                type='submit'
                disabled={signInMutation.isPending}
            >
                <span>{msg.signIn}</span>
                {signInMutation.isPending ? (<Spinner />) : (<ArrowRightIcon />)}
            </Button>
            {errorMessage && <ErrorPanel message={errorMessage} />}
        </form>
    )







}