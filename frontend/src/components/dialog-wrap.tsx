import { useRef, useState, type ReactNode, type SubmitEvent } from "react"
import { useTranslation } from "react-i18next"
import { XIcon } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import { ErrorPanel } from "./error-wrap"
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter, AlertDialogCancel, AlertDialogAction, } from "@/components/ui/alert-dialog"

export interface ConfirmDialogProps {
    open: boolean
    title: string
    loading: boolean
    onOpenChangeComplete?: (open: boolean) => void
    onOpenChange: (open: boolean) => void
    onConfirm?: () => void | Promise<void>
    children?: ReactNode
}

export function ConfirmDialog({
    open,
    title,
    loading,
    onOpenChange,
    onOpenChangeComplete,
    onConfirm,
    children,
}: ConfirmDialogProps
) {
    const { t } = useTranslation()
    const msg = {
        yes: t("yes"),
        no: t("no")
    }

    const [error, setError] = useState<string | null>(null)
    const submitting = useRef(false)

    function handleOpenChange(nextOpen: boolean) {
        if (submitting.current) return
        setError(null)
        onOpenChange(nextOpen)
    }

    async function handleConfirm() {
        if (submitting.current || !onConfirm) return
        submitting.current = true
        setError(null)
        try {
            await onConfirm()
        } catch (error) {
            setError(error instanceof Error ? error.message : "操作失败，请重试")
            return
        } finally {
            submitting.current = false
        }
        onOpenChange(false)
    }

    return (
        <AlertDialog open={open} onOpenChange={handleOpenChange} onOpenChangeComplete={onOpenChangeComplete}>
            <AlertDialogContent>
                <AlertDialogHeader >
                    <div className="flex items-center w-full">
                        <AlertDialogTitle>{title}</AlertDialogTitle>
                        <AlertDialogCancel variant={'ghost'} size={'icon'} className={'ml-auto shrink-0'}><XIcon /></AlertDialogCancel>
                    </div>
                </AlertDialogHeader>

                {children}

                {error && <ErrorPanel message={error} />}

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={loading}>{msg.no}</AlertDialogCancel>
                    <AlertDialogAction
                        type="button"
                        onClick={handleConfirm}
                        disabled={loading}
                        aria-busy={loading}
                    >
                        {loading && <Spinner />}
                        {msg.yes}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}


export interface SubmitDialogProps {
    open: boolean
    title: string
    loading: boolean
    onOpenChange: (open: boolean) => void
    onOpenChangeComplete?: (open: boolean) => void
    onSubmit: (event: SubmitEvent<HTMLFormElement>) => void | Promise<void>
    children?: ReactNode
}

export function SubmitDialog({
    open,
    title,
    loading,
    onOpenChange,
    onOpenChangeComplete,
    onSubmit,
    children,
}: SubmitDialogProps) {
    const { t } = useTranslation()
    const [error, setError] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)
    const submissionLock = useRef(false)
    const busy = loading || submitting

    function handleOpenChange(nextOpen: boolean) {
        if (loading || submissionLock.current) return
        setError(null)
        onOpenChange(nextOpen)
    }

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault()
        if (loading || submissionLock.current) return
        submissionLock.current = true
        setSubmitting(true)
        setError(null)
        try {
            // The caller closes the dialog after validation and submission succeed.
            await onSubmit(event)
        } catch (error) {
            setError(error instanceof Error ? error.message : "操作失败，请重试")
        } finally {
            submissionLock.current = false
            setSubmitting(false)
        }
    }

    return (
        <AlertDialog
            open={open}
            onOpenChange={handleOpenChange}
            onOpenChangeComplete={(nextOpen) => {
                if (!nextOpen) setError(null)
                onOpenChangeComplete?.(nextOpen)
            }}
        >
            <AlertDialogContent>
                <form className="space-y-4" onSubmit={handleSubmit} aria-busy={busy}>
                    <AlertDialogHeader>
                        <div className="flex items-center w-full">
                            <AlertDialogTitle>{title}</AlertDialogTitle>
                            <AlertDialogCancel
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="ml-auto shrink-0"
                                disabled={busy}
                                aria-label={t("no")}
                            >
                                <XIcon />
                            </AlertDialogCancel>
                        </div>
                    </AlertDialogHeader>

                    <fieldset disabled={busy} className="min-w-0 space-y-4">
                        {children}
                    </fieldset>

                    {error && <div role="alert"><ErrorPanel message={error} /></div>}

                    <AlertDialogFooter>
                        <AlertDialogCancel type="button" disabled={busy}>{t("no")}</AlertDialogCancel>
                        <AlertDialogAction type="submit" disabled={busy} aria-busy={busy}>
                            {busy && <Spinner />}
                            {t("yes")}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    )
}
