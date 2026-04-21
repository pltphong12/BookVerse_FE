import React from 'react';
import { Drawer, Descriptions, Avatar, Typography, Divider, Image } from 'antd';
import {
    ShopOutlined, CalendarOutlined, MailOutlined,
    PhoneOutlined, EnvironmentOutlined, FileTextOutlined
} from '@ant-design/icons';
import { ISupplier } from '../../../types/backend';

const { Title, Paragraph } = Typography;

interface SupplierViewProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    supplier: ISupplier | null;
}

export const SupplierView: React.FC<SupplierViewProps> = ({ isOpen, setIsOpen, supplier }) => {
    if (!supplier) return null;

    const imageUrl = supplier.image
        ? `${import.meta.env.VITE_BACKEND_URL}/storage/supplier/${supplier.image}`
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
                    <ShopOutlined /> Thông tin nhà cung cấp
                </span>
            }
            placement="right"
            width={520}
            onClose={() => setIsOpen(false)}
            open={isOpen}
            styles={{ body: { padding: '24px' } }}
        >
            {/* Supplier Header */}
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={supplier.name}
                        width={96}
                        height={96}
                        style={{
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '3px solid #e6f4ff',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        }}
                        fallback="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTYiIGhlaWdodD0iOTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9Ijk2IiBoZWlnaHQ9Ijk2IiBmaWxsPSIjZjBmMGYwIiByeD0iNDgiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIxMiIgZmlsbD0iI2JmYmZiZiI+TkNDPC90ZXh0Pjwvc3ZnPg=="
                    />
                ) : (
                    <Avatar
                        size={96}
                        icon={<ShopOutlined />}
                        style={{
                            background: 'linear-gradient(135deg, #722ed1, #531dab)',
                            border: '3px solid #f0e6ff',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        }}
                    />
                )}
                <Title level={4} style={{ marginTop: 12, marginBottom: 0 }}>{supplier.name}</Title>
            </div>

            <Divider />

            {/* Details */}
            <Descriptions
                column={1}
                bordered
                size="small"
                labelStyle={{ fontWeight: 600, width: 130, whiteSpace: 'nowrap' }}
            >
                <Descriptions.Item label={<><ShopOutlined /> Tên NCC</>}>
                    {supplier.name}
                </Descriptions.Item>
                <Descriptions.Item label={<><EnvironmentOutlined /> Địa chỉ</>}>
                    {supplier.address || '—'}
                </Descriptions.Item>
                <Descriptions.Item label={<><PhoneOutlined /> SĐT</>}>
                    {supplier.phone || '—'}
                </Descriptions.Item>
                <Descriptions.Item label={<><MailOutlined /> Email</>}>
                    {supplier.email || '—'}
                </Descriptions.Item>
                <Descriptions.Item label={<><CalendarOutlined /> Ngày tạo</>}>
                    {formatDateTime(supplier.createdAt)}
                </Descriptions.Item>
                {supplier.updatedAt && (
                    <Descriptions.Item label={<><CalendarOutlined /> Cập nhật</>}>
                        {formatDateTime(supplier.updatedAt)}
                    </Descriptions.Item>
                )}
            </Descriptions>

            {/* Description */}
            <Divider />
            <Title level={5} style={{ marginBottom: 8 }}>
                <FileTextOutlined /> Mô tả
            </Title>
            <Paragraph type="secondary" style={{ whiteSpace: 'pre-wrap' }}>
                {supplier.description || 'Chưa có mô tả.'}
            </Paragraph>
        </Drawer>
    );
};
