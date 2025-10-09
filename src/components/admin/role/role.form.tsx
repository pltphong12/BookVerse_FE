import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { showToast, ToastType } from "../../../common/showToast";
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import { createRole, ICreateRole, resetCreateRole, resetUpdateRole, updateRole } from "../../../redux/slide/role.slide";
import { callFetchAllPermissionsApi } from "../../../services/api";
import { IPermission } from "../../../types/backend";
import { PermissionSelector } from "./PermissionSelector";

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
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm<CreateRoleFormData>({
        resolver: zodResolver(createRoleSchema),
        defaultValues: {
            name: '',
            description: '',
            permissions: [],
        }
    });

    const watchedPermissions = watch('permissions');

    // Fetch all permissions with pagination and filter
    const { data: permissionsQuery } = useQuery({
        queryKey: ['fetchAllPermissions'],
        queryFn: callFetchAllPermissionsApi,
        refetchOnWindowFocus: false
    })
    useEffect(() => {
        if (permissionsQuery?.data.data) {
            setPermissionsByDomain(permissionsQuery.data.data.reduce((acc: Record<string, IPermission[]>, permission) => {
                const domain = permission.domain || 'Khác';
                if (!acc[domain]) {
                    acc[domain] = [];
                }
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
            reset({
                name: '',
                description: '',
                permissions: [],
            });
        }
    }, [roleToEdit, setValue, reset]);

    const resetForm = useCallback(() => {
        reset({
            name: '',
            description: '',
            permissions: [],
        });
        setIsSubmitting(false);
    }, [reset]);

    // Handle permission selection
    const handlePermissionToggle = (permission: IPermission) => {
        const currentPermissions = watchedPermissions || [];
        const isSelected = currentPermissions.some(p => p.id === permission.id);

        if (isSelected) {
            // Remove permission
            const updatedPermissions = currentPermissions.filter(p => p.id !== permission.id);
            setValue('permissions', updatedPermissions);
        } else {
            // Add permission
            const updatedPermissions = [...currentPermissions, permission];
            setValue('permissions', updatedPermissions);
        }
    };

    // Handle select all permissions in a domain
    const handleDomainToggle = (domain: string) => {
        const domainPermissions = permissionsByDomain[domain] || [];
        const currentPermissions = watchedPermissions || [];

        // Check if all permissions in domain are selected
        const allSelected = domainPermissions.every(permission =>
            currentPermissions.some(p => p.id === permission.id)
        );

        if (allSelected) {
            // Remove all permissions from this domain
            const updatedPermissions = currentPermissions.filter(p =>
                !domainPermissions.some(dp => dp.id === p.id)
            );
            setValue('permissions', updatedPermissions);
        } else {
            // Add all permissions from this domain
            const newPermissions = domainPermissions.filter(permission =>
                !currentPermissions.some(p => p.id === permission.id)
            );
            setValue('permissions', [...currentPermissions, ...newPermissions]);
        }
    };

    // Check if permission is selected
    const isPermissionSelected = (permissionId: number) => {
        return watchedPermissions?.some(p => p.id === permissionId) || false;
    };

    // Check if all permissions in domain are selected
    const isDomainFullySelected = (domain: string) => {
        const domainPermissions = permissionsByDomain[domain] || [];
        const currentPermissions = watchedPermissions || [];
        return domainPermissions.length > 0 && domainPermissions.every(permission =>
            currentPermissions.some(p => p.id === permission.id)
        );
    };

    // Check if some permissions in domain are selected
    const isDomainPartiallySelected = (domain: string) => {
        const domainPermissions = permissionsByDomain[domain] || [];
        const currentPermissions = watchedPermissions || [];
        const selectedCount = domainPermissions.filter(permission =>
            currentPermissions.some(p => p.id === permission.id)
        ).length;
        return selectedCount > 0 && selectedCount < domainPermissions.length;
    };


    const onSubmit = async (data: CreateRoleFormData) => {
        setIsSubmitting(true);
        const payload = { ...data };
        if (roleToEdit) {
            dispatch(updateRole({
                id: roleToEdit.id!,
                data: payload as ICreateRole
            }));
        } else {
            dispatch(createRole(payload as ICreateRole));
        }
        setIsSubmitting(false);
    };

    const handleClose = useCallback(() => {
        setIsModalOpen(false);
        if (!roleToEdit) {
            resetForm();
        }
    }, [roleToEdit, setIsModalOpen, resetForm]);

    useEffect(() => {
        if (isCreateRoleSuccess || isUpdateRoleSuccess) {
            showToast(`${roleToEdit ? 'Cập nhật' : 'Tạo'}  vai trò thành công`, ToastType.SUCCESS);
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
        <dialog id="publisher_modal" className={`modal ${isModalOpen ? 'modal-open' : ''} modal-bottom sm:modal-middle w-full`}>
            <div className="modal-box min-w-[60%]">
                <h3 className="font-bold text-lg mb-4">{roleToEdit ? 'Chỉnh sửa vai trò' : 'Tạo vai trò'}</h3>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-control mt-4">
                        <label className="label">
                            <span className="label-text">Tên vai trò</span>
                        </label>
                        <input
                            type="text"
                            {...register('name')}
                            placeholder="Nhập tên vai trò"
                            className={`input input-bordered w-full ${errors.name ? 'input-error' : ''}`}
                        />
                        {errors.name && (
                            <label className="label">
                                <span className="label-text-alt text-error">{errors.name.message}</span>
                            </label>
                        )}
                    </div>

                    <div className="form-control mt-4">
                        <label className="label">
                            <span className="label-text">Mô tả vai trò</span>
                        </label>
                        <input
                            type="text"
                            {...register('description')}
                            placeholder="Nhập mô tả vai trò"
                            className={`input input-bordered w-full ${errors.description ? 'input-error' : ''}`}
                        />
                        {errors.description && (
                            <label className="label">
                                <span className="label-text-alt text-error">{errors.description.message}</span>
                            </label>
                        )}
                    </div>

                    <div className="form-control mt-4">
                        <label className="label">
                            <span className="label-text">Quyền hạn</span>
                            <span className="label-text-alt">
                                {watchedPermissions?.length || 0} quyền đã chọn
                            </span>
                        </label>
                        <PermissionSelector
                            permissionsByDomain={permissionsByDomain}
                            onPermissionToggle={handlePermissionToggle}
                            onDomainToggle={handleDomainToggle}
                            isPermissionSelected={isPermissionSelected}
                            isDomainFullySelected={isDomainFullySelected}
                            isDomainPartiallySelected={isDomainPartiallySelected}
                        />
                        {errors.permissions && (
                            <label className="label">
                                <span className="label-text-alt text-error">{errors.permissions.message}</span>
                            </label>
                        )}
                    </div>

                    <div className="flex justify-end gap-4 mt-4">
                        <button
                            type="submit"
                            className="btn btn-neutral"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <span className="loading loading-spinner loading-sm"></span>
                            ) : (
                                roleToEdit ? 'Cập nhật' : 'Lưu'
                            )}
                        </button>
                        <button
                            type="button"
                            className="btn btn-error"
                            onClick={handleClose}
                            disabled={isSubmitting}
                        >
                            Đóng
                        </button>
                    </div>
                </form>
            </div>
        </dialog>
    );
};