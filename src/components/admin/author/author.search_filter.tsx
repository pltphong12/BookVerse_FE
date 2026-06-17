import React from 'react';
import { Input, DatePicker, Card, Row, Col, Button, Space } from 'antd';
import { SearchOutlined, FilterOutlined, ReloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useDebouncedCallback } from 'use-debounce';

interface AuthorSearchAndFilterProps {
    searchWithName: string;
    setSearchWithName: React.Dispatch<React.SetStateAction<string>>;
    searchWithNationality: string;
    setSearchWithNationality: React.Dispatch<React.SetStateAction<string>>;
    dateFrom: string;
    setDateFrom: React.Dispatch<React.SetStateAction<string>>;
    setPage: React.Dispatch<React.SetStateAction<number>>;
}

export const AuthorSearchAndFilter: React.FC<AuthorSearchAndFilterProps> = ({
    searchWithName,
    setSearchWithName,
    searchWithNationality,
    setSearchWithNationality,
    dateFrom,
    setDateFrom,
    setPage,
}) => {
    const [localSearchWithName, setLocalSearchWithName] = React.useState(searchWithName);
    const [localSearchWithNationality, setLocalSearchWithNationality] = React.useState(searchWithNationality);

    React.useEffect(() => {
        setLocalSearchWithName(searchWithName);
    }, [searchWithName]);

    React.useEffect(() => {
        setLocalSearchWithNationality(searchWithNationality);
    }, [searchWithNationality]);

    const debouncedSetSearchWithName = useDebouncedCallback((val: string) => {
        setSearchWithName(val);
        setPage(1);
    }, 500);

    const debouncedSetSearchWithNationality = useDebouncedCallback((val: string) => {
        setSearchWithNationality(val);
        setPage(1);
    }, 500);

    const handleReset = () => {
        debouncedSetSearchWithName.cancel();
        debouncedSetSearchWithNationality.cancel();
        setLocalSearchWithName('');
        setLocalSearchWithNationality('');
        setSearchWithName('');
        setSearchWithNationality('');
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
                <Col xs={24} sm={12} md={8} lg={6}>
                    <Input
                        placeholder="Tìm theo tên tác giả"
                        prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                        value={localSearchWithName}
                        onChange={(e) => {
                            const val = e.target.value;
                            setLocalSearchWithName(val);
                            debouncedSetSearchWithName(val);
                        }}
                        allowClear
                    />
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                    <Input
                        placeholder="Tìm theo quê quán"
                        prefix={<FilterOutlined style={{ color: '#bfbfbf' }} />}
                        value={localSearchWithNationality}
                        onChange={(e) => {
                            const val = e.target.value;
                            setLocalSearchWithNationality(val);
                            debouncedSetSearchWithNationality(val);
                        }}
                        allowClear
                    />
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
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
                <Col xs={24} sm={12} md={8} lg={6}>
                    <Space>
                        <Button
                            icon={<ReloadOutlined />}
                            onClick={handleReset}
                        >
                            Đặt lại
                        </Button>
                    </Space>
                </Col>
            </Row>
        </Card>
    );
};
