import React from 'react';
import { Drawer, Descriptions, Image, Tag, Typography, Divider, Empty, Avatar, List } from 'antd';
import { BookOutlined, CalendarOutlined, EnvironmentOutlined, UserOutlined } from '@ant-design/icons';
import { IAuthor } from '../../../types/backend';

const { Title, Text } = Typography;

interface AuthorViewProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    author: IAuthor | null;
}

export const AuthorView: React.FC<AuthorViewProps> = ({ isOpen, setIsOpen, author }) => {
    if (!author) return null;

    const avatarUrl = author.avatar
        ? `${import.meta.env.VITE_BACKEND_URL}/storage/author/${author.avatar}`
        : undefined;

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return '—';
        return new Intl.DateTimeFormat('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }).format(new Date(dateStr));
    };

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
                    Thông tin tác giả
                </span>
            }
            placement="right"
            width={560}
            onClose={() => setIsOpen(false)}
            open={isOpen}
            styles={{
                body: { padding: '24px' },
            }}
        >
            {/* Author Avatar & Name Header */}
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
                {avatarUrl ? (
                    <Image
                        src={avatarUrl}
                        alt={author.name}
                        width={160}
                        height={200}
                        style={{
                            objectFit: 'cover',
                            borderRadius: 12,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        }}
                        fallback="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTYwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjE0IiBmaWxsPSIjYmZiZmJmIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4="
                    />
                ) : (
                    <Avatar
                        size={120}
                        icon={<UserOutlined />}
                        style={{
                            backgroundColor: '#f0f5ff',
                            color: '#1677ff',
                            fontSize: 48,
                        }}
                    />
                )}
                <Title level={4} style={{ marginTop: 12, marginBottom: 4 }}>
                    {author.name}
                </Title>
                <Tag icon={<EnvironmentOutlined />} color="blue">
                    {author.nationality}
                </Tag>
            </div>

            <Divider />

            {/* Author Details */}
            <Descriptions
                column={1}
                bordered
                size="small"
                labelStyle={{ fontWeight: 600, width: 140 }}
            >
                <Descriptions.Item label={<><UserOutlined /> Họ và tên</>}>
                    {author.name}
                </Descriptions.Item>
                <Descriptions.Item label={<><EnvironmentOutlined /> Quê quán</>}>
                    {author.nationality}
                </Descriptions.Item>
                <Descriptions.Item label={<><CalendarOutlined /> Ngày sinh</>}>
                    {formatDate(author.birthday)}
                </Descriptions.Item>
                <Descriptions.Item label={<><CalendarOutlined /> Ngày tạo</>}>
                    {formatDateTime(author.createdAt)}
                </Descriptions.Item>
                {author.updatedAt && (
                    <Descriptions.Item label={<><CalendarOutlined /> Cập nhật</>}>
                        {formatDateTime(author.updatedAt)}
                    </Descriptions.Item>
                )}
                {author.createdBy && (
                    <Descriptions.Item label="Người tạo">
                        <Text>{author.createdBy}</Text>
                    </Descriptions.Item>
                )}
            </Descriptions>

            <Divider />

            {/* Author Books */}
            <Title level={5} style={{ marginBottom: 12 }}>
                <BookOutlined /> Danh sách sách ({author.books?.length || 0})
            </Title>

            {author.books && author.books.length > 0 ? (
                <List
                    size="small"
                    bordered
                    dataSource={author.books}
                    renderItem={(book, index) => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={
                                    <Tag color="geekblue" style={{ minWidth: 28, textAlign: 'center' }}>
                                        {index + 1}
                                    </Tag>
                                }
                                title={
                                    <Text strong>{book.title}</Text>
                                }
                                description={
                                    book.publisher?.name
                                        ? `NXB: ${book.publisher.name}`
                                        : undefined
                                }
                            />
                        </List.Item>
                    )}
                />
            ) : (
                <Empty
                    description="Chưa có sách nào"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
            )}
        </Drawer>
    );
};
