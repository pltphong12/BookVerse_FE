import React, { useMemo } from 'react';
import { Card, Empty, Typography } from 'antd';
import { BarChartOutlined } from '@ant-design/icons';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer
} from 'recharts';
import { IRevenueSeries } from '../../../../types/backend';
import { formatCurrency, formatFullCurrency, formatDate } from './dashboard.utils';

const { Title } = Typography;

// ─── Custom Tooltip ─────────────────────────────────────
const CustomChartTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{
            background: 'rgba(30, 41, 59, 0.95)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: 10,
            padding: '10px 14px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 4 }}>
                {label}
            </div>
            {payload.map((p: any, i: number) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#fff', padding: '2px 0' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.color, flexShrink: 0 }} />
                    <span>{p.name === 'revenue' ? 'Doanh thu' : 'Đơn hàng'}</span>
                    <span style={{ fontWeight: 700, marginLeft: 'auto' }}>
                        {p.name === 'revenue' ? formatFullCurrency(p.value) : p.value}
                    </span>
                </div>
            ))}
        </div>
    );
};

interface RevenueChartProps {
    revenueSeries: IRevenueSeries[];
}

export default function RevenueChart({ revenueSeries }: RevenueChartProps) {
    const chartData = useMemo(() =>
        revenueSeries.map(s => ({
            ...s,
            label: formatDate(s.label),
        })), [revenueSeries]);

    return (
        <Card style={{ borderRadius: 12, height: '100%' }} styles={{ body: { padding: '20px' } }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <Title level={5} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <BarChartOutlined style={{ color: '#6366f1' }} /> Biểu đồ doanh thu
                </Title>
            </div>

            {chartData.length > 0 ? (
                <>
                    <ResponsiveContainer width="100%" height={280}>
                        <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                            <defs>
                                <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
                                </linearGradient>
                                <linearGradient id="gradOrders" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.02} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
                            <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={{ stroke: '#e5e7eb' }} tickLine={false} />
                            <YAxis yAxisId="left" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={(v) => formatCurrency(v)} />
                            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomChartTooltip />} />
                            <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2.5} fill="url(#gradRevenue)" dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }} />
                            <Area yAxisId="right" type="monotone" dataKey="orders" stroke="#06b6d4" strokeWidth={2} fill="url(#gradOrders)" dot={{ r: 3, fill: '#06b6d4', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 5, fill: '#06b6d4', strokeWidth: 2, stroke: '#fff' }} />
                        </AreaChart>
                    </ResponsiveContainer>

                    {/* Legend */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 10 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#6b7280' }}>
                            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#6366f1' }} />
                            Doanh thu
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#6b7280' }}>
                            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#06b6d4' }} />
                            Đơn hàng
                        </span>
                    </div>
                </>
            ) : (
                <Empty description="Chưa có dữ liệu doanh thu trong khoảng thời gian này" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
        </Card>
    );
}
