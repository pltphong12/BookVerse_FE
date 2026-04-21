import React from 'react';
import { Card, Table, Tag, Empty, Typography, Badge } from 'antd';
import { TrophyOutlined, InboxOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { ITopProduct } from '../../../../types/backend';
import { formatFullCurrency } from './dashboard.utils';

const { Title, Text } = Typography;

interface TopProductsTableProps {
    topProducts: ITopProduct[];
}

const rankColors: Record<number, string> = {
    1: '#faad14', // Gold
    2: '#8c8c8c', // Silver
    3: '#cd7f32', // Bronze
};

export default function TopProductsTable({ topProducts }: TopProductsTableProps) {
    const columns: ColumnsType<ITopProduct> = [
        {
            title: '#',
            key: 'rank',
            width: 50,
            align: 'center',
            render: (_text, _record, index) => {
                const rank = index + 1;
                const color = rankColors[rank];
                return color ? (
                    <Badge
                        count={rank}
                        style={{
                            background: color,
                            fontWeight: 700,
                            boxShadow: 'none',
                        }}
                    />
                ) : (
                    <span style={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        width: 24, height: 24, borderRadius: 6,
                        background: '#f5f5f5', color: '#8c8c8c',
                        fontSize: 12, fontWeight: 700,
                    }}>
                        {rank}
                    </span>
                );
            },
        },
        {
            title: 'Sản phẩm',
            key: 'title',
            ellipsis: true,
            render: (_text, record) => (
                <Text strong style={{ fontSize: 13 }}>{record.title}</Text>
            ),
        },
        {
            title: 'Đã bán',
            key: 'soldQty',
            width: 100,
            align: 'center',
            render: (_text, record) => (
                <Tag color="green" style={{ fontWeight: 600 }}>
                    <InboxOutlined style={{ marginRight: 4 }} />
                    {record.soldQty}
                </Tag>
            ),
        },
        {
            title: 'Doanh thu',
            key: 'revenue',
            width: 160,
            align: 'right',
            render: (_text, record) => (
                <Text strong>{formatFullCurrency(record.revenue)}</Text>
            ),
        },
    ];

    return (
        <Card style={{ borderRadius: 12 }} styles={{ body: { padding: 0 } }}>
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '16px 20px', borderBottom: '1px solid #f0f0f0',
            }}>
                <Title level={5} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <TrophyOutlined style={{ color: '#f59e0b' }} /> Sản phẩm bán chạy
                </Title>
                <Text type="secondary" style={{ fontSize: 13 }}>
                    Top {topProducts.length} sản phẩm
                </Text>
            </div>

            {topProducts.length > 0 ? (
                <Table
                    columns={columns}
                    dataSource={topProducts}
                    rowKey="productId"
                    pagination={false}
                    size="middle"
                />
            ) : (
                <div style={{ padding: 40 }}>
                    <Empty description="Chưa có dữ liệu sản phẩm" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                </div>
            )}
        </Card>
    );
}
