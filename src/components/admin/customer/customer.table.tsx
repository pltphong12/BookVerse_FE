import React from "react";
import { Table, Button, Space, Popconfirm, Tooltip, Tag, Avatar, Card, Typography } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined, PlusOutlined, UserOutlined, TeamOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { showToast, ToastType } from "../../../common/showToast";
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import { deleteCustomer, resetDeleteCustomer } from "../../../redux/slide/customer.slide";
import { ICustomer } from "../../../types/backend";
import { CustomerForm } from "./customer.form";
import { CustomerSearchAndFilter } from "./customer.search_filter";
import { CustomerView } from "./customer.view";

const { Title } = Typography;

const levelColorMap: Record<string, string> = {
    'Đồng': 'orange', 'Bạc': 'default', 'Vàng': 'gold',
    'Bạch kim': 'cyan', 'Kim cương': 'blue',
    'BRONZE': 'orange', 'SILVER': 'default', 'GOLD': 'gold',
    'PLATINUM': 'cyan', 'DIAMOND': 'blue',
};

interface CustomerTableProps {
    load: () => Promise<void>;
    page: number;
    totalPage: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    dataSource: ICustomer[];
    search: string;
    setSearch: React.Dispatch<React.SetStateAction<string>>;
    customerLevel: string;
    setCustomerLevel: React.Dispatch<React.SetStateAction<string>>;
    dateFrom: string;
    setDateFrom: React.Dispatch<React.SetStateAction<string>>;
}

export const CustomerTable: React.FC<CustomerTableProps> = (props) => {
    const {
        dataSource, load, page, totalPage, setPage,
        search, setSearch, customerLevel, setCustomerLevel,
        dateFrom, setDateFrom,
    } = props;

    const [isViewModalOpen, setIsViewModalOpen] = React.useState<boolean>(false);
    const [selectedCustomer, setSelectedCustomer] = React.useState<ICustomer | null>(null);
    const [customerToEdit, setCustomerToEdit] = React.useState<ICustomer | undefined>(undefined);
    const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);

    const isDeleteCustomerSuccess = useAppSelector((state) => state.customer.isDeleteCustomerSuccess);
    const isDeleteCustomerFailed = useAppSelector((state) => state.customer.isDeleteCustomerFailed);
    const message = useAppSelector((state) => state.customer.message);
    const dispatch = useAppDispatch();

    const handleViewCustomer = (customer: ICustomer) => {
        setSelectedCustomer(customer);
        setIsViewModalOpen(true);
    };

    const executeDeleteCustomer = (id: number) => {
        dispatch(deleteCustomer(id));
    };

    React.useEffect(() => {
        if (isDeleteCustomerSuccess) {
            showToast("Xóa khách hàng thành công", ToastType.SUCCESS);
            dispatch(resetDeleteCustomer());
            setPage(1);
            load();
        }
        if (isDeleteCustomerFailed) {
            showToast("Xóa khách hàng không thành công " + message, ToastType.ERROR);
            dispatch(resetDeleteCustomer());
        }
    }, [isDeleteCustomerSuccess, isDeleteCustomerFailed, message, dispatch, setPage, load]);

    const columns: ColumnsType<ICustomer> = [
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
            title: 'Khách hàng',
            key: 'customer',
            render: (_text, record) => (
                <Space>
                    <Avatar
                        src={record.user.avatar
                            ? `${import.meta.env.VITE_BACKEND_URL}/storage/avatar/${record.user.avatar}`
                            : undefined
                        }
                        icon={<UserOutlined />}
                        size={40}
                    />
                    <div>
                        <div style={{ fontWeight: 600 }}>{record.user.fullName}</div>
                        <div style={{ fontSize: 12, color: '#8c8c8c' }}>{record.user.email}</div>
                    </div>
                </Space>
            ),
        },
        {
            title: 'CCCD',
            key: 'identityCard',
            width: 140,
            responsive: ['md'],
            render: (_text, record) => (
                <span style={{ fontFamily: 'monospace', fontSize: 13 }}>
                    {record.identityCard || '—'}
                </span>
            ),
        },
        {
            title: 'Cấp bậc',
            key: 'customerLevel',
            width: 110,
            align: 'center',
            render: (_text, record) => (
                <Tag color={levelColorMap[record.customerLevel] || 'default'}>
                    {record.customerLevel}
                </Tag>
            ),
        },
        {
            title: 'Đơn hàng',
            key: 'totalOrder',
            width: 100,
            align: 'center',
            responsive: ['lg'],
            render: (_text, record) => (
                <span style={{ fontWeight: 600 }}>{record.totalOrder || 0}</span>
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
                            onClick={() => handleViewCustomer(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            style={{ color: '#faad14' }}
                            onClick={() => {
                                setCustomerToEdit(record as any);
                                setIsModalOpen(true);
                            }}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Xóa khách hàng"
                        description="Bạn có chắc chắn muốn xóa khách hàng này?"
                        onConfirm={() => executeDeleteCustomer(record.id)}
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
            <CustomerSearchAndFilter
                search={search}
                setSearch={setSearch}
                customerLevel={customerLevel}
                setCustomerLevel={setCustomerLevel}
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
                        <TeamOutlined /> Quản lý khách hàng
                    </Title>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setIsModalOpen(true);
                            setCustomerToEdit(undefined);
                        }}
                    >
                        Tạo khách hàng
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
                        showTotal: (total) => `Tổng ${total} khách hàng`,
                        style: { padding: '0 16px' },
                    }}
                    size="middle"
                    scroll={{ x: 700 }}
                />
            </Card>

            <CustomerView
                isOpen={isViewModalOpen}
                setIsOpen={setIsViewModalOpen}
                customer={selectedCustomer}
            />

            <CustomerForm
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                load={load}
                customerToEdit={customerToEdit}
            />
        </>
    );
};