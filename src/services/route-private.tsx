import { ReactNode } from "react"
import { Navigate } from "react-router-dom"

export const PrivateRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
    const user = localStorage.getItem('access_token')
    if (user) {
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