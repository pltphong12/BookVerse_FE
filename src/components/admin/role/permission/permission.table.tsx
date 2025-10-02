import { ChevronDown, ChevronUp, Edit, Trash, View } from "lucide-react";
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../redux/hook";
import { IPermission } from "../../../../types/backend";
import { Pagination } from "../../../global/Pagination";
import { PermissionView } from "./permission.view";
import { PermissionSearchAndFilter } from "./permission.search_filter";
import { deletePermission, ICreatePermission, resetDeletePermission } from "../../../../redux/slide/permission.slice";
import { showToast, ToastType } from "../../../../common/showToast";
import { PermissionForm } from "./permission.form";


interface PermissionTableProps {
    load: () => Promise<void>;
    page: number;
    totalPage: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    dataSource: IPermission[];
    search: string;
    setSearch: React.Dispatch<React.SetStateAction<string>>;
    method: string;
    setMethod: React.Dispatch<React.SetStateAction<string>>;
    dateFrom: string;
    setDateFrom: React.Dispatch<React.SetStateAction<string>>;
}

export const PermissionTable: React.FC<PermissionTableProps> = ({ load, page, totalPage, setPage, dataSource, search, setSearch, method, setMethod, dateFrom, setDateFrom }) => {
    const [isViewModalOpen, setIsViewModalOpen] = React.useState<boolean>(false);
    const [selectedPermission, setSelectedPermission] = React.useState<IPermission | null>(null);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState<boolean>(false);

    const isDeletePermissionSuccess = useAppSelector((state) => state.permission.isDeletePermissionSuccess);
    const isDeletePermissionFailed = useAppSelector((state) => state.permission.isDeletePermissionFailed);

    const [permissionToEdit, setPermissionToEdit] = React.useState<ICreatePermission | undefined>(undefined);
    const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);

    const message = useAppSelector((state) => state.permission.message);
    const dispatch = useAppDispatch();

    const [sortField, setSortField] = React.useState<keyof IPermission>('name');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    const handleSort = (field: keyof IPermission) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const sortedPermissions = [...dataSource].sort((a, b) => {
        const aValue = a[sortField] ?? '';
        const bValue = b[sortField] ?? '';
        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });

    const SortIcon = ({ field }: { field: keyof IPermission }) => {
        if (sortField !== field) return null;
        return sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
    };

    const handleViewPermission = (permission: IPermission) => {
        setSelectedPermission(permission);
        setIsViewModalOpen(true);
    };

    const getPermissionClass = (permission: string) => {
        switch (permission) {
            case 'GET': return 'badge badge-info';
            case 'POST': return 'badge badge-success';
            case 'PUT': return 'badge badge-warning';
            case 'DELETE': return 'badge badge-error';
            default: return 'badge';
        }
    };

    const executeDeletePermission = (id: number) => {
        dispatch(deletePermission(id));
    }

    React.useEffect(() => {
        if (isDeletePermissionSuccess) {
            showToast("Xóa quyền hạn thành công", ToastType.SUCCESS);
            dispatch(resetDeletePermission());
            load()
            setPage(1)
        }
        if (isDeletePermissionFailed) {
            showToast("Xóa quyền hạn không thành công " + message, ToastType.ERROR);
            dispatch(resetDeletePermission());
        }
    }, [isDeletePermissionSuccess, isDeletePermissionFailed, message, dispatch, setPage, load]);
    return (
        <>
            <div className='flex'>
                <PermissionSearchAndFilter
                    searchWithName={search}
                    setSearchWithName={setSearch}
                    method={method}
                    setMethod={setMethod}
                    dateFrom={dateFrom}
                    setDateFrom={setDateFrom}
                    setPage={setPage}
                />
            </div>
            <div className="flex justify-between">
                <div className="text-2xl font-bold">Quản lý quyền hạn</div>
                <button
                    className="btn btn-neutral justify-end"
                    onClick={() => {
                        setIsModalOpen(true);
                        setPermissionToEdit(undefined);
                    }}
                >
                    Tạo quyền hạn
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
                                    <span>Tên quyền hạn</span>
                                    <SortIcon field='name' />
                                </div>
                            </th>
                            <th onClick={() => handleSort('domain')} className='cursor-pointer hover:bg-base-200'>
                                <div className='flex items-center gap-1'>
                                    <span>Tên domain</span>
                                    <SortIcon field='domain' />
                                </div>
                            </th>
                            <th onClick={() => handleSort('apiPath')} className='cursor-pointer hover:bg-base-200'>
                                <div className='flex items-center gap-1'>
                                    <span>Đường dẫn API</span>
                                    <SortIcon field='apiPath' />
                                </div>
                            </th>
                            <th onClick={() => handleSort('method')} className='cursor-pointer hover:bg-base-200'>
                                <div className='flex items-center gap-1'>
                                    <span>Phương thức</span>
                                    <SortIcon field='method' />
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
                        {sortedPermissions.map((record, index) => {
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
                                        {record.domain}
                                    </td>
                                    <td>
                                        {record.apiPath}
                                    </td>
                                    <td>
                                        <span className={getPermissionClass(record.method)}>
                                            {record.method}
                                        </span>
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
                                                        onClick={() => handleViewPermission(record)}
                                                    >
                                                        <View className="w-4 h-4" />
                                                        <span>Xem</span>
                                                    </button>
                                                </li>
                                                <li>
                                                    <button
                                                        className="flex items-center gap-2 text-warning"
                                                        onClick={() => {
                                                            setPermissionToEdit(record);
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
                                                                onClick={() => executeDeletePermission(record.id)}
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
            {sortedPermissions.length === 0 && <div className=''>Không có dữ liệu</div>}
            < Pagination page={page} totalPage={totalPage} setPage={setPage} />

            <PermissionView
                isOpen={isViewModalOpen}
                setIsOpen={setIsViewModalOpen}
                permission={selectedPermission}
            />

            < PermissionForm
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                load={load}
                permissionToEdit={permissionToEdit}
            />
        </>
    )
}
