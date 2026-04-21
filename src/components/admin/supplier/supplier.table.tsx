import React from "react";
import { Table, Button, Space, Popconfirm, Tooltip, Avatar, Card, Typography } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined, PlusOutlined, ShopOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { showToast, ToastType } from "../../../common/showToast";
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import { deleteSupplier, ICreateSupplier, resetDeleteSupplier } from "../../../redux/slide/supplier.slide";
import { ISupplier } from "../../../types/backend";
import { SupplierForm } from "./supplier.form";
import { SupplierSearchAndFilter } from "./supplier.search_filter";
import { SupplierView } from "./supplier.view";

const { Title } = Typography;

interface SupplierTableProps {
    load: () => Promise<void>;
    page: number;
    totalPage: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    dataSource: ISupplier[];
    search: string;
    setSearch: React.Dispatch<React.SetStateAction<string>>;
    dateFrom: string;
    setDateFrom: React.Dispatch<React.SetStateAction<string>>;
}

export const SupplierTable: React.FC<SupplierTableProps> = ({
    load, page, totalPage, setPage, dataSource,
    search, setSearch, dateFrom, setDateFrom,
}) => {
    const [isViewModalOpen, setIsViewModalOpen] = React.useState<boolean>(false);
    const [selectedSupplier, setSelectedSupplier] = React.useState<ISupplier | null>(null);
    const [supplierToEdit, setSupplierToEdit] = React.useState<ICreateSupplier | undefined>(undefined);
    const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);

    const isDeleteSupplierSuccess = useAppSelector((state) => state.supplier.isDeleteSupplierSuccess);
    const isDeleteSupplierFailed = useAppSelector((state) => state.supplier.isDeleteSupplierFailed);
    const message = useAppSelector((state) => state.supplier.message);
    const dispatch = useAppDispatch();

    const handleViewSupplier = (supplier: ISupplier) => {
        setSelectedSupplier(supplier);
        setIsViewModalOpen(true);
    };

    const executeDeleteSupplier = (id: number) => {
        dispatch(deleteSupplier(id));
    };

    React.useEffect(() => {
        if (isDeleteSupplierSuccess) {
            showToast("Xóa nhà cung cấp thành công", ToastType.SUCCESS);
            dispatch(resetDeleteSupplier());
            load();
            setPage(1);
        }
        if (isDeleteSupplierFailed) {
            showToast("Xóa nhà cung cấp không thành công " + message, ToastType.ERROR);
            dispatch(resetDeleteSupplier());
        }
    }, [isDeleteSupplierSuccess, isDeleteSupplierFailed, message, dispatch, setPage, load]);

    const columns: ColumnsType<ISupplier> = [
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
            title: 'Nhà cung cấp',
            key: 'name',
            render: (_text, record) => (
                <Space>
                    <Avatar
                        src={record.image
                            ? `${import.meta.env.VITE_BACKEND_URL}/storage/supplier/${record.image}`
                            : undefined
                        }
                        icon={<ShopOutlined />}
                        size={40}
                        style={{ background: record.image ? undefined : '#722ed1' }}
                    />
                    <div>
                        <div style={{ fontWeight: 600 }}>{record.name}</div>
                        <div style={{ fontSize: 12, color: '#8c8c8c' }}>{record.email}</div>
                    </div>
                </Space>
            ),
        },
        {
            title: 'Địa chỉ',
            key: 'address',
            width: 200,
            responsive: ['lg'],
            ellipsis: true,
            render: (_text, record) => (
                <span style={{ fontSize: 13, color: '#595959' }}>{record.address || '—'}</span>
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
                            onClick={() => handleViewSupplier(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            style={{ color: '#faad14' }}
                            onClick={() => {
                                setSupplierToEdit(record);
                                setIsModalOpen(true);
                            }}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Xóa nhà cung cấp"
                        description="Bạn có chắc chắn muốn xóa nhà cung cấp này?"
                        onConfirm={() => executeDeleteSupplier(record.id)}
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
            <SupplierSearchAndFilter
                search={search}
                setSearch={setSearch}
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
                        <ShopOutlined /> Quản lý nhà cung cấp
                    </Title>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setIsModalOpen(true);
                            setSupplierToEdit(undefined);
                        }}
                    >
                        Tạo nhà cung cấp
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
                        showTotal: (total) => `Tổng ${total} nhà cung cấp`,
                        style: { padding: '0 16px' },
                    }}
                    size="middle"
                    scroll={{ x: 600 }}
                />
            </Card>

            <SupplierView
                isOpen={isViewModalOpen}
                setIsOpen={setIsViewModalOpen}
                supplier={selectedSupplier}
            />

            <SupplierForm
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                load={load}
                supplierToEdit={supplierToEdit}
            />
        </>
    );
};
