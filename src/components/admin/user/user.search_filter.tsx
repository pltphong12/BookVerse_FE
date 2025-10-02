import React, { useEffect, useRef, useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { IRole } from '../../../types/backend';
import Select from 'react-select';

interface UserSearchAndFilterProps {
    search: string;
    setSearch: React.Dispatch<React.SetStateAction<string>>;
    roles: IRole[];
    roleId: number
    setRoleId: React.Dispatch<React.SetStateAction<number>>;
    dateFrom: string;
    setDateFrom: React.Dispatch<React.SetStateAction<string>>;
    setPage: React.Dispatch<React.SetStateAction<number>>;
}

export const UserSearchAndFilter: React.FC<UserSearchAndFilterProps> = ({ search, setSearch, roles, roleId, setRoleId, dateFrom, setDateFrom, setPage }) => {
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
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
                        name="name"
                        value={search}
                        onChange={(events) => {
                            events.preventDefault()
                            setSearch(events.target.value)
                            setPage(1)
                        }}
                        placeholder="Nhập tên đăng nhập"
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
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                            Vai trò
                        </label>
                        <Select
                            id="role"
                            value={roles.find(r => r.id === roleId) ? {
                                value: roleId,
                                label: roles.find(r => r.id === roleId)?.name || 'Tất cả vai trò'
                            } : { value: 0, label: 'Tất cả vai trò' }}
                            onChange={(selected) => {
                                setRoleId(selected?.value || 0);
                                setPage(1);
                            }}
                            options={[
                                { value: 0, label: 'Tất cả vai trò' },
                                ...roles.map(role => ({
                                    value: role.id,
                                    label: role.name
                                }))
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
                                setPage(1)
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        />
                    </div>


                </div>
            )}
        </div>
    );
};

