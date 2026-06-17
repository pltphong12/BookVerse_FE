import { ChevronDown, Clock, Menu, Search, ShoppingCart, TrendingUp, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/main_logo.png";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { callLogoutApi, callFetchAllCategoriesApi, callFetchCartApi, callSearchAutocompleteApi } from "../../services/api";
import { showToast, ToastType } from "../../common/showToast";
import { resetAccount } from "../../redux/slide/account.slide";
import { setCartSum } from "../../redux/slide/cart.slice";
import { AxiosError } from "axios";
import { useState, useEffect, useRef } from "react";
import { ICategoryInBook, ISearchAutocompleteProduct } from "../../types/backend";
import { useDebouncedCallback } from "use-debounce";

export const Header: React.FC = () => {
    const navigate = useNavigate();
    const account = useAppSelector((state) => state.account);
    const queryClient = useQueryClient();
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const categoryRef = useRef<HTMLDivElement>(null);
    const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const dispatch = useAppDispatch();
    const cartSum = useAppSelector((state) => state.cart.sum);

    // Fetch categories from DB (cached with React Query)
    const { data: categories = [], isLoading: loadingCategories } = useQuery<ICategoryInBook[]>({
        queryKey: ['all-categories'],
        queryFn: async () => {
            const res = await callFetchAllCategoriesApi();
            return res.data?.data ?? [];
        },
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    });

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

    // Search autocomplete state
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [searchProducts, setSearchProducts] = useState<ISearchAutocompleteProduct[]>([]);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    // Debounced autocomplete fetch using use-debounce
    const debouncedFetchAutocomplete = useDebouncedCallback(async (keyword: string) => {
        if (keyword.trim().length < 1) {
            setSuggestions([]);
            setSearchProducts([]);
            setIsSearchOpen(false);
            return;
        }
        setIsSearching(true);
        try {
            const res = await callSearchAutocompleteApi(keyword.trim());
            if (res.data?.data) {
                setSuggestions(res.data.data.suggestions);
                setSearchProducts(res.data.data.products);
                setIsSearchOpen(true);
            }
        } catch (error) {
            console.error('Autocomplete failed:', error);
        } finally {
            setIsSearching(false);
        }
    }, 300);

    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);
        debouncedFetchAutocomplete(value);
    };

    const handleSearchSubmit = () => {
        if (searchQuery.trim()) {
            setIsSearchOpen(false);
            navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        setSearchQuery(suggestion);
        setIsSearchOpen(false);
        navigate(`/products?search=${encodeURIComponent(suggestion)}`);
    };

    const handleSearchProductClick = (productId: number) => {
        setIsSearchOpen(false);
        setSearchQuery('');
        navigate(`/product/${productId}`);
    };

    // Close search dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setIsSearchOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
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
                        <span>Miễn phí vận chuyển đơn từ 300.000đ</span>
                    </div>
                    <div className="flex gap-4">
                        <Link to="/order-history" className="hover:underline">Theo dõi đơn hàng</Link>
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

                        {/* Search Bar with Autocomplete */}
                        <div className="flex-1 relative" ref={searchRef}>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={handleSearchInputChange}
                                onFocus={() => { if (suggestions.length > 0 || searchProducts.length > 0) setIsSearchOpen(true); }}
                                onKeyDown={(e) => { if (e.key === 'Enter') handleSearchSubmit(); if (e.key === 'Escape') setIsSearchOpen(false); }}
                                placeholder="Tìm kiếm sách, tác giả, nhà xuất bản..."
                                className="w-full px-4 py-3 pr-12 border-2 border-l-0 border-primary-300 rounded-r-lg focus:outline-none focus:border-primary-500 h-[50px]"
                            />
                            <button
                                onClick={handleSearchSubmit}
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-500 text-white p-2 rounded-md hover:bg-primary-600 cursor-pointer"
                            >
                                <Search className="w-5 h-5" />
                            </button>

                            {/* Autocomplete Dropdown */}
                            {isSearchOpen && (suggestions.length > 0 || searchProducts.length > 0) && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
                                    {/* Suggestions Section */}
                                    {suggestions.length > 0 && (
                                        <div className="p-4 pb-3">
                                            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                                                <Clock className="w-4 h-4 text-gray-400" />
                                                <span>Gợi ý</span>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {suggestions.map((suggestion, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => handleSuggestionClick(suggestion)}
                                                        className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-primary-50 hover:text-primary-600 transition-colors cursor-pointer border border-gray-200 hover:border-primary-300"
                                                    >
                                                        {suggestion}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Divider */}
                                    {suggestions.length > 0 && searchProducts.length > 0 && (
                                        <div className="mx-4 border-t border-gray-100"></div>
                                    )}

                                    {/* Products Section */}
                                    {searchProducts.length > 0 && (
                                        <div className="p-4 pt-3">
                                            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                                                <TrendingUp className="w-4 h-4 text-gray-400" />
                                                <span>Sản phẩm</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                {searchProducts.map((product) => (
                                                    <button
                                                        key={product.id}
                                                        onClick={() => handleSearchProductClick(product.id)}
                                                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors text-left cursor-pointer group"
                                                    >
                                                        <div className="w-12 h-16 shrink-0 rounded-md overflow-hidden bg-gray-100 border border-gray-200">
                                                            <img
                                                                src={`${import.meta.env.VITE_BACKEND_URL}/storage/book/${product.imageUrl}`}
                                                                alt={product.title}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => {
                                                                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 48 64%22><rect fill=%22%23f3f4f6%22 width=%2248%22 height=%2264%22/><text x=%2224%22 y=%2236%22 text-anchor=%22middle%22 fill=%22%239ca3af%22 font-size=%2210%22>📖</text></svg>';
                                                                }}
                                                            />
                                                        </div>
                                                        <span className="text-sm text-gray-700 group-hover:text-primary-600 transition-colors line-clamp-2 font-medium">
                                                            {product.title}
                                                        </span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Loading indicator */}
                                    {isSearching && (
                                        <div className="px-4 py-3 text-center border-t border-gray-100">
                                            <div className="inline-block w-4 h-4 border-2 border-primary-300 border-t-primary-600 rounded-full animate-spin"></div>
                                        </div>
                                    )}
                                </div>
                            )}
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
                        <div className="relative group">
                            <div className="flex flex-col items-center gap-1 hover:text-primary-500 cursor-pointer">
                                <User className="w-6 h-6" />
                                <span className="text-xs">Tài khoản</span>
                            </div>

                            {/* Transparent bridge to prevent hover loss */}
                            <div className="absolute top-full right-0 w-full h-4 -mt-4 bg-transparent"></div>

                            <div className="absolute right-0 top-full m-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 transform origin-top-right scale-95 group-hover:scale-100">
                                <div className="py-2">
                                    {account.isAuthenticated ? (
                                        <>
                                            <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors font-medium">Thông tin tài khoản</button>
                                            <button onClick={() => navigate('/order-history')} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors font-medium">Lịch sử đơn hàng</button>
                                            <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors font-medium">Đổi mật khẩu</button>
                                            <div className="border-t border-gray-100 my-1"></div>
                                            <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium">Đăng xuất</button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => navigate('/login')} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors font-medium">Đăng nhập</button>
                                            <button onClick={() => navigate('/register')} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors font-medium">Đăng ký</button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}