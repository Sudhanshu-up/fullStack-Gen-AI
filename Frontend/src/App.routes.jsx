import { createBrowserRouter, Navigate } from "react-router"
import RootLayout from "./RootLayout.jsx"
import Login from "./features/auth/pages/Login"
import Register from "./features/auth/pages/Register"
import Protected from "./features/auth/components/Protected.jsx"
import Landing from "./features/landing/pages/Landing.jsx"
import GetStarted from "./features/landing/pages/GetStarted.jsx"
import GetReportPage from "./features/report/pages/GetReportPage.jsx"
import GetResumePage from "./features/resume/pages/GetResumePage.jsx"
import Profile from "./features/profile/pages/Profile.jsx"

export const router = createBrowserRouter([
    {
        element: <RootLayout />,
        children: [
            { path: "/", element: <Landing /> },
            { path: "/get-started", element: <GetStarted /> },
            { path: "/login", element: <Login /> },
            { path: "/register", element: <Register /> },
            { path: "/report", element: <GetReportPage /> },
            { path: "/resume", element: <GetResumePage /> },
            { path: "/profile", element: <Protected><Profile /></Protected> }
        ]
    }
])