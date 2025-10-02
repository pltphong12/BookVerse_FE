import { ReactNode } from "react"
import NotFound from "../pages/error/NotFound"

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
        <NotFound statusError="401" message="Unauthentication" navigate="/login" />
    )
}