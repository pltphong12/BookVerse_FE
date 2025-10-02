import { zodResolver } from "@hookform/resolvers/zod";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { showToast, ToastType } from "../../../common/showToast";
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import { createAuthor, ICreateAuthor, resetCreateAuthor, resetUpdateAuthor, updateAuthor } from "../../../redux/slide/author.slice";
import { callUploadSingleFile } from "../../../services/api";

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
    const dispatch = useAppDispatch();
    const isCreateAuthorSuccess = useAppSelector((state) => state.author.isCreateAuthorSuccess);
    const isCreateAuthorFailed = useAppSelector((state) => state.author.isCreateAuthorFailed);
    const isUpdateAuthorSuccess = useAppSelector((state) => state.author.isUpdateAuthorSuccess);
    const isUpdateAuthorFailed = useAppSelector((state) => state.author.isUpdateAuthorFailed);
    const message = useAppSelector((state) => state.author.message);

    const {
        register,
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
            setPreviewUrl(`${import.meta.env.VITE_BACKEND_URL}/storage/author/${authorToEdit.avatar}`)
        } else {
            reset({
                name: '',
                birthday: '',
                nationality: '',
                avatar: undefined
            });
        }
    }, [authorToEdit, setValue, reset]);

    const resetForm = useCallback(() => {
        reset({
            name: '',
            birthday: '',
            nationality: '',
        });
        setPreviewUrl('')
        setIsSubmitting(false);
    }, [reset]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setValue('avatar', file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const onSubmit = async (data: CreateAuthorFormData) => {
        setIsSubmitting(true);
        let imageFileName = authorToEdit?.avatar || '';

        if (data.avatar && typeof data.avatar !== 'string') {
            try {
                const res = await callUploadSingleFile(data.avatar, 'author');
                if (res.data) {
                    imageFileName = res.data.data?.fileName as string;
                }
            } catch (error) {
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
        <dialog id="author_modal" className={`modal ${isModalOpen ? 'modal-open' : ''} modal-bottom sm:modal-middle w-full`}>
            <div className="modal-box">
                <h3 className="font-bold text-lg mb-4">{authorToEdit ? 'Chỉnh sửa tác giả' : 'Tạo tác giả'}</h3>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-control mt-4">
                        <label className="label">
                            <span className="label-text">Tên tác giả</span>
                        </label>
                        <input
                            type="text"
                            {...register('name')}
                            placeholder="Enter author name"
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
                            <span className="label-text">Quê quán</span>
                        </label>
                        <input
                            type="text"
                            {...register('nationality')}
                            placeholder="Enter nationality"
                            className={`input input-bordered w-full ${errors.nationality ? 'input-error' : ''}`}
                        />
                        {errors.nationality && (
                            <label className="label">
                                <span className="label-text-alt text-error">{errors.nationality.message}</span>
                            </label>
                        )}
                    </div>

                    <div className="form-control mt-4">
                        <label className="label">
                            <span className="label-text">Ngày sinh</span>
                        </label>
                        <input
                            type="date"
                            {...register('birthday')}
                            className={`input input-bordered w-full ${errors.birthday ? 'input-error' : ''}`}
                        />
                        {errors.birthday && (
                            <label className="label">
                                <span className="label-text-alt text-error">{errors.birthday.message}</span>
                            </label>
                        )}
                    </div>

                    <div className="form-control mt-4 space-x-2">
                        <label className="label">
                            <span className="label-text">Ảnh sách</span>
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
                        {errors.avatar && (
                            <label className="label">
                                <span className="label-text-alt text-error">{errors.avatar.message?.toString()}</span>
                            </label>
                        )}
                        {previewURL && (
                            <div className="mt-2">
                                <img src={previewURL} alt="Avatar Preview" className="w-24 h-24" />
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
                                authorToEdit ? 'Cập nhật' : 'Tạo'
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