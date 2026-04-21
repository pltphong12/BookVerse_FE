import React from "react";
import { Table, Button, Space, Popconfirm, Tooltip, Tag, Card, Typography } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined, PlusOutlined, TagOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { showToast, ToastType } from "../../../common/showToast";
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import { deleteCategory, ICreateCategory, resetDeleteCategory } from "../../../redux/slide/category.slide";
import { ICategory } from "../../../types/backend";
import { CategorySearchAndFilter } from "./category.search_filter";
import { CategoryView } from "./category.view";
import { CategoryForm } from "./categoty.form";

const { Title } = Typography;

interface CategoryTableProps {
    load: () => Promise<void>;
    page: number;
    totalPage: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    dataSource: ICategory[];
    searchWithName: string;
    setSearchWithName: React.Dispatch<React.SetStateAction<string>>;
    dateFrom: string;
    setDateFrom: React.Dispatch<React.SetStateAction<string>>;
}

export const CategoryTable: React.FC<CategoryTableProps> = ({
    load, page, totalPage, setPage, dataSource,
    searchWithName, setSearchWithName,
    dateFrom, setDateFrom,
}) => {
    const [isViewModalOpen, setIsViewModalOpen] = React.useState<boolean>(false);
    const [selectedCategory, setSelectedCategory] = React.useState<ICategory | null>(null);
    const [categoryToEdit, setCategoryToEdit] = React.useState<ICreateCategory | undefined>(undefined);
    const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);

    const isDeleteCategorySuccess = useAppSelector((state) => state.category.isDeleteCategorySuccess);
    const isDeleteCategoryFailed = useAppSelector((state) => state.category.isDeleteCategoryFailed);
    const message = useAppSelector((state) => state.category.message);
    const dispatch = useAppDispatch();

    const handleViewCategory = (category: ICategory) => {
        setSelectedCategory(category);
        setIsViewModalOpen(true);
    };

    const executeDeleteCategory = (id: number) => {
        dispatch(deleteCategory(id));
    };

    React.useEffect(() => {
        if (isDeleteCategorySuccess) {
            showToast("Xóa thể loại thành công", ToastType.SUCCESS);
            dispatch(resetDeleteCategory());
            setPage(1);
            load();
        }
        if (isDeleteCategoryFailed) {
            showToast("Xóa thể loại không thành công " + message, ToastType.ERROR);
            dispatch(resetDeleteCategory());
        }
    }, [isDeleteCategorySuccess, isDeleteCategoryFailed, message, dispatch, setPage, load]);

    const columns: ColumnsType<ICategory> = [
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
            title: 'Thể loại',
            key: 'name',
            render: (_text, record) => (
                <Space>
                    <div style={{
                        width: 36, height: 36, borderRadius: 8,
                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <TagOutlined style={{ color: '#fff', fontSize: 16 }} />
                    </div>
                    <div>
                        <div style={{ fontWeight: 600 }}>{record.name}</div>
                        <div style={{ fontSize: 12, color: '#8c8c8c', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {record.description || '—'}
                        </div>
                    </div>
                </Space>
            ),
        },
        {
            title: 'Số sách',
            key: 'books',
            width: 100,
            align: 'center',
            responsive: ['md'],
            render: (_text, record) => (
                <Tag color="purple">
                    {record.infoBookInCategory?.length || 0} sách
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
            width: 150,
            align: 'center',
            render: (_text, record) => (
                <Space size="small">
                    <Tooltip title="Xem chi tiết">
                        <Button
                            type="text"
                            icon={<EyeOutlined />}
                            style={{ color: '#1677ff' }}
                            onClick={() => handleViewCategory(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            style={{ color: '#faad14' }}
                            onClick={() => {
                                setCategoryToEdit(record);
                                setIsModalOpen(true);
                            }}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Xóa thể loại"
                        description="Bạn có chắc chắn muốn xóa thể loại này?"
                        onConfirm={() => executeDeleteCategory(record.id)}
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
            <CategorySearchAndFilter
                searchWithName={searchWithName}
                setSearchWithName={setSearchWithName}
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
                        <TagOutlined /> Quản lý thể loại
                    </Title>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setIsModalOpen(true);
                            setCategoryToEdit(undefined);
                        }}
                    >
                        Tạo thể loại
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
                        showTotal: (total) => `Tổng ${total} thể loại`,
                        style: { padding: '0 16px' },
                    }}
                    size="middle"
                    scroll={{ x: 600 }}
                />
            </Card>

            <CategoryView
                isOpen={isViewModalOpen}
                setIsOpen={setIsViewModalOpen}
                category={selectedCategory}
            />

            <CategoryForm
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                load={load}
                categoryToEdit={categoryToEdit}
            />
        </>
    );
};
