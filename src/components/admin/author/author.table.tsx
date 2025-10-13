import { ChevronDown, ChevronUp, Edit, Trash, View } from "lucide-react";
import React, { useState } from "react";
import { showToast, ToastType } from "../../../common/showToast";
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import { deleteAuthor, ICreateAuthor, resetDeleteAuthor } from "../../../redux/slide/author.slice";
import { IAuthor } from "../../../types/backend";
import { Pagination } from "../../global/Pagination";
import { AuthorForm } from "./author.form";
import { AuthorSearchAndFilter } from "./author.search_filter";
import { AuthorView } from "./author.view";


interface AuthorTableProps {
    load: () => Promise<void>;
    page: number;
    totalPage: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    dataSource: IAuthor[];
    searchWithName: string;
    setSearchWithName: React.Dispatch<React.SetStateAction<string>>;
    searchWithNationality: string;
    setSearchWithNationality: React.Dispatch<React.SetStateAction<string>>;
    dateFrom: string;
    setDateFrom: React.Dispatch<React.SetStateAction<string>>;
}

export const AuthorTable: React.FC<AuthorTableProps> = ({ load, page, totalPage, setPage, dataSource, searchWithName, setSearchWithName, searchWithNationality, setSearchWithNationality, dateFrom, setDateFrom }) => {
    const [isViewModalOpen, setIsViewModalOpen] = React.useState<boolean>(false);
    const [selectedAuthor, setSelectedAuthor] = React.useState<IAuthor | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState<boolean>(false);

    const isDeleteAuthorSuccess = useAppSelector((state) => state.author.isDeleteAuthorSuccess);
    const isDeleteAuthorFailed = useAppSelector((state) => state.author.isDeleteAuthorFailed);

    const [authorToEdit, setAuthorToEdit] = React.useState<ICreateAuthor | undefined>(undefined);
    const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);

    const message = useAppSelector((state) => state.author.message);
    const dispatch = useAppDispatch();

    const [sortField, setSortField] = React.useState<keyof IAuthor>('name');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    const handleSort = (field: keyof IAuthor) => {
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

    const SortIcon = ({ field }: { field: keyof IAuthor }) => {
        if (sortField !== field) return null;
        return sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
    };

    const handleViewAuthor = (author: IAuthor) => {
        setSelectedAuthor(author);
        setIsViewModalOpen(true);
    };

    const executeDeleteAuthor = (id: number) => {
        dispatch(deleteAuthor(id));
    }

    React.useEffect(() => {
        if (isDeleteAuthorSuccess) {
            showToast("Xóa tác giả thành công", ToastType.SUCCESS);
            dispatch(resetDeleteAuthor());
            setPage(1)
            load()
        }
        if (isDeleteAuthorFailed) {
            showToast("Xóa tác giả không thành công" + message, ToastType.ERROR);
            dispatch(resetDeleteAuthor());
        }
    }, [isDeleteAuthorSuccess, isDeleteAuthorFailed, message, dispatch, setPage, load]);
    return (
        <>
            <div className='flex'>
                <AuthorSearchAndFilter
                    searchWithName={searchWithName}
                    setSearchWithName={setSearchWithName}
                    searchWithNationality={searchWithNationality}
                    setSearchWithNationality={setSearchWithNationality}
                    dateFrom={dateFrom}
                    setDateFrom={setDateFrom}
                    setPage={setPage}
                />
            </div>
            <div className="flex justify-between">
                <div className="text-2xl font-bold">Quản lý tác giả</div>
                <button
                    className="btn btn-neutral justify-end"
                    onClick={() => {
                        setIsModalOpen(true);
                        setAuthorToEdit(undefined);
                    }}
                >
                    Tạo tác giả
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
                                    <span>Tên tác giả</span>
                                    <SortIcon field='name' />
                                </div>
                            </th>
                            <th onClick={() => handleSort('nationality')} className='cursor-pointer hover:bg-base-200'>
                                <div className='flex items-center gap-1'>
                                    <span>Quê quán</span>
                                    <SortIcon field='nationality' />
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
                                        {record.nationality}
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
                                                        onClick={() => handleViewAuthor(record)}
                                                    >
                                                        <View className="w-4 h-4" />
                                                        <span>Xem</span>
                                                    </button>
                                                </li>
                                                <li>
                                                    <button
                                                        className="flex items-center gap-2 text-warning"
                                                        onClick={() => {
                                                            setAuthorToEdit(record);
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
                                                                    onClick={() => executeDeleteAuthor(record.id)}
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

            <AuthorView
                isOpen={isViewModalOpen}
                setIsOpen={setIsViewModalOpen}
                author={selectedAuthor}
            />

            < AuthorForm
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                load={load}
                authorToEdit={authorToEdit}
            />
        </>
    )
}
