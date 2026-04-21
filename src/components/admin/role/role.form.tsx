import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import React, { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { showToast, ToastType } from "../../../common/showToast";
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import { createRole, ICreateRole, resetCreateRole, resetUpdateRole, updateRole } from "../../../redux/slide/role.slide";
import { callFetchAllPermissionsApi } from "../../../services/api";
import { IPermission } from "../../../types/backend";
import { PermissionSelector } from "./PermissionSelector";
import {
    Modal, Input, Form, Button, Typography, Badge
} from 'antd';
import { SaveOutlined, SafetyCertificateOutlined, ApiOutlined } from '@ant-design/icons';

const { Title } = Typography;

interface RoleFormProps {
    load: () => Promise<void>;
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    roleToEdit?: ICreateRole | undefined;
}

const createRoleSchema = z.object({
    name: z.string()
        .min(2, 'Tên vai trò ít nhất 2 kí tự')
        .max(100, 'Tên vai trò tối đa 100 kí tự'),
    description: z.string()
        .min(2, 'Mô tả vai trò ít nhất 2 kí tự')
        .max(100, 'Mô tả vai trò tối đa 100 kí tự'),
    permissions: z.array(z.object({
        id: z.number(),
        name: z.string(),
        apiPath: z.string(),
        domain: z.string(),
        method: z.string(),
    })),
});

type CreateRoleFormData = z.infer<typeof createRoleSchema>;

export const RoleForm: React.FC<RoleFormProps> = ({ isModalOpen, setIsModalOpen, load, roleToEdit }) => {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [permissionsByDomain, setPermissionsByDomain] = useState<Record<string, IPermission[]>>({});
    const dispatch = useAppDispatch();
    const isCreateRoleSuccess = useAppSelector((state) => state.role.isCreateRoleSuccess);
    const isCreateRoleFailed = useAppSelector((state) => state.role.isCreateRoleFailed);
    const isUpdateRoleSuccess = useAppSelector((state) => state.role.isUpdateRoleSuccess);
    const isUpdateRoleFailed = useAppSelector((state) => state.role.isUpdateRoleFailed);
    const message = useAppSelector((state) => state.role.message);

    const {
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
        control,
    } = useForm<CreateRoleFormData>({
        resolver: zodResolver(createRoleSchema),
        defaultValues: {
            name: '',
            description: '',
            permissions: [],
        }
    });

    const watchedPermissions = watch('permissions');

    // Fetch all permissions
    const { data: permissionsQuery } = useQuery({
        queryKey: ['fetchAllPermissions'],
        queryFn: callFetchAllPermissionsApi,
        refetchOnWindowFocus: false,
        retry: false,
    });

    useEffect(() => {
        if (permissionsQuery?.data.data) {
            setPermissionsByDomain(permissionsQuery.data.data.reduce((acc: Record<string, IPermission[]>, permission) => {
                const domain = permission.domain || 'Khác';
                if (!acc[domain]) acc[domain] = [];
                acc[domain].push(permission);
                return acc;
            }, {}));
        }
    }, [permissionsQuery]);

    useEffect(() => {
        if (roleToEdit) {
            setValue('name', roleToEdit.name);
            setValue('description', roleToEdit.description);
            setValue('permissions', roleToEdit.permissions);
        } else {
            reset({ name: '', description: '', permissions: [] });
        }
    }, [roleToEdit, setValue, reset]);

    const resetForm = useCallback(() => {
        reset({ name: '', description: '', permissions: [] });
        setIsSubmitting(false);
    }, [reset]);

    // Handle permission selection
    const handlePermissionToggle = (permission: IPermission) => {
        const currentPermissions = watchedPermissions || [];
        const isSelected = currentPermissions.some(p => p.id === permission.id);
        if (isSelected) {
            setValue('permissions', currentPermissions.filter(p => p.id !== permission.id));
        } else {
            setValue('permissions', [...currentPermissions, permission]);
        }
    };

    // Handle select all permissions in a domain
    const handleDomainToggle = (domain: string) => {
        const domainPermissions = permissionsByDomain[domain] || [];
        const currentPermissions = watchedPermissions || [];
        const allSelected = domainPermissions.every(p => currentPermissions.some(cp => cp.id === p.id));

        if (allSelected) {
            setValue('permissions', currentPermissions.filter(p => !domainPermissions.some(dp => dp.id === p.id)));
        } else {
            const newPerms = domainPermissions.filter(p => !currentPermissions.some(cp => cp.id === p.id));
            setValue('permissions', [...currentPermissions, ...newPerms]);
        }
    };

    const isPermissionSelected = (permissionId: number) =>
        watchedPermissions?.some(p => p.id === permissionId) || false;

    const isDomainFullySelected = (domain: string) => {
        const domainPerms = permissionsByDomain[domain] || [];
        return domainPerms.length > 0 && domainPerms.every(p => watchedPermissions?.some(cp => cp.id === p.id));
    };

    const isDomainPartiallySelected = (domain: string) => {
        const domainPerms = permissionsByDomain[domain] || [];
        const count = domainPerms.filter(p => watchedPermissions?.some(cp => cp.id === p.id)).length;
        return count > 0 && count < domainPerms.length;
    };

    const onSubmit = async (data: CreateRoleFormData) => {
        setIsSubmitting(true);
        const payload = { ...data };
        if (roleToEdit) {
            dispatch(updateRole({ id: roleToEdit.id!, data: payload as ICreateRole }));
        } else {
            dispatch(createRole(payload as ICreateRole));
        }
        setIsSubmitting(false);
    };

    const handleClose = useCallback(() => {
        setIsModalOpen(false);
        if (!roleToEdit) resetForm();
    }, [roleToEdit, setIsModalOpen, resetForm]);

    useEffect(() => {
        if (isCreateRoleSuccess || isUpdateRoleSuccess) {
            showToast(`${roleToEdit ? 'Cập nhật' : 'Tạo'} vai trò thành công`, ToastType.SUCCESS);
            dispatch(roleToEdit ? resetUpdateRole() : resetCreateRole());
            load();
            handleClose();
        }
        if (isCreateRoleFailed || isUpdateRoleFailed) {
            showToast(`${roleToEdit ? 'Cập nhật' : 'Tạo'} vai trò không thành công ${message}`, ToastType.ERROR);
            dispatch(roleToEdit ? resetUpdateRole() : resetCreateRole());
            setIsSubmitting(false);
        }
    }, [isCreateRoleSuccess, isCreateRoleFailed, isUpdateRoleSuccess, isUpdateRoleFailed, dispatch, load, message, roleToEdit, handleClose]);

    return (
        <Modal
            title={
                <Title level={4} style={{ margin: 0 }}>
                    <SafetyCertificateOutlined /> {roleToEdit ? 'Chỉnh sửa vai trò' : 'Tạo vai trò mới'}
                </Title>
            }
            open={isModalOpen}
            onCancel={handleClose}
            footer={null}
            width={800}
            destroyOnHidden
            centered
            styles={{ body: { maxHeight: '80vh', overflowY: 'auto', padding: '16px 24px' } }}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Name */}
                <Form.Item
                    label="Tên vai trò"
                    validateStatus={errors.name ? 'error' : ''}
                    help={errors.name?.message}
                    required
                    layout="vertical"
                >
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <Input {...field} placeholder="Nhập tên vai trò (ADMIN, MANAGER, ...)" size="large" />
                        )}
                    />
                </Form.Item>

                {/* Description */}
                <Form.Item
                    label="Mô tả vai trò"
                    validateStatus={errors.description ? 'error' : ''}
                    help={errors.description?.message}
                    required
                    layout="vertical"
                >
                    <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                            <Input {...field} placeholder="Nhập mô tả vai trò" />
                        )}
                    />
                </Form.Item>

                {/* Permissions */}
                <Form.Item
                    label={
                        <span>
                            <ApiOutlined /> Quyền hạn{' '}
                            <Badge
                                count={watchedPermissions?.length || 0}
                                style={{ backgroundColor: '#1677ff' }}
                            />
                        </span>
                    }
                    validateStatus={errors.permissions ? 'error' : ''}
                    help={errors.permissions?.message}
                    layout="vertical"
                >
                    <PermissionSelector
                        permissionsByDomain={permissionsByDomain}
                        onPermissionToggle={handlePermissionToggle}
                        onDomainToggle={handleDomainToggle}
                        isPermissionSelected={isPermissionSelected}
                        isDomainFullySelected={isDomainFullySelected}
                        isDomainPartiallySelected={isDomainPartiallySelected}
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
                        {roleToEdit ? 'Cập nhật' : 'Tạo mới'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};