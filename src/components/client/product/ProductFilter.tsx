import { useState } from 'react';
import { ChevronDown, X, RotateCcw } from 'lucide-react';

interface Filters {
    priceRange: [number, number];
    categories: string[];
    publishers: string[];
    publishYears: number[];
    coverTypes: string[];
}

interface ProductFiltersProps {
    filters: Filters;
    onFilterChange: (filters: Filters) => void;
    categories: string[];
    publishers: string[];
    publishYears: number[];
    coverTypes: string[];
}

export default function ProductFilters({
    filters,
    onFilterChange,
    categories,
    publishers,
    publishYears,
    coverTypes,
}: ProductFiltersProps) {
    const [expanded, setExpanded] = useState<Record<string, boolean>>({
        price: true,
        category: false,
        publisher: false,
        year: false,
        cover: false,
    });

    const toggleSection = (section: string) => {
        setExpanded((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    const handlePriceChange = (type: 'min' | 'max', value: number) => {
        const [min, max] = filters.priceRange;
        const newRange: [number, number] = type === 'min' ? [value, max] : [min, value];
        onFilterChange({ ...filters, priceRange: newRange });
    };

    const handleCheckboxChange = (
        filterType: keyof Omit<Filters, 'priceRange'>,
        value: string | number,
        checked: boolean
    ) => {
        const currentFilters = filters[filterType] as (string | number)[];
        const newFilters = checked
            ? [...currentFilters, value]
            : currentFilters.filter((item) => item !== value);
        onFilterChange({ ...filters, [filterType]: newFilters });
    };

    const hasActiveFilters =
        filters.priceRange[0] !== 0 ||
        filters.priceRange[1] !== 300000 ||
        filters.categories.length > 0 ||
        filters.publishers.length > 0 ||
        filters.publishYears.length > 0 ||
        filters.coverTypes.length > 0;

    const resetFilters = () => {
        onFilterChange({
            priceRange: [0, 300000],
            categories: [],
            publishers: [],
            publishYears: [],
            coverTypes: [],
        });
    };

    const pricePresets = [
        { label: 'Tất cả', range: [0, 300000] as [number, number] },
        { label: 'Dưới 50.000đ', range: [0, 50000] as [number, number] },
        { label: '50.000đ - 150.000đ', range: [50000, 150000] as [number, number] },
        { label: 'Trên 150.000đ', range: [150000, 300000] as [number, number] },
    ];

    const isPresetSelected = (range: [number, number]) =>
        filters.priceRange[0] === range[0] && filters.priceRange[1] === range[1];

    return (
        <aside className="w-full flex flex-col gap-5 bg-white p-5 sm:p-6 rounded-2xl border border-[#dff1fb] shadow-sm">
            {/* Header: Title & Reset Button */}
            <div className="flex items-center justify-between pb-3 border-b border-[#dff1fb]">
                <h2 className="font-headline text-lg sm:text-xl font-bold text-[#0d1e25]">
                    Bộ lọc tìm kiếm
                </h2>
                {hasActiveFilters && (
                    <button
                        onClick={resetFilters}
                        className="text-xs text-slate-500 hover:text-red-600 font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                    >
                        <RotateCcw className="w-3 h-3" />
                        <span>Đặt lại</span>
                    </button>
                )}
            </div>

            {/* Active Filters Pill Tag List */}
            {hasActiveFilters && (
                <div className="flex flex-wrap gap-1.5 pb-3 border-b border-slate-100">
                    {(filters.priceRange[0] !== 0 || filters.priceRange[1] !== 300000) && (
                        <span className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-0.5 text-xs font-semibold text-[#1a237e] bg-[#e3f2fd] rounded-full border border-blue-200">
                            {new Intl.NumberFormat('vi-VN').format(filters.priceRange[0])}đ -{' '}
                            {new Intl.NumberFormat('vi-VN').format(filters.priceRange[1])}đ
                            <button
                                onClick={() => onFilterChange({ ...filters, priceRange: [0, 300000] })}
                                className="p-0.5 rounded-full hover:bg-[#1a237e] hover:text-white transition-colors cursor-pointer"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    )}
                    {filters.categories.map((cat) => (
                        <span
                            key={cat}
                            className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-0.5 text-xs font-semibold text-[#1a237e] bg-[#e3f2fd] rounded-full border border-blue-200"
                        >
                            {cat}
                            <button
                                onClick={() => handleCheckboxChange('categories', cat, false)}
                                className="p-0.5 rounded-full hover:bg-[#1a237e] hover:text-white transition-colors cursor-pointer"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    ))}
                    {filters.publishers.map((pub) => (
                        <span
                            key={pub}
                            className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-0.5 text-xs font-semibold text-[#1a237e] bg-[#e3f2fd] rounded-full border border-blue-200"
                        >
                            {pub}
                            <button
                                onClick={() => handleCheckboxChange('publishers', pub, false)}
                                className="p-0.5 rounded-full hover:bg-[#1a237e] hover:text-white transition-colors cursor-pointer"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    ))}
                    {filters.publishYears.map((year) => (
                        <span
                            key={year}
                            className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-0.5 text-xs font-semibold text-[#1a237e] bg-[#e3f2fd] rounded-full border border-blue-200"
                        >
                            {year}
                            <button
                                onClick={() => handleCheckboxChange('publishYears', year, false)}
                                className="p-0.5 rounded-full hover:bg-[#1a237e] hover:text-white transition-colors cursor-pointer"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    ))}
                    {filters.coverTypes.map((type) => (
                        <span
                            key={type}
                            className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-0.5 text-xs font-semibold text-[#1a237e] bg-[#e3f2fd] rounded-full border border-blue-200"
                        >
                            {type === 'HARDCOVER' ? 'Bìa cứng' : 'Bìa mềm'}
                            <button
                                onClick={() => handleCheckboxChange('coverTypes', type, false)}
                                className="p-0.5 rounded-full hover:bg-[#1a237e] hover:text-white transition-colors cursor-pointer"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    ))}
                </div>
            )}

            {/* 1. Price Range Section */}
            <div className="flex flex-col">
                <button
                    onClick={() => toggleSection('price')}
                    className="flex items-center justify-between w-full py-1 text-left cursor-pointer group"
                >
                    <h3 className="font-headline font-bold text-sm text-[#0d1e25] group-hover:text-[#1a237e] transition-colors">
                        Khoảng giá
                    </h3>
                    <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${expanded.price ? 'rotate-180 text-[#1a237e]' : ''
                            }`}
                    />
                </button>

                {expanded.price && (
                    <div className="flex flex-col gap-2.5 pt-2.5 animate-fadeIn">
                        <div className="flex flex-col gap-1">
                            {pricePresets.map((preset) => {
                                const selected = isPresetSelected(preset.range);
                                return (
                                    <label
                                        key={preset.label}
                                        className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors ${selected
                                                ? 'bg-[#e3f2fd] text-[#1a237e] font-semibold'
                                                : 'text-slate-600 hover:bg-[#f4faff]'
                                            }`}
                                        onClick={() => onFilterChange({ ...filters, priceRange: preset.range })}
                                    >
                                        <input
                                            type="radio"
                                            name="price-preset"
                                            checked={selected}
                                            onChange={() => onFilterChange({ ...filters, priceRange: preset.range })}
                                            className="w-4 h-4 text-[#1a237e] focus:ring-[#1a237e] border-slate-300 accent-[#1a237e] cursor-pointer"
                                        />
                                        <span className="font-body text-sm text-inherit">
                                            {preset.label}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>

                        {/* Custom price inputs */}
                        <div className="pt-2 border-t border-slate-100">
                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                    <label className="block text-[11px] font-medium text-slate-400">Từ (đ)</label>
                                    <input
                                        type="number"
                                        value={filters.priceRange[0]}
                                        onChange={(e) => handlePriceChange('min', parseInt(e.target.value) || 0)}
                                        className="w-full px-2.5 py-1.5 bg-[#f4faff] border border-[#dff1fb] rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#1a237e] focus:bg-white"
                                        placeholder="0"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="block text-[11px] font-medium text-slate-400">Đến (đ)</label>
                                    <input
                                        type="number"
                                        value={filters.priceRange[1]}
                                        onChange={(e) => handlePriceChange('max', parseInt(e.target.value) || 300000)}
                                        className="w-full px-2.5 py-1.5 bg-[#f4faff] border border-[#dff1fb] rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#1a237e] focus:bg-white"
                                        placeholder="300,000"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="border-t border-[#dff1fb]" />

            {/* 2. Categories Section */}
            <div className="flex flex-col">
                <button
                    onClick={() => toggleSection('category')}
                    className="flex items-center justify-between w-full py-1 text-left cursor-pointer group"
                >
                    <h3 className="font-headline font-bold text-sm text-[#0d1e25] group-hover:text-[#1a237e] transition-colors">
                        Thể loại sách
                    </h3>
                    <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${expanded.category ? 'rotate-180 text-[#1a237e]' : ''
                            }`}
                    />
                </button>

                {expanded.category && (
                    <div className="flex flex-col gap-1 max-h-48 overflow-y-auto pr-1 pt-2.5 scrollbar-thin scrollbar-thumb-slate-200 animate-fadeIn">
                        {categories.map((category) => {
                            const checked = filters.categories.includes(category);
                            return (
                                <label
                                    key={category}
                                    className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors ${checked
                                            ? 'bg-[#e3f2fd] text-[#1a237e] font-semibold'
                                            : 'text-slate-600 hover:bg-[#f4faff]'
                                        }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={(e) => handleCheckboxChange('categories', category, e.target.checked)}
                                        className="w-4 h-4 rounded text-[#1a237e] focus:ring-[#1a237e] border-slate-300 accent-[#1a237e] cursor-pointer"
                                    />
                                    <span className="font-body text-sm text-inherit">
                                        {category}
                                    </span>
                                </label>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="border-t border-[#dff1fb]" />

            {/* 3. Publishers Section */}
            <div className="flex flex-col">
                <button
                    onClick={() => toggleSection('publisher')}
                    className="flex items-center justify-between w-full py-1 text-left cursor-pointer group"
                >
                    <h3 className="font-headline font-bold text-sm text-[#0d1e25] group-hover:text-[#1a237e] transition-colors">
                        Nhà xuất bản
                    </h3>
                    <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${expanded.publisher ? 'rotate-180 text-[#1a237e]' : ''
                            }`}
                    />
                </button>

                {expanded.publisher && (
                    <div className="flex flex-col gap-1 max-h-48 overflow-y-auto pr-1 pt-2.5 scrollbar-thin scrollbar-thumb-slate-200 animate-fadeIn">
                        {publishers.map((publisher) => {
                            const checked = filters.publishers.includes(publisher);
                            return (
                                <label
                                    key={publisher}
                                    className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors ${checked
                                            ? 'bg-[#e3f2fd] text-[#1a237e] font-semibold'
                                            : 'text-slate-600 hover:bg-[#f4faff]'
                                        }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={(e) => handleCheckboxChange('publishers', publisher, e.target.checked)}
                                        className="w-4 h-4 rounded text-[#1a237e] focus:ring-[#1a237e] border-slate-300 accent-[#1a237e] cursor-pointer"
                                    />
                                    <span className="font-body text-sm text-inherit">
                                        {publisher}
                                    </span>
                                </label>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="border-t border-[#dff1fb]" />

            {/* 4. Publish Years */}
            <div className="flex flex-col">
                <button
                    onClick={() => toggleSection('year')}
                    className="flex items-center justify-between w-full py-1 text-left cursor-pointer group"
                >
                    <h3 className="font-headline font-bold text-sm text-[#0d1e25] group-hover:text-[#1a237e] transition-colors">
                        Năm phát hành
                    </h3>
                    <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${expanded.year ? 'rotate-180 text-[#1a237e]' : ''
                            }`}
                    />
                </button>

                {expanded.year && (
                    <div className="flex flex-wrap gap-2 pt-2.5 animate-fadeIn">
                        {[...publishYears].sort((a, b) => b - a).map((year) => {
                            const isChecked = filters.publishYears.includes(year);
                            return (
                                <button
                                    key={year}
                                    onClick={() => handleCheckboxChange('publishYears', year, !isChecked)}
                                    className={`px-3 py-1 text-xs font-headline font-semibold rounded-lg transition-all border cursor-pointer ${isChecked
                                            ? 'bg-[#1a237e] text-white border-[#1a237e] shadow-sm'
                                            : 'bg-[#f4faff] text-slate-600 border-[#dff1fb] hover:border-blue-300 hover:text-[#1a237e]'
                                        }`}
                                >
                                    {year}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="border-t border-[#dff1fb]" />

            {/* 5. Cover Types */}
            <div className="flex flex-col">
                <button
                    onClick={() => toggleSection('cover')}
                    className="flex items-center justify-between w-full py-1 text-left cursor-pointer group"
                >
                    <h3 className="font-headline font-bold text-sm text-[#0d1e25] group-hover:text-[#1a237e] transition-colors">
                        Hình thức bìa
                    </h3>
                    <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${expanded.cover ? 'rotate-180 text-[#1a237e]' : ''
                            }`}
                    />
                </button>

                {expanded.cover && (
                    <div className="flex flex-col gap-1 pt-2.5 animate-fadeIn">
                        {coverTypes.map((type) => {
                            const checked = filters.coverTypes.includes(type);
                            return (
                                <label
                                    key={type}
                                    className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors ${checked
                                            ? 'bg-[#e3f2fd] text-[#1a237e] font-semibold'
                                            : 'text-slate-600 hover:bg-[#f4faff]'
                                        }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={(e) => handleCheckboxChange('coverTypes', type, e.target.checked)}
                                        className="w-4 h-4 rounded text-[#1a237e] focus:ring-[#1a237e] border-slate-300 accent-[#1a237e] cursor-pointer"
                                    />
                                    <span className="font-body text-sm text-inherit">
                                        {type === 'HARDCOVER' ? 'Bìa cứng' : 'Bìa mềm'}
                                    </span>
                                </label>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Bottom Reset Button */}
            {hasActiveFilters && (
                <button
                    onClick={resetFilters}
                    className="bg-[#1a237e] hover:bg-[#283593] text-white font-headline font-semibold text-sm py-2.5 px-4 rounded-xl transition-all shadow-sm hover:shadow mt-2 w-full cursor-pointer"
                >
                    Xóa tất cả bộ lọc
                </button>
            )}
        </aside>
    );
}


