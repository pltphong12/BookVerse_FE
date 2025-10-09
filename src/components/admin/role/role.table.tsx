import React, { useState } from "react";
import { IRole } from "../../../types/backend";
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import { ChevronDown, ChevronUp, Edit, Trash, View } from "lucide-react";
import { showToast, ToastType } from "../../../common/showToast";
import { Pagination } from "../../global/Pagination";
import { RoleSearchAndFilter } from "./role.search_filter";
import { deleteRole, ICreateRole, resetDeleteRole } from "../../../redux/slide/role.slide";
import { RoleView } from "./role.view";
import { RoleForm } from "./role.form";

interface RoleTableProps {
    load: () => Promise<void>;
    page: number;
    totalPage: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    dataSource: IRole[];
    search: string;
    setSearch: React.Dispatch<React.SetStateAction<string>>;
    dateFrom: string;
    setDateFrom: React.Dispatch<React.SetStateAction<string>>;
}

export const RoleTable: React.FC<RoleTableProps> = ({ load, page, totalPage, setPage, dataSource, search, setSearch, dateFrom, setDateFrom }) => {
    const [isViewModalOpen, setIsViewModalOpen] = React.useState<boolean>(false);
    const [selectedRole, setSelectedRole] = React.useState<IRole | null>(null);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState<boolean>(false);

    const isDeleteRoleSuccess = useAppSelector((state) => state.role.isDeleteRoleSuccess);
    const isDeleteRoleFailed = useAppSelector((state) => state.role.isDeleteRoleFailed);

    const [roleToEdit, setRoleToEdit] = React.useState<ICreateRole | undefined>(undefined);
    const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);

    const message = useAppSelector((state) => state.role.message);
    const dispatch = useAppDispatch();

    const [sortField, setSortField] = React.useState<keyof IRole>('name');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    const handleSort = (field: keyof IRole) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const sortedRoles = [...dataSource].sort((a, b) => {
        const aValue = a[sortField] ?? '';
        const bValue = b[sortField] ?? '';
        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });

    const SortIcon = ({ field }: { field: keyof IRole }) => {
        if (sortField !== field) return null;
        return sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
    };

    const handleViewRole = (role: IRole) => {
        setSelectedRole(role);
        setIsViewModalOpen(true);
    };

    const getRoleClass = (role: string) => {
        switch (role) {
            case 'admin': return 'badge badge-error';
            case 'publisher': return 'badge badge-info';
            case 'customer': return 'badge badge-success';
            case 'editor': return 'badge badge-warning';
            default: return 'badge';
        }
    };

    const executeDeleteRole = (id: number) => {
        dispatch(deleteRole(id));
    }

    React.useEffect(() => {
        if (isDeleteRoleSuccess) {
            showToast("Xóa quyền hạn thành công", ToastType.SUCCESS);
            dispatch(resetDeleteRole());
            load()
            setPage(1)
        }
        if (isDeleteRoleFailed) {
            showToast("Xóa quyền hạn không thành công " + message, ToastType.ERROR);
            dispatch(resetDeleteRole());
        }
    }, [isDeleteRoleSuccess, isDeleteRoleFailed, message, dispatch, setPage, load]);

    return (
        <>
            <div className='flex'>
                <RoleSearchAndFilter
                    searchWithName={search}
                    setSearchWithName={setSearch}
                    dateFrom={dateFrom}
                    setDateFrom={setDateFrom}
                    setPage={setPage}
                />
            </div>
            <div className="flex justify-between">
                <div className="text-2xl font-bold">Quản lý vai trò</div>
                <button
                    className="btn btn-neutral justify-end"
                    onClick={() => {
                        setIsModalOpen(true);
                        setRoleToEdit(undefined);
                    }}
                >
                    Tạo vai trò
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
                                    <span>Tên vai trò</span>
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
                        {sortedRoles.map((record, index) => {
                            return (
                                <tr key={record.id} className='hover:bg-base-300'>
                                    <td>
                                        <div className=''>
                                            {index + (page - 1) * 10 + 1}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={getRoleClass(record.name)}>
                                            {record.name}
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
                                                {/* <li>
                                                    <button
                                                        className="flex items-center gap-2 text-info"
                                                        onClick={() => handleViewRole(record)}
                                                    >
                                                        <View className="w-4 h-4" />
                                                        <span>Xem</span>
                                                    </button>
                                                </li> */}
                                                <li>
                                                    <button
                                                        className="flex items-center gap-2 text-warning"
                                                        onClick={() => {
                                                            setRoleToEdit(record);
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
                                                                    onClick={() => executeDeleteRole(record.id)}
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
            {sortedRoles.length === 0 && <div className=''>Không có dữ liệu</div>}
            < Pagination page={page} totalPage={totalPage} setPage={setPage} />

            {/* <RoleView
                isOpen={isViewModalOpen}
                setIsOpen={setIsViewModalOpen}
                role={selectedRole}
            /> */}

            < RoleForm
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                load={load}
                roleToEdit={roleToEdit}
            />
        </>
    )
}