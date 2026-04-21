import React from 'react';
import { Card, Statistic, Row, Col } from 'antd';
import {
    DollarOutlined, ShoppingCartOutlined, UserAddOutlined,
    InboxOutlined, RiseOutlined, CloseCircleOutlined
} from '@ant-design/icons';
import { IDashboardSummary } from '../../../../types/backend';
import { formatCurrency, formatFullCurrency } from './dashboard.utils';

interface StatItem {
    icon: React.ReactNode;
    label: string;
    value: string;
    sub: string;
    color: string;
    bg: string;
}

interface DashboardStatCardsProps {
    summary: IDashboardSummary;
}

export default function DashboardStatCards({ summary }: DashboardStatCardsProps) {
    const stats: StatItem[] = [
        {
            icon: <DollarOutlined />,
            label: 'Doanh thu',
            value: formatCurrency(summary.revenue),
            sub: formatFullCurrency(summary.revenue),
            color: '#6366f1',
            bg: 'rgba(99, 102, 241, 0.08)',
        },
        {
            icon: <ShoppingCartOutlined />,
            label: 'Đơn hàng',
            value: summary.orders.toString(),
            sub: 'Tổng đơn hàng',
            color: '#06b6d4',
            bg: 'rgba(6, 182, 212, 0.08)',
        },
        {
            icon: <UserAddOutlined />,
            label: 'Khách mới',
            value: summary.customersNew.toString(),
            sub: 'Đăng ký mới',
            color: '#10b981',
            bg: 'rgba(16, 185, 129, 0.08)',
        },
        {
            icon: <InboxOutlined />,
            label: 'SP đã bán',
            value: summary.productsSold.toString(),
            sub: 'Sản phẩm',
            color: '#f59e0b',
            bg: 'rgba(245, 158, 11, 0.08)',
        },
        {
            icon: <RiseOutlined />,
            label: 'AOV',
            value: formatCurrency(summary.aov),
            sub: 'Giá trị TB / đơn',
            color: '#ec4899',
            bg: 'rgba(236, 72, 153, 0.08)',
        },
        {
            icon: <CloseCircleOutlined />,
            label: 'Tỷ lệ huỷ',
            value: `${(summary.cancelRate * 100).toFixed(1)}%`,
            sub: 'Đơn bị huỷ',
            color: '#ef4444',
            bg: 'rgba(239, 68, 68, 0.08)',
        },
    ];

    return (
        <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
            {stats.map((stat, idx) => (
                <Col xs={12} sm={8} lg={4} key={idx}>
                    <Card
                        hoverable
                        size="small"
                        style={{
                            borderRadius: 12,
                            borderTop: `3px solid ${stat.color}`,
                            transition: 'all 0.3s',
                        }}
                        styles={{ body: { padding: '16px' } }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                            <div style={{
                                width: 36, height: 36, borderRadius: 10,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: stat.bg, color: stat.color, fontSize: 18,
                            }}>
                                {stat.icon}
                            </div>
                            <span style={{ fontSize: 11, fontWeight: 500, color: '#8c8c8c', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                {stat.label}
                            </span>
                        </div>
                        <Statistic
                            value={stat.value}
                            valueStyle={{ fontSize: 22, fontWeight: 700, color: '#141414' }}
                        />
                        <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 2 }}>{stat.sub}</div>
                    </Card>
                </Col>
            ))}
        </Row>
    );
}
