import React from 'react';
import { Drawer, Descriptions, Tag, Typography, Divider, List, Empty } from 'antd';
import { TagOutlined, CalendarOutlined, BookOutlined, FileTextOutlined } from '@ant-design/icons';
import { ICategory } from '../../../types/backend';

const { Title, Text, Paragraph } = Typography;

interface CategoryViewProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    category: ICategory | null;
}

export const CategoryView: React.FC<CategoryViewProps> = ({ isOpen, setIsOpen, category }) => {
    if (!category) return null;

    const formatDateTime = (dateStr?: string) => {
        if (!dateStr) return '—';
        return new Intl.DateTimeFormat('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        }).format(new Date(dateStr));
    };

    return (
        <Drawer
            title={
                <span style={{ fontSize: 18, fontWeight: 600 }}>
                    <TagOutlined /> Thông tin thể loại
                </span>
            }
            placement="right"
            width={520}
            onClose={() => setIsOpen(false)}
            open={isOpen}
            styles={{ body: { padding: '24px' } }}
        >
            {/* Category Name Header */}
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <div style={{
                    width: 80, height: 80, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 12px',
                }}>
                    <TagOutlined style={{ fontSize: 32, color: '#fff' }} />
                </div>
                <Title level={4} style={{ marginBottom: 4 }}>{category.name}</Title>
                <Tag color="purple">
                    {category.infoBookInCategory?.length || 0} sách
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
                <Descriptions.Item label={<><TagOutlined /> Tên</>}>
                    {category.name}
                </Descriptions.Item>
                <Descriptions.Item label={<><CalendarOutlined /> Ngày tạo</>}>
                    {formatDateTime(category.createdAt)}
                </Descriptions.Item>
                {category.updatedAt && (
                    <Descriptions.Item label={<><CalendarOutlined /> Cập nhật</>}>
                        {formatDateTime(category.updatedAt)}
                    </Descriptions.Item>
                )}
                {category.createdBy && (
                    <Descriptions.Item label="Người tạo">
                        <Text>{category.createdBy}</Text>
                    </Descriptions.Item>
                )}
            </Descriptions>

            {/* Description */}
            <Divider />
            <Title level={5} style={{ marginBottom: 8 }}>
                <FileTextOutlined /> Mô tả
            </Title>
            <Paragraph type="secondary" style={{ whiteSpace: 'pre-wrap' }}>
                {category.description || 'Chưa có mô tả.'}
            </Paragraph>

            {/* Books in Category */}
            <Divider />
            <Title level={5} style={{ marginBottom: 12 }}>
                <BookOutlined /> Danh sách sách ({category.infoBookInCategory?.length || 0})
            </Title>

            {category.infoBookInCategory && category.infoBookInCategory.length > 0 ? (
                <List
                    size="small"
                    bordered
                    dataSource={category.infoBookInCategory}
                    renderItem={(book, index) => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={
                                    <Tag color="geekblue" style={{ minWidth: 28, textAlign: 'center' }}>
                                        {index + 1}
                                    </Tag>
                                }
                                title={<Text strong>{book.title}</Text>}
                            />
                        </List.Item>
                    )}
                />
            ) : (
                <Empty
                    description="Không có sách thuộc thể loại này"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
            )}
        </Drawer>
    );
};
