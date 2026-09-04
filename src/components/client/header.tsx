import { ChevronDown, Clock, Search, ShoppingBag, TrendingUp, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/logo_v2.png";
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
        staleTime: 5 * 60 * 1000,
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
            await callLogoutApi();
            localStorage.removeItem('access_token');
            showToast('Đăng xuất thành công', ToastType.SUCCESS);
            dispatch(resetAccount());
            navigate('/login');
        } catch (error) {
            if (error instanceof AxiosError) {
                showToast(`Đăng xuất thất bại ${error.response?.data.message}`, ToastType.ERROR);
            }
        }
    };

    const handleCategoryClick = (categoryId?: number) => {
        setIsCategoryOpen(false);
        if (categoryId) {
            navigate(`/products?category=${categoryId}`);
        } else {
            navigate('/products');
        }
    };

    return (
        <header className="bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-[#E5E2DD] shadow-2xs">
            {/* Top Utility Bar */}
            <div className="bg-[#FAF9F7] border-b border-[#E5E2DD] text-slate-500 py-1.5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 flex justify-between items-center text-xs font-body">
                    <div className="flex gap-4 sm:gap-6">
                        <span>Hotline: <strong className="text-[#1A1A1A] font-semibold">0767557431</strong></span>
                        <span className="hidden sm:inline text-slate-400">|</span>
                        <span className="hidden sm:inline">Miễn phí giao hàng cho đơn từ 300.000 ₫</span>
                    </div>
                    <div className="flex gap-4 sm:gap-6 font-medium">
                        <Link to="/order-history" className="hover:text-[#0070B5] transition-colors">Theo dõi đơn hàng</Link>
                        <a href="#" className="hover:text-[#0070B5] transition-colors">Hỗ trợ</a>
                    </div>
                </div>
            </div>

            {/* Main Header Bar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 h-20 sm:h-22 flex items-center justify-between gap-6">
                {/* Brand Logo */}
                <div className="flex-shrink-0">
                    <Link to={'/'} className="flex items-center group">
                        <img
                            src={Logo}
                            alt="BookVerse Logo"
                            className="h-12 sm:h-14 md:h-16 w-auto object-contain transition-transform group-hover:scale-105"
                        />
                    </Link>
                </div>

                {/* Navigation Links (Desktop - Stitch / Waterstones Style) */}
                <nav className="hidden md:flex items-center gap-8 font-body text-[15px] font-medium text-slate-600">
                    {/* Category Dropdown on Hover */}
                    <div
                        ref={categoryRef}
                        className="relative"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        <button
                            onClick={() => handleCategoryClick()}
                            className={`flex items-center gap-1.5 py-1 hover:text-[#0070B5] transition-colors cursor-pointer ${isCategoryOpen ? 'text-[#0070B5]' : ''
                                }`}
                        >
                            <span>Thể loại</span>
                            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isCategoryOpen ? 'rotate-180 text-[#0070B5]' : 'text-slate-400'}`} />
                        </button>

                        {/* Dropdown Popup */}
                        <div className={`
                            absolute top-full left-0 mt-2
                            bg-white rounded-xl shadow-lg border border-[#E5E2DD]
                            min-w-[260px] z-50 p-2
                            transition-all duration-200 ease-out origin-top-left
                            ${isCategoryOpen
                                ? 'opacity-100 scale-100 translate-y-0'
                                : 'opacity-0 scale-95 -translate-y-1 pointer-events-none'
                            }
                        `}>
                            <div className="max-h-[360px] overflow-y-auto">
                                <button
                                    onClick={() => handleCategoryClick()}
                                    className="w-full text-left px-3.5 py-2 text-xs font-serif font-bold text-[#1A1A1A] hover:bg-[#FAF9F7] hover:text-[#0070B5] rounded-lg transition-colors cursor-pointer"
                                >
                                    Tất cả thể loại sách
                                </button>

                                <div className="border-t border-[#E5E2DD] my-1"></div>

                                {loadingCategories ? (
                                    <div className="px-4 py-4 text-center">
                                        <div className="inline-block w-4 h-4 border-2 border-[#E5E2DD] border-t-[#1A1A1A] rounded-full animate-spin"></div>
                                        <p className="text-xs text-slate-400 mt-1 font-body">Đang tải...</p>
                                    </div>
                                ) : categories.length > 0 ? (
                                    categories.map((category) => (
                                        <button
                                            key={category.id}
                                            onClick={() => handleCategoryClick(category.id)}
                                            className="w-full text-left px-3.5 py-1.5 text-xs font-body text-slate-700 hover:bg-[#FAF9F7] hover:text-[#0070B5] rounded-lg transition-colors cursor-pointer"
                                        >
                                            {category.name}
                                        </button>
                                    ))
                                ) : (
                                    <div className="px-4 py-3 text-center text-xs text-slate-400 font-body">
                                        Chưa có thể loại nào
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <Link to="/products" className="hover:text-[#0070B5] transition-colors py-1">
                        Sách mới
                    </Link>
                    <Link to="/products" className="hover:text-[#0070B5] transition-colors py-1">
                        Bán chạy
                    </Link>
                    <Link to="/products" className="hover:text-[#0070B5] transition-colors py-1">
                        Ưu đãi
                    </Link>
                </nav>

                {/* Right side: Minimalist Underline Search & Action Buttons */}
                <div className="flex items-center gap-5">
                    {/* Minimal Underline Search Bar with Autocomplete */}
                    <div className="hidden sm:block relative" ref={searchRef}>
                        <div className="flex items-center border-b border-[#1A1A1A] pb-1 focus-within:border-[#0070B5] transition-colors w-44 md:w-52">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={handleSearchInputChange}
                                onFocus={() => { if (suggestions.length > 0 || searchProducts.length > 0) setIsSearchOpen(true); }}
                                onKeyDown={(e) => { if (e.key === 'Enter') handleSearchSubmit(); if (e.key === 'Escape') setIsSearchOpen(false); }}
                                placeholder="Tìm kiếm..."
                                className="bg-transparent border-none outline-none text-sm text-[#1A1A1A] placeholder:text-slate-400 font-body w-full px-0 py-0 h-6"
                            />
                            {searchQuery ? (
                                <button
                                    onClick={() => { setSearchQuery(''); setIsSearchOpen(false); }}
                                    className="text-slate-400 hover:text-slate-600 text-xs cursor-pointer p-0.5"
                                >
                                    ✕
                                </button>
                            ) : (
                                <Search onClick={handleSearchSubmit} className="w-4 h-4 text-[#1A1A1A] cursor-pointer shrink-0 hover:text-[#0070B5] transition-colors" />
                            )}
                        </div>

                        {/* Autocomplete Dropdown */}
                        {isSearchOpen && (suggestions.length > 0 || searchProducts.length > 0) && (
                            <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-[#E5E2DD] z-50 overflow-hidden">
                                {/* Suggestions */}
                                {suggestions.length > 0 && (
                                    <div className="p-3.5 pb-2.5">
                                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                            <Clock className="w-3 h-3 text-slate-400" />
                                            <span>Gợi ý tìm kiếm</span>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {suggestions.map((suggestion, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => handleSuggestionClick(suggestion)}
                                                    className="px-2.5 py-1 text-xs font-body bg-[#FAF9F7] text-[#1A1A1A] border border-[#E5E2DD] hover:border-[#1A1A1A] hover:text-[#0070B5] rounded-full transition-colors cursor-pointer"
                                                >
                                                    {suggestion}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Divider */}
                                {suggestions.length > 0 && searchProducts.length > 0 && (
                                    <div className="border-t border-[#E5E2DD]"></div>
                                )}

                                {/* Products */}
                                {searchProducts.length > 0 && (
                                    <div className="p-3.5 pt-2.5">
                                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                            <TrendingUp className="w-3 h-3 text-slate-400" />
                                            <span>Sản phẩm phù hợp</span>
                                        </div>
                                        <div className="space-y-1.5">
                                            {searchProducts.slice(0, 4).map((product) => (
                                                <button
                                                    key={product.id}
                                                    onClick={() => handleSearchProductClick(product.id)}
                                                    className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-[#FAF9F7] transition-colors text-left cursor-pointer group w-full"
                                                >
                                                    <div className="w-8 h-11 shrink-0 rounded overflow-hidden bg-slate-100 border border-[#E5E2DD]">
                                                        <img
                                                            src={`${import.meta.env.VITE_BACKEND_URL}/storage/book/${product.imageUrl}`}
                                                            alt={product.title}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 48 64%22><rect fill=%22%23f3f4f6%22 width=%2248%22 height=%2264%22/><text x=%2224%22 y=%2236%22 text-anchor=%22middle%22 fill=%22%239ca3af%22 font-size=%2210%22>📖</text></svg>';
                                                            }}
                                                        />
                                                    </div>
                                                    <span className="text-xs font-serif font-bold text-[#1A1A1A] group-hover:text-[#0070B5] transition-colors line-clamp-2 leading-snug">
                                                        {product.title}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Loading */}
                                {isSearching && (
                                    <div className="px-4 py-2.5 text-center border-t border-[#E5E2DD]">
                                        <div className="inline-block w-3.5 h-3.5 border-2 border-[#E5E2DD] border-t-[#1A1A1A] rounded-full animate-spin"></div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Account Dropdown */}
                    <div className="relative group">
                        <button
                            className="p-1 text-[#1A1A1A] hover:text-[#0070B5] transition-colors cursor-pointer flex items-center"
                            title="Tài khoản"
                        >
                            <User className="w-5 h-5" />
                        </button>

                        {/* Account Popup */}
                        <div className="absolute right-0 top-full mt-1 w-64 bg-white rounded-xl shadow-lg border border-[#E5E2DD] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100] transform origin-top-right scale-95 group-hover:scale-100 overflow-hidden">
                            {account.isAuthenticated ? (
                                <div>
                                    {/* User Info */}
                                    <div className="p-3.5 bg-[#FAF9F7] border-b border-[#E5E2DD]">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-9 h-9 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center font-serif font-bold text-xs shrink-0">
                                                {account.account?.fullName
                                                    ? account.account.fullName.charAt(0).toUpperCase()
                                                    : 'U'}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="font-serif font-bold text-xs sm:text-sm text-[#1A1A1A] truncate">
                                                    {account.account?.fullName || 'Người dùng'}
                                                </p>
                                                <p className="font-body text-[11px] text-slate-400 truncate">
                                                    {account.account?.email || ''}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Menu Items */}
                                    <div className="p-1.5 space-y-0.5">
                                        {account.account?.role === 'ADMIN' && (
                                            <button
                                                onClick={() => navigate('/admin')}
                                                className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-[#FAF9F7] hover:text-[#0070B5] rounded-lg transition-colors font-medium flex items-center gap-2.5 cursor-pointer"
                                            >
                                                <span>Trang quản trị</span>
                                            </button>
                                        )}
                                        <button
                                            onClick={() => navigate('/order-history')}
                                            className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-[#FAF9F7] hover:text-[#0070B5] rounded-lg transition-colors font-medium flex items-center gap-2.5 cursor-pointer"
                                        >
                                            <span>Lịch sử đơn hàng</span>
                                        </button>
                                        <button
                                            onClick={() => showToast('Tính năng đang được phát triển', ToastType.INFO)}
                                            className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-[#FAF9F7] hover:text-[#0070B5] rounded-lg transition-colors font-medium flex items-center gap-2.5 cursor-pointer"
                                        >
                                            <span>Thông tin tài khoản</span>
                                        </button>
                                        <button
                                            onClick={() => showToast('Tính năng đang được phát triển', ToastType.INFO)}
                                            className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-[#FAF9F7] hover:text-[#0070B5] rounded-lg transition-colors font-medium flex items-center gap-2.5 cursor-pointer"
                                        >
                                            <span>Đổi mật khẩu</span>
                                        </button>

                                        <div className="border-t border-[#E5E2DD] my-1"></div>

                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-lg transition-colors font-medium flex items-center gap-2.5 cursor-pointer"
                                        >
                                            <span>Đăng xuất</span>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-4 space-y-2.5">
                                    <div className="text-center pb-1">
                                        <p className="font-serif font-bold text-sm text-[#1A1A1A]">
                                            Chào mừng độc giả!
                                        </p>
                                        <p className="font-body text-xs text-slate-400 mt-0.5">
                                            Đăng nhập để nhận ưu đãi và mua sách
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => navigate('/login')}
                                        className="w-full py-2 bg-[#1A1A1A] hover:bg-[#0070B5] text-white font-medium text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                                    >
                                        <span>Đăng nhập</span>
                                    </button>

                                    <button
                                        onClick={() => navigate('/register')}
                                        className="w-full py-2 bg-[#FAF9F7] hover:bg-[#E5E2DD] text-[#1A1A1A] border border-[#E5E2DD] font-medium text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                                    >
                                        <span>Đăng ký tài khoản</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Cart - only visible if logged in */}
                    {account.isAuthenticated && (
                        <Link
                            to={'/cart'}
                            className="relative p-1 text-[#1A1A1A] hover:text-[#0070B5] transition-colors cursor-pointer"
                            title="Giỏ hàng"
                            id="header-cart-btn"
                        >
                            <ShoppingBag className="w-5 h-5" />
                            {cartSum > 0 && (
                                <span className="absolute -top-1 -right-1 bg-[#1A1A1A] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                                    {cartSum}
                                </span>
                            )}
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
};