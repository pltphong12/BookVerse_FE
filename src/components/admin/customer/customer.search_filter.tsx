import { Filter, Search } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import Select from 'react-select';

interface CustomerSearchAndFilterProps {
    search: string;
    setSearch: React.Dispatch<React.SetStateAction<string>>;
    customerLevel: string;
    setCustomerLevel: React.Dispatch<React.SetStateAction<string>>;
    dateFrom: string;
    setDateFrom: React.Dispatch<React.SetStateAction<string>>;
    setPage: React.Dispatch<React.SetStateAction<number>>;
}

export const CustomerSearchAndFilter: React.FC<CustomerSearchAndFilterProps> = ({ search, setSearch, customerLevel, setCustomerLevel, dateFrom, setDateFrom, setPage }) => {
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const customerLevelList = [
        { value: 'BRONZE', label: 'Đồng' },
        { value: 'SILVER', label: 'Bạc' },
        { value: 'GOLD', label: 'Vàng' },
        { value: 'PLATINUM', label: 'Bạch kim' },
        { value: 'DIAMOND', label: 'Kim cương' }
    ];
    const searchRef = useRef<HTMLInputElement>(null);
    // Focus in SearchInput when entry page
    useEffect(() => {
        if (searchRef.current) {
            searchRef.current.focus();
        }
    }, []);

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 transition-all duration-300 w-full">
            <div className="p-4 sm:flex items-center justify-between">
                <div className="relative flex-1 sm:max-w-md mb-4 sm:mb-0">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Search size={18} />
                    </div>
                    <input
                        type="text"
                        ref={searchRef}
                        name="identityCard"
                        value={search}
                        onChange={(events) => {
                            events.preventDefault()
                            setSearch(events.target.value)
                            setPage(1)
                        }}
                        placeholder="Nhập mã thẻ căn cước công dân"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                    >
                        <Filter size={16} />
                        <span>Bộ lọc</span>
                    </button>


                </div>
            </div>

            {isExpanded && (
                <div className="p-4 border-t border-gray-200 grid sm:grid-cols-2 md:grid-cols-4 gap-4 animate-fadeIn">
                    <div className="space-y-2">
                        <label htmlFor="customerLevel" className="block text-sm font-medium text-gray-700">
                            Cấp độ khách hàng
                        </label>
                        <Select
                            id="customerLevel"
                            value={customerLevelList.find(cl => cl.value === customerLevel) || { value: '', label: 'Tất cả cấp độ khách hàng' }}
                            onChange={(selected) => {
                                setCustomerLevel(selected?.value || '');
                                setPage(1);
                            }}
                            options={[
                                { value: '', label: 'Tất cả cấp độ khách hàng' },
                                ...customerLevelList
                            ]}
                            className="w-full"
                            classNamePrefix="select"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="dateFrom" className="block text-sm font-medium text-gray-700">
                            Ngày tạo
                        </label>
                        <input
                            type="date"
                            id="dateFrom"
                            name="dateFrom"
                            value={dateFrom}
                            onChange={(events) => {
                                setDateFrom(events.target.value)
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        />
                    </div>


                </div>
            )}
        </div>
    );
};
