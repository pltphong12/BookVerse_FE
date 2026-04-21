import React from "react";
import { Table, Button, Space, Tooltip, Tag, Card, Typography } from "antd";
import { EditOutlined, EyeOutlined, ShoppingOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { IOrder } from "../../../types/backend";
import { OrderSearchAndFilter } from "./order.search_filter";
import { OrderView } from "./order.view";
import { OrderForm } from "./order.form";

const { Title, Text } = Typography;

const statusColorMap: Record<string, string> = {
    PENDING: 'orange', CONFIRMED: 'blue', SHIPPING: 'geekblue',
    DELIVERED: 'green', CANCELLED: 'red',
};
const statusLabelMap: Record<string, string> = {
    PENDING: 'Chờ xác nhận', CONFIRMED: 'Đã xác nhận', SHIPPING: 'Đang giao',
    DELIVERED: 'Đã giao', CANCELLED: 'Đã hủy',
};
const paymentStatusColorMap: Record<string, string> = {
    PENDING: 'orange', PAID: 'green', FAILED: 'red', REFUNDED: 'purple',
};
const paymentStatusLabelMap: Record<string, string> = {
    PENDING: 'Chờ TT', PAID: 'Đã TT', FAILED: 'Thất bại', REFUNDED: 'Hoàn tiền',
};

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

interface OrderTableProps {
    load: () => Promise<void>;
    page: number;
    totalPage: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    dataSource: IOrder[];
    orderCode: string;
    setOrderCode: React.Dispatch<React.SetStateAction<string>>;
    status: string;
    setStatus: React.Dispatch<React.SetStateAction<string>>;
    paymentMethod: string;
    setPaymentMethod: React.Dispatch<React.SetStateAction<string>>;
    paymentStatus: string;
    setPaymentStatus: React.Dispatch<React.SetStateAction<string>>;
    dateFrom: string;
    setDateFrom: React.Dispatch<React.SetStateAction<string>>;
}

export const OrderTable: React.FC<OrderTableProps> = ({
    load, page, totalPage, setPage, dataSource,
    orderCode, setOrderCode,
    status, setStatus,
    paymentMethod, setPaymentMethod,
    paymentStatus, setPaymentStatus,
    dateFrom, setDateFrom,
}) => {
    const [isViewModalOpen, setIsViewModalOpen] = React.useState<boolean>(false);
    const [selectedOrderId, setSelectedOrderId] = React.useState<number | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = React.useState<boolean>(false);
    const [editOrderId, setEditOrderId] = React.useState<number | null>(null);

    const handleViewOrder = (order: IOrder) => {
        setSelectedOrderId(order.id);
        setIsViewModalOpen(true);
    };

    const handleEditOrder = (order: IOrder) => {
        setEditOrderId(order.id);
        setIsEditModalOpen(true);
    };

    const columns: ColumnsType<IOrder> = [
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
            title: 'Mã đơn hàng',
            key: 'orderCode',
            width: 150,
            render: (_text, record) => (
                <Text code style={{ color: '#1677ff', fontSize: 12 }}>{record.orderCode}</Text>
            ),
        },
        {
            title: 'Khách hàng',
            key: 'customer',
            render: (_text, record) => (
                <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{record.receiverName}</div>
                    <div style={{ fontSize: 11, color: '#8c8c8c' }}>{record.receiverPhone}</div>
                </div>
            ),
        },
        {
            title: 'Tổng tiền',
            key: 'totalPrice',
            width: 140,
            align: 'right',
            render: (_text, record) => (
                <Text strong style={{ color: '#1677ff' }}>{formatCurrency(record.totalPrice)}</Text>
            ),
        },
        {
            title: 'Trạng thái',
            key: 'status',
            width: 120,
            align: 'center',
            render: (_text, record) => (
                <Tag color={statusColorMap[record.status] || 'default'}>
                    {statusLabelMap[record.status] || record.status}
                </Tag>
            ),
        },
        {
            title: 'Thanh toán',
            key: 'payment',
            width: 100,
            align: 'center',
            responsive: ['md'],
            render: (_text, record) => (
                <Tag bordered={false}>{record.paymentMethod}</Tag>
            ),
        },
        {
            title: 'TT thanh toán',
            key: 'paymentStatus',
            width: 110,
            align: 'center',
            responsive: ['lg'],
            render: (_text, record) => (
                <Tag color={paymentStatusColorMap[record.paymentStatus] || 'default'}>
                    {paymentStatusLabelMap[record.paymentStatus] || record.paymentStatus}
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
            width: 100,
            align: 'center',
            fixed: 'right',
            render: (_text, record) => (
                <Space size="small">
                    <Tooltip title="Xem chi tiết">
                        <Button
                            type="text"
                            icon={<EyeOutlined />}
                            style={{ color: '#1677ff' }}
                            onClick={() => handleViewOrder(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            style={{ color: '#faad14' }}
                            onClick={() => handleEditOrder(record)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <>
            <OrderSearchAndFilter
                orderCode={orderCode}
                setOrderCode={setOrderCode}
                status={status}
                setStatus={setStatus}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                paymentStatus={paymentStatus}
                setPaymentStatus={setPaymentStatus}
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
                        <ShoppingOutlined /> Quản lý đơn hàng
                    </Title>
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
                        showTotal: (total) => `Tổng ${total} đơn hàng`,
                        style: { padding: '0 16px' },
                    }}
                    size="middle"
                    scroll={{ x: 800 }}
                />
            </Card>

            <OrderView
                isOpen={isViewModalOpen}
                setIsOpen={setIsViewModalOpen}
                orderId={selectedOrderId}
            />

            <OrderForm
                isModalOpen={isEditModalOpen}
                setIsModalOpen={setIsEditModalOpen}
                load={load}
                orderIdToEdit={editOrderId}
            />
        </>
    );
};
