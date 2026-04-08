import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronRight } from 'lucide-react';
import ProductFilters from '../../components/client/product/ProductFilter';
import ProductSort from '../../components/client/product/ProductSort';
import ProductCard from '../../components/client/product/ProductCard';
import { Pagination } from '../../components/global/Pagination';
import { callFetchAllProductsWithPaginationAndFilterApi, callFetchAllCategoriesApi, callFetchAllPublishersApi } from '../../services/api';
import { IBook, IBookFilterCriteria } from '../../types/backend';
import { useSearchParams } from 'react-router-dom';

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

    const [categoryOptions, setCategoryOptions] = useState<{ id: number; name: string }[]>([]);
    const [publisherOptions, setPublisherOptions] = useState<{ id: number; name: string }[]>([]);
    const publishYears = [2020, 2021, 2022, 2023, 2024, 2025, 2026];
    const coverTypes = ['PAPERBACK', 'HARDCOVER'];
    const hasAppliedUrlFilter = useRef(false);

    useEffect(() => {
        const fetchOptions = async () => {
            const [catRes, pubRes] = await Promise.all([
                callFetchAllCategoriesApi(),
                callFetchAllPublishersApi(),
            ]);
            if (catRes.data?.data) {
                setCategoryOptions(catRes.data.data.map(c => ({ id: c.id, name: c.name })));
            }
            if (pubRes.data?.data) {
                setPublisherOptions(pubRes.data.data.map(p => ({ id: p.id, name: p.name })));
            }
        };
        fetchOptions();
    }, []);

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

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        const criteria: IBookFilterCriteria = {};

        if (filters.priceRange[0] > 0) criteria.minPrice = filters.priceRange[0];
        if (filters.priceRange[1] < 300000) criteria.maxPrice = filters.priceRange[1];

        if (filters.categories.length > 0) {
            criteria.categoryId = filters.categories
                .map(name => categoryOptions.find(c => c.name === name)?.id)
                .filter((id): id is number => id !== undefined);
        }
        if (filters.publishers.length > 0) {
            criteria.publisherId = filters.publishers
                .map(name => publisherOptions.find(p => p.name === name)?.id)
                .filter((id): id is number => id !== undefined);
        }
        if (filters.publishYears.length > 0) {
            criteria.publishYear = filters.publishYears;
        }
        if (filters.coverTypes.length > 0) {
            criteria.coverFormat = filters.coverTypes;
        }

        criteria.sortType = SORT_OPTION_MAP[sortBy];

        const res = await callFetchAllProductsWithPaginationAndFilterApi(criteria, currentPage, productsPerPage);
        if (res.data?.data) {
            setProducts(res.data.data.result);
            setTotalProducts(res.data.data.meta.total);
            setTotalPages(res.data.data.meta.pages);
        }
        setLoading(false);
    }, [filters, sortBy, currentPage, productsPerPage, categoryOptions, publisherOptions]);

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
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-6">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
                    <a href="/" className="hover:text-primary-500">
                        Trang chủ
                    </a>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-gray-900 font-semibold">Tất cả sản phẩm</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                    <div>
                        <ProductFilters
                            filters={filters}
                            onFilterChange={handleFilterChange}
                            categories={categoryOptions.map(c => c.name)}
                            publishers={publisherOptions.map(p => p.name)}
                            publishYears={publishYears}
                            coverTypes={coverTypes}
                        />
                    </div>

                    <div className="lg:col-span-3 space-y-6">
                        <ProductSort
                            sortBy={sortBy}
                            onSortChange={handleSortChange}
                            totalProducts={totalProducts}
                            productsPerPage={productsPerPage}
                            onItemsPerPageChange={handleItemsPerPageChange}
                        />

                        {loading ? (
                            <div className="bg-white rounded-lg p-12 text-center">
                                <p className="text-gray-600">Đang tải...</p>
                            </div>
                        ) : products.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                            <div className="bg-white rounded-lg p-12 text-center">
                                <p className="text-gray-600 mb-4">Không tìm thấy sản phẩm phù hợp</p>
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
                                    className="btn btn-primary"
                                >
                                    Xóa bộ lọc
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
