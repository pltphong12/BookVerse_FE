import { zodResolver } from "@hookform/resolvers/zod";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { showToast, ToastType } from "../../../common/showToast";
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import { createPublisher, ICreatePublisher, resetCreatePublisher, resetUpdatePublisher, updatePublisher } from "../../../redux/slide/publisher.slice";
import { callUploadSingleFile } from "../../../services/api";

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
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<CreatePublisherFormData>({
        resolver: zodResolver(createPublisherSchema),
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
        if (publisherToEdit) {
            setValue('name', publisherToEdit.name);
            setValue('address', publisherToEdit.address);
            setValue('phone', publisherToEdit.phone);
            setValue('email', publisherToEdit.email);
            setValue('description', publisherToEdit.description);
            setValue('image', publisherToEdit.image);
            setPreviewUrl(`${import.meta.env.VITE_BACKEND_URL}/storage/publisher/${publisherToEdit.image}`)
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
    }, [publisherToEdit, setValue, reset]);

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
            dispatch(updatePublisher({
                id: publisherToEdit.id!,
                data: payload as ICreatePublisher
            }));
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
        <dialog id="publisher_modal" className={`modal ${isModalOpen ? 'modal-open' : ''} modal-bottom sm:modal-middle w-full`}>
            <div className="modal-box">
                <h3 className="font-bold text-lg mb-4">{publisherToEdit ? 'Chỉnh sửa nhà xuất bản' : 'Tạo nhà xuất bản'}</h3>
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
                                publisherToEdit ? 'Cập nhật' : 'Lưu'
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