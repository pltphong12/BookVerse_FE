import React from 'react';
import { Drawer, Descriptions, Avatar, Tag, Typography, Divider, Statistic, Row, Col, Card } from 'antd';
import {
    UserOutlined, CalendarOutlined, IdcardOutlined,
    ShoppingCartOutlined, DollarOutlined, MailOutlined, PhoneOutlined, EnvironmentOutlined
} from '@ant-design/icons';
import { ICustomer } from '../../../types/backend';

const { Title, Text } = Typography;

interface CustomerViewProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    customer: ICustomer | null;
}

const levelColorMap: Record<string, string> = {
    'Đồng': 'orange',
    'Bạc': 'default',
    'Vàng': 'gold',
    'Bạch kim': 'cyan',
    'Kim cương': 'blue',
    'BRONZE': 'orange',
    'SILVER': 'default',
    'GOLD': 'gold',
    'PLATINUM': 'cyan',
    'DIAMOND': 'blue',
};

export const CustomerView: React.FC<CustomerViewProps> = ({ isOpen, setIsOpen, customer }) => {
    if (!customer) return null;

    const avatarUrl = customer.user.avatar
        ? `${import.meta.env.VITE_BACKEND_URL}/storage/avatar/${customer.user.avatar}`
        : undefined;

    const formatDateTime = (dateStr?: string) => {
        if (!dateStr) return '—';
        return new Intl.DateTimeFormat('vi-VN', {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', second: '2-digit',
        }).format(new Date(dateStr));
    };

    return (
        <Drawer
            title={
                <span style={{ fontSize: 18, fontWeight: 600 }}>
                    <UserOutlined /> Thông tin khách hàng
                </span>
            }
            placement="right"
            width={560}
            onClose={() => setIsOpen(false)}
            open={isOpen}
            styles={{ body: { padding: '24px' } }}
        >
            {/* Customer Header */}
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <Avatar
                    src={avatarUrl}
                    icon={<UserOutlined />}
                    size={96}
                    style={{
                        border: '3px solid #e6f4ff',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        marginBottom: 12,
                    }}
                />
                <Title level={4} style={{ marginBottom: 4 }}>{customer.user.fullName}</Title>
                <Tag color={levelColorMap[customer.customerLevel] || 'default'} style={{ fontSize: 13 }}>
                    {customer.customerLevel}
                </Tag>
            </div>

            {/* Stats Cards */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={12}>
                    <Card size="small" style={{ textAlign: 'center', borderColor: '#91caff' }}>
                        <Statistic
                            title={<span style={{ fontSize: 12 }}><ShoppingCartOutlined /> Tổng đơn hàng</span>}
                            value={customer.totalOrder || 0}
                            valueStyle={{ color: '#1677ff', fontSize: 24 }}
                        />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card size="small" style={{ textAlign: 'center', borderColor: '#b7eb8f' }}>
                        <Statistic
                            title={<span style={{ fontSize: 12 }}><DollarOutlined /> Tổng chi tiêu</span>}
                            value={customer.totalSpending || 0}
                            valueStyle={{ color: '#52c41a', fontSize: 24 }}
                            formatter={(val) => new Intl.NumberFormat('vi-VN', {
                                style: 'currency', currency: 'VND',
                            }).format(Number(val))}
                        />
                    </Card>
                </Col>
            </Row>

            <Divider />

            {/* Personal Information */}
            <Title level={5} style={{ marginBottom: 12 }}>
                <IdcardOutlined /> Thông tin cá nhân
            </Title>
            <Descriptions
                column={1}
                bordered
                size="small"
                labelStyle={{ fontWeight: 600, width: 130, whiteSpace: 'nowrap' }}
            >
                <Descriptions.Item label={<><IdcardOutlined /> Mã CCCD</>}>
                    <Text code>{customer.identityCard || 'Chưa cập nhật'}</Text>
                </Descriptions.Item>
                <Descriptions.Item label={<><EnvironmentOutlined /> Địa chỉ</>}>
                    {customer.user.address || 'Chưa cập nhật'}
                </Descriptions.Item>
            </Descriptions>

            <div style={{ height: 16 }} />

            {/* Account Information */}
            <Title level={5} style={{ marginBottom: 12 }}>
                <MailOutlined /> Thông tin tài khoản
            </Title>
            <Descriptions
                column={1}
                bordered
                size="small"
                labelStyle={{ fontWeight: 600, width: 130, whiteSpace: 'nowrap' }}
            >
                <Descriptions.Item label={<><MailOutlined /> Email</>}>
                    {customer.user.email}
                </Descriptions.Item>
                <Descriptions.Item label={<><PhoneOutlined /> SĐT</>}>
                    {customer.user.phone}
                </Descriptions.Item>
                <Descriptions.Item label={<><CalendarOutlined /> Ngày tạo</>}>
                    {formatDateTime(customer.createdAt)}
                </Descriptions.Item>
                {customer.updatedAt && (
                    <Descriptions.Item label={<><CalendarOutlined /> Cập nhật</>}>
                        {formatDateTime(customer.updatedAt)}
                    </Descriptions.Item>
                )}
            </Descriptions>
        </Drawer>
    );
};