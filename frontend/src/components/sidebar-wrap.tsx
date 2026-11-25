import { useTranslation } from "react-i18next"
import { NavLink, useLocation, useRevalidator } from "react-router"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { ChevronRightIcon, LayoutGridIcon, LogOutIcon, CircleUserRoundIcon, ChevronsUpDownIcon, type LucideIcon, } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage, } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { SidebarMenuItem, SidebarMenuButton, SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton, SidebarMenu } from "@/components/ui/sidebar"

import { LanguageSelector } from "./language-selector"
import { LocalStorageKey } from "@/constants";
import { AuthAPI } from "@/api/auth"
import { cn } from "@/lib/utils"

export interface SidebarMenuNaviProps {
    label: string
    path?: string
    icon?: LucideIcon
    children?: {
        label: string
        path: string
    }[]
}



export function SidebarMenuNaviItem({
    label,
    path,
    icon: Icon = LayoutGridIcon,
    children,
}: SidebarMenuNaviProps) {
    const { pathname } = useLocation()

    // 判断当前路由是否属于子菜单
    const isChildActive = children?.some(
        (sub) => sub.path && (pathname === sub.path || pathname.startsWith(`${sub.path}/`))
    )

    return (
        <SidebarMenuItem>
            {
                children ? (
                    <Collapsible className="group/collapsible" defaultOpen={isChildActive}>
                        <CollapsibleTrigger render={
                            <SidebarMenuButton tooltip={label}>
                                <Icon />
                                <span>{label}</span>
                                <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-open/collapsible:rotate-90" />
                            </SidebarMenuButton>
                        }
                        />
                        <CollapsibleContent>
                            <SidebarMenuSub>
                                {children.map((sub) => (
                                    <SidebarMenuSubItem key={sub.label}>
                                        <NavLink to={sub.path || "/"}>
                                            {({ isActive }) => (
                                                <SidebarMenuSubButton
                                                    className={cn(
                                                        isActive && "app-nav-active"
                                                    )}
                                                >
                                                    <span>{sub.label}</span>
                                                </SidebarMenuSubButton>
                                            )}
                                        </NavLink>
                                    </SidebarMenuSubItem>
                                ))}
                            </SidebarMenuSub>
                        </CollapsibleContent>
                    </Collapsible>
                ) : (
                    <NavLink to={path || "/"}>
                        {
                            ({ isActive }) => (
                                <SidebarMenuButton className={cn(isActive && "app-nav-active")} tooltip={label}>
                                    <Icon />
                                    {label}
                                </SidebarMenuButton>
                            )
                        }
                    </NavLink>
                )
            }
        </SidebarMenuItem>
    )
}

export function SidebarMenuNavi({
    menus
}: {
    menus: SidebarMenuNaviProps[]
}) {
    return (
        <SidebarMenu>
            {menus.map(item => (
                <SidebarMenuNaviItem key={item.label} label={item.label} path={item?.path} icon={item?.icon} children={item?.children} />
            ))}
        </SidebarMenu>
    )
}

export function SidebarAvatar() {
    // TODO:这里组件过于业务化,后续需要剥离出来.
    const { t } = useTranslation()
    const revalidator = useRevalidator()
    const queryClient = useQueryClient()

    const msg = {
        profile: t("profile"),
        logout: t("signOut"),
    }

    const menuClass = "cursor-pointer h-9"

    const {
        data: user = { nickname: "", avatar_url: "" },
    } = useQuery({
        queryKey: ["profile"],

        queryFn: async () => {
            return await AuthAPI.profile()
        },
    })

    async function logout() {
        await queryClient.cancelQueries()
        queryClient.clear()
        localStorage.removeItem(LocalStorageKey.accessToken)
        revalidator.revalidate()
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger render={
                        <SidebarMenuButton size={'lg'}>
                            <Avatar>
                                <AvatarImage src={user.avatar_url} />
                                <AvatarFallback>{user.nickname[0]}</AvatarFallback>
                            </Avatar>
                            <span>{user.nickname}</span>
                            <ChevronsUpDownIcon className="ml-auto size-4" />
                        </SidebarMenuButton>
                    }
                    />
                    <DropdownMenuContent side="right" align="start" className={'w-auto'}>
                        <DropdownMenuItem className={menuClass}>
                            <CircleUserRoundIcon />
                            {msg.profile}
                        </DropdownMenuItem>

                        <LanguageSelector />

                        <DropdownMenuSeparator />
                        <DropdownMenuItem className={menuClass} onClick={() => logout()}>
                            <LogOutIcon />
                            {msg.logout}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}