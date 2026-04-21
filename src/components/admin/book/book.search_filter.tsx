import React from 'react';
import { Input, DatePicker, Card, Row, Col, Button, Space, Select } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { IAuthorInBook, ICategoryInBook, IPublisher } from '../../../types/backend';
import dayjs from 'dayjs';

interface BookSearchAndFilterProps {
    search: string;
    setSearch: React.Dispatch<React.SetStateAction<string>>;
    authors: IAuthorInBook[];
    categories: ICategoryInBook[];
    publishers: IPublisher[];
    publisherId: number;
    setPublisherId: React.Dispatch<React.SetStateAction<number>>;
    authorId: number;
    setAuthorId: React.Dispatch<React.SetStateAction<number>>;
    categoryId: number;
    setCategoryId: React.Dispatch<React.SetStateAction<number>>;
    dateFrom: string;
    setDateFrom: React.Dispatch<React.SetStateAction<string>>;
    setPage: React.Dispatch<React.SetStateAction<number>>;
}

export const BookSearchAndFilter: React.FC<BookSearchAndFilterProps> = ({
    search, setSearch,
    authors, categories, publishers,
    publisherId, setPublisherId,
    authorId, setAuthorId,
    categoryId, setCategoryId,
    dateFrom, setDateFrom,
    setPage,
}) => {
    const handleReset = () => {
        setSearch('');
        setPublisherId(0);
        setAuthorId(0);
        setCategoryId(0);
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
                        placeholder="Tìm theo tên sách"
                        prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        allowClear
                    />
                </Col>
                <Col xs={24} sm={12} md={4}>
                    <Select
                        placeholder="Nhà xuất bản"
                        style={{ width: '100%' }}
                        value={publisherId || undefined}
                        onChange={(val) => {
                            setPublisherId(val || 0);
                            setPage(1);
                        }}
                        allowClear
                        showSearch
                        optionFilterProp="label"
                        options={publishers.map(p => ({ value: p.id, label: p.name }))}
                    />
                </Col>
                <Col xs={24} sm={12} md={4}>
                    <Select
                        placeholder="Tác giả"
                        style={{ width: '100%' }}
                        value={authorId || undefined}
                        onChange={(val) => {
                            setAuthorId(val || 0);
                            setPage(1);
                        }}
                        allowClear
                        showSearch
                        optionFilterProp="label"
                        options={authors.map(a => ({ value: a.id, label: a.name }))}
                    />
                </Col>
                <Col xs={24} sm={12} md={4}>
                    <Select
                        placeholder="Thể loại"
                        style={{ width: '100%' }}
                        value={categoryId || undefined}
                        onChange={(val) => {
                            setCategoryId(val || 0);
                            setPage(1);
                        }}
                        allowClear
                        showSearch
                        optionFilterProp="label"
                        options={categories.map(c => ({ value: c.id, label: c.name }))}
                    />
                </Col>
                <Col xs={24} sm={12} md={4}>
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
                <Col xs={24} sm={12} md={2}>
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
