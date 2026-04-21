import React from 'react';
import { Input, DatePicker, Card, Row, Col, Button, Space, Select } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { IRole } from '../../../types/backend';
import dayjs from 'dayjs';

const roleColorMap: Record<string, string> = {
    ADMIN: '🔴', MANAGER: '🔵', CUSTOMER: '🟢', STAFF: '🟠',
};

interface UserSearchAndFilterProps {
    search: string;
    setSearch: React.Dispatch<React.SetStateAction<string>>;
    roles: IRole[];
    roleId: number;
    setRoleId: React.Dispatch<React.SetStateAction<number>>;
    dateFrom: string;
    setDateFrom: React.Dispatch<React.SetStateAction<string>>;
    setPage: React.Dispatch<React.SetStateAction<number>>;
}

export const UserSearchAndFilter: React.FC<UserSearchAndFilterProps> = ({
    search, setSearch,
    roles, roleId, setRoleId,
    dateFrom, setDateFrom,
    setPage,
}) => {
    const handleReset = () => {
        setSearch('');
        setRoleId(0);
        setDateFrom('');
        setPage(1);
    };

    return (
        <Card
            size="small"
            style={{ marginBottom: 16, width: '100%' }}
            styles={{ body: { padding: '16px' } }}
        >
            <Row gutter={[12, 12]} align="middle">
                <Col xs={24} sm={12} md={7}>
                    <Input
                        placeholder="Tìm theo email hoặc tên"
                        prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        allowClear
                    />
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Select
                        placeholder="Tất cả vai trò"
                        style={{ width: '100%' }}
                        value={roleId || undefined}
                        onChange={(val) => { setRoleId(val || 0); setPage(1); }}
                        allowClear
                        options={roles.map(r => ({
                            value: r.id,
                            label: `${roleColorMap[r.name] || '⚪'} ${r.name}`,
                        }))}
                    />
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <DatePicker
                        placeholder="Từ ngày tạo"
                        style={{ width: '100%' }}
                        value={dateFrom ? dayjs(dateFrom) : null}
                        onChange={(_date, dateString) => {
                            setDateFrom(dateString as string);
                            setPage(1);
                        }}
                        format="YYYY-MM-DD"
                    />
                </Col>
                <Col xs={24} sm={12} md={5}>
                    <Space>
                        <Button icon={<ReloadOutlined />} onClick={handleReset}>
                            Đặt lại
                        </Button>
                    </Space>
                </Col>
            </Row>
        </Card>
    );
};
