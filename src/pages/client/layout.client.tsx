import { Outlet } from "react-router-dom"
import { Footer } from "../../components/client/Footer"
import { Header } from "../../components/client/Header"

export const LayoutClient = () => {
    return (
        <div className="min-h-screen bg-gray-50" data-theme="bookverse">
            <Header />
            <main className="container mx-auto px-4 py-6 space-y-8">
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}