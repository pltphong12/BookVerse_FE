import { zodResolver } from "@hookform/resolvers/zod";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { showToast, ToastType } from "../../../common/showToast";
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import { createCategory, ICreateCategory, resetCreateCategory, resetUpdateCategory, updateCategory } from "../../../redux/slide/categogy.slide";

interface CategoryFormProps {
    load: () => Promise<void>;
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    categoryToEdit?: ICreateCategory | undefined;
}

const createCategorySchema = z.object({
    name: z.string()
        .min(2, 'Tên thể loại ít nhất 2 kí tự')
        .max(100, 'Tên thể loại tối đa 100 kí tự'),  
    description: z.string()
        .min(10, 'Mô tả ít nhất 10 kí tự')
        .max(500, 'Mô tả tối đa 500 kí tự'),
});

type CreateCategoryFormData = z.infer<typeof createCategorySchema>;

export const CategoryForm: React.FC<CategoryFormProps> = ({ isModalOpen, setIsModalOpen, load, categoryToEdit }) => {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    // const [previewUrl, setPreviewUrl] = useState<string>('');
    const dispatch = useAppDispatch();
    const isCreateCategorySuccess = useAppSelector((state) => state.category.isCreateCategorySuccess);
    const isCreateCategoryFailed = useAppSelector((state) => state.category.isCreateCategoryFailed);
    const isUpdateCategorySuccess = useAppSelector((state) => state.category.isUpdateCategorySuccess);
    const isUpdateCategoryFailed = useAppSelector((state) => state.category.isUpdateCategoryFailed);
    const message = useAppSelector((state) => state.category.message);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<CreateCategoryFormData>({
        resolver: zodResolver(createCategorySchema),
        defaultValues: {
            name: '',
            description: '',
        }
    });

    useEffect(() => {
        if (categoryToEdit) {
            setValue('name', categoryToEdit.name);
            setValue('description', categoryToEdit.description);
        } else {
            reset({
                name: '',
                description: '',
            });
        }
    }, [categoryToEdit, setValue, reset]);

    const resetForm = useCallback(() => {
        reset({
            name: '',
            description: '',
        });
        setIsSubmitting(false);
    }, [reset]);


    const onSubmit = async (data: CreateCategoryFormData) => {
        setIsSubmitting(true);
        const payload = { ...data};
        if (categoryToEdit) {
            dispatch(updateCategory({
                id: categoryToEdit.id!,
                data: payload as ICreateCategory
            }));
        } else {
            dispatch(createCategory(payload as ICreateCategory));
        }
        setIsSubmitting(false);
    };

    const handleClose = useCallback(() => {
        setIsModalOpen(false);
        if (!categoryToEdit) {
            resetForm();
        }
    }, [categoryToEdit, setIsModalOpen, resetForm]);

    useEffect(() => {
        if (isCreateCategorySuccess || isUpdateCategorySuccess) {
            showToast(`${categoryToEdit ? 'Cập nhật' : 'Tạo'} thể loại thành công`, ToastType.SUCCESS);
            dispatch(categoryToEdit ? resetUpdateCategory() : resetCreateCategory());
            load();
            handleClose();
        }
        if (isCreateCategoryFailed || isUpdateCategoryFailed) {
            showToast(`${categoryToEdit ? 'Cập nhật' : 'Tạo'} thể loại không thành công ${message}`, ToastType.ERROR);
            dispatch(categoryToEdit ? resetUpdateCategory() : resetCreateCategory());
            setIsSubmitting(false);
        }
    }, [isCreateCategorySuccess, isCreateCategoryFailed, isUpdateCategorySuccess, isUpdateCategoryFailed, dispatch, load, message, categoryToEdit, handleClose]);

    return (
        <dialog id="publisher_modal" className={`modal ${isModalOpen ? 'modal-open' : ''} modal-bottom sm:modal-middle w-full`}>
            <div className="modal-box">
                <h3 className="font-bold text-lg mb-4">{categoryToEdit ? 'Chỉnh sửa nhà xuất bản' : 'Tạo nhà xuất bản'}</h3>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-control mt-4">
                        <label className="label">
                            <span className="label-text">Tên thể loại</span>
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

                    {/* <div className="form-control mt-4">
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
                    </div> */}

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

                    

                    <div className="flex justify-end gap-4 mt-4">
                        <button
                            type="submit"
                            className="btn btn-neutral"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <span className="loading loading-spinner loading-sm"></span>
                            ) : (
                                categoryToEdit ? 'Update' : 'Save'
                            )}
                        </button>
                        <button
                            type="button"
                            className="btn btn-error"
                            onClick={handleClose}
                            disabled={isSubmitting}
                        >
                            Close
                        </button>
                    </div>
                </form>
            </div>
        </dialog>
    );
};