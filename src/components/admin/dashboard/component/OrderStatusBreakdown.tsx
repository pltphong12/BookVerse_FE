import React, { useMemo } from 'react';
import { Card, Empty, Progress, Typography } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { STATUS_COLORS, STATUS_LABELS } from './dashboard.utils';

const { Title, Text } = Typography;

interface OrderStatusBreakdownProps {
    orderStatusBreakdown: Record<string, number>;
}

export default function OrderStatusBreakdown({ orderStatusBreakdown }: OrderStatusBreakdownProps) {
    const totalOrders = useMemo(() =>
        Object.values(orderStatusBreakdown).reduce((a, b) => a + b, 0),
        [orderStatusBreakdown]);

    const pieData = useMemo(() =>
        Object.entries(orderStatusBreakdown).map(([key, value]) => ({
            name: STATUS_LABELS[key] || key,
            value,
            color: STATUS_COLORS[key] || '#94a3b8',
        })), [orderStatusBreakdown]);

    return (
        <Card style={{ borderRadius: 12, height: '100%' }} styles={{ body: { padding: '20px' } }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <Title level={5} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <ShoppingCartOutlined style={{ color: '#8b5cf6' }} /> Trạng thái đơn hàng
                </Title>
                <Text type="secondary" style={{ fontSize: 13 }}>
                    Tổng: <strong style={{ color: '#141414' }}>{totalOrders}</strong>
                </Text>
            </div>

            {pieData.length > 0 ? (
                <>
                    {/* Donut chart */}
                    <div style={{ position: 'relative' }}>
                        <ResponsiveContainer width="100%" height={180}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%" cy="50%"
                                    innerRadius={55} outerRadius={80}
                                    paddingAngle={3}
                                    dataKey="value"
                                    strokeWidth={0}
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={index} fill={entry.color} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Center text */}
                        <div style={{
                            position: 'absolute', top: '50%', left: '50%',
                            transform: 'translate(-50%, -50%)', textAlign: 'center',
                        }}>
                            <div style={{ fontSize: 22, fontWeight: 700, color: '#141414' }}>{totalOrders}</div>
                            <div style={{ fontSize: 11, color: '#8c8c8c', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Đơn hàng</div>
                        </div>
                    </div>

                    {/* Status list with progress bars */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
                        {pieData.map((item, i) => {
                            const percent = totalOrders > 0 ? Math.round((item.value / totalOrders) * 100) : 0;
                            return (
                                <div key={i}>
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: 8,
                                        padding: '4px 8px', borderRadius: 6,
                                    }}>
                                        <span style={{ width: 10, height: 10, borderRadius: '50%', background: item.color, flexShrink: 0 }} />
                                        <span style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{item.name}</span>
                                        <span style={{ fontSize: 13, fontWeight: 700 }}>{item.value}</span>
                                    </div>
                                    <Progress
                                        percent={percent}
                                        showInfo={false}
                                        strokeColor={item.color}
                                        trailColor="#f0f0f0"
                                        size="small"
                                        style={{ margin: '0 8px' }}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </>
            ) : (
                <Empty description="Chưa có đơn hàng" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
        </Card>
    );
}
