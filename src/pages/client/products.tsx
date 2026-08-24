import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronRight, Home, Search, BookX } from 'lucide-react';
import ProductFilters from '../../components/client/product/ProductFilter';
import ProductSort from '../../components/client/product/ProductSort';
import ProductCard from '../../components/client/product/ProductCard';
import { Pagination } from '../../components/global/Pagination';
import { callFetchAllProductsWithPaginationAndFilterApi, callFetchAllCategoriesApi, callFetchAllPublishersApi } from '../../services/api';
import { IBook, IBookFilterCriteria } from '../../types/backend';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'best-selling' | 'rating';

const SORT_OPTION_MAP: Record<SortOption, string> = {
    'newest': 'NEWEST',
    'price-asc': 'PRICE_ASC',
    'price-desc': 'PRICE_DESC',
    'best-selling': 'BEST_SELLING',
    'rating': 'RATING',
};

interface Filters {
    priceRange: [number, number];
    categories: string[];
    publishers: string[];
    publishYears: number[];
    coverTypes: string[];
}

export default function AllProductsPage() {
    const [searchParams] = useSearchParams();
    const [products, setProducts] = useState<IBook[]>([]);
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState(searchParams.get('search') || '');

    const [filters, setFilters] = useState<Filters>({
        priceRange: [0, 300000],
        categories: [],
        publishers: [],
        publishYears: [],
        coverTypes: [],
    });
    const [sortBy, setSortBy] = useState<SortOption>('newest');
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage, setProductsPerPage] = useState(12);

    const publishYears = [2020, 2021, 2022, 2023, 2024, 2025, 2026];
    const coverTypes = ['PAPERBACK', 'HARDCOVER'];
    const hasAppliedUrlFilter = useRef(false);

    // Fetch categories (shared cache with Header via query key ['all-categories'])
    const { data: categoryOptions = [] } = useQuery({
        queryKey: ['all-categories'],
        queryFn: async () => {
            const res = await callFetchAllCategoriesApi();
            return res.data?.data ?? [];
        },
        staleTime: 5 * 60 * 1000,
        select: (data) => data.map((c: { id: number; name: string }) => ({ id: c.id, name: c.name })),
    });

    // Fetch publishers (cached)
    const { data: publisherOptions = [] } = useQuery({
        queryKey: ['all-publishers'],
        queryFn: async () => {
            const res = await callFetchAllPublishersApi();
            return res.data?.data ?? [];
        },
        staleTime: 5 * 60 * 1000,
        select: (data) => data.map((p: { id: number; name: string }) => ({ id: p.id, name: p.name })),
    });

    // Keep refs in sync so fetchProducts doesn't depend on query data directly
    const categoryOptionsRef = useRef(categoryOptions);
    const publisherOptionsRef = useRef(publisherOptions);
    useEffect(() => { categoryOptionsRef.current = categoryOptions; }, [categoryOptions]);
    useEffect(() => { publisherOptionsRef.current = publisherOptions; }, [publisherOptions]);

    // Apply category filter from URL query params
    useEffect(() => {
        const categoryId = searchParams.get('category');
        if (categoryId && categoryOptions.length > 0) {
            const id = parseInt(categoryId, 10);
            const matchedCategory = categoryOptions.find(c => c.id === id);
            if (matchedCategory) {
                setFilters(prev => ({
                    ...prev,
                    categories: [matchedCategory.name],
                }));
                setCurrentPage(1);
                hasAppliedUrlFilter.current = true;
            }
        } else if (!categoryId && hasAppliedUrlFilter.current) {
            // URL no longer has category param, clear filter
            setFilters(prev => ({
                ...prev,
                categories: [],
            }));
            setCurrentPage(1);
            hasAppliedUrlFilter.current = false;
        }
    }, [searchParams, categoryOptions]);

    // Sync search keyword from URL
    useEffect(() => {
        const search = searchParams.get('search') || '';
        setSearchKeyword(search);
        setCurrentPage(1);
    }, [searchParams]);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        const criteria: IBookFilterCriteria = {};

        if (searchKeyword.trim()) criteria.title = searchKeyword.trim();

        if (filters.priceRange[0] > 0) criteria.minPrice = filters.priceRange[0];
        if (filters.priceRange[1] < 300000) criteria.maxPrice = filters.priceRange[1];

        if (filters.categories.length > 0) {
            criteria.categoryId = filters.categories
                .map(name => categoryOptionsRef.current.find(c => c.name === name)?.id)
                .filter((id): id is number => id !== undefined);
        }
        if (filters.publishers.length > 0) {
            criteria.publisherId = filters.publishers
                .map(name => publisherOptionsRef.current.find(p => p.name === name)?.id)
                .filter((id): id is number => id !== undefined);
        }
        if (filters.publishYears.length > 0) {
            criteria.publishYear = filters.publishYears;
        }
        if (filters.coverTypes.length > 0) {
            criteria.coverFormat = filters.coverTypes;
        }

        criteria.sortType = SORT_OPTION_MAP[sortBy];

        try {
            const res = await callFetchAllProductsWithPaginationAndFilterApi(criteria, currentPage, productsPerPage);
            if (res.data?.data) {
                setProducts(res.data.data.result);
                setTotalProducts(res.data.data.meta.total);
                setTotalPages(res.data.data.meta.pages);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [filters, sortBy, currentPage, productsPerPage, searchKeyword]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleFilterChange = (newFilters: Filters) => {
        setFilters(newFilters);
        setCurrentPage(1);
    };

    const handleSortChange = (sort: SortOption) => {
        setSortBy(sort);
        setCurrentPage(1);
    };

    const handleItemsPerPageChange = (count: number) => {
        setProductsPerPage(count);
        setCurrentPage(1);
    };

    return (
        <div className="space-y-6 sm:space-y-8">
            {/* Breadcrumbs */}
            <nav aria-label="Breadcrumb">
                <ol className="flex items-center flex-wrap gap-1.5 text-xs sm:text-sm font-body text-slate-500 font-medium">
                    <li>
                        <Link to="/" className="flex items-center gap-1 text-slate-500 hover:text-[#1a237e] transition-colors">
                            <Home className="w-3.5 h-3.5" />
                            <span>Trang chủ</span>
                        </Link>
                    </li>
                    <li>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                    </li>
                    <li aria-current="page" className="text-[#0d1e25] font-semibold">
                        Tất cả sản phẩm
                    </li>
                </ol>
            </nav>

            {/* Search keyword indicator */}
            {searchKeyword && (
                <div className="flex items-center gap-3 p-4 sm:p-5 bg-white rounded-2xl border border-[#dff1fb] shadow-sm">
                    <div className="w-9 h-9 rounded-xl bg-[#e3f2fd] text-[#1a237e] flex items-center justify-center shrink-0">
                        <Search className="w-4 h-4" />
                    </div>
                    <div className="flex flex-wrap items-baseline gap-2">
                        <span className="text-xs sm:text-sm font-body text-slate-500">Kết quả tìm kiếm cho:</span>
                        <span className="font-headline font-bold text-sm sm:text-base text-[#1a237e]">"{searchKeyword}"</span>
                        <span className="text-xs font-body text-slate-400 font-medium">({totalProducts} cuốn sách)</span>
                    </div>
                    <button
                        onClick={() => {
                            setSearchKeyword('');
                            setCurrentPage(1);
                            window.history.replaceState(null, '', '/products');
                        }}
                        className="ml-auto text-xs sm:text-sm font-body font-medium text-slate-400 hover:text-red-600 transition-colors cursor-pointer flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-red-50"
                    >
                        ✕ Xóa tìm kiếm
                    </button>
                </div>
            )}

            {/* Main Content Grid: 1 col (filters) + 3 cols (products) */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8 items-start">
                {/* Left Sidebar Filter */}
                <div className="lg:col-span-1 lg:sticky lg:top-24">
                    <ProductFilters
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        categories={categoryOptions.map(c => c.name)}
                        publishers={publisherOptions.map(p => p.name)}
                        publishYears={publishYears}
                        coverTypes={coverTypes}
                    />
                </div>

                {/* Right Products Area */}
                <div className="lg:col-span-3 space-y-6">
                    <ProductSort
                        sortBy={sortBy}
                        onSortChange={handleSortChange}
                        totalProducts={totalProducts}
                        productsPerPage={productsPerPage}
                        onItemsPerPageChange={handleItemsPerPageChange}
                        currentPage={currentPage}
                    />

                    {loading ? (
                        <div className="bg-white rounded-2xl border border-[#dff1fb] p-16 text-center shadow-sm flex flex-col items-center justify-center gap-3">
                            <div className="w-10 h-10 border-3 border-[#e3f2fd] border-t-[#1a237e] rounded-full animate-spin"></div>
                            <p className="font-body text-sm text-slate-500 font-medium">Đang tải danh sách sách...</p>
                        </div>
                    ) : products.length > 0 ? (
                        <>
                            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                                {products.map((product) => (
                                    <ProductCard key={product.id} {...product} />
                                ))}
                            </div>

                            {totalPages > 1 && (
                                <Pagination
                                    page={currentPage}
                                    totalPage={totalPages}
                                    setPage={setCurrentPage}
                                />
                            )}
                        </>
                    ) : (
                        <div className="bg-white rounded-2xl border border-[#dff1fb] p-12 sm:p-16 text-center shadow-sm max-w-md mx-auto">
                            <div className="w-16 h-16 rounded-2xl bg-[#e3f2fd] text-[#1a237e] flex items-center justify-center mx-auto mb-4">
                                <BookX className="w-8 h-8" />
                            </div>
                            <h3 className="font-headline font-bold text-lg text-[#0d1e25] mb-2">
                                Không tìm thấy cuốn sách nào
                            </h3>
                            <p className="font-body text-sm text-slate-500 mb-6 leading-relaxed">
                                Hãy thử thay đổi hoặc xóa bớt các tiêu chí trong bộ lọc để tìm thấy nhiều tựa sách hơn.
                            </p>
                            <button
                                onClick={() =>
                                    handleFilterChange({
                                        priceRange: [0, 300000],
                                        categories: [],
                                        publishers: [],
                                        publishYears: [],
                                        coverTypes: [],
                                    })
                                }
                                className="bg-[#1a237e] hover:bg-[#283593] text-white px-6 py-2.5 rounded-xl font-headline font-semibold text-sm transition-colors shadow-sm cursor-pointer"
                            >
                                Xóa toàn bộ bộ lọc
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

