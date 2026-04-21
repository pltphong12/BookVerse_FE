import React from 'react';
import { Drawer, Descriptions, Avatar, Tag, Typography, Divider, Image } from 'antd';
import {
    UserOutlined, CalendarOutlined, MailOutlined,
    PhoneOutlined, EnvironmentOutlined
} from '@ant-design/icons';
import { IUser } from '../../../types/backend';

const { Title } = Typography;

interface UserViewProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    user: IUser | null;
}

const roleColorMap: Record<string, string> = {
    ADMIN: 'red',
    MANAGER: 'blue',
    CUSTOMER: 'green',
    STAFF: 'orange',
};

const formatDateTime = (dateStr?: string) => {
    if (!dateStr) return '—';
    return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
    }).format(new Date(dateStr));
};

export const UserView: React.FC<UserViewProps> = ({ isOpen, setIsOpen, user }) => {
    if (!user) return null;

    const avatarUrl = user.avatar
        ? `${import.meta.env.VITE_BACKEND_URL}/storage/avatar/${user.avatar}`
        : undefined;

    return (
        <Drawer
            title={
                <span style={{ fontSize: 18, fontWeight: 600 }}>
                    <UserOutlined /> Thông tin người dùng
                </span>
            }
            placement="right"
            width={520}
            onClose={() => setIsOpen(false)}
            open={isOpen}
            styles={{ body: { padding: '24px' } }}
        >
            {/* User Header */}
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
                {avatarUrl ? (
                    <Image
                        src={avatarUrl}
                        alt={user.fullName}
                        width={96}
                        height={96}
                        style={{
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '3px solid #e6f4ff',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        }}
                        fallback="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTYiIGhlaWdodD0iOTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9Ijk2IiBoZWlnaHQ9Ijk2IiBmaWxsPSIjZjBmMGYwIiByeD0iNDgiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIxMiIgZmlsbD0iI2JmYmZiZiI+VXNlcjwvdGV4dD48L3N2Zz4="
                    />
                ) : (
                    <Avatar
                        size={96}
                        icon={<UserOutlined />}
                        style={{
                            background: 'linear-gradient(135deg, #1677ff, #0958d9)',
                            border: '3px solid #e6f4ff',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        }}
                    />
                )}
                <Title level={4} style={{ marginTop: 12, marginBottom: 4 }}>{user.fullName}</Title>
                <Tag color={roleColorMap[user.role?.name] || 'default'} style={{ fontSize: 13 }}>
                    {user.role?.name}
                </Tag>
            </div>

            <Divider />

            {/* Details */}
            <Descriptions
                column={1}
                bordered
                size="small"
                labelStyle={{ fontWeight: 600, width: 130, whiteSpace: 'nowrap' }}
            >
                <Descriptions.Item label={<><UserOutlined /> Họ tên</>}>
                    {user.fullName}
                </Descriptions.Item>
                <Descriptions.Item label={<><MailOutlined /> Email</>}>
                    {user.email}
                </Descriptions.Item>
                <Descriptions.Item label={<><PhoneOutlined /> SĐT</>}>
                    {user.phone || '—'}
                </Descriptions.Item>
                <Descriptions.Item label={<><EnvironmentOutlined /> Địa chỉ</>}>
                    {user.address || '—'}
                </Descriptions.Item>
                <Descriptions.Item label={<><CalendarOutlined /> Ngày tạo</>}>
                    {formatDateTime(user.createdAt)}
                </Descriptions.Item>
                {user.updatedAt && (
                    <Descriptions.Item label={<><CalendarOutlined /> Cập nhật</>}>
                        {formatDateTime(user.updatedAt)}
                    </Descriptions.Item>
                )}
            </Descriptions>
        </Drawer>
    );
};
