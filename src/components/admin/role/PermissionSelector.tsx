import React, { useState } from 'react';
import { Checkbox, Tag, Collapse, Empty, Spin, Badge } from 'antd';
import { IPermission } from '../../../types/backend';

interface PermissionSelectorProps {
    permissionsByDomain: Record<string, IPermission[]>;
    onPermissionToggle: (permission: IPermission) => void;
    onDomainToggle: (domain: string) => void;
    isPermissionSelected: (permissionId: number) => boolean;
    isDomainFullySelected: (domain: string) => boolean;
    isDomainPartiallySelected: (domain: string) => boolean;
}

const methodColorMap: Record<string, string> = {
    GET: 'blue',
    POST: 'green',
    PUT: 'orange',
    DELETE: 'red',
    PATCH: 'purple',
};

export const PermissionSelector: React.FC<PermissionSelectorProps> = ({
    permissionsByDomain,
    onPermissionToggle,
    onDomainToggle,
    isPermissionSelected,
    isDomainFullySelected,
    isDomainPartiallySelected,
}) => {
    const domains = Object.keys(permissionsByDomain);

    if (domains.length === 0) {
        return (
            <div style={{
                border: '1px solid #f0f0f0', borderRadius: 8,
                padding: '32px 0', textAlign: 'center',
            }}>
                <Spin />
                <div style={{ color: '#8c8c8c', marginTop: 8 }}>Đang tải danh sách quyền hạn...</div>
            </div>
        );
    }

    const [activeKeys, setActiveKeys] = useState<string[]>(domains);

    const collapseItems = domains.map((domain) => {
        const permissions = permissionsByDomain[domain];
        const isFullySelected = isDomainFullySelected(domain);
        const isPartially = isDomainPartiallySelected(domain);

        return {
            key: domain,
            label: (
                <div
                    style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <Checkbox
                        checked={isFullySelected}
                        indeterminate={isPartially}
                        onChange={(e) => {
                            e.stopPropagation();
                            onDomainToggle(domain);
                        }}
                    />
                    <span style={{ fontWeight: 600 }}>{domain}</span>
                    <Badge
                        count={`${permissions.length} quyền`}
                        style={{ backgroundColor: '#8c8c8c', fontSize: 11 }}
                    />
                </div>
            ),
            children: (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: 8,
                }}>
                    {permissions.map((permission) => {
                        const selected = isPermissionSelected(permission.id);
                        return (
                            <div
                                key={permission.id}
                                onClick={() => onPermissionToggle(permission)}
                                style={{
                                    border: `2px solid ${selected ? '#1677ff' : '#f0f0f0'}`,
                                    borderRadius: 8,
                                    padding: '8px 12px',
                                    cursor: 'pointer',
                                    background: selected ? '#e6f4ff' : '#fff',
                                    transition: 'all 0.2s',
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                                    <Checkbox
                                        checked={selected}
                                        style={{ marginTop: 2 }}
                                        onChange={() => onPermissionToggle(permission)}
                                    />
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ marginBottom: 4 }}>
                                            <Tag color={methodColorMap[permission.method] || 'default'} style={{ fontSize: 11 }}>
                                                {permission.method}
                                            </Tag>
                                        </div>
                                        <div style={{
                                            fontSize: 13, fontWeight: 500,
                                            overflow: 'hidden', textOverflow: 'ellipsis',
                                            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                                        }}>
                                            {permission.name}
                                        </div>
                                        <div style={{
                                            fontSize: 11, color: '#8c8c8c', fontFamily: 'monospace',
                                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                        }}>
                                            {permission.apiPath}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ),
        };
    });

    return (
        <div style={{
            border: '1px solid #f0f0f0', borderRadius: 8,
            maxHeight: 400, overflowY: 'auto',
        }}>
            <Collapse
                activeKey={activeKeys}
                onChange={(keys) => setActiveKeys(keys as string[])}
                items={collapseItems}
                size="small"
                ghost
            />
        </div>
    );
};
