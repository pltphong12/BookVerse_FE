import { Outlet } from "react-router-dom"
import { Footer } from "../../components/client/Footer"
import { Header } from "../../components/client/Header"
import { useEffect } from "react"
import { callGetAccountApi } from "../../services/api"
import { useAppDispatch } from "../../redux/hook"
import { setAccount } from "../../redux/slide/account.slide"
import { IUser } from "../../types/backend"

export const LayoutClient = () => {
    const dispatch = useAppDispatch()
    useEffect(() => {
        const getAccount = async () => {
            try {
                const res = await callGetAccountApi()
                dispatch(setAccount(res.data?.data as IUser))
            } catch (error) {
                alert(error)
            }
        }
        getAccount()
    }, [dispatch])
    return (
        <div className="min-h-screen bg-gray-100" data-theme="bookverse">
            <Header />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 py-6 space-y-8">
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}