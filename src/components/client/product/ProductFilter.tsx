import { useState } from 'react';
import { RotateCcw } from 'lucide-react';

export interface Filters {
    priceRange: [number, number];
    categories: number[];
    publishers: number[];
    publishYears: number[];
    coverTypes: string[];
}

interface ProductFiltersProps {
    filters: Filters;
    onFilterChange: (filters: Filters) => void;
    categories: { id: number; name: string }[];
    publishers: { id: number; name: string }[];
    publishYears: number[];
    coverTypes?: string[];
}

export default function ProductFilters({
    filters,
    onFilterChange,
    categories,
    publishers,
    publishYears,
    coverTypes = ['PAPERBACK', 'HARDCOVER'],
}: ProductFiltersProps) {
    const [customMin, setCustomMin] = useState<string>(
        filters.priceRange[0] > 0 ? filters.priceRange[0].toString() : ''
    );
    const [customMax, setCustomMax] = useState<string>(
        filters.priceRange[1] < 300000 ? filters.priceRange[1].toString() : ''
    );

    const handlePresetChange = (min: number, max: number) => {
        setCustomMin(min > 0 ? min.toString() : '');
        setCustomMax(max < 300000 ? max.toString() : '');
        onFilterChange({ ...filters, priceRange: [min, max] });
    };

    const handleApplyCustomPrice = () => {
        const min = customMin ? parseInt(customMin) || 0 : 0;
        const max = customMax ? parseInt(customMax) || 300000 : 300000;
        onFilterChange({ ...filters, priceRange: [min, max] });
    };

    const handleCheckboxChange = (
        filterType: 'categories' | 'publishers' | 'coverTypes',
        value: number | string,
        checked: boolean
    ) => {
        if (filterType === 'coverTypes') {
            const current = filters.coverTypes;
            const updated = checked
                ? [...current, value as string]
                : current.filter((item) => item !== value);
            onFilterChange({ ...filters, coverTypes: updated });
        } else {
            const current = filters[filterType] as number[];
            const updated = checked
                ? [...current, value as number]
                : current.filter((item) => item !== value);
            onFilterChange({ ...filters, [filterType]: updated });
        }
    };

    const handleYearSelect = (yearValue: string) => {
        if (!yearValue) {
            onFilterChange({ ...filters, publishYears: [] });
        } else {
            onFilterChange({ ...filters, publishYears: [parseInt(yearValue)] });
        }
    };

    const hasActiveFilters =
        filters.priceRange[0] !== 0 ||
        filters.priceRange[1] !== 300000 ||
        filters.categories.length > 0 ||
        filters.publishers.length > 0 ||
        filters.publishYears.length > 0 ||
        filters.coverTypes.length > 0;

    const resetFilters = () => {
        setCustomMin('');
        setCustomMax('');
        onFilterChange({
            priceRange: [0, 300000],
            categories: [],
            publishers: [],
            publishYears: [],
            coverTypes: [],
        });
    };

    const isPresetSelected = (min: number, max: number) =>
        filters.priceRange[0] === min && filters.priceRange[1] === max;

    return (
        <aside className="w-full pr-0 md:pr-6 md:border-r border-[#E5E2DD] self-start space-y-6">
            {/* Header: Title & Reset Button */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E2DD]">
                <h2 className="font-serif text-2xl font-bold text-[#1A1A1A]">
                    Bộ lọc
                </h2>
                {hasActiveFilters && (
                    <button
                        onClick={resetFilters}
                        className="text-xs text-slate-500 hover:text-red-600 font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Đặt lại</span>
                    </button>
                )}
            </div>

            {/* 1. Khoảng giá (Price Range) */}
            <div className="border-b border-[#E5E2DD] pb-6 space-y-4">
                <h3 className="font-body text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider">
                    Khoảng giá
                </h3>
                <div className="space-y-2.5 font-body text-sm text-slate-700">
                    <label className="flex items-center gap-2.5 cursor-pointer group">
                        <input
                            type="radio"
                            name="price_preset"
                            checked={isPresetSelected(0, 300000)}
                            onChange={() => handlePresetChange(0, 300000)}
                            className="accent-[#1A1A1A] w-4 h-4 cursor-pointer"
                        />
                        <span className="group-hover:text-[#0070B5] transition-colors">Tất cả mức giá</span>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer group">
                        <input
                            type="radio"
                            name="price_preset"
                            checked={isPresetSelected(0, 50000)}
                            onChange={() => handlePresetChange(0, 50000)}
                            className="accent-[#1A1A1A] w-4 h-4 cursor-pointer"
                        />
                        <span className="group-hover:text-[#0070B5] transition-colors">Dưới 50.000đ</span>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer group">
                        <input
                            type="radio"
                            name="price_preset"
                            checked={isPresetSelected(50000, 150000)}
                            onChange={() => handlePresetChange(50000, 150000)}
                            className="accent-[#1A1A1A] w-4 h-4 cursor-pointer"
                        />
                        <span className="group-hover:text-[#0070B5] transition-colors">50.000đ - 150.000đ</span>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer group">
                        <input
                            type="radio"
                            name="price_preset"
                            checked={isPresetSelected(150000, 300000)}
                            onChange={() => handlePresetChange(150000, 300000)}
                            className="accent-[#1A1A1A] w-4 h-4 cursor-pointer"
                        />
                        <span className="group-hover:text-[#0070B5] transition-colors">Trên 150.000đ</span>
                    </label>
                </div>

                {/* Custom price input */}
                <div className="pt-3 border-t border-[#E5E2DD]">
                    <p className="text-xs font-body text-slate-500 mb-2">Hoặc nhập khoảng giá (₫):</p>
                    <div className="flex items-center gap-2 mb-3">
                        <input
                            type="number"
                            min="0"
                            placeholder="Từ"
                            value={customMin}
                            onChange={(e) => setCustomMin(e.target.value)}
                            className="w-full bg-transparent border-b border-[#1A1A1A] focus:border-[#0070B5] outline-none px-1 py-1 text-sm font-body text-[#1A1A1A]"
                        />
                        <span className="text-slate-400">-</span>
                        <input
                            type="number"
                            min="0"
                            placeholder="Đến"
                            value={customMax}
                            onChange={(e) => setCustomMax(e.target.value)}
                            className="w-full bg-transparent border-b border-[#1A1A1A] focus:border-[#0070B5] outline-none px-1 py-1 text-sm font-body text-[#1A1A1A]"
                        />
                    </div>
                    <button
                        onClick={handleApplyCustomPrice}
                        className="w-full bg-[#1A1A1A] hover:bg-[#0070B5] text-white font-body font-semibold text-xs py-2 px-4 rounded transition-colors duration-200 cursor-pointer shadow-xs"
                    >
                        Áp dụng
                    </button>
                </div>
            </div>

            {/* 2. Thể loại sách (Categories) */}
            {categories.length > 0 && (
                <div className="border-b border-[#E5E2DD] pb-6 space-y-3">
                    <h3 className="font-body text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider">
                        Thể loại sách
                    </h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {categories.map((cat) => (
                            <label key={cat.id} className="flex items-center gap-2.5 cursor-pointer group text-sm font-body text-slate-700">
                                <input
                                    type="checkbox"
                                    checked={filters.categories.includes(cat.id)}
                                    onChange={(e) => handleCheckboxChange('categories', cat.id, e.target.checked)}
                                    className="accent-[#1A1A1A] rounded-sm w-4 h-4 cursor-pointer"
                                />
                                <span className="group-hover:text-[#0070B5] transition-colors">{cat.name}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {/* 3. Nhà xuất bản (Publishers) */}
            {publishers.length > 0 && (
                <div className="border-b border-[#E5E2DD] pb-6 space-y-3">
                    <h3 className="font-body text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider">
                        Nhà xuất bản
                    </h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {publishers.map((pub) => (
                            <label key={pub.id} className="flex items-center gap-2.5 cursor-pointer group text-sm font-body text-slate-700">
                                <input
                                    type="checkbox"
                                    checked={filters.publishers.includes(pub.id)}
                                    onChange={(e) => handleCheckboxChange('publishers', pub.id, e.target.checked)}
                                    className="accent-[#1A1A1A] rounded-sm w-4 h-4 cursor-pointer"
                                />
                                <span className="group-hover:text-[#0070B5] transition-colors">{pub.name}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {/* 4. Năm phát hành (Release Year) */}
            <div className="border-b border-[#E5E2DD] pb-6 space-y-3">
                <h3 className="font-body text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider">
                    Năm phát hành
                </h3>
                <select
                    value={filters.publishYears[0] || ''}
                    onChange={(e) => handleYearSelect(e.target.value)}
                    className="w-full bg-transparent border-b border-[#1A1A1A] focus:border-[#0070B5] outline-none px-0 py-1.5 text-sm font-body text-[#1A1A1A] cursor-pointer"
                >
                    <option value="">Tất cả các năm</option>
                    {publishYears.map((year) => (
                        <option key={year} value={year}>
                            Năm {year}
                        </option>
                    ))}
                </select>
            </div>

            {/* 5. Hình thức bìa (Cover Format) */}
            <div className="pb-2 space-y-3">
                <h3 className="font-body text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider">
                    Hình thức bìa
                </h3>
                <div className="space-y-2 text-sm font-body text-slate-700">
                    {coverTypes.map((type) => (
                        <label key={type} className="flex items-center gap-2.5 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={filters.coverTypes.includes(type)}
                                onChange={(e) => handleCheckboxChange('coverTypes', type, e.target.checked)}
                                className="accent-[#1A1A1A] rounded-sm w-4 h-4 cursor-pointer"
                            />
                            <span className="group-hover:text-[#0070B5] transition-colors">
                                {type === 'PAPERBACK' ? 'Bìa mềm' : type === 'HARDCOVER' ? 'Bìa cứng' : type}
                            </span>
                        </label>
                    ))}
                </div>
            </div>
        </aside>
    );
}
