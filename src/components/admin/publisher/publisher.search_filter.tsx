import React from 'react';
import { Input, DatePicker, Card, Row, Col, Button, Space } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useDebouncedCallback } from 'use-debounce';

interface PublisherSearchAndFilterProps {
    search: string;
    setSearch: React.Dispatch<React.SetStateAction<string>>;
    dateFrom: string;
    setDateFrom: React.Dispatch<React.SetStateAction<string>>;
    setPage: React.Dispatch<React.SetStateAction<number>>;
}

export const PublisherSearchAndFilter: React.FC<PublisherSearchAndFilterProps> = ({
    search, setSearch,
    dateFrom, setDateFrom,
    setPage,
}) => {
    const [localSearch, setLocalSearch] = React.useState(search);

    React.useEffect(() => {
        setLocalSearch(search);
    }, [search]);

    const debouncedSetSearch = useDebouncedCallback((val: string) => {
        setSearch(val);
        setPage(1);
    }, 500);

    const handleReset = () => {
        debouncedSetSearch.cancel();
        setLocalSearch('');
        setSearch('');
        setDateFrom('');
        setPage(1);
    };

    return (
        <Card
            size="small"
            style={{ marginBottom: 16, width: '100%' }}
            styles={{ body: { padding: '16px' } }}
        >
            <Row gutter={[16, 16]} align="middle">
                <Col xs={24} sm={12} md={8}>
                    <Input
                        placeholder="Tìm theo tên nhà xuất bản"
                        prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                        value={localSearch}
                        onChange={(e) => {
                            const val = e.target.value;
                            setLocalSearch(val);
                            debouncedSetSearch(val);
                        }}
                        allowClear
                    />
                </Col>
                <Col xs={24} sm={12} md={8}>
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
                <Col xs={24} sm={12} md={8}>
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
