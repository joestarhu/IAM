import { createBrowserRouter, redirect } from "react-router";
import { LocalStorageKey } from "@/constants";


import { Page404 } from "@/components/error-wrap";
import SidebarLayout from "@/layout/SidebarLayout";
import SignInLayout from "@/layout/SignInLayout";

import AccountList from "@/biz/account/AccountList";

// Account


function requreidAuth() {
    if (!localStorage.getItem(LocalStorageKey.accessToken)) {
        throw redirect("/signin")
    }
    return null
}

function alreadyAuthed() {
    if (localStorage.getItem(LocalStorageKey.accessToken)) {
        throw redirect("/")
    }
    return null
}

export const router = createBrowserRouter([
    {
        path: "/",
        loader: requreidAuth,
        element: <SidebarLayout />,
        children: [
            { path: "/account", element: <AccountList /> },
            { path: "/*", element: <Page404 /> },
        ]
    },
    {
        path: "/signin",
        loader: alreadyAuthed,
        element: <SignInLayout />
    }
])
