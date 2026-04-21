import React from 'react';
import { Drawer, Descriptions, Tag, Typography, Divider, Table, Image, Spin, Statistic, Row, Col, Card, Space, Empty } from 'antd';
import {
    ShoppingOutlined, CalendarOutlined, UserOutlined,
    EnvironmentOutlined, PhoneOutlined, MailOutlined, CreditCardOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { IOrder, IOrderDetail } from '../../../types/backend';
import { callFetchOrderByIdApi } from '../../../services/api';

const { Title, Text } = Typography;

interface OrderViewProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    orderId: number | null;
}

const statusColorMap: Record<string, string> = {
    PENDING: 'orange',
    CONFIRMED: 'blue',
    SHIPPING: 'geekblue',
    DELIVERED: 'green',
    CANCELLED: 'red',
};

const statusLabelMap: Record<string, string> = {
    PENDING: 'Chờ xác nhận',
    CONFIRMED: 'Đã xác nhận',
    SHIPPING: 'Đang giao',
    DELIVERED: 'Đã giao',
    CANCELLED: 'Đã hủy',
};

const paymentStatusColorMap: Record<string, string> = {
    PENDING: 'orange',
    PAID: 'green',
    FAILED: 'red',
    REFUNDED: 'purple',
};

const paymentStatusLabelMap: Record<string, string> = {
    PENDING: 'Chờ thanh toán',
    PAID: 'Đã thanh toán',
    FAILED: 'Thất bại',
    REFUNDED: 'Đã hoàn tiền',
};

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

const formatDateTime = (dateStr?: string | null) => {
    if (!dateStr) return '—';
    return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit',
    }).format(new Date(dateStr));
};

export const OrderView: React.FC<OrderViewProps> = ({ isOpen, setIsOpen, orderId }) => {
    const [order, setOrder] = React.useState<IOrder | null>(null);
    const [loading, setLoading] = React.useState<boolean>(false);

    React.useEffect(() => {
        if (isOpen && orderId) {
            setLoading(true);
            callFetchOrderByIdApi(orderId)
                .then(res => {
                    if (res.data?.data) setOrder(res.data.data);
                })
                .catch(err => console.error('Failed to fetch order:', err))
                .finally(() => setLoading(false));
        }
    }, [isOpen, orderId]);

    const itemColumns: ColumnsType<IOrderDetail> = [
        {
            title: 'Sản phẩm',
            key: 'product',
            render: (_text, record) => (
                <Space>
                    {record.book?.image && (
                        <Image
                            src={`${import.meta.env.VITE_BACKEND_URL}/storage/book/${record.book.image}`}
                            width={40} height={56}
                            style={{ objectFit: 'cover', borderRadius: 4 }}
                            preview={false}
                        />
                    )}
                    <div>
                        <Text strong style={{ fontSize: 13 }}>{record.book?.title}</Text>
                        {record.book?.authors && record.book.authors.length > 0 && (
                            <div style={{ fontSize: 11, color: '#8c8c8c' }}>
                                {record.book.authors.map(a => a.name).join(', ')}
                            </div>
                        )}
                    </div>
                </Space>
            ),
        },
        {
            title: 'Đơn giá',
            key: 'price',
            width: 120,
            align: 'right',
            render: (_text, record) => formatCurrency(record.price),
        },
        {
            title: 'SL',
            key: 'qty',
            width: 50,
            align: 'center',
            dataIndex: 'quantity',
        },
        {
            title: 'Thành tiền',
            key: 'total',
            width: 130,
            align: 'right',
            render: (_text, record) => (
                <Text strong>{formatCurrency(record.price * record.quantity)}</Text>
            ),
        },
    ];

    return (
        <Drawer
            title={
                <span style={{ fontSize: 18, fontWeight: 600 }}>
                    <ShoppingOutlined /> Chi tiết đơn hàng
                </span>
            }
            placement="right"
            width={680}
            onClose={() => setIsOpen(false)}
            open={isOpen}
            styles={{ body: { padding: '24px' } }}
        >
            {loading ? (
                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                    <Spin size="large" />
                </div>
            ) : order ? (
                <>
                    {/* Order Code & Status Header */}
                    <div style={{ textAlign: 'center', marginBottom: 24 }}>
                        <Text code style={{ fontSize: 16, fontWeight: 600 }}>{order.orderCode}</Text>
                        <div style={{ marginTop: 8 }}>
                            <Space>
                                <Tag color={statusColorMap[order.status] || 'default'}>
                                    {statusLabelMap[order.status] || order.status}
                                </Tag>
                                <Tag color={paymentStatusColorMap[order.paymentStatus] || 'default'}>
                                    {paymentStatusLabelMap[order.paymentStatus] || order.paymentStatus}
                                </Tag>
                                <Tag>{order.paymentMethod}</Tag>
                            </Space>
                        </div>
                    </div>

                    {/* Price Stats */}
                    <Row gutter={12} style={{ marginBottom: 24 }}>
                        <Col span={8}>
                            <Card size="small" style={{ textAlign: 'center' }}>
                                <Statistic
                                    title={<span style={{ fontSize: 11 }}>Tạm tính</span>}
                                    value={order.subtotal}
                                    formatter={(val) => formatCurrency(Number(val))}
                                    valueStyle={{ fontSize: 16 }}
                                />
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card size="small" style={{ textAlign: 'center' }}>
                                <Statistic
                                    title={<span style={{ fontSize: 11 }}>Phí ship</span>}
                                    value={order.shippingFee || 0}
                                    formatter={(val) => Number(val) === 0 ? 'Miễn phí' : formatCurrency(Number(val))}
                                    valueStyle={{ fontSize: 16, color: Number(order.shippingFee) === 0 ? '#52c41a' : undefined }}
                                />
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card size="small" style={{ textAlign: 'center', borderColor: '#1677ff' }}>
                                <Statistic
                                    title={<span style={{ fontSize: 11, fontWeight: 600 }}>Tổng cộng</span>}
                                    value={order.totalPrice}
                                    formatter={(val) => formatCurrency(Number(val))}
                                    valueStyle={{ fontSize: 18, color: '#1677ff', fontWeight: 700 }}
                                />
                            </Card>
                        </Col>
                    </Row>

                    {/* Receiver Info */}
                    <Title level={5} style={{ marginBottom: 12 }}>
                        <UserOutlined /> Thông tin người nhận
                    </Title>
                    <Descriptions
                        column={1}
                        bordered
                        size="small"
                        labelStyle={{ fontWeight: 600, width: 120, whiteSpace: 'nowrap' }}
                    >
                        <Descriptions.Item label={<><UserOutlined /> Tên</>}>
                            {order.receiverName}
                        </Descriptions.Item>
                        <Descriptions.Item label={<><PhoneOutlined /> SĐT</>}>
                            {order.receiverPhone}
                        </Descriptions.Item>
                        {order.receiverEmail && (
                            <Descriptions.Item label={<><MailOutlined /> Email</>}>
                                {order.receiverEmail}
                            </Descriptions.Item>
                        )}
                        {order.receiverAddress && (
                            <Descriptions.Item label={<><EnvironmentOutlined /> Địa chỉ</>}>
                                {order.receiverAddress}
                            </Descriptions.Item>
                        )}
                    </Descriptions>

                    {/* Order Items */}
                    <Divider />
                    <Title level={5} style={{ marginBottom: 12 }}>
                        <ShoppingOutlined /> Sản phẩm ({order.orderDetails?.length || 0})
                    </Title>
                    {order.orderDetails && order.orderDetails.length > 0 ? (
                        <Table
                            columns={itemColumns}
                            dataSource={order.orderDetails}
                            rowKey="id"
                            pagination={false}
                            size="small"
                            scroll={{ x: 400 }}
                        />
                    ) : (
                        <Empty description="Không có sản phẩm" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    )}

                    {/* Timestamps */}
                    <Divider />
                    <Descriptions
                        column={2}
                        bordered
                        size="small"
                        labelStyle={{ fontWeight: 600, whiteSpace: 'nowrap' }}
                    >
                        <Descriptions.Item label={<><CalendarOutlined /> Ngày tạo</>}>
                            {formatDateTime(order.createdAt)}
                        </Descriptions.Item>
                        {order.updatedAt && (
                            <Descriptions.Item label={<><CalendarOutlined /> Cập nhật</>}>
                                {formatDateTime(order.updatedAt)}
                            </Descriptions.Item>
                        )}
                        {order.paidAt && (
                            <Descriptions.Item label={<><CreditCardOutlined /> Thanh toán</>}>
                                {formatDateTime(order.paidAt)}
                            </Descriptions.Item>
                        )}
                        {order.createdBy && (
                            <Descriptions.Item label="Tạo bởi">
                                {order.createdBy}
                            </Descriptions.Item>
                        )}
                    </Descriptions>
                </>
            ) : (
                <Empty description="Không tìm thấy đơn hàng" />
            )}
        </Drawer>
    );
};
