import { zodResolver } from "@hookform/resolvers/zod";
import React, { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { showToast, ToastType } from "../../../common/showToast";
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import { createBook, ICreateBook, ICreateBookImage, resetCreateBook, resetUpdateBook, updateBook } from "../../../redux/slide/book.slice";
import { IAuthorInBook, ICategoryInBook, IPublisher, ISupplier } from "../../../types/backend";
import { callUploadBatchFiles } from "../../../services/api";
import {
    Modal, Input, InputNumber, Select, Form, Button, Image, Row, Col, Divider, Typography
} from 'antd';
import { SaveOutlined, StarFilled, StarOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Title } = Typography;

interface ImageItem {
    uid: string;
    file?: File;
    previewUrl: string;
    relativePath?: string;
    primary: boolean;
    sortOrder: number;
}

interface BookFormProps {
    load: () => Promise<void>;
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    bookToEdit?: ICreateBook | undefined;
    publishers: IPublisher[];
    suppliers: ISupplier[];
    authors: IAuthorInBook[];
    categories: ICategoryInBook[];
}

const createBookSchema = z.object({
    title: z.string()
        .min(2, 'Tên sách ít nhất 2 kí tự')
        .max(200, 'Tên sách tối đa 200 kí tự'),
    publisher: z.object({
        id: z.number()
    }),
    supplier: z.object({
        id: z.number()
    }),
    authors: z.array(z.object({
        id: z.number()
    })).min(1, 'Chọn ít nhất 1 tác giả'),
    category: z.object({
        id: z.number()
    }),
    price: z.number()
        .min(0, 'Giá sách phải lớn hơn 0'),
    discount: z.number()
        .min(0, 'Giảm giá phải lớn hơn 0')
        .max(100, 'Giảm giá tối đa 100%'),
    quantity: z.number()
        .min(0, 'Số lượng phải lớn hơn 0')
        .int('Số lượng phải là số nguyên'),
    publishYear: z.number()
        .min(0, "Năm xuất bản phải từ 0 trở lên")
        .max(new Date().getFullYear(), "Năm xuất bản không được vượt quá năm hiện tại")
        .int("Năm xuất bản phải là số nguyên"),
    weight: z.number()
        .min(1, "Trọng lượng phải lớn hơn 0")
        .max(10000, "Trọng lượng không được vượt quá 10kg")
        .int("Trọng lượng phải là số nguyên"),
    dimensions: z.string()
        .min(1, "Kích thước phải lớn hơn 1 kí tự")
        .max(100, "Kích thước không được vượt quá 100 kí tự"),
    numberOfPages: z.number()
        .min(1, "Số trang phải lớn hơn 0")
        .max(10000, "Số trang không được vượt quá 10,000")
        .int("Số trang phải là số nguyên"),
    coverFormat: z.enum(["PAPERBACK", "HARDCOVER"], {
        errorMap: () => ({ message: "Vui lòng chọn định dạng bìa" })
    }),
    description: z.string()
        .min(10, 'Mô tả ít nhất 10 kí tự')
        .max(1000, 'Mô tả tối đa 1000 kí tự'),
});

type CreateBookFormData = z.infer<typeof createBookSchema>;

export const BookForm: React.FC<BookFormProps> = ({
    isModalOpen, setIsModalOpen, load, bookToEdit,
    publishers, authors, categories, suppliers,
}) => {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [imageItems, setImageItems] = useState<ImageItem[]>([]);
    const dispatch = useAppDispatch();
    const isCreateBookSuccess = useAppSelector((state) => state.book.isCreateBookSuccess);
    const isCreateBookFailed = useAppSelector((state) => state.book.isCreateBookFailed);
    const isUpdateBookSuccess = useAppSelector((state) => state.book.isUpdateBookSuccess);
    const isUpdateBookFailed = useAppSelector((state) => state.book.isUpdateBookFailed);
    const message = useAppSelector((state) => state.book.message);

    const {
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
        control,
    } = useForm<CreateBookFormData>({
        resolver: zodResolver(createBookSchema),
        defaultValues: {
            title: '', publisher: { id: 0 }, supplier: { id: 0 },
            authors: [], category: { id: 0 },
            price: 0, discount: 0, quantity: 0,
            publishYear: 0, weight: 0, dimensions: '',
            numberOfPages: 0, coverFormat: 'PAPERBACK', description: '',
        }
    });

    useEffect(() => {
        if (bookToEdit) {
            setValue('title', bookToEdit.title);
            setValue('publisher', bookToEdit.publisher);
            setValue('supplier', bookToEdit.supplier);
            setValue('authors', bookToEdit.authors.map(a => ({ id: a.id })));
            setValue('category', bookToEdit.category);
            setValue('price', bookToEdit.price);
            setValue('discount', bookToEdit.discount);
            setValue('quantity', bookToEdit.quantity);
            setValue('description', bookToEdit.description);
            setValue('publishYear', bookToEdit.publishYear);
            setValue('weight', bookToEdit.weight);
            setValue('dimensions', bookToEdit.dimensions);
            setValue('numberOfPages', bookToEdit.numberOfPages);
            setValue('coverFormat', bookToEdit.coverFormat === "Bìa mềm" ? "PAPERBACK" : "HARDCOVER");

            if (bookToEdit.images && bookToEdit.images.length > 0) {
                setImageItems(bookToEdit.images.map((img, idx) => ({
                    uid: `existing-${img.relativePath}`,
                    previewUrl: `${import.meta.env.VITE_BACKEND_URL}/storage/book/${img.relativePath}`,
                    relativePath: img.relativePath,
                    primary: img.primary,
                    sortOrder: img.sortOrder ?? idx,
                })));
            } else if (bookToEdit.image) {
                setImageItems([{
                    uid: `existing-${bookToEdit.image}`,
                    previewUrl: `${import.meta.env.VITE_BACKEND_URL}/storage/book/${bookToEdit.image}`,
                    relativePath: bookToEdit.image,
                    primary: true,
                    sortOrder: 0,
                }]);
            }
        } else {
            reset({
                title: '', publisher: { id: 0 }, supplier: { id: 0 },
                authors: [], category: { id: 0 },
                price: 0, discount: 0, quantity: 0,
                publishYear: 0, weight: 0, dimensions: '',
                numberOfPages: 0, coverFormat: 'PAPERBACK', description: '',
            });
            setImageItems([]);
        }
    }, [bookToEdit, setValue, reset]);

    const resetForm = useCallback(() => {
        reset({
            title: '', publisher: { id: 0 }, supplier: { id: 0 },
            authors: [], category: { id: 0 },
            price: 0, discount: 0, quantity: 0,
            publishYear: 0, weight: 0, dimensions: '',
            numberOfPages: 0, coverFormat: 'PAPERBACK', description: '',
        });
        setImageItems([]);
        setIsSubmitting(false);
    }, [reset]);

    const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);
            setImageItems(prev => {
                const hasPrimary = prev.some(item => item.primary);
                const newItems: ImageItem[] = newFiles.map((file, index) => ({
                    uid: `${Date.now()}-${index}-${file.name}`,
                    file,
                    previewUrl: URL.createObjectURL(file),
                    primary: !hasPrimary && prev.length === 0 && index === 0,
                    sortOrder: prev.length + index,
                }));
                return [...prev, ...newItems];
            });
            e.target.value = '';
        }
    };

    const handleRemoveImage = (uid: string) => {
        setImageItems(prev => {
            const filtered = prev.filter(item => item.uid !== uid);
            if (filtered.length > 0 && !filtered.some(item => item.primary)) {
                filtered[0].primary = true;
            }
            return filtered.map((item, idx) => ({ ...item, sortOrder: idx }));
        });
    };

    const handleSetPrimary = (uid: string) => {
        setImageItems(prev => prev.map(item => ({
            ...item,
            primary: item.uid === uid,
        })));
    };

    const onSubmit = async (data: CreateBookFormData) => {
        setIsSubmitting(true);

        if (imageItems.length === 0) {
            showToast("Vui lòng chọn ít nhất 1 ảnh", ToastType.ERROR);
            setIsSubmitting(false);
            return;
        }

        const newFiles = imageItems.filter(item => item.file);
        let uploadedFileNames: string[] = [];

        if (newFiles.length > 0) {
            try {
                const res = await callUploadBatchFiles(
                    newFiles.map(item => item.file!),
                    'book'
                );
                if (res.data?.data) {
                    uploadedFileNames = res.data.data.map(f => f.fileName);
                }
            } catch {
                showToast("Tải ảnh lên không thành công", ToastType.ERROR);
                setIsSubmitting(false);
                return;
            }
        }

        let newFileIndex = 0;
        const images: ICreateBookImage[] = imageItems.map((item, idx) => {
            if (item.file) {
                return {
                    relativePath: uploadedFileNames[newFileIndex++],
                    sortOrder: idx,
                    primary: item.primary,
                };
            }
            return {
                relativePath: item.relativePath!,
                sortOrder: idx,
                primary: item.primary,
            };
        });

        const primaryImage = images.find(img => img.primary);
        const formData = {
            ...data,
            image: primaryImage?.relativePath || '',
            images,
        };

        if (bookToEdit) {
            dispatch(updateBook({ id: bookToEdit.id, data: formData as ICreateBook }));
        } else {
            dispatch(createBook(formData as ICreateBook));
        }
        setIsSubmitting(false);
    };

    const handleClose = useCallback(() => {
        if (bookToEdit !== undefined) {
            setIsModalOpen(false);
        } else {
            setIsModalOpen(false);
            resetForm();
        }
    }, [bookToEdit, setIsModalOpen, resetForm]);

    useEffect(() => {
        if (isCreateBookSuccess || isUpdateBookSuccess) {
            showToast(`${bookToEdit ? 'Cập nhật' : 'Tạo'} sách thành công`, ToastType.SUCCESS);
            dispatch(bookToEdit ? resetUpdateBook() : resetCreateBook());
            load();
            handleClose();
        }
        if (isCreateBookFailed || isUpdateBookFailed) {
            showToast(`${bookToEdit ? 'Cập nhật' : 'Tạo'} sách không thành công ${message}`, ToastType.ERROR);
            dispatch(bookToEdit ? resetUpdateBook() : resetCreateBook());
            setIsSubmitting(false);
        }
    }, [isCreateBookSuccess, isCreateBookFailed, isUpdateBookSuccess, isUpdateBookFailed, dispatch, load, message, bookToEdit, handleClose]);

    return (
        <Modal
            title={
                <Title level={4} style={{ margin: 0 }}>
                    {bookToEdit ? 'Chỉnh sửa sách' : 'Tạo sách mới'}
                </Title>
            }
            open={isModalOpen}
            onCancel={handleClose}
            footer={null}
            width={780}
            destroyOnHidden
            centered
            styles={{ body: { maxHeight: '75vh', overflowY: 'auto', padding: '16px 24px' } }}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Title */}
                <Form.Item
                    label="Tên sách"
                    validateStatus={errors.title ? 'error' : ''}
                    help={errors.title?.message}
                    required
                    layout="vertical"
                >
                    <Controller
                        name="title"
                        control={control}
                        render={({ field }) => (
                            <Input {...field} placeholder="Nhập tên sách" size="large" />
                        )}
                    />
                </Form.Item>

                <Row gutter={16}>
                    {/* Publisher */}
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Nhà xuất bản"
                            validateStatus={errors.publisher ? 'error' : ''}
                            help={errors.publisher?.message}
                            required
                            layout="vertical"
                        >
                            <Controller
                                name="publisher.id"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        value={field.value || undefined}
                                        onChange={(val) => field.onChange(val)}
                                        placeholder="Chọn nhà xuất bản"
                                        showSearch
                                        optionFilterProp="label"
                                        style={{ width: '100%' }}
                                        options={publishers.map(p => ({ value: p.id, label: p.name }))}
                                    />
                                )}
                            />
                        </Form.Item>
                    </Col>
                    {/* Supplier */}
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Nhà cung cấp"
                            validateStatus={errors.supplier ? 'error' : ''}
                            help={errors.supplier?.message}
                            layout="vertical"
                        >
                            <Controller
                                name="supplier.id"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        value={field.value || undefined}
                                        onChange={(val) => field.onChange(val)}
                                        placeholder="Chọn nhà cung cấp"
                                        showSearch
                                        optionFilterProp="label"
                                        style={{ width: '100%' }}
                                        options={suppliers.map(s => ({ value: s.id, label: s.name }))}
                                    />
                                )}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    {/* Authors (Multi) */}
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Tác giả"
                            validateStatus={errors.authors ? 'error' : ''}
                            help={errors.authors?.message}
                            required
                            layout="vertical"
                        >
                            <Controller
                                name="authors"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        mode="multiple"
                                        value={field.value?.map(a => a.id) || []}
                                        onChange={(vals: number[]) => {
                                            field.onChange(vals.map(id => ({ id })));
                                        }}
                                        placeholder="Chọn tác giả"
                                        showSearch
                                        optionFilterProp="label"
                                        style={{ width: '100%' }}
                                        options={authors.map(a => ({ value: a.id, label: a.name }))}
                                    />
                                )}
                            />
                        </Form.Item>
                    </Col>
                    {/* Category */}
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Thể loại"
                            validateStatus={errors.category ? 'error' : ''}
                            help={errors.category?.message}
                            required
                            layout="vertical"
                        >
                            <Controller
                                name="category.id"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        value={field.value || undefined}
                                        onChange={(val) => field.onChange(val)}
                                        placeholder="Chọn thể loại"
                                        showSearch
                                        optionFilterProp="label"
                                        style={{ width: '100%' }}
                                        options={categories.map(c => ({ value: c.id, label: c.name }))}
                                    />
                                )}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Divider style={{ margin: '8px 0 16px' }} />

                <Row gutter={16}>
                    <Col xs={24} md={8}>
                        <Form.Item
                            label="Giá (₫)"
                            validateStatus={errors.price ? 'error' : ''}
                            help={errors.price?.message}
                            required
                            layout="vertical"
                        >
                            <Controller
                                name="price"
                                control={control}
                                render={({ field }) => (
                                    <InputNumber
                                        {...field}
                                        style={{ width: '100%' }}
                                        min={0}
                                        placeholder="Nhập giá"
                                        formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={v => Number(v?.replace(/,/g, '') || 0)}
                                    />
                                )}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                        <Form.Item
                            label="Giảm giá (%)"
                            validateStatus={errors.discount ? 'error' : ''}
                            help={errors.discount?.message}
                            layout="vertical"
                        >
                            <Controller
                                name="discount"
                                control={control}
                                render={({ field }) => (
                                    <InputNumber
                                        {...field}
                                        style={{ width: '100%' }}
                                        min={0} max={100}
                                        placeholder="Giảm giá"
                                    />
                                )}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                        <Form.Item
                            label="Số lượng"
                            validateStatus={errors.quantity ? 'error' : ''}
                            help={errors.quantity?.message}
                            required
                            layout="vertical"
                        >
                            <Controller
                                name="quantity"
                                control={control}
                                render={({ field }) => (
                                    <InputNumber
                                        {...field}
                                        style={{ width: '100%' }}
                                        min={0}
                                        placeholder="Số lượng"
                                    />
                                )}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col xs={24} md={8}>
                        <Form.Item
                            label="Năm xuất bản"
                            validateStatus={errors.publishYear ? 'error' : ''}
                            help={errors.publishYear?.message}
                            layout="vertical"
                        >
                            <Controller
                                name="publishYear"
                                control={control}
                                render={({ field }) => (
                                    <InputNumber
                                        {...field}
                                        style={{ width: '100%' }}
                                        min={0}
                                        max={new Date().getFullYear()}
                                        placeholder="Năm XB"
                                    />
                                )}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                        <Form.Item
                            label="Trọng lượng (g)"
                            validateStatus={errors.weight ? 'error' : ''}
                            help={errors.weight?.message}
                            layout="vertical"
                        >
                            <Controller
                                name="weight"
                                control={control}
                                render={({ field }) => (
                                    <InputNumber
                                        {...field}
                                        style={{ width: '100%' }}
                                        min={1} max={10000}
                                        placeholder="Trọng lượng"
                                    />
                                )}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                        <Form.Item
                            label="Số trang"
                            validateStatus={errors.numberOfPages ? 'error' : ''}
                            help={errors.numberOfPages?.message}
                            layout="vertical"
                        >
                            <Controller
                                name="numberOfPages"
                                control={control}
                                render={({ field }) => (
                                    <InputNumber
                                        {...field}
                                        style={{ width: '100%' }}
                                        min={1} max={10000}
                                        placeholder="Số trang"
                                    />
                                )}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Kích thước"
                            validateStatus={errors.dimensions ? 'error' : ''}
                            help={errors.dimensions?.message}
                            layout="vertical"
                        >
                            <Controller
                                name="dimensions"
                                control={control}
                                render={({ field }) => (
                                    <Input {...field} placeholder="VD: 20.5 x 13 x 1.5 cm" />
                                )}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Định dạng bìa"
                            validateStatus={errors.coverFormat ? 'error' : ''}
                            help={errors.coverFormat?.message}
                            layout="vertical"
                        >
                            <Controller
                                name="coverFormat"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        style={{ width: '100%' }}
                                        options={[
                                            { value: 'PAPERBACK', label: 'Bìa Mềm (Paperback)' },
                                            { value: 'HARDCOVER', label: 'Bìa Cứng (Hardcover)' },
                                        ]}
                                    />
                                )}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                {/* Description */}
                <Form.Item
                    label="Mô tả"
                    validateStatus={errors.description ? 'error' : ''}
                    help={errors.description?.message}
                    required
                    layout="vertical"
                >
                    <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                            <TextArea
                                {...field}
                                rows={4}
                                placeholder="Nhập mô tả sách"
                                showCount
                                maxLength={1000}
                            />
                        )}
                    />
                </Form.Item>

                {/* Image Upload Section */}
                <Divider style={{ margin: '8px 0 16px' }} />
                <Form.Item label="Ảnh sách" layout="vertical">
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                        {imageItems.map((item) => (
                            <div
                                key={item.uid}
                                style={{
                                    position: 'relative',
                                    width: 96, height: 96,
                                    borderRadius: 8,
                                    overflow: 'hidden',
                                    border: item.primary ? '2px solid #faad14' : '1px solid #d9d9d9',
                                }}
                            >
                                <Image
                                    src={item.previewUrl}
                                    alt="preview"
                                    width={96} height={96}
                                    style={{ objectFit: 'cover' }}
                                    preview={false}
                                />
                                <div style={{
                                    position: 'absolute', inset: 0,
                                    background: 'rgba(0,0,0,0.4)',
                                    opacity: 0, transition: 'opacity 0.2s',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                                }}
                                    onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                                    onMouseLeave={e => (e.currentTarget.style.opacity = '0')}
                                >
                                    <Button
                                        type="text"
                                        size="small"
                                        icon={item.primary
                                            ? <StarFilled style={{ color: '#faad14' }} />
                                            : <StarOutlined style={{ color: '#fff' }} />
                                        }
                                        onClick={() => handleSetPrimary(item.uid)}
                                        title="Đặt ảnh chính"
                                    />
                                    <Button
                                        type="text"
                                        size="small"
                                        danger
                                        icon={<DeleteOutlined style={{ color: '#ff4d4f' }} />}
                                        onClick={() => handleRemoveImage(item.uid)}
                                        title="Xóa ảnh"
                                    />
                                </div>
                                {item.primary && (
                                    <span style={{
                                        position: 'absolute', top: 2, left: 2,
                                        background: '#faad14', color: '#000',
                                        fontSize: 10, padding: '1px 5px',
                                        borderRadius: 4, fontWeight: 600,
                                    }}>
                                        Chính
                                    </span>
                                )}
                            </div>
                        ))}
                        <label style={{
                            width: 96, height: 96,
                            borderRadius: 8,
                            border: '2px dashed #d9d9d9',
                            display: 'flex', flexDirection: 'column',
                            alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', transition: 'border-color 0.2s',
                        }}
                            onMouseEnter={e => (e.currentTarget.style.borderColor = '#1677ff')}
                            onMouseLeave={e => (e.currentTarget.style.borderColor = '#d9d9d9')}
                        >
                            <PlusOutlined style={{ fontSize: 20, color: '#8c8c8c' }} />
                            <span style={{ fontSize: 12, color: '#8c8c8c', marginTop: 4 }}>Thêm ảnh</span>
                            <input
                                type="file"
                                multiple
                                onChange={handleImagesChange}
                                accept="image/*"
                                style={{ display: 'none' }}
                            />
                        </label>
                    </div>
                    {imageItems.length > 0 && (
                        <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 4 }}>
                            Hover vào ảnh để đặt ảnh chính hoặc xóa. Ảnh có viền vàng là ảnh chính.
                        </div>
                    )}
                </Form.Item>

                {/* Footer */}
                <div style={{
                    display: 'flex', justifyContent: 'flex-end', gap: 8,
                    paddingTop: 16, borderTop: '1px solid #f0f0f0',
                }}>
                    <Button onClick={handleClose} disabled={isSubmitting}>
                        Đóng
                    </Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        icon={<SaveOutlined />}
                        loading={isSubmitting}
                    >
                        {bookToEdit ? 'Cập nhật' : 'Tạo mới'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
