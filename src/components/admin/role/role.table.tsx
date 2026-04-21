import React from "react";
import { Table, Button, Space, Popconfirm, Tooltip, Tag, Card, Typography } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined, PlusOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { showToast, ToastType } from "../../../common/showToast";
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import { deleteRole, ICreateRole, resetDeleteRole } from "../../../redux/slide/role.slide";
import { IRole } from "../../../types/backend";
import { RoleForm } from "./role.form";
import { RoleSearchAndFilter } from "./role.search_filter";
import { RoleView } from "./role.view";

const { Title } = Typography;

const roleColorMap: Record<string, string> = {
    ADMIN: 'red',
    MANAGER: 'blue',
    CUSTOMER: 'green',
    STAFF: 'orange',
};

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

export const RoleTable: React.FC<RoleTableProps> = ({
    load, page, totalPage, setPage, dataSource,
    search, setSearch, dateFrom, setDateFrom,
}) => {
    const [isViewModalOpen, setIsViewModalOpen] = React.useState<boolean>(false);
    const [selectedRole, setSelectedRole] = React.useState<IRole | null>(null);
    const [roleToEdit, setRoleToEdit] = React.useState<ICreateRole | undefined>(undefined);
    const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);

    const isDeleteRoleSuccess = useAppSelector((state) => state.role.isDeleteRoleSuccess);
    const isDeleteRoleFailed = useAppSelector((state) => state.role.isDeleteRoleFailed);
    const message = useAppSelector((state) => state.role.message);
    const dispatch = useAppDispatch();

    const handleViewRole = (role: IRole) => {
        setSelectedRole(role);
        setIsViewModalOpen(true);
    };

    const executeDeleteRole = (id: number) => {
        dispatch(deleteRole(id));
    };

    React.useEffect(() => {
        if (isDeleteRoleSuccess) {
            showToast("Xóa vai trò thành công", ToastType.SUCCESS);
            dispatch(resetDeleteRole());
            load();
            setPage(1);
        }
        if (isDeleteRoleFailed) {
            showToast("Xóa vai trò không thành công " + message, ToastType.ERROR);
            dispatch(resetDeleteRole());
        }
    }, [isDeleteRoleSuccess, isDeleteRoleFailed, message, dispatch, setPage, load]);

    const columns: ColumnsType<IRole> = [
        {
            title: 'STT',
            key: 'index',
            width: 60,
            align: 'center',
            render: (_text, _record, index) => (
                <span style={{ fontWeight: 500 }}>
                    {index + (page - 1) * 10 + 1}
                </span>
            ),
        },
        {
            title: 'Tên vai trò',
            key: 'name',
            render: (_text, record) => (
                <Tag color={roleColorMap[record.name] || 'default'} style={{ fontSize: 13 }}>
                    {record.name}
                </Tag>
            ),
        },
        {
            title: 'Mô tả',
            key: 'description',
            responsive: ['md'],
            render: (_text, record) => (
                <span style={{ fontSize: 13, color: '#595959' }}>{record.description || '—'}</span>
            ),
        },
        {
            title: 'Quyền hạn',
            key: 'permissions',
            width: 100,
            align: 'center',
            responsive: ['lg'],
            render: (_text, record) => (
                <Tag>{record.permissions?.length || 0} quyền</Tag>
            ),
        },
        {
            title: 'Ngày tạo',
            key: 'createdAt',
            width: 120,
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
                            onClick={() => handleViewRole(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            style={{ color: '#faad14' }}
                            onClick={() => {
                                setRoleToEdit(record);
                                setIsModalOpen(true);
                            }}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Xóa vai trò"
                        description="Bạn có chắc chắn muốn xóa vai trò này?"
                        onConfirm={() => executeDeleteRole(record.id)}
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
            <RoleSearchAndFilter
                searchWithName={search}
                setSearchWithName={setSearch}
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
                        <SafetyCertificateOutlined /> Quản lý vai trò
                    </Title>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setIsModalOpen(true);
                            setRoleToEdit(undefined);
                        }}
                    >
                        Tạo vai trò
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
                        showTotal: (total) => `Tổng ${total} vai trò`,
                        style: { padding: '0 16px' },
                    }}
                    size="middle"
                    scroll={{ x: 500 }}
                />
            </Card>

            <RoleView
                isOpen={isViewModalOpen}
                setIsOpen={setIsViewModalOpen}
                role={selectedRole}
            />

            <RoleForm
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                load={load}
                roleToEdit={roleToEdit}
            />
        </>
    );
};