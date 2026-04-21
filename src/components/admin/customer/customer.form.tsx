import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { showToast, ToastType } from "../../../common/showToast";
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import { createCustomer, ICreateCustomer, resetCreateCustomer, resetUpdateCustomer, updateCustomer } from "../../../redux/slide/customer.slide";
import { callUploadSingleFile } from "../../../services/api";
import { ICustomer } from "../../../types/backend";
import {
    Modal, Input, Form, Button, Select, Row, Col, Divider, Avatar, Typography, Image
} from 'antd';
import { SaveOutlined, UserOutlined, CameraOutlined } from '@ant-design/icons';

const { Title } = Typography;

interface CustomerFormProps {
    load: () => Promise<void>;
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    customerToEdit?: ICustomer | undefined;
}

const createCustomerSchema = z.object({
    identityCard: z.string()
        .min(10, 'Mã CCCD có ít nhất 10 kí tự')
        .max(12, 'Mã CCCD có nhiều nhất 12 kí tự'),
    password: z.string()
        .optional(),
    fullName: z.string()
        .min(2, 'Họ và tên có ít nhất 2 kí tự')
        .max(100, 'Họ và tên có nhiều nhất 100 kí tự'),
    email: z.string()
        .email('Email không hợp lệ'),
    address: z.string()
        .min(5, 'Địa chỉ có ít nhất 5 kí tự')
        .max(200, 'Địa chỉ có nhiều nhất 200 kí tự'),
    phone: z.string()
        .min(10, 'Số điện thoại có ít nhất 10 kí tự')
        .max(15, 'Số điện thoại có nhiều nhất 15 kí tự')
        .regex(/^[0-9+\-\s()]*$/, ''),
    avatar: z.any().optional(),
    customerLevel: z.string()
        .min(1, 'Loại khách hàng có ít nhất 1 kí tự')
        .max(50, 'Loại khách hàng có nhiều nhất 50 kí tự'),
});

type CreateCustomerFormData = z.infer<typeof createCustomerSchema>;

const customerLevelOptions = [
    { value: 'BRONZE', label: '🥉 Đồng (Bronze)' },
    { value: 'SILVER', label: '🥈 Bạc (Silver)' },
    { value: 'GOLD', label: '🥇 Vàng (Gold)' },
    { value: 'DIAMOND', label: '💠 Kim cương (Diamond)' },
];

export const CustomerForm: React.FC<CustomerFormProps> = ({ isModalOpen, setIsModalOpen, load, customerToEdit }) => {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const dispatch = useAppDispatch();
    const isCreateCustomerSuccess = useAppSelector((state) => state.customer.isCreateCustomerSuccess);
    const isCreateCustomerFailed = useAppSelector((state) => state.customer.isCreateCustomerFailed);
    const isUpdateCustomerSuccess = useAppSelector((state) => state.customer.isUpdateCustomerSuccess);
    const isUpdateCustomerFailed = useAppSelector((state) => state.customer.isUpdateCustomerFailed);
    const message = useAppSelector((state) => state.customer.message);

    const {
        handleSubmit,
        reset,
        control,
        setValue,
        formState: { errors },
    } = useForm<CreateCustomerFormData>({
        resolver: zodResolver(createCustomerSchema),
        defaultValues: {
            password: '', fullName: '', email: '', address: '',
            phone: '', avatar: undefined, customerLevel: 'BRONZE',
        }
    });

    useEffect(() => {
        if (customerToEdit) {
            setValue('identityCard', customerToEdit.identityCard);
            setValue('fullName', customerToEdit.user.fullName);
            setValue('email', customerToEdit.user.email);
            setValue('address', customerToEdit.user.address);
            setValue('phone', customerToEdit.user.phone);
            if (customerToEdit?.customerLevel === 'Đồng') {
                setValue('customerLevel', 'BRONZE');
            } else if (customerToEdit?.customerLevel === 'Bạc') {
                setValue('customerLevel', 'SILVER');
            } else if (customerToEdit?.customerLevel === 'Vàng') {
                setValue('customerLevel', 'GOLD');
            } else if (customerToEdit?.customerLevel === 'Kim cương') {
                setValue('customerLevel', 'DIAMOND');
            }
            setAvatarPreview(`${import.meta.env.VITE_BACKEND_URL}/storage/avatar/${customerToEdit.user.avatar}`);
        } else {
            reset({
                password: '', fullName: '', email: '', address: '',
                phone: '', avatar: undefined, customerLevel: 'BRONZE',
            });
            setAvatarPreview('');
        }
    }, [customerToEdit, setValue, reset, setAvatarPreview]);

    const resetForm = () => {
        reset({
            password: '', fullName: '', email: '', address: '',
            phone: '', avatar: undefined, customerLevel: 'BRONZE',
        });
        setAvatarPreview('');
        setIsSubmitting(false);
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setValue('avatar', file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const onSubmit = async (data: CreateCustomerFormData) => {
        setIsSubmitting(true);
        let avatarFileName = customerToEdit?.user.avatar || '';

        if (data.avatar && typeof data.avatar !== 'string') {
            try {
                const res = await callUploadSingleFile(data.avatar, 'avatar');
                if (res.data) {
                    avatarFileName = res.data.data?.fileName as string;
                }
            } catch (error) {
                showToast("Ảnh đại diện tải lên không thành công", ToastType.ERROR);
                setIsSubmitting(false);
                return;
            }
        }

        const formData = {
            ...data,
            password: data.password || '',
            avatar: avatarFileName,
        };

        if (customerToEdit) {
            dispatch(updateCustomer({ id: customerToEdit.id, data: formData as ICreateCustomer }));
        } else {
            dispatch(createCustomer(formData as ICreateCustomer));
        }
    };

    const handleClose = () => {
        if (customerToEdit !== undefined) {
            setIsModalOpen(false);
        } else {
            setIsModalOpen(false);
            resetForm();
        }
    };

    useEffect(() => {
        if (isCreateCustomerSuccess || isUpdateCustomerSuccess) {
            showToast(`${customerToEdit ? 'Cập nhật' : 'Tạo'} khách hàng thành công`, ToastType.SUCCESS);
            dispatch(customerToEdit ? resetUpdateCustomer() : resetCreateCustomer());
            load();
            handleClose();
            setIsSubmitting(false);
        }
        if (isCreateCustomerFailed || isUpdateCustomerFailed) {
            showToast(`${customerToEdit ? 'Cập nhật' : 'Tạo'} khách hàng không thành công`, ToastType.ERROR);
            dispatch(customerToEdit ? resetUpdateCustomer() : resetCreateCustomer());
            setIsSubmitting(false);
        }
    }, [isCreateCustomerSuccess, isCreateCustomerFailed, isUpdateCustomerSuccess, isUpdateCustomerFailed, dispatch, load, message, customerToEdit]);

    return (
        <Modal
            title={
                <Title level={4} style={{ margin: 0 }}>
                    {customerToEdit ? 'Chỉnh sửa khách hàng' : 'Tạo khách hàng mới'}
                </Title>
            }
            open={isModalOpen}
            onCancel={handleClose}
            footer={null}
            width={680}
            destroyOnHidden
            centered
            styles={{ body: { maxHeight: '75vh', overflowY: 'auto', padding: '16px 24px' } }}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Avatar Section */}
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                        {avatarPreview ? (
                            <Image
                                src={avatarPreview}
                                width={80} height={80}
                                style={{ borderRadius: '50%', objectFit: 'cover' }}
                                preview={false}
                            />
                        ) : (
                            <Avatar size={80} icon={<UserOutlined />} />
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
                                onChange={handleAvatarChange}
                                accept="image/*"
                                style={{ display: 'none' }}
                            />
                        </label>
                    </div>
                </div>

                {/* Identity Card */}
                <Form.Item
                    label="Mã CCCD"
                    validateStatus={errors.identityCard ? 'error' : ''}
                    help={errors.identityCard?.message}
                    required
                    layout="vertical"
                >
                    <Controller
                        name="identityCard"
                        control={control}
                        render={({ field }) => (
                            <Input {...field} placeholder="Nhập mã CCCD" size="large" />
                        )}
                    />
                </Form.Item>

                <Row gutter={16}>
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Họ và tên"
                            validateStatus={errors.fullName ? 'error' : ''}
                            help={errors.fullName?.message}
                            required
                            layout="vertical"
                        >
                            <Controller
                                name="fullName"
                                control={control}
                                render={({ field }) => (
                                    <Input {...field} placeholder="Nhập họ và tên" />
                                )}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
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
                    </Col>
                </Row>

                {/* Password - only for create */}
                {!customerToEdit && (
                    <Form.Item
                        label="Mật khẩu"
                        validateStatus={errors.password ? 'error' : ''}
                        help={errors.password?.message}
                        layout="vertical"
                    >
                        <Controller
                            name="password"
                            control={control}
                            render={({ field }) => (
                                <Input.Password {...field} placeholder="Nhập mật khẩu" />
                            )}
                        />
                    </Form.Item>
                )}

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
                            label="Cấp bậc khách hàng"
                            validateStatus={errors.customerLevel ? 'error' : ''}
                            help={errors.customerLevel?.message}
                            required
                            layout="vertical"
                        >
                            <Controller
                                name="customerLevel"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        style={{ width: '100%' }}
                                        options={customerLevelOptions}
                                        placeholder="Chọn cấp bậc"
                                    />
                                )}
                            />
                        </Form.Item>
                    </Col>
                </Row>

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
                        {customerToEdit ? 'Cập nhật' : 'Tạo mới'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
