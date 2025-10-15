import { zodResolver } from "@hookform/resolvers/zod";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { showToast, ToastType } from "../../../common/showToast";
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import { createSupplier, ICreateSupplier, resetCreateSupplier, resetUpdateSupplier, updateSupplier } from "../../../redux/slide/supplier.slide";
import { callUploadSingleFile } from "../../../services/api";

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
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<CreateSupplierFormData>({
        resolver: zodResolver(createSupplierSchema),
        defaultValues: {
            name: '',
            address: '',
            phone: '',
            email: '',
            description: '',
            image: '',
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
            setPreviewUrl(`${import.meta.env.VITE_BACKEND_URL}/storage/publisher/${supplierToEdit.image}`)
        } else {
            reset({
                name: '',
                address: '',
                phone: '',
                email: '',
                description: '',
                image: '',
            });
            setPreviewUrl('')
        }
    }, [supplierToEdit, setValue, reset]);

    const resetForm = useCallback(() => {
        reset({
            name: '',
            address: '',
            phone: '',
            email: '',
            description: '',
            image: '',
        });
        setPreviewUrl('')
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
            dispatch(updateSupplier({
                id: supplierToEdit.id!,
                data: payload as ICreateSupplier
            }));
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
        <dialog id="publisher_modal" className={`modal ${isModalOpen ? 'modal-open' : ''} modal-bottom sm:modal-middle w-full`}>
            <div className="modal-box">
                <h3 className="font-bold text-lg mb-4">{supplierToEdit ? 'Chỉnh sửa nhà cung cấp' : 'Tạo nhà cung cấp'}</h3>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-control mt-4">
                        <label className="label">
                            <span className="label-text">Tên nhà xuất bản</span>
                        </label>
                        <input
                            type="text"
                            {...register('name')}
                            placeholder="Nhập tên nhà xuất bản"
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
                            <span className="label-text">Địa chỉ</span>
                        </label>
                        <input
                            type="text"
                            {...register('address')}
                            placeholder="Nhập địa chỉ"
                            className={`input input-bordered w-full ${errors.address ? 'input-error' : ''}`}
                        />
                        {errors.address && (
                            <label className="label">
                                <span className="label-text-alt text-error">{errors.address.message}</span>
                            </label>
                        )}
                    </div>

                    <div className="form-control mt-4">
                        <label className="label">
                            <span className="label-text">Số điện thoại</span>
                        </label>
                        <input
                            type="tel"
                            {...register('phone')}
                            placeholder="Nhập số điện thoại"
                            className={`input input-bordered w-full ${errors.phone ? 'input-error' : ''}`}
                        />
                        {errors.phone && (
                            <label className="label">
                                <span className="label-text-alt text-error">{errors.phone.message}</span>
                            </label>
                        )}
                    </div>

                    <div className="form-control mt-4">
                        <label className="label">
                            <span className="label-text">Email</span>
                        </label>
                        <input
                            type="email"
                            {...register('email')}
                            placeholder="Nhập email"
                            className={`input input-bordered w-full ${errors.email ? 'input-error' : ''}`}
                        />
                        {errors.email && (
                            <label className="label">
                                <span className="label-text-alt text-error">{errors.email.message}</span>
                            </label>
                        )}
                    </div>

                    <div className="form-control mt-4">
                        <label className="label">
                            <span className="label-text">Mô tả</span>
                        </label>
                        <textarea
                            {...register('description')}
                            placeholder="Nhập mô tả"
                            className={`textarea textarea-bordered w-full ${errors.description ? 'textarea-error' : ''}`}
                            rows={3}
                        />
                        {errors.description && (
                            <label className="label">
                                <span className="label-text-alt text-error">{errors.description.message}</span>
                            </label>
                        )}
                    </div>

                    <div className="form-control mt-4 space-x-2">
                        <label className="label">
                            <span className="label-text">Ảnh đại diện nhà xuất bản</span>
                        </label>
                        <input
                            type="file"
                            id="avatar-upload"
                            onChange={handleImageChange}
                            accept="image/*"
                            className="hidden"
                        />

                        {/* Nút chọn ảnh thay thế */}
                        <label htmlFor="avatar-upload" className="btn btn-outline btn-sm w-fit">
                            📷 Chọn ảnh
                        </label>
                        {errors.image && (
                            <label className="label">
                                <span className="label-text-alt text-error">{errors.image.message?.toString()}</span>
                            </label>
                        )}
                        {previewUrl && (
                            <div className="mt-2">
                                <img src={previewUrl} alt="Avatar Preview" className="w-24 h-24" />
                            </div>
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
                                supplierToEdit ? 'Cập nhật' : 'Lưu'
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