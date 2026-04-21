import React from 'react';
import { Drawer, Descriptions, Tag, Typography, Divider, Empty, Badge } from 'antd';
import { SafetyCertificateOutlined, CalendarOutlined, ApiOutlined } from '@ant-design/icons';
import { IRole } from '../../../types/backend';

const { Title, Text } = Typography;

interface RoleViewProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    role: IRole | null;
}

const roleColorMap: Record<string, string> = {
    ADMIN: 'red',
    MANAGER: 'blue',
    CUSTOMER: 'green',
    STAFF: 'orange',
};

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
        hour: '2-digit', minute: '2-digit',
    }).format(new Date(dateStr));
};

export const RoleView: React.FC<RoleViewProps> = ({ isOpen, setIsOpen, role }) => {
    if (!role) return null;

    // Group permissions by domain
    const permissionsByDomain = role.permissions?.reduce((acc: Record<string, typeof role.permissions>, perm) => {
        const domain = perm.domain || 'Khác';
        if (!acc[domain]) acc[domain] = [];
        acc[domain].push(perm);
        return acc;
    }, {}) || {};

    return (
        <Drawer
            title={
                <span style={{ fontSize: 18, fontWeight: 600 }}>
                    <SafetyCertificateOutlined /> Thông tin vai trò
                </span>
            }
            placement="right"
            width={600}
            onClose={() => setIsOpen(false)}
            open={isOpen}
            styles={{ body: { padding: '24px' } }}
        >
            {/* Role Header */}
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <Tag color={roleColorMap[role.name] || 'default'} style={{ fontSize: 18, padding: '6px 20px' }}>
                    {role.name}
                </Tag>
                <div style={{ marginTop: 8 }}>
                    <Text type="secondary">{role.description}</Text>
                </div>
            </div>

            <Descriptions
                column={1}
                bordered
                size="small"
                labelStyle={{ fontWeight: 600, width: 130, whiteSpace: 'nowrap' }}
            >
                <Descriptions.Item label={<><SafetyCertificateOutlined /> Vai trò</>}>
                    <Tag color={roleColorMap[role.name] || 'default'}>{role.name}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Mô tả">
                    {role.description || '—'}
                </Descriptions.Item>
                <Descriptions.Item label={<><CalendarOutlined /> Ngày tạo</>}>
                    {formatDateTime(role.createdAt)}
                </Descriptions.Item>
                {role.updatedAt && (
                    <Descriptions.Item label={<><CalendarOutlined /> Cập nhật</>}>
                        {formatDateTime(role.updatedAt)}
                    </Descriptions.Item>
                )}
            </Descriptions>

            {/* Permissions */}
            <Divider />
            <Title level={5} style={{ marginBottom: 12 }}>
                <ApiOutlined /> Quyền hạn{' '}
                <Badge count={role.permissions?.length || 0} style={{ backgroundColor: '#1677ff' }} />
            </Title>

            {Object.keys(permissionsByDomain).length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {Object.entries(permissionsByDomain).map(([domain, perms]) => (
                        <div key={domain} style={{
                            border: '1px solid #f0f0f0', borderRadius: 8, padding: 12,
                            background: '#fafafa',
                        }}>
                            <div style={{ fontWeight: 600, marginBottom: 8 }}>
                                {domain}
                                <Tag style={{ marginLeft: 8 }}>{perms.length}</Tag>
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                {perms.map(perm => (
                                    <Tag
                                        key={perm.id}
                                        color={methodColorMap[perm.method] || 'default'}
                                        style={{ marginBottom: 4 }}
                                    >
                                        <span style={{ fontWeight: 600, marginRight: 4 }}>{perm.method}</span>
                                        <span style={{ fontFamily: 'monospace', fontSize: 11 }}>{perm.apiPath}</span>
                                    </Tag>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <Empty description="Không có quyền nào" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
        </Drawer>
    );
};