import { zodResolver } from "@hookform/resolvers/zod";
import React, { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { showToast, ToastType } from "../../../../common/showToast";
import { useAppDispatch, useAppSelector } from "../../../../redux/hook";
import { createPermission, ICreatePermission, resetCreatePermission, resetUpdatePermission, updatePermission } from "../../../../redux/slide/permission.slice";
import {
    Modal, Input, Form, Button, Select, Row, Col, Typography
} from 'antd';
import { SaveOutlined, ApiOutlined } from '@ant-design/icons';

const { Title } = Typography;

interface PermissionFormProps {
    load: () => Promise<void>;
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    permissionToEdit?: ICreatePermission | undefined;
}

const METHOD_OPTIONS = [
    { value: 'GET', label: 'GET' },
    { value: 'POST', label: 'POST' },
    { value: 'PUT', label: 'PUT' },
    { value: 'DELETE', label: 'DELETE' },
];

const createPermissionSchema = z.object({
    name: z.string()
        .min(2, 'Tên quyền hạn ít nhất 2 kí tự')
        .max(100, 'Tên quyền hạn tối đa 100 kí tự'),
    apiPath: z.string()
        .min(2, 'Đường dẫn ít nhất 2 kí tự')
        .max(100, 'Đường dẫn tối đa 100 kí tự'),
    domain: z.string()
        .min(2, 'Tên domain ít nhất 2 kí tự')
        .max(100, 'Tên domain tối đa 100 kí tự'),
    method: z.string()
        .min(2, 'Vui lòng chọn phương thức')
        .max(100, 'Phương thức tối đa 100 kí tự'),
});

type CreatePermissionFormData = z.infer<typeof createPermissionSchema>;

export const PermissionForm: React.FC<PermissionFormProps> = ({ isModalOpen, setIsModalOpen, load, permissionToEdit }) => {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const isCreatePermissionSuccess = useAppSelector((state) => state.permission.isCreatePermissionSuccess);
    const isCreatePermissionFailed = useAppSelector((state) => state.permission.isCreatePermissionFailed);
    const isUpdatePermissionSuccess = useAppSelector((state) => state.permission.isUpdatePermissionSuccess);
    const isUpdatePermissionFailed = useAppSelector((state) => state.permission.isUpdatePermissionFailed);
    const message = useAppSelector((state) => state.permission.message);

    const {
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
        control,
    } = useForm<CreatePermissionFormData>({
        resolver: zodResolver(createPermissionSchema),
        defaultValues: {
            name: '', apiPath: '', domain: '', method: '',
        }
    });

    useEffect(() => {
        if (permissionToEdit) {
            setValue('name', permissionToEdit.name);
            setValue('apiPath', permissionToEdit.apiPath);
            setValue('domain', permissionToEdit.domain);
            setValue('method', permissionToEdit.method);
        } else {
            reset({ name: '', apiPath: '', domain: '', method: '' });
        }
    }, [permissionToEdit, setValue, reset]);

    const resetForm = useCallback(() => {
        reset({ name: '', apiPath: '', domain: '', method: '' });
        setIsSubmitting(false);
    }, [reset]);

    const onSubmit = async (data: CreatePermissionFormData) => {
        setIsSubmitting(true);
        const payload = { ...data };
        if (permissionToEdit) {
            dispatch(updatePermission({ id: permissionToEdit.id!, data: payload as ICreatePermission }));
        } else {
            dispatch(createPermission(payload as ICreatePermission));
        }
        setIsSubmitting(false);
    };

    const handleClose = useCallback(() => {
        setIsModalOpen(false);
        if (!permissionToEdit) resetForm();
    }, [permissionToEdit, setIsModalOpen, resetForm]);

    useEffect(() => {
        if (isCreatePermissionSuccess || isUpdatePermissionSuccess) {
            showToast(`${permissionToEdit ? 'Cập nhật' : 'Tạo'} quyền hạn thành công`, ToastType.SUCCESS);
            dispatch(permissionToEdit ? resetUpdatePermission() : resetCreatePermission());
            load();
            handleClose();
        }
        if (isCreatePermissionFailed || isUpdatePermissionFailed) {
            showToast(`${permissionToEdit ? 'Cập nhật' : 'Tạo'} quyền hạn không thành công ${message}`, ToastType.ERROR);
            dispatch(permissionToEdit ? resetUpdatePermission() : resetCreatePermission());
            setIsSubmitting(false);
        }
    }, [isCreatePermissionSuccess, isCreatePermissionFailed, isUpdatePermissionSuccess, isUpdatePermissionFailed, dispatch, load, message, permissionToEdit, handleClose]);

    return (
        <Modal
            title={
                <Title level={4} style={{ margin: 0 }}>
                    <ApiOutlined /> {permissionToEdit ? 'Chỉnh sửa quyền hạn' : 'Tạo quyền hạn mới'}
                </Title>
            }
            open={isModalOpen}
            onCancel={handleClose}
            footer={null}
            width={560}
            destroyOnHidden
            centered
            styles={{ body: { padding: '16px 24px' } }}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Name */}
                <Form.Item
                    label="Tên quyền hạn"
                    validateStatus={errors.name ? 'error' : ''}
                    help={errors.name?.message}
                    required
                    layout="vertical"
                >
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <Input {...field} placeholder="Nhập tên quyền hạn" />
                        )}
                    />
                </Form.Item>

                {/* API Path */}
                <Form.Item
                    label="Đường dẫn API"
                    validateStatus={errors.apiPath ? 'error' : ''}
                    help={errors.apiPath?.message}
                    required
                    layout="vertical"
                >
                    <Controller
                        name="apiPath"
                        control={control}
                        render={({ field }) => (
                            <Input {...field} placeholder="/api/v1/..." style={{ fontFamily: 'monospace' }} />
                        )}
                    />
                </Form.Item>

                <Row gutter={16}>
                    <Col xs={24} md={12}>
                        {/* Domain */}
                        <Form.Item
                            label="Domain"
                            validateStatus={errors.domain ? 'error' : ''}
                            help={errors.domain?.message}
                            required
                            layout="vertical"
                        >
                            <Controller
                                name="domain"
                                control={control}
                                render={({ field }) => (
                                    <Input {...field} placeholder="Nhập tên domain" />
                                )}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        {/* Method */}
                        <Form.Item
                            label="Phương thức HTTP"
                            validateStatus={errors.method ? 'error' : ''}
                            help={errors.method?.message}
                            required
                            layout="vertical"
                        >
                            <Controller
                                name="method"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        style={{ width: '100%' }}
                                        placeholder="Chọn phương thức"
                                        options={METHOD_OPTIONS}
                                        getPopupContainer={(trigger) => trigger.parentElement!}
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
                        {permissionToEdit ? 'Cập nhật' : 'Tạo mới'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};