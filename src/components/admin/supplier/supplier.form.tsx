import { zodResolver } from "@hookform/resolvers/zod";
import React, { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { showToast, ToastType } from "../../../common/showToast";
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import { createSupplier, ICreateSupplier, resetCreateSupplier, resetUpdateSupplier, updateSupplier } from "../../../redux/slide/supplier.slide";
import { callUploadSingleFile } from "../../../services/api";
import {
    Modal, Input, Form, Button, Row, Col, Divider, Image, Avatar, Typography
} from 'antd';
import { SaveOutlined, ShopOutlined, CameraOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Title } = Typography;

interface SupplierFormProps {
    load: () => Promise<void>;
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    supplierToEdit?: ICreateSupplier | undefined;
}

const createSupplierSchema = z.object({
    name: z.string()
        .min(2, 'Tên nhà cung cấp ít nhất 2 kí tự')
        .max(100, 'Tên nhà cung cấp tối đa 100 kí tự'),
    address: z.string()
        .min(5, 'Địa chỉ ít nhất 5 kí tự')
        .max(200, 'Địa chỉ tối đa 200 kí tự'),
    phone: z.string()
        .min(10, 'Số điện thoại có ít nhất 10 số')
        .max(15, 'Số điện thoại tối đa 15 số'),
    email: z.string()
        .email('email không đúng định dạng'),
    description: z.string()
        .min(10, 'Mô tả ít nhất 10 kí tự')
        .max(500, 'Mô tả tối đa 500 kí tự'),
    image: z.any().optional()
});

type CreateSupplierFormData = z.infer<typeof createSupplierSchema>;

export const SupplierForm: React.FC<SupplierFormProps> = ({ isModalOpen, setIsModalOpen, load, supplierToEdit }) => {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const dispatch = useAppDispatch();
    const isCreateSupplierSuccess = useAppSelector((state) => state.supplier.isCreateSupplierSuccess);
    const isCreateSupplierFailed = useAppSelector((state) => state.supplier.isCreateSupplierFailed);
    const isUpdateSupplierSuccess = useAppSelector((state) => state.supplier.isUpdateSupplierSuccess);
    const isUpdateSupplierFailed = useAppSelector((state) => state.supplier.isUpdateSupplierFailed);
    const message = useAppSelector((state) => state.supplier.message);

    const {
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
        control,
    } = useForm<CreateSupplierFormData>({
        resolver: zodResolver(createSupplierSchema),
        defaultValues: {
            name: '', address: '', phone: '',
            email: '', description: '', image: '',
        }
    });

    useEffect(() => {
        if (supplierToEdit) {
            setValue('name', supplierToEdit.name);
            setValue('address', supplierToEdit.address);
            setValue('phone', supplierToEdit.phone);
            setValue('email', supplierToEdit.email);
            setValue('description', supplierToEdit.description);
            setValue('image', supplierToEdit.image);
            setPreviewUrl(`${import.meta.env.VITE_BACKEND_URL}/storage/supplier/${supplierToEdit.image}`);
        } else {
            reset({ name: '', address: '', phone: '', email: '', description: '', image: '' });
            setPreviewUrl('');
        }
    }, [supplierToEdit, setValue, reset]);

    const resetForm = useCallback(() => {
        reset({ name: '', address: '', phone: '', email: '', description: '', image: '' });
        setPreviewUrl('');
        setIsSubmitting(false);
    }, [reset]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setValue('image', file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const onSubmit = async (data: CreateSupplierFormData) => {
        setIsSubmitting(true);
        let imageFileName = supplierToEdit?.image || '';

        if (data.image && typeof data.image !== 'string') {
            try {
                const res = await callUploadSingleFile(data.image, 'supplier');
                if (res.data) {
                    imageFileName = res.data.data?.fileName as string;
                }
            } catch (error) {
                showToast("Tải lên không thành công", ToastType.ERROR);
                setIsSubmitting(false);
                return;
            }
        }
        const payload = { ...data, image: imageFileName };
        if (supplierToEdit) {
            dispatch(updateSupplier({ id: supplierToEdit.id!, data: payload as ICreateSupplier }));
        } else {
            dispatch(createSupplier(payload as ICreateSupplier));
        }
        setIsSubmitting(false);
    };

    const handleClose = useCallback(() => {
        setIsModalOpen(false);
        if (!supplierToEdit) {
            resetForm();
        }
    }, [supplierToEdit, setIsModalOpen, resetForm]);

    useEffect(() => {
        if (isCreateSupplierSuccess || isUpdateSupplierSuccess) {
            showToast(`${supplierToEdit ? 'Cập nhật' : 'Tạo'} nhà cung cấp thành công`, ToastType.SUCCESS);
            dispatch(supplierToEdit ? resetUpdateSupplier() : resetCreateSupplier());
            load();
            handleClose();
        }
        if (isCreateSupplierFailed || isUpdateSupplierFailed) {
            showToast(`${supplierToEdit ? 'Cập nhật' : 'Tạo'} nhà cung cấp không thành công ${message}`, ToastType.ERROR);
            dispatch(supplierToEdit ? resetUpdateSupplier() : resetCreateSupplier());
            setIsSubmitting(false);
        }
    }, [isCreateSupplierSuccess, isCreateSupplierFailed, isUpdateSupplierSuccess, isUpdateSupplierFailed, dispatch, load, message, supplierToEdit, handleClose]);

    return (
        <Modal
            title={
                <Title level={4} style={{ margin: 0 }}>
                    {supplierToEdit ? 'Chỉnh sửa nhà cung cấp' : 'Tạo nhà cung cấp mới'}
                </Title>
            }
            open={isModalOpen}
            onCancel={handleClose}
            footer={null}
            width={600}
            destroyOnHidden
            centered
            styles={{ body: { maxHeight: '75vh', overflowY: 'auto', padding: '16px 24px' } }}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Image Upload */}
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                        {previewUrl ? (
                            <Image
                                src={previewUrl}
                                width={80} height={80}
                                style={{ borderRadius: '50%', objectFit: 'cover' }}
                                preview={false}
                            />
                        ) : (
                            <Avatar size={80} icon={<ShopOutlined />} style={{ background: '#722ed1' }} />
                        )}
                        <label style={{
                            position: 'absolute', bottom: 0, right: -4,
                            background: '#722ed1', borderRadius: '50%',
                            width: 28, height: 28,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', border: '2px solid #fff',
                        }}>
                            <CameraOutlined style={{ color: '#fff', fontSize: 14 }} />
                            <input
                                type="file"
                                onChange={handleImageChange}
                                accept="image/*"
                                style={{ display: 'none' }}
                            />
                        </label>
                    </div>
                </div>

                {/* Name */}
                <Form.Item
                    label="Tên nhà cung cấp"
                    validateStatus={errors.name ? 'error' : ''}
                    help={errors.name?.message}
                    required
                    layout="vertical"
                >
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <Input {...field} placeholder="Nhập tên nhà cung cấp" size="large" />
                        )}
                    />
                </Form.Item>

                {/* Address */}
                <Form.Item
                    label="Địa chỉ"
                    validateStatus={errors.address ? 'error' : ''}
                    help={errors.address?.message}
                    required
                    layout="vertical"
                >
                    <Controller
                        name="address"
                        control={control}
                        render={({ field }) => (
                            <Input {...field} placeholder="Nhập địa chỉ" />
                        )}
                    />
                </Form.Item>

                <Divider style={{ margin: '8px 0 16px' }} />

                <Row gutter={16}>
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Số điện thoại"
                            validateStatus={errors.phone ? 'error' : ''}
                            help={errors.phone?.message}
                            required
                            layout="vertical"
                        >
                            <Controller
                                name="phone"
                                control={control}
                                render={({ field }) => (
                                    <Input {...field} placeholder="Nhập SĐT" />
                                )}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Email"
                            validateStatus={errors.email ? 'error' : ''}
                            help={errors.email?.message}
                            required
                            layout="vertical"
                        >
                            <Controller
                                name="email"
                                control={control}
                                render={({ field }) => (
                                    <Input {...field} placeholder="Nhập email" type="email" />
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
                                rows={3}
                                placeholder="Nhập mô tả"
                                showCount
                                maxLength={500}
                            />
                        )}
                    />
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
                        {supplierToEdit ? 'Cập nhật' : 'Tạo mới'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};