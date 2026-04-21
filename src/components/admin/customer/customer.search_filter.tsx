import React from 'react';
import { Input, DatePicker, Card, Row, Col, Button, Space, Select } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

interface CustomerSearchAndFilterProps {
    search: string;
    setSearch: React.Dispatch<React.SetStateAction<string>>;
    customerLevel: string;
    setCustomerLevel: React.Dispatch<React.SetStateAction<string>>;
    dateFrom: string;
    setDateFrom: React.Dispatch<React.SetStateAction<string>>;
    setPage: React.Dispatch<React.SetStateAction<number>>;
}

const customerLevelOptions = [
    { value: 'BRONZE', label: 'Đồng' },
    { value: 'SILVER', label: 'Bạc' },
    { value: 'GOLD', label: 'Vàng' },
    { value: 'PLATINUM', label: 'Bạch kim' },
    { value: 'DIAMOND', label: 'Kim cương' },
];

export const CustomerSearchAndFilter: React.FC<CustomerSearchAndFilterProps> = ({
    search, setSearch,
    customerLevel, setCustomerLevel,
    dateFrom, setDateFrom,
    setPage,
}) => {
    const handleReset = () => {
        setSearch('');
        setCustomerLevel('');
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
                        placeholder="Tìm theo CCCD"
                        prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        allowClear
                    />
                </Col>
                <Col xs={24} sm={12} md={5}>
                    <Select
                        placeholder="Cấp bậc khách hàng"
                        style={{ width: '100%' }}
                        value={customerLevel || undefined}
                        onChange={(val) => {
                            setCustomerLevel(val || '');
                            setPage(1);
                        }}
                        allowClear
                        options={customerLevelOptions}
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
                <Col xs={24} sm={12} md={3}>
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
