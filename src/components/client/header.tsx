import { ChevronDown, Clock, Menu, Search, ShoppingCart, TrendingUp, User, LogOut, Lock, Package, ShieldCheck, LogIn, UserPlus } from "lucide-react";
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
        <header className="bg-white/95 backdrop-blur-md shadow-[0_2px_16px_rgba(26,35,126,0.06)] sticky top-0 z-50 border-b border-[#e3f2fd]">
            {/* Top Utility Bar */}
            <div className="bg-[#f8fafc] border-b border-[#e3f2fd] text-slate-500 py-2">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 flex justify-between items-center text-xs sm:text-sm font-body">
                    <div className="flex gap-4 sm:gap-6">
                        <span>Hotline: <strong className="text-[#1a237e] font-semibold">0767557431</strong></span>
                        <span className="hidden sm:inline">Miễn phí vận chuyển đơn từ 300.000đ</span>
                    </div>
                    <div className="flex gap-4 sm:gap-6 font-medium">
                        <Link to="/order-history" className="hover:text-[#1a237e] transition-colors">Theo dõi đơn hàng</Link>
                        <a href="#" className="hover:text-[#1a237e] transition-colors">Hỗ trợ</a>
                    </div>
                </div>
            </div>

            {/* Main Header Bar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 py-3.5 sm:py-4">
                <div className="flex items-center justify-between gap-4">
                    {/* Logo */}
                    <div className="flex items-center gap-4 shrink-0">
                        <Link to={'/'} className="flex items-center gap-3">
                            <img
                                className="w-28 sm:w-32 h-auto object-contain"
                                src={Logo}
                                alt="BookVerse Logo"
                                style={{
                                    filter: 'brightness(0) saturate(100%) invert(13%) sepia(85%) saturate(3025%) hue-rotate(229deg) brightness(90%) contrast(105%)',
                                }}
                            />
                            <div className="hidden sm:flex flex-col">
                                <h1 className="text-xl font-headline font-extrabold text-[#0d1e25] leading-tight">Vũ Trụ Sách</h1>
                                <p className="text-xs text-slate-500 font-body">Tri thức mở ra thế giới</p>
                            </div>
                        </Link>
                    </div>

                    {/* Category Dropdown + Search Bar */}
                    <div className="flex-1 max-w-3xl flex items-center gap-3">
                        {/* Category Button with Hover Dropdown */}
                        <div
                            ref={categoryRef}
                            className="relative shrink-0"
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            <button
                                className="flex items-center gap-2 bg-[#f4faff] hover:bg-[#e3f2fd] text-[#1a237e] px-4 py-2.5 rounded-full font-headline font-semibold text-sm cursor-pointer border border-[#dff1fb] hover:border-blue-300 transition-all whitespace-nowrap h-[46px] shadow-sm"
                            >
                                <Menu className="w-4 h-4" />
                                <span>Danh mục</span>
                                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isCategoryOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown popup on hover */}
                            <div className={`
                                absolute top-full left-0 mt-2
                                bg-white rounded-2xl shadow-2xl border border-[#dff1fb]
                                min-w-[280px] z-50 p-2
                                transition-all duration-300 ease-in-out origin-top-left
                                ${isCategoryOpen
                                    ? 'opacity-100 scale-100 translate-y-0'
                                    : 'opacity-0 scale-95 -translate-y-1 pointer-events-none'
                                }
                            `}>
                                <div className="max-h-[380px] overflow-y-auto">
                                    {/* Toàn bộ sản phẩm */}
                                    <button
                                        onClick={() => handleCategoryClick()}
                                        className="w-full text-left px-3.5 py-2.5 text-sm font-semibold text-[#0d1e25] hover:bg-[#e3f2fd] hover:text-[#1a237e] rounded-xl transition-colors flex items-center gap-3 cursor-pointer"
                                    >
                                        Tất cả danh mục sách
                                    </button>

                                    <div className="mx-2 border-t border-slate-100 my-1"></div>

                                    {/* Danh sách thể loại từ DB */}
                                    {loadingCategories ? (
                                        <div className="px-4 py-6 text-center">
                                            <div className="inline-block w-5 h-5 border-2 border-[#e3f2fd] border-t-[#1a237e] rounded-full animate-spin"></div>
                                            <p className="text-xs text-slate-400 mt-2 font-body">Đang tải...</p>
                                        </div>
                                    ) : categories.length > 0 ? (
                                        categories.map((category) => (
                                            <button
                                                key={category.id}
                                                onClick={() => handleCategoryClick(category.id)}
                                                className="w-full text-left px-3.5 py-2 text-sm font-body text-slate-700 hover:bg-[#e3f2fd] hover:text-[#1a237e] rounded-xl transition-colors flex items-center gap-3 cursor-pointer"
                                            >
                                                <span className="flex-1">{category.name}</span>
                                            </button>
                                        ))
                                    ) : (
                                        <div className="px-4 py-4 text-center text-sm text-slate-400 font-body">
                                            Chưa có thể loại nào
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Search Bar with Autocomplete */}
                        <div className="flex-1 relative" ref={searchRef}>
                            <div className="flex items-center bg-[#f4faff] hover:bg-[#eaf4fb] focus-within:bg-white focus-within:border-[#1a237e] border border-[#dff1fb] rounded-full px-4 h-[46px] transition-all shadow-sm">
                                <Search className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={handleSearchInputChange}
                                    onFocus={() => { if (suggestions.length > 0 || searchProducts.length > 0) setIsSearchOpen(true); }}
                                    onKeyDown={(e) => { if (e.key === 'Enter') handleSearchSubmit(); if (e.key === 'Escape') setIsSearchOpen(false); }}
                                    placeholder="Tìm kiếm sách, tác giả, thể loại..."
                                    className="w-full bg-transparent border-none outline-none text-sm text-[#0d1e25] placeholder:text-slate-400 font-body"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => { setSearchQuery(''); setIsSearchOpen(false); }}
                                        className="text-slate-400 hover:text-slate-600 text-xs cursor-pointer p-1 rounded-full hover:bg-slate-200 transition-colors"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>

                            {/* Autocomplete Dropdown */}
                            {isSearchOpen && (suggestions.length > 0 || searchProducts.length > 0) && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-[#dff1fb] z-50 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
                                    {/* Suggestions Section */}
                                    {suggestions.length > 0 && (
                                        <div className="p-4 pb-3">
                                            <div className="flex items-center gap-2 text-xs font-headline font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                                <span>Gợi ý tìm kiếm</span>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {suggestions.map((suggestion, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => handleSuggestionClick(suggestion)}
                                                        className="px-3 py-1 text-xs font-body font-semibold bg-[#e3f2fd] text-[#1a237e] hover:bg-[#1a237e] hover:text-white rounded-full transition-colors cursor-pointer"
                                                    >
                                                        {suggestion}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Divider */}
                                    {suggestions.length > 0 && searchProducts.length > 0 && (
                                        <div className="mx-4 border-t border-slate-100"></div>
                                    )}

                                    {/* Products Section */}
                                    {searchProducts.length > 0 && (
                                        <div className="p-4 pt-3">
                                            <div className="flex items-center gap-2 text-xs font-headline font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                                                <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
                                                <span>Sản phẩm phù hợp</span>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                                {searchProducts.map((product) => (
                                                    <button
                                                        key={product.id}
                                                        onClick={() => handleSearchProductClick(product.id)}
                                                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#f4faff] border border-transparent hover:border-[#dff1fb] transition-colors text-left cursor-pointer group"
                                                    >
                                                        <div className="w-10 h-14 shrink-0 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                                                            <img
                                                                src={`${import.meta.env.VITE_BACKEND_URL}/storage/book/${product.imageUrl}`}
                                                                alt={product.title}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => {
                                                                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 48 64%22><rect fill=%22%23f3f4f6%22 width=%2248%22 height=%2264%22/><text x=%2224%22 y=%2236%22 text-anchor=%22middle%22 fill=%22%239ca3af%22 font-size=%2210%22>📖</text></svg>';
                                                                }}
                                                            />
                                                        </div>
                                                        <span className="text-xs font-headline font-bold text-slate-800 group-hover:text-[#1a237e] transition-colors line-clamp-2 leading-snug">
                                                            {product.title}
                                                        </span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Loading indicator */}
                                    {isSearching && (
                                        <div className="px-4 py-3 text-center border-t border-slate-100">
                                            <div className="inline-block w-4 h-4 border-2 border-[#e3f2fd] border-t-[#1a237e] rounded-full animate-spin"></div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-5 sm:gap-6 shrink-0">
                        {account.isAuthenticated && (
                            <Link to={'/cart'} className="flex flex-col items-center gap-0.5 text-slate-700 hover:text-[#1a237e] transition-colors relative cursor-pointer group">
                                <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
                                <span className="text-[11px] font-medium font-body">Giỏ hàng</span>
                                <span className="absolute -top-1 -right-1 bg-[#1a237e] text-white text-[10px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center shadow-sm">
                                    {cartSum}
                                </span>
                            </Link>
                        )}
                        <div className="relative group">
                            <div className="flex flex-col items-center gap-0.5 text-slate-700 hover:text-[#1a237e] transition-colors cursor-pointer">
                                <div className="w-8 h-8 rounded-full bg-[#f4faff] border border-[#dff1fb] group-hover:border-blue-300 group-hover:bg-[#e3f2fd] flex items-center justify-center transition-all">
                                    <User className="w-4 h-4 text-[#1a237e]" />
                                </div>
                                <span className="text-[11px] font-medium font-body">Tài khoản</span>
                            </div>

                            {/* Transparent bridge to prevent hover loss */}
                            <div className="absolute top-full right-0 w-full h-4 -mt-4 bg-transparent"></div>

                            {/* Account Popup Box */}
                            <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-[0_12px_40px_rgba(26,35,126,0.12)] border border-[#dff1fb] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[100] transform origin-top-right scale-95 group-hover:scale-100 overflow-hidden">
                                {account.isAuthenticated ? (
                                    <div>
                                        {/* User Info Header */}
                                        <div className="p-4 bg-[#f4faff] border-b border-[#dff1fb]">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-[#e3f2fd] border border-blue-200 text-[#1a237e] flex items-center justify-center font-headline font-bold text-sm shrink-0">
                                                    {account.account?.fullName
                                                        ? account.account.fullName.charAt(0).toUpperCase()
                                                        : 'U'}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="font-headline font-bold text-sm text-[#0d1e25] truncate">
                                                        {account.account?.fullName || 'Người dùng'}
                                                    </p>
                                                    <p className="font-body text-xs text-slate-400 truncate">
                                                        {account.account?.email || ''}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Menu Items */}
                                        <div className="p-2 space-y-1">
                                            {account.account?.role === 'ADMIN' && (
                                                <button
                                                    onClick={() => navigate('/admin')}
                                                    className="w-full text-left px-3 py-2 text-xs sm:text-sm text-slate-700 hover:bg-[#e3f2fd] hover:text-[#1a237e] rounded-xl transition-colors font-medium flex items-center gap-2.5 cursor-pointer"
                                                >
                                                    <ShieldCheck className="w-4 h-4 text-[#1a237e]" />
                                                    <span>Trang quản trị</span>
                                                </button>
                                            )}
                                            <button
                                                onClick={() => navigate('/order-history')}
                                                className="w-full text-left px-3 py-2 text-xs sm:text-sm text-slate-700 hover:bg-[#e3f2fd] hover:text-[#1a237e] rounded-xl transition-colors font-medium flex items-center gap-2.5 cursor-pointer"
                                            >
                                                <Package className="w-4 h-4 text-slate-500" />
                                                <span>Lịch sử đơn hàng</span>
                                            </button>
                                            <button
                                                onClick={() => showToast('Tính năng đang được phát triển', ToastType.INFO)}
                                                className="w-full text-left px-3 py-2 text-xs sm:text-sm text-slate-700 hover:bg-[#e3f2fd] hover:text-[#1a237e] rounded-xl transition-colors font-medium flex items-center gap-2.5 cursor-pointer"
                                            >
                                                <User className="w-4 h-4 text-slate-500" />
                                                <span>Thông tin tài khoản</span>
                                            </button>
                                            <button
                                                onClick={() => showToast('Tính năng đang được phát triển', ToastType.INFO)}
                                                className="w-full text-left px-3 py-2 text-xs sm:text-sm text-slate-700 hover:bg-[#e3f2fd] hover:text-[#1a237e] rounded-xl transition-colors font-medium flex items-center gap-2.5 cursor-pointer"
                                            >
                                                <Lock className="w-4 h-4 text-slate-500" />
                                                <span>Đổi mật khẩu</span>
                                            </button>

                                            <div className="border-t border-slate-100 my-1"></div>

                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-3 py-2 text-xs sm:text-sm text-rose-600 hover:bg-rose-50 rounded-xl transition-colors font-medium flex items-center gap-2.5 cursor-pointer"
                                            >
                                                <LogOut className="w-4 h-4 text-rose-500" />
                                                <span>Đăng xuất</span>
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-4 space-y-3">
                                        <div className="text-center pb-1">
                                            <p className="font-headline font-bold text-sm text-[#0d1e25]">
                                                Chào mừng bạn!
                                            </p>
                                            <p className="font-body text-xs text-slate-400 mt-0.5">
                                                Đăng nhập để xem đơn hàng và nhận ưu đãi
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => navigate('/login')}
                                            className="w-full py-2.5 bg-[#1a237e] hover:bg-[#283593] text-white font-headline font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                                        >
                                            <LogIn className="w-4 h-4" />
                                            <span>Đăng nhập</span>
                                        </button>

                                        <button
                                            onClick={() => navigate('/register')}
                                            className="w-full py-2.5 bg-[#f4faff] hover:bg-[#e3f2fd] text-[#1a237e] border border-[#dff1fb] font-headline font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                                        >
                                            <UserPlus className="w-4 h-4" />
                                            <span>Đăng ký tài khoản</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}