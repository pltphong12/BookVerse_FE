import { zodResolver } from "@hookform/resolvers/zod";
import React, { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { showToast, ToastType } from "../../../common/showToast";
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import { createAuthor, ICreateAuthor, resetCreateAuthor, resetUpdateAuthor, updateAuthor } from "../../../redux/slide/author.slice";
import { callUploadSingleFile } from "../../../services/api";
import { Modal, Input, DatePicker, Upload, Button, Form, Image, Space } from 'antd';
import { UploadOutlined, SaveOutlined, UserOutlined, EnvironmentOutlined, CalendarOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd';
import dayjs from 'dayjs';

interface AuthorFormProps {
    load: () => Promise<void>;
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    authorToEdit?: ICreateAuthor | undefined;
}

const createAuthorSchema = z.object({
    name: z.string()
        .min(2, 'Tên tác giả phải ít nhất 2 kí tự')
        .max(100, 'Tên tác giả không nhiều quá 100 kí tự'),
    birthday: z.string()
        .min(1, 'Ngày sinh không được để trống'),
    nationality: z.string()
        .min(2, 'Quê quán ít nhất 2 kí tự')
        .max(100, 'Quê quán không nhiều quá 100 kí tự'),
    avatar: z.any()
        .optional()
});

type CreateAuthorFormData = z.infer<typeof createAuthorSchema>;

export const AuthorForm: React.FC<AuthorFormProps> = ({ isModalOpen, setIsModalOpen, load, authorToEdit }) => {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [previewURL, setPreviewUrl] = useState<string>('');
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const dispatch = useAppDispatch();
    const isCreateAuthorSuccess = useAppSelector((state) => state.author.isCreateAuthorSuccess);
    const isCreateAuthorFailed = useAppSelector((state) => state.author.isCreateAuthorFailed);
    const isUpdateAuthorSuccess = useAppSelector((state) => state.author.isUpdateAuthorSuccess);
    const isUpdateAuthorFailed = useAppSelector((state) => state.author.isUpdateAuthorFailed);
    const message = useAppSelector((state) => state.author.message);

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<CreateAuthorFormData>({
        resolver: zodResolver(createAuthorSchema),
        defaultValues: {
            name: '',
            birthday: '',
            nationality: '',
            avatar: undefined
        }
    });

    useEffect(() => {
        if (authorToEdit) {
            setValue('name', authorToEdit.name);
            setValue('birthday', authorToEdit.birthday.slice(0, 10));
            setValue('nationality', authorToEdit.nationality);
            const url = `${import.meta.env.VITE_BACKEND_URL}/storage/author/${authorToEdit.avatar}`;
            setPreviewUrl(url);
            setFileList([]);
        } else {
            reset({
                name: '',
                birthday: '',
                nationality: '',
                avatar: undefined
            });
            setPreviewUrl('');
            setFileList([]);
        }
    }, [authorToEdit, setValue, reset]);

    const resetForm = useCallback(() => {
        reset({
            name: '',
            birthday: '',
            nationality: '',
        });
        setPreviewUrl('');
        setFileList([]);
        setIsSubmitting(false);
    }, [reset]);

    const onSubmit = async (data: CreateAuthorFormData) => {
        setIsSubmitting(true);
        let imageFileName = authorToEdit?.avatar || '';

        if (data.avatar && typeof data.avatar !== 'string') {
            try {
                const res = await callUploadSingleFile(data.avatar, 'author');
                if (res.data) {
                    imageFileName = res.data.data?.fileName as string;
                }
            } catch {
                showToast("Tải lên không thành công", ToastType.ERROR);
                setIsSubmitting(false);
                return;
            }
        }
        const birthday = data.birthday.length > 10 ? data.birthday.slice(0, 10) : data.birthday;
        const payload = { ...data, birthday, avatar: imageFileName };
        if (authorToEdit) {
            dispatch(updateAuthor({
                id: authorToEdit.id,
                data: payload as ICreateAuthor
            }));
        } else {
            dispatch(createAuthor(payload as ICreateAuthor));
        }
        setIsSubmitting(false);
    };

    const handleClose = useCallback(() => {
        setIsModalOpen(false);
        if (!authorToEdit) {
            resetForm();
        }
    }, [authorToEdit, setIsModalOpen, resetForm]);

    useEffect(() => {
        if (isCreateAuthorSuccess || isUpdateAuthorSuccess) {
            showToast(`${authorToEdit ? 'Cập nhật' : 'Tạo'} tác giả thành công`, ToastType.SUCCESS);
            dispatch(authorToEdit ? resetUpdateAuthor() : resetCreateAuthor());
            load();
            handleClose();
        }
        if (isCreateAuthorFailed || isUpdateAuthorFailed) {
            showToast(`${authorToEdit ? 'Cập nhật' : 'Tạo'} tác giả không thành công`, ToastType.ERROR);
            dispatch(authorToEdit ? resetUpdateAuthor() : resetCreateAuthor());
            setIsSubmitting(false);
        }
    }, [isCreateAuthorSuccess, isCreateAuthorFailed, isUpdateAuthorSuccess, isUpdateAuthorFailed, dispatch, load, message, authorToEdit, handleClose]);

    return (
        <Modal
            title={
                <span style={{ fontSize: 18, fontWeight: 600 }}>
                    {authorToEdit ? 'Chỉnh sửa tác giả' : 'Tạo tác giả mới'}
                </span>
            }
            open={isModalOpen}
            onCancel={handleClose}
            footer={null}
            width={520}
            destroyOnHidden
            centered
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 16 }}>
                    {/* Name */}
                    <Form.Item
                        label={<><UserOutlined /> Tên tác giả</>}
                        validateStatus={errors.name ? 'error' : ''}
                        help={errors.name?.message}
                        required
                        layout="vertical"
                        style={{ marginBottom: 0 }}
                    >
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    placeholder="Nhập tên tác giả"
                                    size="large"
                                />
                            )}
                        />
                    </Form.Item>

                    {/* Nationality */}
                    <Form.Item
                        label={<><EnvironmentOutlined /> Quê quán</>}
                        validateStatus={errors.nationality ? 'error' : ''}
                        help={errors.nationality?.message}
                        required
                        layout="vertical"
                        style={{ marginBottom: 0 }}
                    >
                        <Controller
                            name="nationality"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    placeholder="Nhập quê quán"
                                    size="large"
                                />
                            )}
                        />
                    </Form.Item>

                    {/* Birthday */}
                    <Form.Item
                        label={<><CalendarOutlined /> Ngày sinh</>}
                        validateStatus={errors.birthday ? 'error' : ''}
                        help={errors.birthday?.message}
                        required
                        layout="vertical"
                        style={{ marginBottom: 0 }}
                    >
                        <Controller
                            name="birthday"
                            control={control}
                            render={({ field }) => (
                                <DatePicker
                                    value={field.value ? dayjs(field.value) : null}
                                    onChange={(_date, dateString) => {
                                        field.onChange(dateString);
                                    }}
                                    style={{ width: '100%' }}
                                    size="large"
                                    format="YYYY-MM-DD"
                                    placeholder="Chọn ngày sinh"
                                />
                            )}
                        />
                    </Form.Item>

                    {/* Avatar Upload */}
                    <Form.Item
                        label="Ảnh đại diện"
                        layout="vertical"
                        style={{ marginBottom: 0 }}
                    >
                        <Upload
                            listType="picture"
                            maxCount={1}
                            fileList={fileList}
                            beforeUpload={(file) => {
                                setValue('avatar', file);
                                setPreviewUrl(URL.createObjectURL(file));
                                setFileList([{
                                    uid: '-1',
                                    name: file.name,
                                    status: 'done',
                                    originFileObj: file,
                                }]);
                                return false; // Prevent auto upload
                            }}
                            onRemove={() => {
                                setValue('avatar', undefined);
                                setPreviewUrl('');
                                setFileList([]);
                            }}
                            accept="image/*"
                        >
                            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                        </Upload>

                        {/* Preview for edit mode (old image) */}
                        {previewURL && fileList.length === 0 && (
                            <div style={{ marginTop: 12 }}>
                                <Image
                                    src={previewURL}
                                    alt="Avatar Preview"
                                    width={96}
                                    height={96}
                                    style={{ objectFit: 'cover', borderRadius: 8 }}
                                />
                            </div>
                        )}
                    </Form.Item>
                </div>

                {/* Footer Actions */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 8,
                    marginTop: 24,
                    paddingTop: 16,
                    borderTop: '1px solid #f0f0f0',
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
                        {authorToEdit ? 'Cập nhật' : 'Tạo mới'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};