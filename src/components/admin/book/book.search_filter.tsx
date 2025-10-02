import React, { useEffect, useRef, useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { IAuthorInBook, ICategoryInBook, IPublisher } from '../../../types/backend';
import Select from 'react-select';

interface BookSearchAndFilterProps {
    search: string;
    setSearch: React.Dispatch<React.SetStateAction<string>>;
    authors: IAuthorInBook[];
    categories: ICategoryInBook[];
    publishers: IPublisher[];
    publisherId: number;
    setPublisherId: React.Dispatch<React.SetStateAction<number>>;
    authorId: number;
    setAuthorId: React.Dispatch<React.SetStateAction<number>>;
    categoryId: number;
    setCategoryId: React.Dispatch<React.SetStateAction<number>>;
    dateFrom: string;
    setDateFrom: React.Dispatch<React.SetStateAction<string>>;
    setPage: React.Dispatch<React.SetStateAction<number>>;
}

export const BookSearchAndFilter: React.FC<BookSearchAndFilterProps> = ({ search, setSearch, authors, categories, publishers, dateFrom, setDateFrom, publisherId, setPublisherId, authorId, setAuthorId, categoryId, setCategoryId, setPage }) => {
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
                        placeholder="Nhập tên sách"
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
                        <label htmlFor="publisher" className="block text-sm font-medium text-gray-700">
                            Nhà xuất bản
                        </label>
                        <Select
                            id="publisher"
                            value={publishers.find(p => p.id === publisherId) ? {
                                value: publisherId,
                                label: publishers.find(p => p.id === publisherId)?.name || 'Tất cả nhà xuất bản'
                            } : { value: 0, label: 'Tất cả nhà xuất bản' }}
                            onChange={(selected) => {
                                setPublisherId(selected?.value || 0);
                                setPage(1);
                            }}
                            options={[
                                { value: 0, label: 'Tất cả nhà xuất bản' },
                                ...publishers.map(publisher => ({
                                    value: publisher.id,
                                    label: publisher.name
                                }))
                            ]}
                            className="w-full"
                            classNamePrefix="select"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="authors" className="block text-sm font-medium text-gray-700">
                            Tác giả
                        </label>
                        <Select
                            id="authors"
                            value={authors.find(a => a.id === authorId) ? {
                                value: authorId,
                                label: authors.find(a => a.id === authorId)?.name || 'Tất cả tác giả'
                            } : { value: 0, label: 'Tất cả tác giả' }}
                            onChange={(selected) => {
                                setAuthorId(selected?.value || 0);
                                setPage(1);
                            }}
                            options={[
                                { value: 0, label: 'Tất cả tác giả' },
                                ...authors.map(author => ({
                                    value: author.id,
                                    label: author.name
                                }))
                            ]}
                            className="w-full"
                            classNamePrefix="select"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                            Thể loại
                        </label>
                        <Select
                            id="category"
                            value={categories.find(c => c.id === categoryId) ? {
                                value: categoryId,
                                label: categories.find(c => c.id === categoryId)?.name || 'Tất cả các thể loại'
                            } : { value: 0, label: 'Tất cả các thể loại' }}
                            onChange={(selected) => {
                                setCategoryId(selected?.value || 0);
                                setPage(1);
                            }}
                            options={[
                                { value: 0, label: 'Tất cả các thể loại' },
                                ...categories.map(category => ({
                                    value: category.id,
                                    label: category.name
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
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        />
                    </div>


                </div>
            )}
        </div>
    );
};

