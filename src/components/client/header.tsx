import { ChevronDown, Menu, Search, ShoppingCart, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/main_logo.png";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { useQueryClient } from "@tanstack/react-query";
import { callLogoutApi, callFetchAllCategoriesApi, callFetchCartApi } from "../../services/api";
import { showToast, ToastType } from "../../common/showToast";
import { resetAccount } from "../../redux/slide/account.slide";
import { setCartSum } from "../../redux/slide/cart.slice";
import { AxiosError } from "axios";
import { useState, useEffect, useRef } from "react";
import { ICategoryInBook } from "../../types/backend";

export const Header: React.FC = () => {
    const navigate = useNavigate();
    const account = useAppSelector((state) => state.account);
    const queryClient = useQueryClient();
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [categories, setCategories] = useState<ICategoryInBook[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const categoryRef = useRef<HTMLDivElement>(null);
    const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const dispatch = useAppDispatch();
    const cartSum = useAppSelector((state) => state.cart.sum);

    // Fetch categories from DB
    useEffect(() => {
        const fetchCategories = async () => {
            setLoadingCategories(true);
            try {
                const res = await callFetchAllCategoriesApi();
                if (res.data?.data) {
                    setCategories(res.data.data);
                }
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            } finally {
                setLoadingCategories(false);
            }
        };
        fetchCategories();
    }, []);

    // Fetch cart count
    useEffect(() => {
        const fetchCart = async () => {
            try {
                const res = await callFetchCartApi();
                if (res.data?.data) {
                    dispatch(setCartSum(res.data.data.sum));
                }
            } catch (error) {
                console.error('Failed to fetch cart:', error);
            }
        };
        if (account.isAuthenticated) {
            fetchCart();
        }
    }, [account.isAuthenticated, dispatch]);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
        };
    }, []);

    const handleMouseEnter = () => {
        if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
        setIsCategoryOpen(true);
    };

    const handleMouseLeave = () => {
        hoverTimeoutRef.current = setTimeout(() => {
            setIsCategoryOpen(false);
        }, 200);
    };

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

    const handleCategoryClick = (categoryId?: number) => {
        setIsCategoryOpen(false);
        if (categoryId) {
            navigate(`/products?category=${categoryId}`);
        } else {
            navigate('/products');
        }
    };

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
                <div className="flex items-center justify-between gap-4">
                    {/* Logo */}
                    <div className="flex items-center gap-4 shrink-0">
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

                    {/* Category Dropdown + Search Bar */}
                    <div className="flex-1 max-w-3xl flex items-center">
                        {/* Category Button with Hover Dropdown */}
                        <div
                            ref={categoryRef}
                            className="relative"
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            <button
                                className="flex items-center gap-2 bg-primary-500 text-white px-4 py-3 rounded-l-lg font-semibold cursor-pointer hover:bg-primary-600 transition-colors whitespace-nowrap h-[50px]"
                            >
                                <Menu className="w-5 h-5" />
                                Danh mục
                                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isCategoryOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown popup on hover */}
                            <div className={`
                                absolute top-full left-0 mt-0
                                bg-white rounded-b-xl rounded-tr-xl shadow-2xl border border-gray-100
                                min-w-[300px] z-50
                                transition-all duration-300 ease-in-out origin-top-left
                                ${isCategoryOpen
                                    ? 'opacity-100 scale-100 translate-y-0'
                                    : 'opacity-0 scale-95 -translate-y-1 pointer-events-none'
                                }
                            `}>
                                <div className="py-2 max-h-[400px] overflow-y-auto">
                                    {/* Toàn bộ sản phẩm */}
                                    <button
                                        onClick={() => handleCategoryClick()}
                                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors flex items-center gap-3 font-medium"
                                    >
                                        <span className="w-7 h-7 flex items-center justify-center bg-primary-100 text-primary-600 rounded-lg text-sm">
                                            📖
                                        </span>
                                        Toàn bộ sản phẩm
                                    </button>

                                    <div className="mx-4 border-t border-gray-100 my-1"></div>

                                    {/* Danh sách thể loại từ DB */}
                                    {loadingCategories ? (
                                        <div className="px-4 py-6 text-center">
                                            <div className="inline-block w-5 h-5 border-2 border-primary-300 border-t-primary-600 rounded-full animate-spin"></div>
                                            <p className="text-xs text-gray-400 mt-2">Đang tải...</p>
                                        </div>
                                    ) : categories.length > 0 ? (
                                        categories.map((category) => (
                                            <button
                                                key={category.id}
                                                onClick={() => handleCategoryClick(category.id)}
                                                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors flex items-center gap-3 group"
                                            >
                                                <span className="flex-1">{category.name}</span>
                                            </button>
                                        ))
                                    ) : (
                                        <div className="px-4 py-4 text-center text-sm text-gray-400">
                                            Chưa có thể loại nào
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Search Bar */}
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                placeholder="Tìm kiếm sách, tác giả, nhà xuất bản..."
                                className="w-full px-4 py-3 pr-12 border-2 border-l-0 border-primary-300 rounded-r-lg focus:outline-none focus:border-primary-500 h-[50px]"
                            />
                            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-500 text-white p-2 rounded-md hover:bg-primary-600">
                                <Search className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-6 shrink-0">
                        {account.isAuthenticated && (
                            <Link to={'/cart'} className="flex flex-col items-center gap-1 hover:text-primary-500 relative cursor-pointer">
                                <ShoppingCart className="w-6 h-6" />
                                <span className="text-xs">Giỏ hàng</span>
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {cartSum}
                                </span>
                            </Link>
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
            </div>
        </header>
    );
}