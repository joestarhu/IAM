import { Outlet } from "react-router";
import { useTranslation } from "react-i18next"
import { AtomIcon, User2Icon, AppWindow, LayoutGridIcon } from "lucide-react"
import { Sidebar, SidebarContent, SidebarProvider, SidebarGroup, SidebarHeader, SidebarInset, SidebarFooter, SidebarTrigger } from "@/components/ui/sidebar"
import { SidebarMenuNavi, SidebarAvatar, type SidebarMenuNaviProps } from "@/components/sidebar-wrap";

export default function SidebarLayout() {
    const defaultOpen = document.cookie.split("; ").find((row) => row.startsWith("sidebar_state="))?.split("=")[1] !== "false"
    const { t } = useTranslation()

    const menus: SidebarMenuNaviProps[] = [
        { label: t("account"), path: "/account", icon: User2Icon },
        { label: "应用", path: "/application", icon: AppWindow },
        {
            label: "设定", path: "/application", icon: LayoutGridIcon, children: [
                { label: t("account"), path: "/account-1" },
                { label: "应用", path: "/application-1" },
            ]
        },
    ]

    const msgAppTitle = "IAM"

    return (
        <SidebarProvider defaultOpen={defaultOpen}>
            <Sidebar collapsible="icon">
                <SidebarHeader>
                    <div className="flex items-center justify-center gap-2 pt-2 group/header">
                        <AtomIcon className="size-7 shrink-0 rounded-md bg-primary text-accent p-1 group-data-[collapsible=icon]:group-hover/header:hidden" />
                        <span className="font-semibold text-lg tabluar-nums group-data-[collapsible=icon]:hidden truncate">{msgAppTitle}</span>
                        <SidebarTrigger className="size-7 ml-auto shrink-0 group-data-[collapsible=icon]:hidden  group-data-[collapsible=icon]:group-hover/header:flex" />
                    </div>
                </SidebarHeader>

                <SidebarContent>
                    <SidebarGroup>
                        <SidebarMenuNavi menus={menus} />
                    </SidebarGroup>
                </SidebarContent>


                <SidebarFooter>
                    <SidebarAvatar />
                </SidebarFooter>
            </Sidebar>

            <SidebarInset>
                <div className="w-full min-h-0 h-screen m-auto max-w-400 p-6">
                    <Outlet />
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}