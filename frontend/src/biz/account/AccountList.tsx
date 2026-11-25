import { useState, type ReactNode } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate, useSearchParams } from "react-router"
import { useDebounce } from "use-debounce"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useSyncQueryParams } from "@/hooks/use-syncQueryParams"
import { newButtonProps, resetButtonProps, DEFAULT_PAGE_SIZE, DEFAULT_PAGE_NUM } from "@/constants"
import { type PageData } from "@/lib/axios"
import { formatDateTime } from "@/lib/datetime"

import { SearchIcon, EllipsisIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TableRow, TableCell, } from "@/components/ui/table"
import { TableList } from "@/components/table-wrap"
import { EmptyText } from "@/components/empty-wrap"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import { AccountAPI, type ReqAccountList, type RspAccountListItem } from "@/api/account"
import AccountStatus from "./AccountStatus"
import AccountDialog from "./AccountDialog"

export default function AccountList() {
    const { t } = useTranslation()
    const msg = {
        all: t("all"),
        accountStatus: t("accountStatus"),
        accountStatusEnable: t("accountStatusEnable"),
        accountStatusDisable: t("accountStatusDisable"),
        create: t("new"),
        edit: t("edit"),
        delete: t("delete"),
        resetPassowrd: t("resetPassword"),
        pleaseEnterKW: t("pleaseEnterKeyword"),
        action: t("action"),
        phone: t("phone"),
        account: t("account"),
        nickname: t("nickname"),
        view: t("view"),
        email: t("email"),
        createdAt: t("createdAt"),
    }

    const [searchParams,] = useSearchParams()
    const [nickname, setNickname] = useState(searchParams.get("nickname") ?? '')
    const [debouncedNickname] = useDebounce(nickname, nickname.trim() ? 800 : 0)
    const queryNickname = nickname === '' ? '' : debouncedNickname;

    const [pageSize, setPageSize] = useState<number>(() => {
        const value = Number(searchParams.get("pageSize"))
        return Number.isSafeInteger(value) && value > 0 ? value : DEFAULT_PAGE_SIZE
    })

    const [pageNum, setPageNum] = useState<number>(() => {
        const value = Number(searchParams.get("pageNum"))
        return Number.isSafeInteger(value) && value > 0 ? value : DEFAULT_PAGE_NUM
    })

    const [status, setStatus] = useState<number | null>(
        searchParams.get("status") !== null
            ? Number(searchParams.get("status"))
            : null
    )

    useSyncQueryParams(
        {
            nickname: debouncedNickname,
            status, pageNum, pageSize,
        },
    );

    const nicknameInput = {
        label: msg.nickname,
        props: {
            type: "search",
            autoComplete: "off",
            placeholder: msg.pleaseEnterKW,
        }
    }

    const statusSelect = {
        label: msg.accountStatus,
        options: [
            { value: null, label: msg.all },
            { value: 0, label: msg.accountStatusEnable },
            { value: 1, label: msg.accountStatusDisable },
        ]
    }


    function reset() {
        setNickname('')
        setStatus(null)
    }



    const tableHeaders = [
        { label: msg.nickname, },
        { label: msg.phone, },
        { label: msg.email, },
        { label: msg.accountStatus, },
        { label: msg.createdAt, },
        { label: msg.action, class: "text-right" },
    ]

    const {
        data: accountList = { total_items: 0, items: [] },
        // isLoading,
        // isFetching,
        // error,
    } = useQuery<PageData<RspAccountListItem>>({
        queryKey: ["accounts", { queryNickname, status, pageNum, pageSize }],

        queryFn: async (): Promise<PageData<RspAccountListItem>> => {
            const params: ReqAccountList = {}

            if (queryNickname) {
                params.nickname = queryNickname
            }

            if (status !== null) {
                params.account_status = status
            }

            params.page_num = pageNum
            params.page_size = pageSize

            const items = await AccountAPI.getList(params)

            const pages = items.total_pages
            if (pages < DEFAULT_PAGE_NUM) {
                setPageNum(DEFAULT_PAGE_NUM)
            }
            if (pageNum > pages) {
                setPageNum(pages)
            }

            return items
        },
    })

    function AccountTableCell({
        children,
    }: { children: ReactNode }) {
        return (
            <TableCell className="tabular-nums">
                {children}
            </TableCell >
        )
    }

    const queryClient = useQueryClient()
    const [statusDialogOpen, setStatusDialogOpen] = useState(false)
    const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false)
    const [accountDialogOpen, setAccountDialogOpen] = useState(false)
    const [actionData, setActionData] = useState<RspAccountListItem | null>(null)




    return (
        <div className="flex flex-col gap-4 ">
            {/* 顶部 */}
            <section className="flex mb-2 items-center">
                <div className="flex flex-col">
                    <span className="font-semibold text-2xl">{msg.account}</span>
                    <span className="text-muted-foreground text-sm">管理账号基础信息</span>
                </div>

                <div className="ml-auto">
                    <Button size={'lg'} onClick={() => {
                        setActionData(null)
                        setAccountDialogOpen(true)
                    }}>
                        <newButtonProps.Icon />
                        {t(newButtonProps.label)}
                    </Button>
                </div>
            </section>

            {/* 筛选区域 */}
            <section className="flex items-baseline-last gap-4">
                <div className="flex flex-col gap-1">
                    <span className="text-xs">{nicknameInput.label}</span>
                    <InputGroup className="group">
                        <InputGroupInput {...nicknameInput.props} value={nickname} onChange={(e) => setNickname(e.target.value)} />
                        <InputGroupAddon>
                            <SearchIcon />
                        </InputGroupAddon>
                    </InputGroup>
                </div>

                <div className="flex flex-col gap-1">
                    <span className="text-xs">{statusSelect.label}</span>
                    <div className="flex">
                        <Tabs value={status} onValueChange={setStatus}>
                            <TabsList>
                                {statusSelect.options.map((item) => (
                                    <TabsTrigger key={item.value} value={item.value}>
                                        {item.label}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </Tabs>
                    </div>
                </div>

                <Button variant={'ghost'} onClick={() => reset()}>
                    {<resetButtonProps.Icon />}
                    {t(resetButtonProps.label)}
                </Button>
            </section>


            {/* 数据列表  */}
            <section className='border rounded-lg flex flex-col overflow-hidden'>
                <TableList headers={tableHeaders}
                    rows={accountList.items}
                    pageNum={pageNum}
                    pageSize={pageSize}
                    totalItems={accountList.total_items}
                    onSizeChange={setPageSize}
                    onPageChange={setPageNum}
                >
                    {
                        accountList.items.map((data) => (
                            <TableRow key={data.account_uuid}>
                                <TableCell className="flex gap-2 items-center">
                                    <Avatar>
                                        <AvatarImage src={data.avatar_url}></AvatarImage>
                                        <AvatarFallback>{data.nickname[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-accent-foreground">{data.nickname}</span>
                                        <span className="app-text-caption flex items-center gap-0.5">
                                            {data.account}
                                        </span>
                                    </div>
                                </TableCell>

                                <AccountTableCell children={data?.phone_masked.trim() ? data?.phone_masked.trim() : <EmptyText />}>
                                </AccountTableCell>

                                <TableCell className="tabular-nums" >
                                    {data?.email.trim() ? data?.email.trim() : <EmptyText />}
                                </TableCell>

                                <TableCell>
                                    <AccountStatus status={data.account_status} />
                                </TableCell>

                                <TableCell className="tabular-nums text-xs">
                                    {formatDateTime(data.created_at)}
                                </TableCell>

                                <TableCell>
                                    <div className="flex gap-x-1 justify-end">
                                        <Button variant={'outline'} size={"sm"} onClick={() => detail(data.account_uuid)}>{msg.view}</Button>

                                        <DropdownMenu>
                                            <DropdownMenuTrigger render={
                                                <Button variant={'outline'} size={'icon-sm'}><EllipsisIcon /></Button>
                                            }
                                            />
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>{msg.edit}</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => {
                                                    // setActionData(data)
                                                    // setStatusDialogOpen(true)
                                                }}>
                                                    {data.account_status === 0 && '停用'}
                                                    {data.account_status === 1 && '启用'}
                                                </DropdownMenuItem>

                                                <DropdownMenuItem onClick={() => {
                                                    // setActionData(data)
                                                    // setResetPasswordDialogOpen(true)
                                                }}>
                                                    {msg.resetPassowrd}
                                                </DropdownMenuItem>

                                                <DropdownMenuItem>{msg.delete}</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))

                    }

                </TableList>
            </section>


            <AccountDialog open={accountDialogOpen} actionData={actionData} onOpenChange={setAccountDialogOpen}
                onSuccess={() => { queryClient.invalidateQueries({ queryKey: ["accounts"] }) }}
            />


        </div >
    )
}