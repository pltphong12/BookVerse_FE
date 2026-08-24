import { ChevronDown, ArrowDownUp } from 'lucide-react';

type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'best-selling' | 'rating';

interface ProductSortProps {
    sortBy: SortOption;
    onSortChange: (sort: SortOption) => void;
    totalProducts: number;
    productsPerPage: number;
    onItemsPerPageChange: (count: number) => void;
    currentPage?: number;
}

export default function ProductSort({
    sortBy,
    onSortChange,
    totalProducts,
    productsPerPage,
    onItemsPerPageChange,
    currentPage = 1,
}: ProductSortProps) {
    const sortOptions: { value: SortOption; label: string }[] = [
        { value: 'newest', label: 'Mới nhất' },
        { value: 'best-selling', label: 'Bán chạy nhất' },
        { value: 'rating', label: 'Đánh giá cao nhất' },
        { value: 'price-asc', label: 'Giá: Thấp đến cao' },
        { value: 'price-desc', label: 'Giá: Cao đến thấp' },
    ];

    const itemsPerPageOptions = [12, 24, 36, 48];

    const startItem = totalProducts > 0 ? (currentPage - 1) * productsPerPage + 1 : 0;
    const endItem = Math.min(currentPage * productsPerPage, totalProducts);

    return (
        <div className="bg-white rounded-2xl border border-[#dff1fb] shadow-sm p-4 sm:p-5 flex items-center justify-between flex-wrap gap-4">
            <div className="text-xs sm:text-sm font-body text-slate-500">
                {totalProducts > 0 ? (
                    <>
                        Hiển thị <span className="font-headline font-bold text-[#1a237e]">{startItem} - {endItem}</span> của{' '}
                        <span className="font-headline font-bold text-[#1a237e]">{totalProducts}</span> kết quả
                    </>
                ) : (
                    'Không có sản phẩm nào'
                )}
            </div>

            <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                {/* Items Per Page Select */}
                <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-body text-slate-500">Hiển thị:</span>
                    <div className="relative">
                        <select
                            value={productsPerPage}
                            onChange={(e) => onItemsPerPageChange(parseInt(e.target.value))}
                            className="appearance-none px-3 py-1.5 pr-7 bg-[#f4faff] border border-[#dff1fb] hover:border-blue-300 rounded-xl text-xs sm:text-sm font-body font-semibold text-slate-700 focus:outline-none focus:border-[#1a237e] focus:bg-white cursor-pointer transition-all"
                        >
                            {itemsPerPageOptions.map((count) => (
                                <option key={count} value={count}>
                                    {count} / trang
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                    </div>
                </div>

                {/* Sort Option Select */}
                <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-body text-slate-500 flex items-center gap-1">
                        <ArrowDownUp className="w-3.5 h-3.5 text-slate-400" />
                        <span>Sắp xếp:</span>
                    </span>
                    <div className="relative">
                        <select
                            value={sortBy}
                            onChange={(e) => onSortChange(e.target.value as SortOption)}
                            className="appearance-none px-3.5 py-1.5 pr-8 bg-[#f4faff] border border-[#dff1fb] hover:border-blue-300 rounded-xl text-xs sm:text-sm font-body font-semibold text-slate-700 focus:outline-none focus:border-[#1a237e] focus:bg-white cursor-pointer transition-all"
                        >
                            {sortOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                    </div>
                </div>
            </div>
        </div>
    );
}

