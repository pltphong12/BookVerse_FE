import { useState, useEffect, useCallback } from 'react';
import { ChevronRight, Search, BookX } from 'lucide-react';
import ProductFilters, { Filters } from '../../components/client/product/ProductFilter';
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

export default function AllProductsPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState<IBook[]>([]);
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState(searchParams.get('search') || '');

    const initialCategoryId = searchParams.get('category') ? parseInt(searchParams.get('category')!, 10) : null;

    const [filters, setFilters] = useState<Filters>({
        priceRange: [0, 300000],
        categories: initialCategoryId && !isNaN(initialCategoryId) ? [initialCategoryId] : [],
        publishers: [],
        publishYears: [],
        coverTypes: [],
    });
    const [sortBy, setSortBy] = useState<SortOption>('newest');
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage, setProductsPerPage] = useState(12);

    const publishYears = [2026, 2025, 2024, 2023, 2022, 2021, 2020];
    const coverTypes = ['PAPERBACK', 'HARDCOVER'];

    // Fetch categories
    const { data: categoryOptions = [] } = useQuery({
        queryKey: ['all-categories'],
        queryFn: async () => {
            const res = await callFetchAllCategoriesApi();
            return res.data?.data ?? [];
        },
        staleTime: 5 * 60 * 1000,
        select: (data) => data.map((c: { id: number; name: string }) => ({ id: c.id, name: c.name })),
    });

    // Fetch publishers
    const { data: publisherOptions = [] } = useQuery({
        queryKey: ['all-publishers'],
        queryFn: async () => {
            const res = await callFetchAllPublishersApi();
            return res.data?.data ?? [];
        },
        staleTime: 5 * 60 * 1000,
        select: (data) => data.map((p: { id: number; name: string }) => ({ id: p.id, name: p.name })),
    });

    // Synchronize category and search from URL search params
    useEffect(() => {
        const categoryParam = searchParams.get('category');
        const searchParam = searchParams.get('search') || '';

        setSearchKeyword(searchParam);

        if (categoryParam) {
            const catId = parseInt(categoryParam, 10);
            if (!isNaN(catId)) {
                setFilters(prev => {
                    if (prev.categories.length === 1 && prev.categories[0] === catId) return prev;
                    return { ...prev, categories: [catId] };
                });
            }
        } else {
            setFilters(prev => {
                if (prev.categories.length === 0) return prev;
                return { ...prev, categories: [] };
            });
        }
        setCurrentPage(1);
    }, [searchParams]);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        const criteria: IBookFilterCriteria = {};

        if (searchKeyword.trim()) criteria.title = searchKeyword.trim();

        if (filters.priceRange[0] > 0) criteria.minPrice = filters.priceRange[0];
        if (filters.priceRange[1] < 300000) criteria.maxPrice = filters.priceRange[1];

        if (filters.categories.length > 0) {
            criteria.categoryId = filters.categories;
        }

        if (filters.publishers.length > 0) {
            criteria.publisherId = filters.publishers;
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

        // Update or remove category param from URL if changed
        if (newFilters.categories.length === 1) {
            setSearchParams(prev => {
                const updated = new URLSearchParams(prev);
                updated.set('category', newFilters.categories[0].toString());
                return updated;
            });
        } else {
            setSearchParams(prev => {
                const updated = new URLSearchParams(prev);
                updated.delete('category');
                return updated;
            });
        }
    };

    const handleSortChange = (sort: SortOption) => {
        setSortBy(sort);
        setCurrentPage(1);
    };

    const handleItemsPerPageChange = (count: number) => {
        setProductsPerPage(count);
        setCurrentPage(1);
    };

    const activeCategoryName = filters.categories.length === 1
        ? categoryOptions.find(c => c.id === filters.categories[0])?.name
        : undefined;

    return (
        <div className="space-y-6 sm:space-y-8">
            {/* Breadcrumbs */}
            <nav aria-label="Breadcrumb">
                <ol className="flex items-center flex-wrap gap-1.5 text-xs sm:text-sm font-body text-slate-500">
                    <li>
                        <Link to="/" className="text-slate-500 hover:text-[#0070B5] transition-colors">
                            Trang chủ
                        </Link>
                    </li>
                    <li>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                    </li>
                    <li aria-current="page" className="text-[#1A1A1A] font-semibold">
                        {activeCategoryName ? activeCategoryName : 'Tất cả sản phẩm'}
                    </li>
                </ol>
            </nav>

            {/* Search keyword indicator */}
            {searchKeyword && (
                <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-[#E5E2DD] shadow-xs">
                    <div className="w-8 h-8 rounded bg-[#FAF9F7] text-[#1A1A1A] flex items-center justify-center shrink-0 border border-[#E5E2DD]">
                        <Search className="w-4 h-4" />
                    </div>
                    <div className="flex flex-wrap items-baseline gap-2">
                        <span className="text-xs sm:text-sm font-body text-slate-500">Kết quả tìm kiếm cho:</span>
                        <span className="font-serif font-bold text-base text-[#1A1A1A]">"{searchKeyword}"</span>
                        <span className="text-xs font-body text-slate-400">({totalProducts} cuốn sách)</span>
                    </div>
                    <button
                        onClick={() => {
                            setSearchKeyword('');
                            setCurrentPage(1);
                            setSearchParams(prev => {
                                const updated = new URLSearchParams(prev);
                                updated.delete('search');
                                return updated;
                            });
                        }}
                        className="ml-auto text-xs font-body font-medium text-slate-500 hover:text-red-600 transition-colors cursor-pointer px-2 py-1 rounded hover:bg-red-50"
                    >
                        ✕ Xóa tìm kiếm
                    </button>
                </div>
            )}

            {/* Main Content Layout (Sidebar 3 cols + Grid 9 cols) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10 items-start">
                {/* Left Sidebar Filter */}
                <div className="col-span-1 md:col-span-4 lg:col-span-3 md:sticky md:top-24">
                    <ProductFilters
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        categories={categoryOptions}
                        publishers={publisherOptions}
                        publishYears={publishYears}
                        coverTypes={coverTypes}
                    />
                </div>

                {/* Right Products Area */}
                <div className="col-span-1 md:col-span-8 lg:col-span-9 flex flex-col">
                    <ProductSort
                        sortBy={sortBy}
                        onSortChange={handleSortChange}
                        totalProducts={totalProducts}
                        productsPerPage={productsPerPage}
                        onItemsPerPageChange={handleItemsPerPageChange}
                        currentPage={currentPage}
                        title={activeCategoryName ? `Sách ${activeCategoryName}` : 'Tất cả sản phẩm'}
                    />

                    {loading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-10 sm:gap-y-12">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="space-y-3">
                                    <div className="skeleton-shimmer aspect-[2/3] rounded w-full"></div>
                                    <div className="skeleton-shimmer h-4 w-3/4 rounded"></div>
                                    <div className="skeleton-shimmer h-3 w-1/2 rounded"></div>
                                    <div className="skeleton-shimmer h-5 w-1/3 rounded"></div>
                                </div>
                            ))}
                        </div>
                    ) : products.length > 0 ? (
                        <>
                            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-10 sm:gap-y-12">
                                {products.map((product) => (
                                    <div key={product.id}>
                                        <ProductCard {...product} />
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            <Pagination
                                page={currentPage}
                                totalPage={totalPages}
                                setPage={setCurrentPage}
                            />
                        </>
                    ) : (
                        <div className="bg-white rounded-lg border border-[#E5E2DD] p-12 sm:p-16 text-center shadow-xs flex flex-col items-center justify-center">
                            <BookX className="w-16 h-16 text-slate-300 mb-4" />
                            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1A1A1A] mb-2">
                                Không tìm thấy sách phù hợp
                            </h3>
                            <p className="font-body text-sm text-slate-500 max-w-md mb-6">
                                Hãy thử thay đổi khoảng giá, xóa bớt các bộ lọc hoặc tìm kiếm với từ khóa khác.
                            </p>
                            <button
                                onClick={() => {
                                    setFilters({
                                        priceRange: [0, 300000],
                                        categories: [],
                                        publishers: [],
                                        publishYears: [],
                                        coverTypes: [],
                                    });
                                    setSearchKeyword('');
                                    setCurrentPage(1);
                                    setSearchParams({});
                                }}
                                className="bg-[#1A1A1A] hover:bg-[#0070B5] text-white px-6 py-2.5 rounded font-body font-semibold text-sm transition-colors cursor-pointer shadow-xs"
                            >
                                Xóa tất cả bộ lọc
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
