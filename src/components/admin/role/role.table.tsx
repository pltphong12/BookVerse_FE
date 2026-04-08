import { Edit, Trash } from "lucide-react";
import React from "react";
import { showToast, ToastType } from "../../../common/showToast";
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import { deleteRole, ICreateRole, resetDeleteRole } from "../../../redux/slide/role.slide";
import { IRole } from "../../../types/backend";
import { Pagination } from "../../global/Pagination";
import { RoleForm } from "./role.form";
import { RoleSearchAndFilter } from "./role.search_filter";

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


    const handleViewRole = (role: IRole) => {
        setSelectedRole(role);
        setIsViewModalOpen(true);
    };

    const getRoleClass = (role: string) => {
        switch (role) {
            case 'ADMIN': return 'badge badge-error';
            case 'MANAGER': return 'badge badge-info';
            case 'CUSTOMER': return 'badge badge-success';
            case 'STAFF': return 'badge badge-warning';
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
                            <th className='cursor-pointer hover:bg-base-200'>
                                <div className='flex items-center gap-1'>
                                    <span>Tên vai trò</span>
                                </div>
                            </th>

                            <th className='cursor-pointer hover:bg-base-200'>
                                <div className='flex items-center gap-1'>
                                    <span>Ngày tạo</span>
                                </div>
                            </th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataSource.map((record, index) => {
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
            {dataSource.length === 0 && <div className=''>Không có dữ liệu</div>}
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