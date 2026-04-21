import React from "react";
import { Table, Button, Space, Popconfirm, Tooltip, Tag, Card, Typography } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined, PlusOutlined, ApiOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { showToast, ToastType } from "../../../../common/showToast";
import { useAppDispatch, useAppSelector } from "../../../../redux/hook";
import { deletePermission, ICreatePermission, resetDeletePermission } from "../../../../redux/slide/permission.slice";
import { IPermission } from "../../../../types/backend";
import { PermissionForm } from "./permission.form";
import { PermissionSearchAndFilter } from "./permission.search_filter";
import { PermissionView } from "./permission.view";

const { Title, Text } = Typography;

const methodColorMap: Record<string, string> = {
    GET: 'blue',
    POST: 'green',
    PUT: 'orange',
    DELETE: 'red',
    PATCH: 'purple',
};

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
    domain: string;
    setDomain: React.Dispatch<React.SetStateAction<string>>;
    domains: string[];
    dateFrom: string;
    setDateFrom: React.Dispatch<React.SetStateAction<string>>;
}

export const PermissionTable: React.FC<PermissionTableProps> = ({
    load, page, totalPage, setPage, dataSource,
    search, setSearch, method, setMethod,
    domain, setDomain, domains, dateFrom, setDateFrom,
}) => {
    const [isViewModalOpen, setIsViewModalOpen] = React.useState<boolean>(false);
    const [selectedPermission, setSelectedPermission] = React.useState<IPermission | null>(null);
    const [permissionToEdit, setPermissionToEdit] = React.useState<ICreatePermission | undefined>(undefined);
    const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);

    const isDeletePermissionSuccess = useAppSelector((state) => state.permission.isDeletePermissionSuccess);
    const isDeletePermissionFailed = useAppSelector((state) => state.permission.isDeletePermissionFailed);
    const message = useAppSelector((state) => state.permission.message);
    const dispatch = useAppDispatch();

    const handleViewPermission = (permission: IPermission) => {
        setSelectedPermission(permission);
        setIsViewModalOpen(true);
    };

    const executeDeletePermission = (id: number) => {
        dispatch(deletePermission(id));
    };

    React.useEffect(() => {
        if (isDeletePermissionSuccess) {
            showToast("Xóa quyền hạn thành công", ToastType.SUCCESS);
            dispatch(resetDeletePermission());
            load();
            setPage(1);
        }
        if (isDeletePermissionFailed) {
            showToast("Xóa quyền hạn không thành công " + message, ToastType.ERROR);
            dispatch(resetDeletePermission());
        }
    }, [isDeletePermissionSuccess, isDeletePermissionFailed, message, dispatch, setPage, load]);

    const columns: ColumnsType<IPermission> = [
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
            title: 'Tên quyền hạn',
            key: 'name',
            ellipsis: true,
            render: (_text, record) => (
                <span style={{ fontWeight: 600, fontSize: 13 }}>{record.name}</span>
            ),
        },
        {
            title: 'Domain',
            key: 'domain',
            width: 120,
            responsive: ['md'],
            render: (_text, record) => (
                <Tag>{record.domain}</Tag>
            ),
        },
        {
            title: 'API Path',
            key: 'apiPath',
            width: 200,
            responsive: ['lg'],
            ellipsis: true,
            render: (_text, record) => (
                <Text code style={{ fontSize: 11 }}>{record.apiPath}</Text>
            ),
        },
        {
            title: 'Method',
            key: 'method',
            width: 90,
            align: 'center',
            render: (_text, record) => (
                <Tag color={methodColorMap[record.method] || 'default'}>
                    {record.method}
                </Tag>
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
                            onClick={() => handleViewPermission(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            style={{ color: '#faad14' }}
                            onClick={() => {
                                setPermissionToEdit(record);
                                setIsModalOpen(true);
                            }}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Xóa quyền hạn"
                        description="Bạn có chắc chắn muốn xóa quyền hạn này?"
                        onConfirm={() => executeDeletePermission(record.id)}
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
            <PermissionSearchAndFilter
                searchWithName={search}
                setSearchWithName={setSearch}
                method={method}
                setMethod={setMethod}
                domain={domain}
                setDomain={setDomain}
                domains={domains}
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
                        <ApiOutlined /> Quản lý quyền hạn
                    </Title>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setIsModalOpen(true);
                            setPermissionToEdit(undefined);
                        }}
                    >
                        Tạo quyền hạn
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
                        showTotal: (total) => `Tổng ${total} quyền hạn`,
                        style: { padding: '0 16px' },
                    }}
                    size="middle"
                    scroll={{ x: 600 }}
                />
            </Card>

            <PermissionView
                isOpen={isViewModalOpen}
                setIsOpen={setIsViewModalOpen}
                permission={selectedPermission}
            />

            <PermissionForm
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                load={load}
                permissionToEdit={permissionToEdit}
            />
        </>
    );
};
