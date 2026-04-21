import React from "react";
import { Table, Button, Space, Popconfirm, Tooltip, Avatar, Card, Typography } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined, PlusOutlined, BankOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { showToast, ToastType } from "../../../common/showToast";
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import { deletePublisher, ICreatePublisher, resetDeletePublisher } from "../../../redux/slide/publisher.slice";
import { IPublisher } from "../../../types/backend";
import { PublisherForm } from "./publisher.form";
import { PublisherSearchAndFilter } from "./publisher.search_filter";
import { PublisherView } from "./publisher.view";

const { Title } = Typography;

interface PublisherTableProps {
    load: () => Promise<void>;
    page: number;
    totalPage: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    dataSource: IPublisher[];
    search: string;
    setSearch: React.Dispatch<React.SetStateAction<string>>;
    dateFrom: string;
    setDateFrom: React.Dispatch<React.SetStateAction<string>>;
}

export const PublisherTable: React.FC<PublisherTableProps> = ({
    load, page, totalPage, setPage, dataSource,
    search, setSearch, dateFrom, setDateFrom,
}) => {
    const [isViewModalOpen, setIsViewModalOpen] = React.useState<boolean>(false);
    const [selectedPublisher, setSelectedPublisher] = React.useState<IPublisher | null>(null);
    const [publisherToEdit, setPublisherToEdit] = React.useState<ICreatePublisher | undefined>(undefined);
    const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);

    const isDeletePublisherSuccess = useAppSelector((state) => state.publisher.isDeletePublisherSuccess);
    const isDeletePublisherFailed = useAppSelector((state) => state.publisher.isDeletePublisherFailed);
    const message = useAppSelector((state) => state.publisher.message);
    const dispatch = useAppDispatch();

    const handleViewPublisher = (publisher: IPublisher) => {
        setSelectedPublisher(publisher);
        setIsViewModalOpen(true);
    };

    const executeDeletePublisher = (id: number) => {
        dispatch(deletePublisher(id));
    };

    React.useEffect(() => {
        if (isDeletePublisherSuccess) {
            showToast("Xóa nhà xuất bản thành công", ToastType.SUCCESS);
            dispatch(resetDeletePublisher());
            load();
            setPage(1);
        }
        if (isDeletePublisherFailed) {
            showToast("Xóa nhà xuất bản không thành công " + message, ToastType.ERROR);
            dispatch(resetDeletePublisher());
        }
    }, [isDeletePublisherSuccess, isDeletePublisherFailed, message, dispatch, setPage, load]);

    const columns: ColumnsType<IPublisher> = [
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
            title: 'Nhà xuất bản',
            key: 'name',
            render: (_text, record) => (
                <Space>
                    <Avatar
                        src={record.image
                            ? `${import.meta.env.VITE_BACKEND_URL}/storage/publisher/${record.image}`
                            : undefined
                        }
                        icon={<BankOutlined />}
                        size={40}
                        style={{ background: record.image ? undefined : '#1677ff' }}
                    />
                    <div>
                        <div style={{ fontWeight: 600 }}>{record.name}</div>
                        <div style={{ fontSize: 12, color: '#8c8c8c' }}>{record.email}</div>
                    </div>
                </Space>
            ),
        },
        {
            title: 'Địa chỉ',
            key: 'address',
            width: 200,
            responsive: ['lg'],
            ellipsis: true,
            render: (_text, record) => (
                <span style={{ fontSize: 13, color: '#595959' }}>{record.address || '—'}</span>
            ),
        },
        {
            title: 'SĐT',
            key: 'phone',
            width: 130,
            responsive: ['md'],
            render: (_text, record) => (
                <span style={{ fontSize: 13 }}>{record.phone || '—'}</span>
            ),
        },
        {
            title: 'Ngày tạo',
            key: 'createdAt',
            width: 120,
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
                            onClick={() => handleViewPublisher(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            style={{ color: '#faad14' }}
                            onClick={() => {
                                setPublisherToEdit(record);
                                setIsModalOpen(true);
                            }}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Xóa nhà xuất bản"
                        description="Bạn có chắc chắn muốn xóa nhà xuất bản này?"
                        onConfirm={() => executeDeletePublisher(record.id)}
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
            <PublisherSearchAndFilter
                search={search}
                setSearch={setSearch}
                dateFrom={dateFrom}
                setDateFrom={setDateFrom}
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
                        <BankOutlined /> Quản lý nhà xuất bản
                    </Title>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setIsModalOpen(true);
                            setPublisherToEdit(undefined);
                        }}
                    >
                        Tạo nhà xuất bản
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
                        showTotal: (total) => `Tổng ${total} nhà xuất bản`,
                        style: { padding: '0 16px' },
                    }}
                    size="middle"
                    scroll={{ x: 600 }}
                />
            </Card>

            <PublisherView
                isOpen={isViewModalOpen}
                setIsOpen={setIsViewModalOpen}
                publisher={selectedPublisher}
            />

            <PublisherForm
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                load={load}
                publisherToEdit={publisherToEdit}
            />
        </>
    );
};
