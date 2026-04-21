import React from 'react';
import { Input, DatePicker, Card, Row, Col, Button, Space, Select } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

interface OrderSearchAndFilterProps {
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
    setPage: React.Dispatch<React.SetStateAction<number>>;
}

const ORDER_STATUS_OPTIONS = [
    { value: 'PENDING', label: 'Chờ xác nhận' },
    { value: 'CONFIRMED', label: 'Đã xác nhận' },
    { value: 'SHIPPING', label: 'Đang giao' },
    { value: 'DELIVERED', label: 'Đã giao' },
    { value: 'CANCELLED', label: 'Đã hủy' },
];

const PAYMENT_METHOD_OPTIONS = [
    { value: 'COD', label: 'COD' },
    { value: 'VNPAY', label: 'VNPAY' },
];

const PAYMENT_STATUS_OPTIONS = [
    { value: 'PENDING', label: 'Chờ thanh toán' },
    { value: 'PAID', label: 'Đã thanh toán' },
    { value: 'FAILED', label: 'Thất bại' },
    { value: 'REFUNDED', label: 'Đã hoàn tiền' },
];

export const OrderSearchAndFilter: React.FC<OrderSearchAndFilterProps> = ({
    orderCode, setOrderCode,
    status, setStatus,
    paymentMethod, setPaymentMethod,
    paymentStatus, setPaymentStatus,
    dateFrom, setDateFrom,
    setPage,
}) => {
    const handleReset = () => {
        setOrderCode('');
        setStatus('');
        setPaymentMethod('');
        setPaymentStatus('');
        setDateFrom('');
        setPage(1);
    };

    return (
        <Card
            size="small"
            style={{ marginBottom: 16, width: '100%' }}
            styles={{ body: { padding: '16px' } }}
        >
            <Row gutter={[12, 12]} align="middle">
                <Col xs={24} sm={12} md={5}>
                    <Input
                        placeholder="Mã đơn hàng..."
                        prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                        value={orderCode}
                        onChange={(e) => {
                            setOrderCode(e.target.value);
                            setPage(1);
                        }}
                        allowClear
                    />
                </Col>
                <Col xs={24} sm={12} md={4}>
                    <Select
                        placeholder="Trạng thái"
                        style={{ width: '100%' }}
                        value={status || undefined}
                        onChange={(val) => { setStatus(val || ''); setPage(1); }}
                        allowClear
                        options={ORDER_STATUS_OPTIONS}
                    />
                </Col>
                <Col xs={24} sm={12} md={4}>
                    <Select
                        placeholder="Thanh toán"
                        style={{ width: '100%' }}
                        value={paymentMethod || undefined}
                        onChange={(val) => { setPaymentMethod(val || ''); setPage(1); }}
                        allowClear
                        options={PAYMENT_METHOD_OPTIONS}
                    />
                </Col>
                <Col xs={24} sm={12} md={4}>
                    <Select
                        placeholder="TT thanh toán"
                        style={{ width: '100%' }}
                        value={paymentStatus || undefined}
                        onChange={(val) => { setPaymentStatus(val || ''); setPage(1); }}
                        allowClear
                        options={PAYMENT_STATUS_OPTIONS}
                    />
                </Col>
                <Col xs={24} sm={12} md={4}>
                    <DatePicker
                        placeholder="Từ ngày"
                        style={{ width: '100%' }}
                        value={dateFrom ? dayjs(dateFrom) : null}
                        onChange={(_date, dateString) => {
                            setDateFrom(dateString as string);
                            setPage(1);
                        }}
                        format="YYYY-MM-DD"
                    />
                </Col>
                <Col xs={24} sm={12} md={3}>
                    <Space>
                        <Button icon={<ReloadOutlined />} onClick={handleReset}>
                            Đặt lại
                        </Button>
                    </Space>
                </Col>
            </Row>
        </Card>
    );
};
