import { ChevronDown } from 'lucide-react';

type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'best-selling' | 'rating';

interface ProductSortProps {
    sortBy: SortOption;
    onSortChange: (sort: SortOption) => void;
    totalProducts: number;
    productsPerPage: number;
    onItemsPerPageChange: (count: number) => void;
    currentPage?: number;
    title?: string;
}

export default function ProductSort({
    sortBy,
    onSortChange,
    totalProducts,
    productsPerPage,
    onItemsPerPageChange,
    currentPage = 1,
    title = 'Tất cả sản phẩm',
}: ProductSortProps) {
    const sortOptions: { value: SortOption; label: string }[] = [
        { value: 'newest', label: 'Mới nhất' },
        { value: 'price-asc', label: 'Giá tăng dần' },
        { value: 'price-desc', label: 'Giá giảm dần' },
        { value: 'best-selling', label: 'Bán chạy' },
        { value: 'rating', label: 'Đánh giá cao' },
    ];

    const itemsPerPageOptions = [12, 24, 36, 48];

    const startItem = totalProducts > 0 ? (currentPage - 1) * productsPerPage + 1 : 0;
    const endItem = Math.min(currentPage * productsPerPage, totalProducts);

    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 pb-4 border-b border-[#E5E2DD] gap-4">
            {/* Title & Count */}
            <div>
                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1A1A] tracking-tight">
                    {title}
                </h1>
                <p className="font-body text-sm text-slate-500 mt-1">
                    {totalProducts > 0 ? (
                        <>Hiển thị <strong>{startItem} - {endItem}</strong> của <strong>{totalProducts}</strong> kết quả</>
                    ) : (
                        'Không có sản phẩm nào'
                    )}
                </p>
            </div>

            {/* Controls: Per Page & Sort By */}
            <div className="flex items-center gap-6 flex-wrap self-stretch sm:self-auto justify-between sm:justify-end">
                {/* Items Per Page */}
                <div className="flex items-center gap-2 font-body text-sm text-slate-600">
                    <span className="text-xs text-slate-400">Hiển thị:</span>
                    <select
                        value={productsPerPage}
                        onChange={(e) => onItemsPerPageChange(parseInt(e.target.value))}
                        className="bg-transparent border-b border-[#1A1A1A] focus:border-[#0070B5] outline-none pb-0.5 text-xs font-semibold text-[#1A1A1A] cursor-pointer"
                    >
                        {itemsPerPageOptions.map((count) => (
                            <option key={count} value={count}>
                                {count} / trang
                            </option>
                        ))}
                    </select>
                </div>

                {/* Sort Option */}
                <div className="flex items-center gap-2 font-body text-sm text-slate-600">
                    <span className="text-slate-500 whitespace-nowrap">Sắp xếp theo:</span>
                    <div className="relative">
                        <select
                            value={sortBy}
                            onChange={(e) => onSortChange(e.target.value as SortOption)}
                            className="bg-transparent border-b border-[#1A1A1A] focus:border-[#0070B5] outline-none pr-5 pb-0.5 font-medium text-[#1A1A1A] cursor-pointer appearance-none min-w-[130px]"
                        >
                            {sortOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#1A1A1A] pointer-events-none" />
                    </div>
                </div>
            </div>
        </div>
    );
}
