import { ChevronDown, DollarSign, Grid3X3, BookOpen, Calendar, Layers, SlidersHorizontal, X, RotateCcw } from 'lucide-react';
import { useState } from 'react';

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

interface FilterSectionProps {
    title: string;
    icon: React.ReactNode;
    isExpanded: boolean;
    onToggle: () => void;
    count?: number;
    children: React.ReactNode;
}

function FilterSection({ title, icon, isExpanded, onToggle, count, children }: FilterSectionProps) {
    return (
        <div className="group">
            <button
                onClick={onToggle}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl 
                           transition-all duration-200 ease-out
                           hover:bg-primary-50/60 active:scale-[0.99]"
            >
                <span className="flex items-center justify-center w-8 h-8 rounded-lg 
                                 bg-gradient-to-br from-primary-100 to-primary-200/70
                                 text-primary-600 transition-colors duration-200
                                 group-hover:from-primary-200 group-hover:to-primary-300/70">
                    {icon}
                </span>
                <span className="flex-1 text-left font-semibold text-gray-800 text-sm tracking-wide">
                    {title}
                </span>
                {count !== undefined && count > 0 && (
                    <span className="flex items-center justify-center min-w-5 h-5 px-1.5 
                                     text-[11px] font-bold text-white rounded-full
                                     bg-gradient-to-r from-primary-500 to-primary-600
                                     shadow-sm shadow-primary-200
                                     animate-[scaleIn_0.2s_ease-out]">
                        {count}
                    </span>
                )}
                <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform duration-300 ease-out
                               ${isExpanded ? 'rotate-180 text-primary-500' : ''}`}
                />
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ease-out
                           ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
            >
                <div className="px-4 pb-4 pt-1">
                    {children}
                </div>
            </div>
        </div>
    );
}

interface CheckboxItemProps {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}

function CheckboxItem({ label, checked, onChange }: CheckboxItemProps) {
    return (
        <label className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer 
                          transition-all duration-150 select-none
                          ${checked
                ? 'bg-primary-50 ring-1 ring-primary-200'
                : 'hover:bg-gray-50'}`}>
            <div className="relative flex items-center justify-center">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                    className="sr-only"
                />
                <div className={`w-[18px] h-[18px] rounded-md border-2 flex items-center justify-center
                                transition-all duration-200
                                ${checked
                        ? 'bg-gradient-to-br from-primary-500 to-primary-600 border-primary-500 shadow-sm shadow-primary-200'
                        : 'border-gray-300 bg-white hover:border-primary-300'}`}>
                    {checked && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    )}
                </div>
            </div>
            <span className={`text-sm transition-colors duration-150
                            ${checked ? 'text-primary-700 font-medium' : 'text-gray-600'}`}>
                {label}
            </span>
        </label>
    );
}

export default function ProductFilters({
    filters,
    onFilterChange,
    categories,
    publishers,
    publishYears,
    coverTypes,
}: ProductFiltersProps) {
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        price: true,
        category: true,
        publisher: false,
        year: false,
        cover: false,
    });

    const toggleSection = (section: string) => {
        setExpandedSections((prev) => ({
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

    const activeCount =
        filters.categories.length +
        filters.publishers.length +
        filters.publishYears.length +
        filters.coverTypes.length +
        (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 300000 ? 1 : 0);

    const formatPrice = (value: number) => {
        return new Intl.NumberFormat('vi-VN').format(value);
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-5 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <SlidersHorizontal className="w-5 h-5 text-white/90" />
                        <h3 className="font-bold text-[15px] text-white tracking-wide">Bộ lọc</h3>
                        {activeCount > 0 && (
                            <span className="flex items-center justify-center min-w-5 h-5 px-1.5 
                                             text-[11px] font-bold text-primary-600 rounded-full
                                             bg-white/90 shadow-sm">
                                {activeCount}
                            </span>
                        )}
                    </div>
                    {hasActiveFilters && (
                        <button
                            onClick={() =>
                                onFilterChange({
                                    priceRange: [0, 300000],
                                    categories: [],
                                    publishers: [],
                                    publishYears: [],
                                    coverTypes: [],
                                })
                            }
                            className="flex items-center gap-1.5 text-[13px] text-white/80 
                                       hover:text-white font-medium transition-colors duration-150
                                       hover:bg-white/10 px-2.5 py-1 rounded-lg"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                            Đặt lại
                        </button>
                    )}
                </div>
            </div>

            {/* Active filter tags */}
            {hasActiveFilters && (
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex flex-wrap gap-1.5">
                        {(filters.priceRange[0] !== 0 || filters.priceRange[1] !== 300000) && (
                            <span className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 
                                           text-xs font-medium text-primary-700 bg-primary-50 
                                           rounded-full border border-primary-100">
                                {formatPrice(filters.priceRange[0])}đ - {formatPrice(filters.priceRange[1])}đ
                                <button
                                    onClick={() => onFilterChange({ ...filters, priceRange: [0, 300000] })}
                                    className="ml-0.5 p-0.5 rounded-full hover:bg-primary-100 transition-colors"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                        {filters.categories.map((cat) => (
                            <span key={cat}
                                className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 
                                           text-xs font-medium text-primary-700 bg-primary-50 
                                           rounded-full border border-primary-100">
                                {cat}
                                <button
                                    onClick={() => handleCheckboxChange('categories', cat, false)}
                                    className="ml-0.5 p-0.5 rounded-full hover:bg-primary-100 transition-colors"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        ))}
                        {filters.publishers.map((pub) => (
                            <span key={pub}
                                className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 
                                           text-xs font-medium text-primary-700 bg-primary-50 
                                           rounded-full border border-primary-100">
                                {pub}
                                <button
                                    onClick={() => handleCheckboxChange('publishers', pub, false)}
                                    className="ml-0.5 p-0.5 rounded-full hover:bg-primary-100 transition-colors"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        ))}
                        {filters.publishYears.map((year) => (
                            <span key={year}
                                className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 
                                           text-xs font-medium text-primary-700 bg-primary-50 
                                           rounded-full border border-primary-100">
                                {year}
                                <button
                                    onClick={() => handleCheckboxChange('publishYears', year, false)}
                                    className="ml-0.5 p-0.5 rounded-full hover:bg-primary-100 transition-colors"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        ))}
                        {filters.coverTypes.map((type) => (
                            <span key={type}
                                className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 
                                           text-xs font-medium text-primary-700 bg-primary-50 
                                           rounded-full border border-primary-100">
                                {type}
                                <button
                                    onClick={() => handleCheckboxChange('coverTypes', type, false)}
                                    className="ml-0.5 p-0.5 rounded-full hover:bg-primary-100 transition-colors"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Filter Sections */}
            <div className="p-2 space-y-0.5">
                {/* Price Range */}
                <FilterSection
                    title="Giá tiền"
                    icon={<DollarSign className="w-4 h-4" />}
                    isExpanded={expandedSections.price}
                    onToggle={() => toggleSection('price')}
                    count={filters.priceRange[0] !== 0 || filters.priceRange[1] !== 300000 ? 1 : 0}
                >
                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Từ
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={filters.priceRange[0]}
                                        onChange={(e) => handlePriceChange('min', parseInt(e.target.value))}
                                        className="w-full pl-3 pr-8 py-2.5 bg-gray-50 border border-gray-200 
                                                   rounded-xl text-sm text-gray-800 font-medium
                                                   focus:outline-none focus:ring-2 focus:ring-primary-500/20 
                                                   focus:border-primary-400 focus:bg-white
                                                   transition-all duration-200
                                                   [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none 
                                                   [&::-webkit-inner-spin-button]:appearance-none"
                                        placeholder="0"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">đ</span>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Đến
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={filters.priceRange[1]}
                                        onChange={(e) => handlePriceChange('max', parseInt(e.target.value))}
                                        className="w-full pl-3 pr-8 py-2.5 bg-gray-50 border border-gray-200 
                                                   rounded-xl text-sm text-gray-800 font-medium
                                                   focus:outline-none focus:ring-2 focus:ring-primary-500/20 
                                                   focus:border-primary-400 focus:bg-white
                                                   transition-all duration-200
                                                   [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none 
                                                   [&::-webkit-inner-spin-button]:appearance-none"
                                        placeholder="300,000"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">đ</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </FilterSection>

                <div className="mx-4">
                    <div className="border-t border-gray-100" />
                </div>

                {/* Categories */}
                <FilterSection
                    title="Danh mục"
                    icon={<Grid3X3 className="w-4 h-4" />}
                    isExpanded={expandedSections.category}
                    onToggle={() => toggleSection('category')}
                    count={filters.categories.length}
                >
                    <div className="space-y-1">
                        {categories.map((category) => (
                            <CheckboxItem
                                key={category}
                                label={category}
                                checked={filters.categories.includes(category)}
                                onChange={(checked) => handleCheckboxChange('categories', category, checked)}
                            />
                        ))}
                    </div>
                </FilterSection>

                <div className="mx-4">
                    <div className="border-t border-gray-100" />
                </div>

                {/* Publishers */}
                <FilterSection
                    title="Nhà xuất bản"
                    icon={<BookOpen className="w-4 h-4" />}
                    isExpanded={expandedSections.publisher}
                    onToggle={() => toggleSection('publisher')}
                    count={filters.publishers.length}
                >
                    <div className="space-y-1 max-h-48 overflow-y-auto pr-1 
                                    scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                        {publishers.map((publisher) => (
                            <CheckboxItem
                                key={publisher}
                                label={publisher}
                                checked={filters.publishers.includes(publisher)}
                                onChange={(checked) => handleCheckboxChange('publishers', publisher, checked)}
                            />
                        ))}
                    </div>
                </FilterSection>

                <div className="mx-4">
                    <div className="border-t border-gray-100" />
                </div>

                {/* Publish Years */}
                <FilterSection
                    title="Năm xuất bản"
                    icon={<Calendar className="w-4 h-4" />}
                    isExpanded={expandedSections.year}
                    onToggle={() => toggleSection('year')}
                    count={filters.publishYears.length}
                >
                    <div className="flex flex-wrap gap-2">
                        {[...publishYears].sort((a, b) => b - a).map((year) => {
                            const isChecked = filters.publishYears.includes(year);
                            return (
                                <button
                                    key={year}
                                    onClick={() => handleCheckboxChange('publishYears', year, !isChecked)}
                                    className={`px-3.5 py-1.5 text-sm font-medium rounded-lg
                                               transition-all duration-150 border
                                               ${isChecked
                                            ? 'bg-primary-500 text-white border-primary-500 shadow-sm shadow-primary-200'
                                            : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300 hover:text-primary-600'}`}
                                >
                                    {year}
                                </button>
                            );
                        })}
                    </div>
                </FilterSection>

                <div className="mx-4">
                    <div className="border-t border-gray-100" />
                </div>

                {/* Cover Types */}
                <FilterSection
                    title="Hình thức bìa"
                    icon={<Layers className="w-4 h-4" />}
                    isExpanded={expandedSections.cover}
                    onToggle={() => toggleSection('cover')}
                    count={filters.coverTypes.length}
                >
                    <div className="space-y-1">
                        {coverTypes.map((type) => (
                            <CheckboxItem
                                key={type}
                                label={type == "HARDCOVER" ? "Bìa cứng" : "Bìa mềm"}
                                checked={filters.coverTypes.includes(type)}
                                onChange={(checked) => handleCheckboxChange('coverTypes', type, checked)}
                            />
                        ))}
                    </div>
                </FilterSection>
            </div>
        </div>
    );
}
