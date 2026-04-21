import React from 'react';
import { Input, DatePicker, Card, Row, Col, Button, Space, Select } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

interface PermissionSearchAndFilterProps {
    searchWithName: string;
    setSearchWithName: React.Dispatch<React.SetStateAction<string>>;
    method: string;
    setMethod: React.Dispatch<React.SetStateAction<string>>;
    domain: string;
    setDomain: React.Dispatch<React.SetStateAction<string>>;
    domains: string[];
    dateFrom: string;
    setDateFrom: React.Dispatch<React.SetStateAction<string>>;
    setPage: React.Dispatch<React.SetStateAction<number>>;
}

const METHOD_OPTIONS = [
    { value: 'GET', label: 'GET' },
    { value: 'POST', label: 'POST' },
    { value: 'PUT', label: 'PUT' },
    { value: 'DELETE', label: 'DELETE' },
];

export const PermissionSearchAndFilter: React.FC<PermissionSearchAndFilterProps> = ({
    searchWithName, setSearchWithName,
    method, setMethod,
    domain, setDomain,
    domains,
    dateFrom, setDateFrom,
    setPage,
}) => {
    const handleReset = () => {
        setSearchWithName('');
        setMethod('');
        setDomain('');
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
                <Col xs={24} sm={12} md={6}>
                    <Input
                        placeholder="Tìm theo tên quyền hạn"
                        prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                        value={searchWithName}
                        onChange={(e) => {
                            setSearchWithName(e.target.value);
                            setPage(1);
                        }}
                        allowClear
                    />
                </Col>
                <Col xs={24} sm={12} md={4}>
                    <Select
                        placeholder="Phương thức"
                        style={{ width: '100%' }}
                        value={method || undefined}
                        onChange={(val) => { setMethod(val || ''); setPage(1); }}
                        allowClear
                        options={METHOD_OPTIONS}
                    />
                </Col>
                <Col xs={24} sm={12} md={5}>
                    <Select
                        placeholder="Domain"
                        style={{ width: '100%' }}
                        value={domain || undefined}
                        onChange={(val) => { setDomain(val || ''); setPage(1); }}
                        allowClear
                        showSearch
                        options={domains.map(d => ({ value: d, label: d }))}
                    />
                </Col>
                <Col xs={24} sm={12} md={5}>
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
                <Col xs={24} sm={12} md={4}>
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
