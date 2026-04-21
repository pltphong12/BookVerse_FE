import { zodResolver } from "@hookform/resolvers/zod";
import React, { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { showToast, ToastType } from "../../../common/showToast";
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import { createPublisher, ICreatePublisher, resetCreatePublisher, resetUpdatePublisher, updatePublisher } from "../../../redux/slide/publisher.slice";
import { callUploadSingleFile } from "../../../services/api";
import {
    Modal, Input, Form, Button, Row, Col, Divider, Image, Avatar, Typography
} from 'antd';
import { SaveOutlined, BankOutlined, CameraOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Title } = Typography;

interface PublisherFormProps {
    load: () => Promise<void>;
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    publisherToEdit?: ICreatePublisher | undefined;
}

const createPublisherSchema = z.object({
    name: z.string()
        .min(2, 'Tên nhà xuất bản ít nhất 2 kí tự')
        .max(100, 'Tên nhà xuất bản tối đa 100 kí tự'),
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

type CreatePublisherFormData = z.infer<typeof createPublisherSchema>;

export const PublisherForm: React.FC<PublisherFormProps> = ({ isModalOpen, setIsModalOpen, load, publisherToEdit }) => {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const dispatch = useAppDispatch();
    const isCreatePublisherSuccess = useAppSelector((state) => state.publisher.isCreatePublisherSuccess);
    const isCreatePublisherFailed = useAppSelector((state) => state.publisher.isCreatePublisherFailed);
    const isUpdatePublisherSuccess = useAppSelector((state) => state.publisher.isUpdatePublisherSuccess);
    const isUpdatePublisherFailed = useAppSelector((state) => state.publisher.isUpdatePublisherFailed);
    const message = useAppSelector((state) => state.publisher.message);

    const {
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
        control,
    } = useForm<CreatePublisherFormData>({
        resolver: zodResolver(createPublisherSchema),
        defaultValues: {
            name: '', address: '', phone: '',
            email: '', description: '', image: '',
        }
    });

    useEffect(() => {
        if (publisherToEdit) {
            setValue('name', publisherToEdit.name);
            setValue('address', publisherToEdit.address);
            setValue('phone', publisherToEdit.phone);
            setValue('email', publisherToEdit.email);
            setValue('description', publisherToEdit.description);
            setValue('image', publisherToEdit.image);
            setPreviewUrl(`${import.meta.env.VITE_BACKEND_URL}/storage/publisher/${publisherToEdit.image}`);
        } else {
            reset({ name: '', address: '', phone: '', email: '', description: '', image: '' });
            setPreviewUrl('');
        }
    }, [publisherToEdit, setValue, reset]);

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

    const onSubmit = async (data: CreatePublisherFormData) => {
        setIsSubmitting(true);
        let imageFileName = publisherToEdit?.image || '';

        if (data.image && typeof data.image !== 'string') {
            try {
                const res = await callUploadSingleFile(data.image, 'publisher');
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
        if (publisherToEdit) {
            dispatch(updatePublisher({ id: publisherToEdit.id!, data: payload as ICreatePublisher }));
        } else {
            dispatch(createPublisher(payload as ICreatePublisher));
        }
        setIsSubmitting(false);
    };

    const handleClose = useCallback(() => {
        setIsModalOpen(false);
        if (!publisherToEdit) {
            resetForm();
        }
    }, [publisherToEdit, setIsModalOpen, resetForm]);

    useEffect(() => {
        if (isCreatePublisherSuccess || isUpdatePublisherSuccess) {
            showToast(`${publisherToEdit ? 'Cập nhật' : 'Tạo'} nhà xuất bản thành công`, ToastType.SUCCESS);
            dispatch(publisherToEdit ? resetUpdatePublisher() : resetCreatePublisher());
            load();
            handleClose();
        }
        if (isCreatePublisherFailed || isUpdatePublisherFailed) {
            showToast(`${publisherToEdit ? 'Cập nhật' : 'Tạo'} nhà xuất bản không thành công ${message}`, ToastType.ERROR);
            dispatch(publisherToEdit ? resetUpdatePublisher() : resetCreatePublisher());
            setIsSubmitting(false);
        }
    }, [isCreatePublisherSuccess, isCreatePublisherFailed, isUpdatePublisherSuccess, isUpdatePublisherFailed, dispatch, load, message, publisherToEdit, handleClose]);

    return (
        <Modal
            title={
                <Title level={4} style={{ margin: 0 }}>
                    {publisherToEdit ? 'Chỉnh sửa nhà xuất bản' : 'Tạo nhà xuất bản mới'}
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
                            <Avatar size={80} icon={<BankOutlined />} style={{ background: '#1677ff' }} />
                        )}
                        <label style={{
                            position: 'absolute', bottom: 0, right: -4,
                            background: '#1677ff', borderRadius: '50%',
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
                    label="Tên nhà xuất bản"
                    validateStatus={errors.name ? 'error' : ''}
                    help={errors.name?.message}
                    required
                    layout="vertical"
                >
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <Input {...field} placeholder="Nhập tên nhà xuất bản" size="large" />
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
                        {publisherToEdit ? 'Cập nhật' : 'Tạo mới'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};