import { zodResolver } from "@hookform/resolvers/zod";
import React, { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { showToast, ToastType } from "../../../../common/showToast";
import { useAppDispatch, useAppSelector } from "../../../../redux/hook";
import { createPermission, ICreatePermission, resetCreatePermission, resetUpdatePermission, updatePermission } from "../../../../redux/slide/permission.slice";
import Select from 'react-select';

interface PermissionFormProps {
    load: () => Promise<void>;
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    permissionToEdit?: ICreatePermission | undefined;
}

const createPermissionSchema = z.object({
    name: z.string()
        .min(2, 'Tên thể loại ít nhất 2 kí tự')
        .max(100, 'Tên thể loại tối đa 100 kí tự'),
    apiPath: z.string()
        .min(2, 'Tên đường dẫn ít nhất 2 kí tự')
        .max(100, 'Tên đường dẫn tối đa 100 kí tự'),
    method: z.string()
        .min(2, 'Tên phương thức nhất 2 kí tự')
        .max(100, 'Tên phương thức tối đa 100 kí tự'),
});

type CreatePermissionFormData = z.infer<typeof createPermissionSchema>;

export const PermissionForm: React.FC<PermissionFormProps> = ({ isModalOpen, setIsModalOpen, load, permissionToEdit }) => {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    // const [previewUrl, setPreviewUrl] = useState<string>('');
    const dispatch = useAppDispatch();
    const isCreatePermissionSuccess = useAppSelector((state) => state.permission.isCreatePermissionSuccess);
    const isCreatePermissionFailed = useAppSelector((state) => state.permission.isCreatePermissionFailed);
    const isUpdatePermissionSuccess = useAppSelector((state) => state.permission.isUpdatePermissionSuccess);
    const isUpdatePermissionFailed = useAppSelector((state) => state.permission.isUpdatePermissionFailed);
    const message = useAppSelector((state) => state.permission.message);
    const methodList = ['GET', 'POST', 'PUT', 'DELETE']


    const {
        register,
        handleSubmit,
        reset,
        control,
        setValue,
        formState: { errors },
    } = useForm<CreatePermissionFormData>({
        resolver: zodResolver(createPermissionSchema),
        defaultValues: {
            name: '',
            apiPath: '',
            method: '',
        }
    });

    useEffect(() => {
        if (permissionToEdit) {
            setValue('name', permissionToEdit.name);
            setValue('apiPath', permissionToEdit.apiPath);
            setValue('method', permissionToEdit.method);
        } else {
            reset({
                name: '',
                apiPath: '',
                method: '',
            });
        }
    }, [permissionToEdit, setValue, reset]);

    const resetForm = useCallback(() => {
        reset({
            name: '',
            apiPath: '',
            method: '',
        });
        setIsSubmitting(false);
    }, [reset]);


    const onSubmit = async (data: CreatePermissionFormData) => {
        setIsSubmitting(true);
        const payload = { ...data };
        if (permissionToEdit) {
            dispatch(updatePermission({
                id: permissionToEdit.id!,
                data: payload as ICreatePermission
            }));
        } else {
            dispatch(createPermission(payload as ICreatePermission));
        }
        setIsSubmitting(false);
    };

    const handleClose = useCallback(() => {
        setIsModalOpen(false);
        if (!permissionToEdit) {
            resetForm();
        }
    }, [permissionToEdit, setIsModalOpen, resetForm]);

    useEffect(() => {
        if (isCreatePermissionSuccess || isUpdatePermissionSuccess) {
            showToast(`${permissionToEdit ? 'Cập nhật' : 'Tạo'}  quyền hạn thành công`, ToastType.SUCCESS);
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
        <dialog id="publisher_modal" className={`modal ${isModalOpen ? 'modal-open' : ''} modal-bottom sm:modal-middle w-full`}>
            <div className="modal-box">
                <h3 className="font-bold text-lg mb-4">{permissionToEdit ? 'Chỉnh sửa quyền hạn' : 'Tạo quyền hạn'}</h3>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-control mt-4">
                        <label className="label">
                            <span className="label-text">Tên quyền hạn</span>
                        </label>
                        <input
                            type="text"
                            {...register('name')}
                            placeholder="Nhập tên quyền hạn"
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
                            <span className="label-text">Tên đường dẫn</span>
                        </label>
                        <input
                            type="text"
                            {...register('apiPath')}
                            placeholder="Nhập tên đường dẫn"
                            className={`input input-bordered w-full ${errors.apiPath ? 'input-error' : ''}`}
                        />
                        {errors.apiPath && (
                            <label className="label">
                                <span className="label-text-alt text-error">{errors.apiPath.message}</span>
                            </label>
                        )}
                    </div>

                    <div className="form-control mt-4">
                        <label className="label">
                            <span className="label-text">Phương thức</span>
                        </label>
                        <Controller
                            name="method"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    options={methodList.map(category => ({
                                        value: category,
                                        label: category
                                    }))}
                                    value={methodList
                                        .filter(category => category === field.value)
                                        .map(category => ({
                                            value: category,
                                            label: category
                                        }))[0]}
                                    onChange={(selected) => {
                                        field.onChange(selected?.value || 0);
                                    }}
                                    className={`${errors.method ? 'border-error' : ''}`}
                                    placeholder="Chọn phương thức"
                                />
                            )}
                        />
                        {errors.method && (
                            <label className="label">
                                <span className="label-text-alt text-error">{errors.method.message}</span>
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
                                permissionToEdit ? 'Cập nhật' : 'Lưu'
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