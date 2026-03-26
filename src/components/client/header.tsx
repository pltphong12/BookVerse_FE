import { Menu, Search, ShoppingCart, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/main_logo.png";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { useQueryClient } from "@tanstack/react-query";
import { callLogoutApi } from "../../services/api";
import { showToast, ToastType } from "../../common/showToast";
import { resetAccount } from "../../redux/slide/account.slide";
import { AxiosError } from "axios";
import { useState } from "react";

export const Header: React.FC = () => {
    const navigate = useNavigate();
    const account = useAppSelector((state) => state.account);
    const queryClient = useQueryClient();
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const dispatch = useAppDispatch()
    const handleLogout = async () => {
        try {
            queryClient.clear();
            await callLogoutApi()
            localStorage.removeItem('access_token');
            showToast('Đăng xuất thành công', ToastType.SUCCESS)
            dispatch(resetAccount())
            navigate('/login');
        } catch (error) {
            if (error instanceof AxiosError) {
                showToast(`Đăng xuất thất bại ${error.response?.data.message}`, ToastType.ERROR)
            }
        }
    }
    return (
        <header className="bg-white shadow-md top-0 z-50">
            <div className="bg-primary-400 text-white py-2">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 flex justify-between items-center text-sm">
                    <div className="flex gap-4">
                        <span>Hotline: 0767557431</span>
                        <span>Miễn phí vận chuyển đơn từ 300k</span>
                    </div>
                    <div className="flex gap-4">
                        <a href="#" className="hover:underline">Theo dõi đơn hàng</a>
                        <a href="#" className="hover:underline">Hỗ trợ</a>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 py-4">
                <div className="flex items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <Link to={'/'} className="flex items-center gap-4">
                            <img
                                className="w-32 h-auto object-contain"
                                src={Logo}
                                alt="BookVerse Logo"
                                style={{
                                    filter: 'brightness(0) saturate(100%) invert(39%) sepia(57%) saturate(2000%) hue-rotate(200deg) brightness(96%) contrast(94%)',
                                }}
                            />
                            <div className="flex flex-col">
                                <h1 className="text-xl font-bold text-primary-500">Vũ Trụ Sách</h1>
                                <p className="text-sm text-gray-600 italic">Tri thức mở ra thế giới</p>
                            </div>
                        </Link>
                    </div>

                    <div className="flex-1 max-w-2xl">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Tìm kiếm sách, tác giả, nhà xuất bản..."
                                className="w-full px-4 py-3 pr-12 border-2 border-primary-300 rounded-lg focus:outline-none focus:border-primary-500"
                            />
                            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-500 text-white p-2 rounded-md hover:bg-primary-600">
                                <Search className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        {account.isAuthenticated && (
                            <button className="flex flex-col items-center gap-1 hover:text-primary-500 relative cursor-pointer">
                                <ShoppingCart className="w-6 h-6" />
                                <span className="text-xs">Giỏ hàng</span>
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    0
                                </span>
                            </button>
                        )}
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="flex flex-col items-center gap-1 hover:text-primary-500 cursor-pointer">
                                <User className="w-6 h-6" />
                                <span className="text-xs">Tài khoản</span>
                            </div>
                            <ul className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                                {account.isAuthenticated ? (
                                    <>
                                        <li><button>Thông tin tài khoản</button></li>
                                        <li><button>Đổi mật khẩu</button></li>
                                        <li><button onClick={handleLogout}>Đăng xuất</button></li>
                                    </>
                                ) : (
                                    <>
                                        <li><button onClick={() => navigate('/login')}>Đăng nhập</button></li>
                                        <li><button onClick={() => navigate('/register')}>Đăng ký</button></li>
                                    </>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>

                <nav className="mt-4 flex items-center gap-6 text-sm border-t pt-3 relative">
                    <button
                        onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                        className="flex items-center gap-2 text-primary-600 font-semibold cursor-pointer"
                    >
                        <Menu className="w-5 h-5" />
                        Danh mục
                    </button>

                    {/* Dropdown sổ ngang với animation */}
                    <div className={`
                            flex items-center gap-6
                            transition-all duration-300 ease-in-out cursor-pointer
                            ${isCategoryOpen? 'opacity-100 max-w-[1000px]': 'opacity-0 max-w-0 overflow-hidden'}
                    `}>
                        <a href="#" className="hover:text-primary-500 whitespace-nowrap">Sách mới</a>
                        <a href="#" className="hover:text-primary-500 whitespace-nowrap">Best Seller</a>
                        <a href="#" className="hover:text-primary-500 whitespace-nowrap">Giảm giá</a>
                        <a href="#" className="hover:text-primary-500 whitespace-nowrap">Văn học</a>
                        <a href="#" className="hover:text-primary-500 whitespace-nowrap">Kinh tế</a>
                        <a href="#" className="hover:text-primary-500 whitespace-nowrap">Thiếu nhi</a>
                        <a href="#" className="hover:text-primary-500 whitespace-nowrap">Kỹ năng</a>
                    </div>
                </nav>
            </div>
        </header>
    );
}