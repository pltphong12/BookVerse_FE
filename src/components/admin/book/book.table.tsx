import React from "react";
import { Table, Button, Space, Popconfirm, Tooltip, Tag, Image, Card, Typography } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined, PlusOutlined, BookOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { formatPrice } from "../../../common/formatPrice";
import { showToast, ToastType } from "../../../common/showToast";
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import { deleteBook, ICreateBook, resetDeleteBook } from "../../../redux/slide/book.slice";
import { IAuthorInBook, IBook, ICategoryInBook, IPublisher, ISupplier } from "../../../types/backend";
import { BookForm } from "./book.form";
import { BookSearchAndFilter } from "./book.search_filter";
import { BookView } from "./book.view";

const { Title } = Typography;

interface BookTableProps {
    load: () => Promise<void>;
    page: number;
    totalPage: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    dataSource: IBook[];
    search: string;
    setSearch: React.Dispatch<React.SetStateAction<string>>;
    publishers: IPublisher[];
    suppliers: ISupplier[];
    authors: IAuthorInBook[];
    categories: ICategoryInBook[];
    publisherId: number;
    setPublisherId: React.Dispatch<React.SetStateAction<number>>;
    authorId: number;
    setAuthorId: React.Dispatch<React.SetStateAction<number>>;
    categoryId: number;
    setCategoryId: React.Dispatch<React.SetStateAction<number>>;
    dateFrom: string;
    setDateFrom: React.Dispatch<React.SetStateAction<string>>;
}

export const BookTable: React.FC<BookTableProps> = (props) => {
    const {
        dataSource, load, page, totalPage, setPage,
        search, setSearch, publishers, suppliers, authors, categories,
        dateFrom, setDateFrom,
        publisherId, setPublisherId,
        authorId, setAuthorId,
        categoryId, setCategoryId,
    } = props;

    const [isViewModalOpen, setIsViewModalOpen] = React.useState<boolean>(false);
    const [selectedBook, setSelectedBook] = React.useState<IBook | null>(null);
    const [bookToEdit, setBookToEdit] = React.useState<ICreateBook | undefined>(undefined);
    const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);

    const isDeleteBookSuccess = useAppSelector((state) => state.book.isDeleteBookSuccess);
    const isDeleteBookFailed = useAppSelector((state) => state.book.isDeleteBookFailed);
    const message = useAppSelector((state) => state.book.message);
    const dispatch = useAppDispatch();

    const handleViewBook = (book: IBook) => {
        setSelectedBook(book);
        setIsViewModalOpen(true);
    };

    const executeDeleteBook = (id: number) => {
        dispatch(deleteBook(id));
    };

    React.useEffect(() => {
        if (isDeleteBookSuccess) {
            showToast("Xóa sách thành công", ToastType.SUCCESS);
            dispatch(resetDeleteBook());
            setPage(1);
            load();
        }
        if (isDeleteBookFailed) {
            showToast("Xóa sách không thành công " + message, ToastType.ERROR);
            dispatch(resetDeleteBook());
        }
    }, [isDeleteBookSuccess, isDeleteBookFailed, message, dispatch, setPage, load]);

    const columns: ColumnsType<IBook> = [
        {
            title: 'STT',
            key: 'index',
            width: 60,
            align: 'center',
            render: (_text, _record, index) => (
                <span style={{ fontWeight: 500 }}>
                    {index + (page - 1) * 10 + 1}
                </span>
            ),
        },
        {
            title: 'Sách',
            key: 'title',
            render: (_text, record) => (
                <Space>
                    <Image
                        width={44}
                        height={60}
                        src={
                            record.image
                                ? `${import.meta.env.VITE_BACKEND_URL}/storage/book/${record.image}`
                                : undefined
                        }
                        fallback="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDQiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQ0IiBoZWlnaHQ9IjYwIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iOSIgZmlsbD0iI2JmYmZiZiI+Tm88L3RleHQ+PC9zdmc+"
                        style={{ objectFit: 'cover', borderRadius: 4, flexShrink: 0 }}
                        preview={false}
                    />
                    <div>
                        <div style={{ fontWeight: 600, maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {record.title}
                        </div>
                        <div style={{ fontSize: 12, color: '#8c8c8c' }}>
                            {record.authors?.map(a => a.name).join(', ') || '—'}
                        </div>
                    </div>
                </Space>
            ),
        },
        {
            title: 'NXB',
            key: 'publisher',
            width: 140,
            responsive: ['lg'],
            render: (_text, record) => (
                <span style={{ fontSize: 13 }}>{record.publisher.name}</span>
            ),
        },
        {
            title: 'Thể loại',
            key: 'category',
            width: 120,
            responsive: ['md'],
            render: (_text, record) => (
                <Tag color="blue">{record.category.name}</Tag>
            ),
        },
        {
            title: 'Giá',
            key: 'price',
            width: 130,
            render: (_text, record) => (
                <div>
                    {record.discount > 0 ? (
                        <>
                            <div style={{ fontWeight: 600, color: '#cf1322', fontSize: 13 }}>
                                {formatPrice(record.price * (1 - record.discount / 100))}
                            </div>
                            <div style={{ fontSize: 11, textDecoration: 'line-through', color: '#8c8c8c' }}>
                                {formatPrice(record.price)}
                            </div>
                        </>
                    ) : (
                        <span style={{ fontWeight: 600, fontSize: 13 }}>{formatPrice(record.price)}</span>
                    )}
                </div>
            ),
        },
        {
            title: 'Kho / Bán',
            key: 'stock',
            width: 100,
            align: 'center',
            responsive: ['lg'],
            render: (_text, record) => (
                <Space size={4}>
                    <Tag color="default">{record.quantity}</Tag>
                    <span>/</span>
                    <Tag color="green">{record.sold}</Tag>
                </Space>
            ),
        },
        {
            title: 'Ngày tạo',
            key: 'createdAt',
            width: 110,
            responsive: ['xl'],
            render: (_text, record) => (
                <span style={{ fontSize: 12, color: '#595959' }}>
                    {record.createdAt
                        ? new Intl.DateTimeFormat('vi-VN', {
                            year: 'numeric', month: '2-digit', day: '2-digit',
                        }).format(new Date(record.createdAt))
                        : '—'
                    }
                </span>
            ),
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: 140,
            align: 'center',
            fixed: 'right',
            render: (_text, record) => (
                <Space size="small">
                    <Tooltip title="Xem chi tiết">
                        <Button
                            type="text"
                            icon={<EyeOutlined />}
                            style={{ color: '#1677ff' }}
                            onClick={() => handleViewBook(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            style={{ color: '#faad14' }}
                            onClick={() => {
                                setBookToEdit(record as any);
                                setIsModalOpen(true);
                            }}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Xóa sách"
                        description="Bạn có chắc chắn muốn xóa sách này?"
                        onConfirm={() => executeDeleteBook(record.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                        okButtonProps={{ danger: true }}
                    >
                        <Tooltip title="Xóa">
                            <Button type="text" danger icon={<DeleteOutlined />} />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <>
            <BookSearchAndFilter
                search={search}
                setSearch={setSearch}
                authors={authors}
                categories={categories}
                publishers={publishers}
                dateFrom={dateFrom}
                setDateFrom={setDateFrom}
                publisherId={publisherId}
                setPublisherId={setPublisherId}
                authorId={authorId}
                setAuthorId={setAuthorId}
                categoryId={categoryId}
                setCategoryId={setCategoryId}
                setPage={setPage}
            />

            <Card styles={{ body: { padding: 0 } }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px 24px',
                    borderBottom: '1px solid #f0f0f0',
                }}>
                    <Title level={4} style={{ margin: 0 }}>
                        <BookOutlined /> Quản lý sách
                    </Title>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setIsModalOpen(true);
                            setBookToEdit(undefined);
                        }}
                    >
                        Tạo sách
                    </Button>
                </div>

                <Table
                    columns={columns}
                    dataSource={dataSource}
                    rowKey="id"
                    pagination={{
                        current: page,
                        total: totalPage * 10,
                        pageSize: 10,
                        onChange: (p) => setPage(p),
                        showSizeChanger: false,
                        showTotal: (total) => `Tổng ${total} sách`,
                        style: { padding: '0 16px' },
                    }}
                    size="middle"
                    scroll={{ x: 800 }}
                />
            </Card>

            <BookView
                isOpen={isViewModalOpen}
                setIsOpen={setIsViewModalOpen}
                book={selectedBook}
            />

            <BookForm
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                load={load}
                bookToEdit={bookToEdit}
                publishers={publishers}
                suppliers={suppliers}
                authors={authors}
                categories={categories}
            />
        </>
    );
};