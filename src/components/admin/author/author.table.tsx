import React from "react";
import { Table, Button, Space, Popconfirm, Tooltip, Avatar, Typography, Card, Tag } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { showToast, ToastType } from "../../../common/showToast";
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import { deleteAuthor, ICreateAuthor, resetDeleteAuthor } from "../../../redux/slide/author.slice";
import { IAuthor } from "../../../types/backend";
import { AuthorForm } from "./author.form";
import { AuthorSearchAndFilter } from "./author.search_filter";
import { AuthorView } from "./author.view";

const { Title } = Typography;

interface AuthorTableProps {
    load: () => Promise<void>;
    page: number;
    totalPage: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    dataSource: IAuthor[];
    searchWithName: string;
    setSearchWithName: React.Dispatch<React.SetStateAction<string>>;
    searchWithNationality: string;
    setSearchWithNationality: React.Dispatch<React.SetStateAction<string>>;
    dateFrom: string;
    setDateFrom: React.Dispatch<React.SetStateAction<string>>;
}

export const AuthorTable: React.FC<AuthorTableProps> = ({
    load, page, totalPage, setPage, dataSource,
    searchWithName, setSearchWithName,
    searchWithNationality, setSearchWithNationality,
    dateFrom, setDateFrom,
}) => {
    const [isViewModalOpen, setIsViewModalOpen] = React.useState<boolean>(false);
    const [selectedAuthor, setSelectedAuthor] = React.useState<IAuthor | null>(null);
    const [authorToEdit, setAuthorToEdit] = React.useState<ICreateAuthor | undefined>(undefined);
    const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);

    const isDeleteAuthorSuccess = useAppSelector((state) => state.author.isDeleteAuthorSuccess);
    const isDeleteAuthorFailed = useAppSelector((state) => state.author.isDeleteAuthorFailed);
    const message = useAppSelector((state) => state.author.message);
    const dispatch = useAppDispatch();

    const handleViewAuthor = (author: IAuthor) => {
        setSelectedAuthor(author);
        setIsViewModalOpen(true);
    };

    const executeDeleteAuthor = (id: number) => {
        dispatch(deleteAuthor(id));
    };

    React.useEffect(() => {
        if (isDeleteAuthorSuccess) {
            showToast("Xóa tác giả thành công", ToastType.SUCCESS);
            dispatch(resetDeleteAuthor());
            setPage(1);
            load();
        }
        if (isDeleteAuthorFailed) {
            showToast("Xóa tác giả không thành công " + message, ToastType.ERROR);
            dispatch(resetDeleteAuthor());
        }
    }, [isDeleteAuthorSuccess, isDeleteAuthorFailed, message, dispatch, setPage, load]);

    // Ant Design Table columns
    const columns: ColumnsType<IAuthor> = [
        {
            title: 'STT',
            key: 'index',
            width: 70,
            align: 'center',
            render: (_text, _record, index) => (
                <span style={{ fontWeight: 500 }}>
                    {index + (page - 1) * 10 + 1}
                </span>
            ),
        },
        {
            title: 'Tác giả',
            key: 'name',
            render: (_text, record) => (
                <Space>
                    <Avatar
                        size={40}
                        src={
                            record.avatar
                                ? `${import.meta.env.VITE_BACKEND_URL}/storage/author/${record.avatar}`
                                : undefined
                        }
                        icon={!record.avatar ? <UserOutlined /> : undefined}
                        style={{
                            backgroundColor: record.avatar ? undefined : '#f0f5ff',
                            color: record.avatar ? undefined : '#1677ff',
                        }}
                    />
                    <div>
                        <div style={{ fontWeight: 600 }}>{record.name}</div>
                        <div style={{ fontSize: 12, color: '#8c8c8c' }}>{record.nationality}</div>
                    </div>
                </Space>
            ),
        },
        {
            title: 'Quê quán',
            dataIndex: 'nationality',
            key: 'nationality',
            responsive: ['md'],
            render: (val: string) => (
                <Tag color="blue">{val}</Tag>
            ),
        },
        {
            title: 'Số sách',
            key: 'books',
            width: 100,
            align: 'center',
            responsive: ['lg'],
            render: (_text, record) => (
                <Tag color="geekblue">
                    {record.books?.length || 0} sách
                </Tag>
            ),
        },
        {
            title: 'Ngày tạo',
            key: 'createdAt',
            width: 140,
            responsive: ['lg'],
            render: (_text, record) => (
                <span style={{ fontSize: 13, color: '#595959' }}>
                    {record.createdAt
                        ? new Intl.DateTimeFormat('vi-VN', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                        }).format(new Date(record.createdAt))
                        : '—'
                    }
                </span>
            ),
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: 150,
            align: 'center',
            render: (_text, record) => (
                <Space size="small">
                    <Tooltip title="Xem chi tiết">
                        <Button
                            type="text"
                            icon={<EyeOutlined />}
                            style={{ color: '#1677ff' }}
                            onClick={() => handleViewAuthor(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            style={{ color: '#faad14' }}
                            onClick={() => {
                                setAuthorToEdit(record);
                                setIsModalOpen(true);
                            }}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Xóa tác giả"
                        description="Bạn có chắc chắn muốn xóa tác giả này?"
                        onConfirm={() => executeDeleteAuthor(record.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                        okButtonProps={{ danger: true }}
                    >
                        <Tooltip title="Xóa">
                            <Button
                                type="text"
                                danger
                                icon={<DeleteOutlined />}
                            />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <>
            {/* Search & Filter */}
            <AuthorSearchAndFilter
                searchWithName={searchWithName}
                setSearchWithName={setSearchWithName}
                searchWithNationality={searchWithNationality}
                setSearchWithNationality={setSearchWithNationality}
                dateFrom={dateFrom}
                setDateFrom={setDateFrom}
                setPage={setPage}
            />

            {/* Header */}
            <Card
                styles={{
                    body: { padding: 0 },
                }}
            >
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px 24px',
                    borderBottom: '1px solid #f0f0f0',
                }}>
                    <Title level={4} style={{ margin: 0 }}>
                        <UserOutlined /> Quản lý tác giả
                    </Title>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setIsModalOpen(true);
                            setAuthorToEdit(undefined);
                        }}
                    >
                        Tạo tác giả
                    </Button>
                </div>

                {/* Table */}
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
                        showTotal: (total) => `Tổng ${total} tác giả`,
                        style: { padding: '0 16px' },
                    }}
                    size="middle"
                    scroll={{ x: 600 }}
                />
            </Card>

            {/* View Drawer */}
            <AuthorView
                isOpen={isViewModalOpen}
                setIsOpen={setIsViewModalOpen}
                author={selectedAuthor}
            />

            {/* Create/Edit Modal */}
            <AuthorForm
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                load={load}
                authorToEdit={authorToEdit}
            />
        </>
    );
};
