import { Bell } from "lucide-react"
import { Account } from "./Account.tsx"

export const Header = () => {
    return (
        <>
            <div className="">
                <div className="flex justify-end items-center gap-2">
                    <Bell size={20}/>
                    <Account />
                </div>
                
            </div>
        </>
    )
}