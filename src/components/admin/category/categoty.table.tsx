import { ChevronDown, ChevronUp, Edit, Trash, View } from "lucide-react";
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import { ICategory } from "../../../types/backend";
import { Pagination } from "../../global/Pagination";
import { CategoryView } from "./category.view";
import { CategoryForm } from "./categoty.form";
import { deleteCategory, ICreateCategory, resetDeleteCategory } from "../../../redux/slide/categogy.slide";
import { showToast, ToastType } from "../../../common/showToast";
import { CategorySearchAndFilter } from "./category.search_filter";


interface CategoryTableProps {
    load: () => Promise<void>;
    page: number;
    totalPage: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    dataSource: ICategory[];
    searchWithName: string;
    setSearchWithName: React.Dispatch<React.SetStateAction<string>>;
    dateFrom: string;
    setDateFrom: React.Dispatch<React.SetStateAction<string>>;
}

export const CategoryTable: React.FC<CategoryTableProps> = ({ load, page, totalPage, setPage, dataSource, searchWithName, setSearchWithName, dateFrom, setDateFrom }) => {
    const [isViewModalOpen, setIsViewModalOpen] = React.useState<boolean>(false);
    const [selectedCategory, setSelectedCategory] = React.useState<ICategory | null>(null);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState<boolean>(false);

    const isDeleteCategorySuccess = useAppSelector((state) => state.category.isDeleteCategorySuccess);
    const isDeleteCategoryFailed = useAppSelector((state) => state.category.isDeleteCategoryFailed);

    const [categoryToEdit, setCategoryToEdit] = React.useState<ICreateCategory | undefined>(undefined);
    const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);

    const message = useAppSelector((state) => state.category.message);
    const dispatch = useAppDispatch();

    const [sortField, setSortField] = React.useState<keyof ICategory>('name');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    const handleSort = (field: keyof ICategory) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const sortedAuthors = [...dataSource].sort((a, b) => {
        const aValue = a[sortField] ?? '';
        const bValue = b[sortField] ?? '';
        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });

    const SortIcon = ({ field }: { field: keyof ICategory }) => {
        if (sortField !== field) return null;
        return sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
    };

    const handleViewCategory = (category: ICategory) => {
        setSelectedCategory(category);
        setIsViewModalOpen(true);
    };

    const executeDeleteCategory = (id: number) => {
        dispatch(deleteCategory(id));
    }

    React.useEffect(() => {
        if (isDeleteCategorySuccess) {
            showToast("Xóa tác giả thành công", ToastType.SUCCESS);
            dispatch(resetDeleteCategory());
            setPage(1)
            load()
        }
        if (isDeleteCategoryFailed) {
            showToast("Xóa tác giả không thành công" + message, ToastType.ERROR);
            dispatch(resetDeleteCategory());
        }
    }, [isDeleteCategorySuccess, isDeleteCategoryFailed, message, dispatch, setPage, load]);
    return (
        <>
            <div className='flex'>
                <CategorySearchAndFilter
                    searchWithName={searchWithName}
                    setSearchWithName={setSearchWithName}
                    dateFrom={dateFrom}
                    setDateFrom={setDateFrom}
                    setPage={setPage}
                />
            </div>
            <div className="flex justify-between">
                <div className="text-2xl font-bold">Quản lý thể loại</div>
                <button
                    className="btn btn-neutral justify-end"
                    onClick={() => {
                        setIsModalOpen(true);
                        setCategoryToEdit(undefined);
                    }}
                >
                    Tạo thể loại
                </button>
            </div>

            <div className="rounded-box border border-base-content/5 bg-base-100">
                <table className="table">
                    {/* head */}
                    <thead>
                        <tr>
                            <th className='cursor-pointer hover:bg-base-200'>
                                <span>STT</span>
                            </th>
                            <th onClick={() => handleSort('name')} className='cursor-pointer hover:bg-base-200'>
                                <div className='flex items-center gap-1'>
                                    <span>Tên thể loại</span>
                                    <SortIcon field='name' />
                                </div>
                            </th>
                            <th onClick={() => handleSort('createdAt')} className='cursor-pointer hover:bg-base-200'>
                                <div className='flex items-center gap-1'>
                                    <span>Ngày tạo</span>
                                    <SortIcon field='createdAt' />
                                </div>
                            </th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedAuthors.map((record, index) => {
                            return (
                                <tr key={record.id} className='hover:bg-base-300'>
                                    <td>
                                        <div className=''>
                                            {index + (page - 1) * 10 + 1}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div>
                                                <div className="font-bold">{record.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(record.createdAt as string))}
                                    </td>
                                    <td className="w-[1%]">
                                        <div className="dropdown dropdown-left">
                                            <button tabIndex={0} className="btn btn-ghost btn-sm" onMouseDown={() => {
                                                setIsDeleteModalOpen(false)
                                            }}>
                                                ⋮
                                            </button>
                                            <ul
                                                tabIndex={0}
                                                className="dropdown-content menu bg-base-100 rounded-box z-[10] w-36 p-2 shadow-lg border border-base-content/20"
                                            >
                                                <li>
                                                    <button
                                                        className="flex items-center gap-2 text-info"
                                                        onClick={() => handleViewCategory(record)}
                                                    >
                                                        <View className="w-4 h-4" />
                                                        <span>Xem</span>
                                                    </button>
                                                </li>
                                                <li>
                                                    <button
                                                        className="flex items-center gap-2 text-warning"
                                                        onClick={() => {
                                                            setCategoryToEdit(record);
                                                            setIsModalOpen(true);
                                                        }}
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                        <span>Sửa</span>
                                                    </button>
                                                </li>
                                                <li>
                                                    <button tabIndex={0} className="flex items-center gap-2 text-error"
                                                        onClick={() => {
                                                            setIsDeleteModalOpen(true)
                                                        }}>
                                                        <Trash className="w-4 h-4" />
                                                        <span>Xóa</span>
                                                    </button>
                                                    {isDeleteModalOpen && (
                                                        <ul tabIndex={0} className="dropdown-content menu bg-base-200 rounded-box z-[10] w-52 p-2 shadow-lg border border-base-content/20">
                                                            <li className='w-full'>Bạn có chắn chắn muốn xóa</li>
                                                            <li className="mt-1">
                                                                <button
                                                                    className="btn btn-error btn-sm w-full"
                                                                    onClick={() => executeDeleteCategory(record.id)}
                                                                >
                                                                    Xóa
                                                                </button>
                                                            </li>

                                                        </ul>
                                                    )}
                                                </li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>

                </table>

            </div >
            {sortedAuthors.length === 0 && <div className=''>Không có dữ liệu</div>}
            < Pagination page={page} totalPage={totalPage} setPage={setPage} />

            <CategoryView
                isOpen={isViewModalOpen}
                setIsOpen={setIsViewModalOpen}
                category={selectedCategory}
            />

            <CategoryForm
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                load={load}
                categoryToEdit={categoryToEdit}
            />
        </>
    )
}
