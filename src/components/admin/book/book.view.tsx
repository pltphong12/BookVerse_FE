import React from 'react';
import { Drawer, Descriptions, Image, Tag, Typography, Divider, Space, Badge } from 'antd';
import {
    BookOutlined, CalendarOutlined, TagOutlined,
    DollarOutlined, InboxOutlined, PercentageOutlined, UserOutlined
} from '@ant-design/icons';
import { IBook } from '../../../types/backend';
import { formatPrice } from '../../../common/formatPrice';

const { Title, Text, Paragraph } = Typography;

interface BookViewProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    book: IBook | null;
}

export const BookView: React.FC<BookViewProps> = ({ isOpen, setIsOpen, book }) => {
    if (!book) return null;

    const imageUrl = book.image
        ? `${import.meta.env.VITE_BACKEND_URL}/storage/book/${book.image}`
        : undefined;

    const formatDateTime = (dateStr?: string) => {
        if (!dateStr) return '—';
        return new Intl.DateTimeFormat('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        }).format(new Date(dateStr));
    };

    const discountedPrice = book.discount > 0
        ? book.price * (1 - book.discount / 100)
        : book.price;

    return (
        <Drawer
            title={
                <span style={{ fontSize: 18, fontWeight: 600 }}>
                    <BookOutlined /> Thông tin sách
                </span>
            }
            placement="right"
            width={640}
            onClose={() => setIsOpen(false)}
            open={isOpen}
            styles={{ body: { padding: '24px' } }}
        >
            {/* Book Cover + Title Header */}
            <div style={{ display: 'flex', gap: 20, marginBottom: 24 }}>
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={book.title}
                        width={140}
                        height={200}
                        style={{
                            objectFit: 'cover',
                            borderRadius: 8,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            flexShrink: 0,
                        }}
                        fallback="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTQwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjEyIiBmaWxsPSIjYmZiZmJmIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4="
                    />
                ) : (
                    <div style={{
                        width: 140, height: 200, borderRadius: 8, flexShrink: 0,
                        background: 'linear-gradient(135deg, #1e3a5f, #2d5a87)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <BookOutlined style={{ fontSize: 48, color: '#fff', opacity: 0.5 }} />
                    </div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <Title level={4} style={{ marginBottom: 8 }}>{book.title}</Title>
                    <Space wrap size={[4, 8]}>
                        <Tag icon={<TagOutlined />} color="blue">{book.category.name}</Tag>
                        <Tag color="cyan">{book.coverFormat}</Tag>
                        {book.discount > 0 && (
                            <Tag color="red">-{book.discount}%</Tag>
                        )}
                    </Space>
                    <div style={{ marginTop: 12 }}>
                        {book.discount > 0 ? (
                            <Space align="baseline">
                                <Text strong style={{ fontSize: 22, color: '#cf1322' }}>
                                    {formatPrice(discountedPrice)}
                                </Text>
                                <Text delete type="secondary" style={{ fontSize: 14 }}>
                                    {formatPrice(book.price)}
                                </Text>
                            </Space>
                        ) : (
                            <Text strong style={{ fontSize: 22, color: '#1677ff' }}>
                                {formatPrice(book.price)}
                            </Text>
                        )}
                    </div>
                </div>
            </div>

            <Divider />

            {/* Main Details — single column to avoid narrow cells */}
            <Descriptions
                column={1}
                bordered
                size="small"
                labelStyle={{ fontWeight: 600, width: 130, whiteSpace: 'nowrap' }}
                contentStyle={{ wordBreak: 'break-word' }}
            >
                <Descriptions.Item label={<><BookOutlined /> NXB</>}>
                    {book.publisher.name}
                </Descriptions.Item>
                <Descriptions.Item label={<><InboxOutlined /> NCC</>}>
                    {book.supplier?.name || '—'}
                </Descriptions.Item>
                <Descriptions.Item label={<><UserOutlined /> Tác giả</>}>
                    <Space wrap>
                        {book.authors?.map(a => (
                            <Tag key={a.id} color="geekblue">{a.name}</Tag>
                        ))}
                        {(!book.authors || book.authors.length === 0) && <Text type="secondary">Chưa có</Text>}
                    </Space>
                </Descriptions.Item>
                <Descriptions.Item label={<><DollarOutlined /> Giá gốc</>}>
                    {formatPrice(book.price)}
                </Descriptions.Item>
                <Descriptions.Item label={<><PercentageOutlined /> Giảm giá</>}>
                    <Badge
                        count={`${book.discount}%`}
                        style={{ backgroundColor: book.discount > 0 ? '#ff4d4f' : '#d9d9d9' }}
                    />
                </Descriptions.Item>
                <Descriptions.Item label="Số lượng">
                    <Text strong>{book.quantity}</Text> cuốn
                </Descriptions.Item>
                <Descriptions.Item label="Đã bán">
                    <Text strong type="success">{book.sold}</Text> cuốn
                </Descriptions.Item>
            </Descriptions>

            <div style={{ height: 16 }} />

            {/* Secondary details */}
            <Descriptions
                column={2}
                bordered
                size="small"
                labelStyle={{ fontWeight: 600, whiteSpace: 'nowrap' }}
            >
                <Descriptions.Item label="Năm XB">{book.publishYear}</Descriptions.Item>
                <Descriptions.Item label="Trọng lượng">{book.weight}g</Descriptions.Item>
                <Descriptions.Item label="Kích thước">{book.dimensions || '—'}</Descriptions.Item>
                <Descriptions.Item label="Số trang">{book.numberOfPages}</Descriptions.Item>
            </Descriptions>

            <div style={{ height: 16 }} />

            <Descriptions
                column={1}
                bordered
                size="small"
                labelStyle={{ fontWeight: 600, width: 130, whiteSpace: 'nowrap' }}
            >
                <Descriptions.Item label={<><CalendarOutlined /> Ngày tạo</>}>
                    {formatDateTime(book.createdAt)}
                </Descriptions.Item>
                {book.updatedAt && (
                    <Descriptions.Item label={<><CalendarOutlined /> Cập nhật</>}>
                        {formatDateTime(book.updatedAt)}
                    </Descriptions.Item>
                )}
            </Descriptions>

            {/* Book Images Gallery */}
            {book.images && book.images.length > 1 && (
                <>
                    <Divider />
                    <Title level={5} style={{ marginBottom: 12 }}>Ảnh sách</Title>
                    <Image.PreviewGroup>
                        <Space wrap>
                            {book.images.map((img) => (
                                <Image
                                    key={img.id}
                                    src={`${import.meta.env.VITE_BACKEND_URL}/storage/book/${img.relativePath}`}
                                    width={80}
                                    height={80}
                                    style={{
                                        objectFit: 'cover',
                                        borderRadius: 6,
                                        border: img.primary ? '2px solid #faad14' : '1px solid #f0f0f0',
                                    }}
                                />
                            ))}
                        </Space>
                    </Image.PreviewGroup>
                </>
            )}

            {/* Description */}
            <Divider />
            <Title level={5} style={{ marginBottom: 8 }}>Mô tả</Title>
            <Paragraph
                type="secondary"
                style={{ whiteSpace: 'pre-wrap', maxHeight: 200, overflow: 'auto' }}
            >
                {book.description || 'Chưa có mô tả cho cuốn sách này.'}
            </Paragraph>
        </Drawer>
    );
};
