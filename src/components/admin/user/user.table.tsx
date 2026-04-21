import React from 'react';
import { Table, Button, Space, Popconfirm, Tooltip, Tag, Avatar, Card, Typography } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { showToast, ToastType } from '../../../common/showToast';
import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import { deleteUser, resetDeleteUser } from '../../../redux/slide/user.slice';
import { IRole, IUser } from '../../../types/backend';
import { UserForm } from './user.form';
import { UserSearchAndFilter } from './user.search_filter';
import { UserView } from './user.view';

const { Title } = Typography;

const roleColorMap: Record<string, string> = {
    ADMIN: 'red', MANAGER: 'blue', CUSTOMER: 'green', STAFF: 'orange',
};

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
    const {
        dataSource, load, page, totalPage, setPage,
        search, setSearch, roles, roleId, setRoleId, dateFrom, setDateFrom,
    } = props;

    const [isViewModalOpen, setIsViewModalOpen] = React.useState<boolean>(false);
    const [selectedUser, setSelectedUser] = React.useState<IUser | null>(null);
    const [userToEdit, setUserToEdit] = React.useState<IUser | undefined>(undefined);
    const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);

    const isDeleteUserSuccess = useAppSelector((state) => state.user.isDeleteUserSuccess);
    const isDeleteUserFailed = useAppSelector((state) => state.user.isDeleteUserFailed);
    const message = useAppSelector((state) => state.user.message);
    const dispatch = useAppDispatch();

    const handleViewUser = (user: IUser) => {
        setSelectedUser(user);
        setIsViewModalOpen(true);
    };

    const executeDeleteUser = (id: number) => {
        dispatch(deleteUser(id));
    };

    React.useEffect(() => {
        if (isDeleteUserSuccess) {
            showToast("Xóa người dùng thành công", ToastType.SUCCESS);
            dispatch(resetDeleteUser());
            setPage(1);
            load();
        }
        if (isDeleteUserFailed) {
            showToast("Xóa người dùng không thành công " + message, ToastType.ERROR);
            dispatch(resetDeleteUser());
        }
    }, [isDeleteUserSuccess, isDeleteUserFailed, message, dispatch, setPage, load]);

    const columns: ColumnsType<IUser> = [
        {
            title: 'STT',
            key: 'index',
            width: 55,
            align: 'center',
            render: (_text, _record, index) => (
                <span style={{ fontWeight: 500 }}>
                    {index + (page - 1) * 10 + 1}
                </span>
            ),
        },
        {
            title: 'Người dùng',
            key: 'user',
            render: (_text, record) => (
                <Space>
                    <Avatar
                        src={record.avatar
                            ? `${import.meta.env.VITE_BACKEND_URL}/storage/avatar/${record.avatar}`
                            : undefined
                        }
                        icon={<UserOutlined />}
                        size={40}
                        style={{ background: record.avatar ? undefined : '#1677ff' }}
                    />
                    <div>
                        <div style={{ fontWeight: 600 }}>{record.fullName}</div>
                        <div style={{ fontSize: 12, color: '#8c8c8c' }}>{record.email}</div>
                    </div>
                </Space>
            ),
        },
        {
            title: 'Vai trò',
            key: 'role',
            width: 120,
            align: 'center',
            render: (_text, record) => (
                <Tag color={roleColorMap[record.role?.name] || 'default'} style={{ fontSize: 12 }}>
                    {record.role?.name}
                </Tag>
            ),
        },
        {
            title: 'SĐT',
            key: 'phone',
            width: 130,
            responsive: ['md'],
            render: (_text, record) => (
                <span style={{ fontSize: 13 }}>{record.phone || '—'}</span>
            ),
        },
        {
            title: 'Ngày tạo',
            key: 'createdAt',
            width: 110,
            responsive: ['xl'],
            render: (_text, record) => (
                <span style={{ fontSize: 12, color: '#595959' }}>
                    {record.createdAt
                        ? new Intl.DateTimeFormat('vi-VN', {
                            year: 'numeric', month: '2-digit', day: '2-digit',
                        }).format(new Date(record.createdAt))
                        : '—'
                    }
                </span>
            ),
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: 140,
            align: 'center',
            fixed: 'right',
            render: (_text, record) => (
                <Space size="small">
                    <Tooltip title="Xem chi tiết">
                        <Button
                            type="text"
                            icon={<EyeOutlined />}
                            style={{ color: '#1677ff' }}
                            onClick={() => handleViewUser(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            style={{ color: '#faad14' }}
                            onClick={() => {
                                setUserToEdit(record);
                                setIsModalOpen(true);
                            }}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Xóa người dùng"
                        description="Bạn có chắc chắn muốn xóa người dùng này?"
                        onConfirm={() => executeDeleteUser(record.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                        okButtonProps={{ danger: true }}
                    >
                        <Tooltip title="Xóa">
                            <Button type="text" danger icon={<DeleteOutlined />} />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <>
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

            <Card styles={{ body: { padding: 0 } }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px 24px',
                    borderBottom: '1px solid #f0f0f0',
                }}>
                    <Title level={4} style={{ margin: 0 }}>
                        <UserOutlined /> Quản lý người dùng
                    </Title>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setIsModalOpen(true);
                            setUserToEdit(undefined);
                        }}
                    >
                        Tạo người dùng
                    </Button>
                </div>

                <Table
                    columns={columns}
                    dataSource={dataSource}
                    rowKey="id"
                    pagination={{
                        current: page,
                        total: totalPage * 10,
                        pageSize: 10,
                        onChange: (p) => setPage(p),
                        showSizeChanger: false,
                        showTotal: (total) => `Tổng ${total} người dùng`,
                        style: { padding: '0 16px' },
                    }}
                    size="middle"
                    scroll={{ x: 600 }}
                />
            </Card>

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
    );
};