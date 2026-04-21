import React from 'react';
import { Drawer, Descriptions, Tag, Typography } from 'antd';
import { ApiOutlined, CalendarOutlined } from '@ant-design/icons';
import { IPermission } from '../../../../types/backend';

const { Text } = Typography;

interface PermissionViewProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    permission: IPermission | null;
}

const methodColorMap: Record<string, string> = {
    GET: 'blue',
    POST: 'green',
    PUT: 'orange',
    DELETE: 'red',
    PATCH: 'purple',
};

const formatDateTime = (dateStr?: string) => {
    if (!dateStr) return '—';
    return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
    }).format(new Date(dateStr));
};

export const PermissionView: React.FC<PermissionViewProps> = ({ isOpen, setIsOpen, permission }) => {
    if (!permission) return null;

    return (
        <Drawer
            title={
                <span style={{ fontSize: 18, fontWeight: 600 }}>
                    <ApiOutlined /> Thông tin quyền hạn
                </span>
            }
            placement="right"
            width={480}
            onClose={() => setIsOpen(false)}
            open={isOpen}
            styles={{ body: { padding: '24px' } }}
        >
            {/* Method + API Path Header */}
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <Tag
                    color={methodColorMap[permission.method] || 'default'}
                    style={{ fontSize: 16, padding: '4px 16px' }}
                >
                    {permission.method}
                </Tag>
                <div style={{ marginTop: 8 }}>
                    <Text code style={{ fontSize: 13 }}>{permission.apiPath}</Text>
                </div>
            </div>

            <Descriptions
                column={1}
                bordered
                size="small"
                labelStyle={{ fontWeight: 600, width: 130, whiteSpace: 'nowrap' }}
            >
                <Descriptions.Item label="Tên quyền">
                    {permission.name}
                </Descriptions.Item>
                <Descriptions.Item label="Đường dẫn">
                    <Text code>{permission.apiPath}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Domain">
                    <Tag>{permission.domain}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Phương thức">
                    <Tag color={methodColorMap[permission.method] || 'default'}>
                        {permission.method}
                    </Tag>
                </Descriptions.Item>
                <Descriptions.Item label={<><CalendarOutlined /> Ngày tạo</>}>
                    {formatDateTime(permission.createdAt)}
                </Descriptions.Item>
                {permission.updatedAt && (
                    <Descriptions.Item label={<><CalendarOutlined /> Cập nhật</>}>
                        {formatDateTime(permission.updatedAt)}
                    </Descriptions.Item>
                )}
            </Descriptions>
        </Drawer>
    );
};
