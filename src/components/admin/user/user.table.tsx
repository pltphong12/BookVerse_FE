import { Edit, Trash, View } from 'lucide-react';
import React from 'react';
import { showToast, ToastType } from '../../../common/showToast';
import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import { deleteUser, resetDeleteUser } from '../../../redux/slide/user.slice';
import { IRole, IUser } from '../../../types/backend';
import { Pagination } from '../../global/Pagination';
import { UserForm } from './user.form';
import { UserSearchAndFilter } from './user.search_filter';
import { UserView } from './user.view';


interface UserTableProps {
    load: () => Promise<void>;
    page: number;
    totalPage: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    dataSource: IUser[];
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    search: string;
    setSearch: React.Dispatch<React.SetStateAction<string>>;
    roles: IRole[];
    roleId: number;
    setRoleId: React.Dispatch<React.SetStateAction<number>>;
    dateFrom: string;
    setDateFrom: React.Dispatch<React.SetStateAction<string>>;
}

export const UserTable: React.FC<UserTableProps> = (props) => {
    const { dataSource, load, page, totalPage, setPage, search, setSearch, roles, roleId, setRoleId, dateFrom, setDateFrom } = props;
    const [isViewModalOpen, setIsViewModalOpen] = React.useState<boolean>(false);
    const [selectedUser, setSelectedUser] = React.useState<IUser | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState<boolean>(false);
    const isDeleteUserSuccess = useAppSelector((state) => state.user.isDeleteUserSuccess);
    const isDeleteUserFailed = useAppSelector((state) => state.user.isDeleteUserFailed);
    const [userToEdit, setUserToEdit] = React.useState<IUser | undefined>(undefined);
    const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);

    const message = useAppSelector((state) => state.user.message);
    const dispatch = useAppDispatch();


    const handleViewUser = (user: IUser) => {
        setSelectedUser(user);
        setIsViewModalOpen(true);
    };

    const executeDeleteUser = (id: number) => {
        dispatch(deleteUser(id));
    }

    const getRoleClass = (role: string) => {
        switch (role) {
            case 'ADMIN': return 'badge badge-error';
            case 'MANAGER': return 'badge badge-info';
            case 'CUSTOMER': return 'badge badge-success';
            case 'EDITOR': return 'badge badge-warning';
            default: return 'badge';
        }
    };

    React.useEffect(() => {
        if (isDeleteUserSuccess) {
            showToast("Xóa người dùng thành công", ToastType.SUCCESS);
            dispatch(resetDeleteUser());
            setPage(1)
            load()
        }
        if (isDeleteUserFailed) {
            showToast("Xóa người dùng không thành công " + message, ToastType.ERROR);
            dispatch(resetDeleteUser());
        }
    }, [isDeleteUserSuccess, isDeleteUserFailed, message, dispatch, setPage, load]);


    return (
        <>
            <div className='flex'>
                <UserSearchAndFilter
                    search={search}
                    setSearch={setSearch}
                    roles={roles}
                    roleId={roleId}
                    setRoleId={setRoleId}
                    dateFrom={dateFrom}
                    setDateFrom={setDateFrom}
                    setPage={setPage}
                />
            </div>
            <div className="flex justify-between">
                <div className="text-2xl font-bold">Quản lý người dùng</div>
                <button
                    className="btn btn-neutral justify-end"
                    onClick={() => {
                        setIsModalOpen(true);
                        setUserToEdit(undefined);
                    }}
                >
                    Tạo người dùng
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
                                    <span>Email</span>
                                </div>
                            </th>
                            <th className='cursor-pointer hover:bg-base-200'>
                                <div className='flex items-center gap-1'>
                                    <span>Họ và tên</span>
                                </div>
                            </th>

                            <th className='cursor-pointer hover:bg-base-200'>
                                <div className='flex items-center gap-1'>
                                    <span>Vai trò</span>
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
                                        <div className="flex items-center gap-3">
                                            <div>
                                                <div className="font-bold">{record.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        {record.fullName}
                                    </td>

                                    <td >
                                        <span className={getRoleClass(record.role.name)}>
                                            {record.role.name}
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
                                                        onClick={() => handleViewUser(record)}
                                                    >
                                                        <View className="w-4 h-4" />
                                                        <span>Xem</span>
                                                    </button>
                                                </li>
                                                <li>
                                                    <button
                                                        className="flex items-center gap-2 text-warning"
                                                        onClick={() => {
                                                            setUserToEdit(record);
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
                                                                    onClick={() => executeDeleteUser(record.id)}
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
            <Pagination page={page} totalPage={totalPage} setPage={setPage} />

            <UserView
                isOpen={isViewModalOpen}
                setIsOpen={setIsViewModalOpen}
                user={selectedUser}
            />

            <UserForm
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                load={load}
                userToEdit={userToEdit}
                roles={roles}
            />
        </>
    )
}