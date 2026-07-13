import React from 'react'
import { Outlet, ScrollRestoration } from 'react-router'
import Navbar from './shared/components/Navbar/Navbar.jsx'
import CustomCursor from './shared/components/CustomCursor/CustomCursor.jsx'

const RootLayout = () => {
    return (
        <>
            <ScrollRestoration />
            <CustomCursor />
            <Navbar />
            <div style={{ paddingTop: "var(--navbar-height)" }}>
                <Outlet />
            </div>
        </>
    )
}

export default RootLayout