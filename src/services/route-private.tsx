import { ReactNode } from "react"
import { Navigate } from "react-router-dom"

export const PrivateRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
    const role = localStorage.getItem("role")
    if (role === "ADMIN") {
        return (
            <>
                {children}
            </>
        )
    }

    return (
        <Navigate to="/login" />
    )
}