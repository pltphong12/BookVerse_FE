import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import { createUser, ICreateUser, resetCreateUser, updateUser, resetUpdateUser } from "../../../redux/slide/user.slice";
import { showToast, ToastType } from "../../../common/showToast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { IUser, IRole } from "../../../types/backend";
import { callUploadSingleFile } from "../../../services/api";
import {
    Modal, Input, Form, Button, Select, Row, Col, Divider, Avatar, Image, Typography
} from 'antd';
import { SaveOutlined, UserOutlined, CameraOutlined } from '@ant-design/icons';

const { Title } = Typography;

interface UserFormProps {
    load: () => Promise<void>;
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    userToEdit?: IUser | undefined;
    roles: IRole[];
}

const roleColorMap: Record<string, string> = {
    ADMIN: 'red', MANAGER: 'blue', CUSTOMER: 'green', STAFF: 'orange',
};

const createUserSchema = z.object({
    password: z.string().optional(),
    fullName: z.string()
        .min(2, 'Họ và tên có ít nhất 2 kí tự')
        .max(100, 'Họ và tên có nhiều nhất 100 kí tự'),
    email: z.string().email('Email không hợp lệ'),
    address: z.string()
        .min(5, 'Địa chỉ có ít nhất 5 kí tự')
        .max(200, 'Địa chỉ có nhiều nhất 200 kí tự'),
    phone: z.string()
        .min(10, 'Số điện thoại có ít nhất 10 số')
        .max(15, 'Số điện thoại có nhiều nhất 15 số')
        .regex(/^[0-9+\-\s()]*$/, ''),
    role: z.object({ id: z.string() }),
    avatar: z.any().optional(),
});

type CreateUserFormData = z.infer<typeof createUserSchema>;

export const UserForm: React.FC<UserFormProps> = ({ isModalOpen, setIsModalOpen, load, userToEdit, roles }) => {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const dispatch = useAppDispatch();
    const isCreateUserSuccess = useAppSelector((state) => state.user.isCreateUserSuccess);
    const isCreateUserFailed = useAppSelector((state) => state.user.isCreateUserFailed);
    const isUpdateUserSuccess = useAppSelector((state) => state.user.isUpdateUserSuccess);
    const isUpdateUserFailed = useAppSelector((state) => state.user.isUpdateUserFailed);
    const message = useAppSelector((state) => state.user.message);

    const {
        handleSubmit, reset, setValue, formState: { errors }, control,
    } = useForm<CreateUserFormData>({
        resolver: zodResolver(createUserSchema),
        defaultValues: {
            password: '', fullName: '', email: '', address: '',
            phone: '', role: { id: '1' }, avatar: undefined,
        }
    });

    useEffect(() => {
        if (userToEdit) {
            setValue('fullName', userToEdit.fullName);
            setValue('email', userToEdit.email);
            setValue('address', userToEdit.address);
            setValue('phone', userToEdit.phone);
            setValue('role.id', userToEdit.role.id.toString());
            setAvatarPreview(`${import.meta.env.VITE_BACKEND_URL}/storage/avatar/${userToEdit.avatar}`);
        } else {
            reset({ password: '', fullName: '', email: '', address: '', phone: '', role: { id: '1' }, avatar: undefined });
            setAvatarPreview('');
        }
    }, [userToEdit, setValue, reset]);

    const resetForm = () => {
        reset({ password: '', fullName: '', email: '', address: '', phone: '', role: { id: '1' }, avatar: undefined });
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

    const onSubmit = async (data: CreateUserFormData) => {
        setIsSubmitting(true);
        let avatarFileName = userToEdit?.avatar || '';

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
            role: { id: Number(data.role.id) },
            password: data.password || '',
            avatar: avatarFileName,
        };

        if (userToEdit) {
            dispatch(updateUser({ id: userToEdit.id, data: formData }));
        } else {
            dispatch(createUser(formData as ICreateUser));
        }
    };

    const handleClose = () => {
        setIsModalOpen(false);
        if (!userToEdit) resetForm();
    };

    useEffect(() => {
        if (isCreateUserSuccess || isUpdateUserSuccess) {
            showToast(`${userToEdit ? 'Cập nhật' : 'Tạo'} người dùng thành công`, ToastType.SUCCESS);
            dispatch(userToEdit ? resetUpdateUser() : resetCreateUser());
            load();
            handleClose();
            setIsSubmitting(false);
        }
        if (isCreateUserFailed || isUpdateUserFailed) {
            showToast(`${userToEdit ? 'Cập nhật' : 'Tạo'} người dùng không thành công`, ToastType.ERROR);
            dispatch(userToEdit ? resetUpdateUser() : resetCreateUser());
            setIsSubmitting(false);
        }
    }, [isCreateUserSuccess, isCreateUserFailed, isUpdateUserSuccess, isUpdateUserFailed, dispatch, load, message, userToEdit]);

    return (
        <Modal
            title={
                <Title level={4} style={{ margin: 0 }}>
                    <UserOutlined /> {userToEdit ? 'Chỉnh sửa người dùng' : 'Tạo người dùng mới'}
                </Title>
            }
            open={isModalOpen}
            onCancel={handleClose}
            footer={null}
            width={640}
            destroyOnHidden
            centered
            styles={{ body: { maxHeight: '80vh', overflowY: 'auto', padding: '16px 24px' } }}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Avatar Upload */}
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
                            <Avatar size={80} icon={<UserOutlined />} style={{ background: '#1677ff' }} />
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

                {/* FullName + Address */}
                <Row gutter={16}>
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Họ và tên"
                            validateStatus={errors.fullName ? 'error' : ''}
                            help={errors.fullName?.message}
                            required layout="vertical"
                        >
                            <Controller name="fullName" control={control}
                                render={({ field }) => <Input {...field} placeholder="Nhập họ và tên" />}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Địa chỉ"
                            validateStatus={errors.address ? 'error' : ''}
                            help={errors.address?.message}
                            required layout="vertical"
                        >
                            <Controller name="address" control={control}
                                render={({ field }) => <Input {...field} placeholder="Nhập địa chỉ" />}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                {/* Password (only when creating) */}
                {!userToEdit && (
                    <Form.Item
                        label="Mật khẩu"
                        validateStatus={errors.password ? 'error' : ''}
                        help={errors.password?.message}
                        layout="vertical"
                    >
                        <Controller name="password" control={control}
                            render={({ field }) => <Input.Password {...field} placeholder="Nhập mật khẩu" />}
                        />
                    </Form.Item>
                )}

                {/* Email */}
                <Form.Item
                    label="Email"
                    validateStatus={errors.email ? 'error' : ''}
                    help={errors.email?.message}
                    required layout="vertical"
                >
                    <Controller name="email" control={control}
                        render={({ field }) => <Input {...field} placeholder="Nhập email" type="email" />}
                    />
                </Form.Item>

                <Divider style={{ margin: '8px 0 16px' }} />

                {/* Phone + Role */}
                <Row gutter={16}>
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Số điện thoại"
                            validateStatus={errors.phone ? 'error' : ''}
                            help={errors.phone?.message}
                            required layout="vertical"
                        >
                            <Controller name="phone" control={control}
                                render={({ field }) => <Input {...field} placeholder="Nhập SĐT" />}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Vai trò"
                            validateStatus={errors.role ? 'error' : ''}
                            help={errors.role?.message}
                            required layout="vertical"
                        >
                            <Controller
                                name="role.id"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        style={{ width: '100%' }}
                                        placeholder="Chọn vai trò"
                                        getPopupContainer={(trigger) => trigger.parentElement!}
                                        options={roles.map(role => ({
                                            value: role.id.toString(),
                                            label: role.name,
                                        }))}
                                        optionRender={(option) => (
                                            <span>
                                                <span style={{
                                                    display: 'inline-block',
                                                    width: 8, height: 8, borderRadius: '50%',
                                                    background: roleColorMap[option.label as string] || '#d9d9d9',
                                                    marginRight: 8,
                                                }} />
                                                {option.label}
                                            </span>
                                        )}
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
                        {userToEdit ? 'Cập nhật' : 'Tạo mới'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
