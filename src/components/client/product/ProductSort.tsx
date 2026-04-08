import { ChevronDown } from 'lucide-react';

type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'best-selling' | 'rating';

interface ProductSortProps {
    sortBy: SortOption;
    onSortChange: (sort: SortOption) => void;
    totalProducts: number;
    productsPerPage: number;
    onItemsPerPageChange: (count: number) => void;
}

export default function ProductSort({
    sortBy,
    onSortChange,
    totalProducts,
    productsPerPage,
    onItemsPerPageChange,
}: ProductSortProps) {
    const sortOptions: { value: SortOption; label: string }[] = [
        { value: 'newest', label: 'Mới nhất' },
        { value: 'best-selling', label: 'Bán chạy nhất' },
        { value: 'rating', label: 'Đánh giá cao nhất' },
        { value: 'price-asc', label: 'Giá: Thấp đến cao' },
        { value: 'price-desc', label: 'Giá: Cao đến thấp' },
    ];

    const itemsPerPageOptions = [12, 24, 36, 48];

    return (
        <div className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between flex-wrap gap-4">
            <div className="text-sm text-gray-600">
                Hiển thị <span className="font-semibold text-gray-900">{totalProducts}</span> sản phẩm
            </div>

            <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Hiển thị:</span>
                    <select
                        value={productsPerPage}
                        onChange={(e) => onItemsPerPageChange(parseInt(e.target.value))}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                    >
                        {itemsPerPageOptions.map((count) => (
                            <option key={count} value={count}>
                                {count}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Sắp xếp:</span>
                    <div className="relative">
                        <select
                            value={sortBy}
                            onChange={(e) => onSortChange(e.target.value as SortOption)}
                            className="appearance-none px-3 py-2 pr-8 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-primary-500 bg-white cursor-pointer"
                        >
                            {sortOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>
            </div>
        </div>
    );
}
