import { useNavigate } from "react-router-dom";
import { showToast, ToastType } from "../../../common/showToast";
import { AxiosError } from "axios";
import { callLogoutApi } from "../../../services/api";
import { useQueryClient } from "@tanstack/react-query";
import { useAppSelector } from "../../../redux/hook";

export const Account = () => {
    const navigate = useNavigate();
    const account = useAppSelector((state) => state.account);
    const queryClient = useQueryClient();
    const handleLogout = async() => {
        try {
            queryClient.clear();
            await callLogoutApi()
            localStorage.removeItem('access_token');
            showToast('Đăng xuất thành công', ToastType.SUCCESS)
            navigate('/login');
        } catch (error) {
            if (error instanceof AxiosError) {
                showToast(`Đăng xuất thất bại ${error.response?.data.message}`, ToastType.ERROR)
            }
        }
    }

    return (
        <>
            <div className="flex gap-2">
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full">
                            <img
                                src={`${import.meta.env.VITE_BACKEND_URL}/storage/avatar/${account.account.avatar}`}
                                alt="Avatar Tailwind CSS Component" />
                        </div>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                        <li>
                            <a className="justify-between">
                                Chi tiết tài khoản
                                <span className="badge">New</span>
                            </a>
                        </li>
                        <li><a>Cập nhật tài khoản</a></li>
                        <li><a onClick={handleLogout}>Đăng xuất</a></li>
                    </ul>
                </div>
            </div>
        </>
    )
}
