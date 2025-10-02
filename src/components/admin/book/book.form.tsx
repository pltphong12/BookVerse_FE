import { zodResolver } from "@hookform/resolvers/zod";
import React, { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Select from 'react-select';
import { z } from "zod";
import { showToast, ToastType } from "../../../common/showToast";
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import { createBook, ICreateBook, resetCreateBook, resetUpdateBook, updateBook } from "../../../redux/slide/book.slice";
import { IAuthorInBook, ICategoryInBook, IPublisher } from "../../../types/backend";
import { callUploadSingleFile } from "../../../services/api";

interface BookFormProps {
    load: () => Promise<void>;
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    bookToEdit?: ICreateBook | undefined;
    publishers: IPublisher[];
    authors: IAuthorInBook[];
    categories: ICategoryInBook[];
}

const createBookSchema = z.object({
    title: z.string()
        .min(2, 'Tên sách ít nhất 2 kí tự')
        .max(200, 'Tên sách tối đa 200 kí tự'),
    publisher: z.object({
        id: z.number()
    }),
    authors: z.array(z.object({
        id: z.number()
    })).min(1, 'Chọn ít nhất 1 tác giả'),
    category: z.object({
        id: z.number()
    }),
    price: z.number()
        .min(0, 'Giá sách phải lớn hơn 0'),
    quantity: z.number()
        .min(0, 'Số lượng phải lớn hơn 0')
        .int('Số lượng phải là số nguyên'),
    description: z.string()
        .min(10, 'Mô tả ít nhất 10 kí tự')
        .max(1000, 'Mô tả tối đa 1000 kí tự'),
    image: z.any()
        .optional()
});

type CreateBookFormData = z.infer<typeof createBookSchema>;

export const BookForm: React.FC<BookFormProps> = ({ isModalOpen, setIsModalOpen, load, bookToEdit, publishers, authors, categories }) => {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const dispatch = useAppDispatch();
    const isCreateBookSuccess = useAppSelector((state) => state.book.isCreateBookSuccess);
    const isCreateBookFailed = useAppSelector((state) => state.book.isCreateBookFailed);
    const isUpdateBookSuccess = useAppSelector((state) => state.book.isUpdateBookSuccess);
    const isUpdateBookFailed = useAppSelector((state) => state.book.isUpdateBookFailed);
    const message = useAppSelector((state) => state.book.message);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
        control
    } = useForm<CreateBookFormData>({
        resolver: zodResolver(createBookSchema),
        defaultValues: {
            title: '',
            publisher: { id: 0 },
            authors: [],
            category: { id: 0 },
            price: 0,
            quantity: 0,
            description: '',
            image: undefined
        }
    });

    useEffect(() => {
        if (bookToEdit) {
            setValue('title', bookToEdit.title);
            setValue('publisher', bookToEdit.publisher);
            setValue('authors', bookToEdit.authors.map(author => ({ id: author.id })));
            setValue('category.id', bookToEdit.category.id);
            setValue('price', bookToEdit.price);
            setValue('quantity', bookToEdit.quantity);
            setValue('description', bookToEdit.description);
            setPreviewUrl(`${import.meta.env.VITE_BACKEND_URL}/storage/book/${bookToEdit.image}`);
        } else {
            reset({
                title: '',
                publisher: { id: 0 },
                authors: [],
                category: { id: 0 },
                price: 0,
                quantity: 0,
                description: '',
                image: undefined
            });
            setPreviewUrl('');
        }
    }, [bookToEdit, setValue, reset, setPreviewUrl]);

    const resetForm = useCallback(() => {
        reset({
            title: '',
            publisher: { id: 0 },
            authors: [],
            category: { id: 0 },
            price: 0,
            quantity: 0,
            description: '',
        });
        setPreviewUrl('');
        setIsSubmitting(false);
    }, [reset, setPreviewUrl, setIsSubmitting]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setValue('image', file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const onSubmit = async (data: CreateBookFormData) => {
        setIsSubmitting(true);
        let imageFileName = bookToEdit?.image || '';

        if (data.image && typeof data.image !== 'string') {
            try {
                const res = await callUploadSingleFile(data.image, 'book');
                if (res.data) {
                    imageFileName = res.data.data?.fileName as string;
                }
            } catch (error) {
                showToast("Tải lên không thành công", ToastType.ERROR);
                setIsSubmitting(false);
                return;
            }
        }
        const formData = {
            ...data,
            image: imageFileName
        }
        console.log(formData)
        if (bookToEdit) {
            dispatch(updateBook({
                id: bookToEdit.id,
                data: formData as ICreateBook
            }));
        } else {
            dispatch(createBook(formData as ICreateBook));
        }
        setIsSubmitting(false);
    };

    const handleClose = useCallback(() => {
        if (bookToEdit !== undefined) {
            setIsModalOpen(false);
        } else {
            setIsModalOpen(false);
            resetForm();
        }
    }, [bookToEdit, setIsModalOpen, resetForm]);

    useEffect(() => {
        if (isCreateBookSuccess || isUpdateBookSuccess) {
            showToast(`${bookToEdit ? 'Cập nhật' : 'Tạo'} sách thành công`, ToastType.SUCCESS);
            dispatch(bookToEdit ? resetUpdateBook() : resetCreateBook());
            load();
            handleClose();
        }
        if (isCreateBookFailed || isUpdateBookFailed) {
            showToast(`${bookToEdit ? 'Cập nhật' : 'Tạo'} sách không thành công ${message}`, ToastType.ERROR);
            dispatch(bookToEdit ? resetUpdateBook() : resetCreateBook());
            setIsSubmitting(false);
        }
    }, [isCreateBookSuccess, isCreateBookFailed, isUpdateBookSuccess, isUpdateBookFailed, dispatch, load, message, bookToEdit, handleClose]);

    return (
        <dialog id="book_modal" className={`modal ${isModalOpen ? 'modal-open' : ''} modal-bottom sm:modal-middle w-full`}>
            <div className="modal-box">
                <h3 className="font-bold text-lg mb-4">{bookToEdit ? 'Chỉnh sửa sách' : 'Tạo sách'}</h3>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-control mt-4">
                        <label className="label">
                            <span className="label-text">Tên sách</span>
                        </label>
                        <input
                            type="text"
                            {...register('title')}
                            placeholder="Nhập tên sách"
                            className={`input input-bordered w-full ${errors.title ? 'input-error' : ''}`}
                        />
                        {errors.title && (
                            <label className="label">
                                <span className="label-text-alt text-error">{errors.title.message}</span>
                            </label>
                        )}
                    </div>

                    <div className="form-control mt-4">
                        <label className="label">
                            <span className="label-text">Nhà xuất bản</span>
                        </label>
                        <Controller
                            name="publisher.id"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    options={publishers.map(publisher => ({
                                        value: publisher.id,
                                        label: publisher.name
                                    }))}
                                    value={publishers
                                        .filter(publisher => publisher.id === field.value)
                                        .map(publisher => ({
                                            value: publisher.id,
                                            label: publisher.name
                                        }))[0]}
                                    onChange={(selected) => {
                                        field.onChange(selected?.value || 0);
                                    }}
                                    className={`${errors.publisher ? 'border-error' : ''}`}
                                    placeholder="Chọn nhà xuất bản"
                                />
                            )}
                        />
                        {errors.publisher && (
                            <label className="label">
                                <span className="label-text-alt text-error">{errors.publisher.message}</span>
                            </label>
                        )}
                    </div>

                    <div className="form-control mt-4">
                        <label className="label">
                            <span className="label-text">Tác giả</span>
                        </label>
                        <Controller
                            name="authors"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    isMulti
                                    options={authors.map(author => ({
                                        value: author.id,
                                        label: author.name
                                    }))}
                                    value={authors
                                        .filter(author => field.value?.some(v => v.id === author.id))
                                        .map(author => ({
                                            value: author.id,
                                            label: author.name
                                        }))}
                                    onChange={(selected) => {
                                        field.onChange(selected?.map(option => ({ id: option.value })) || []);
                                    }}
                                    className={`${errors.authors ? 'border-error' : ''}`}
                                    placeholder="Chọn tác giả"
                                />
                            )}
                        />
                        {errors.authors && (
                            <label className="label">
                                <span className="label-text-alt text-error">{errors.authors.message}</span>
                            </label>
                        )}
                    </div>

                    <div className="form-control mt-4">
                        <label className="label">
                            <span className="label-text">Thể loại</span>
                        </label>
                        <Controller
                            name="category.id"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    options={categories.map(category => ({
                                        value: category.id,
                                        label: category.name
                                    }))}
                                    value={categories
                                        .filter(category => category.id === field.value)
                                        .map(category => ({
                                            value: category.id,
                                            label: category.name
                                        }))[0]}
                                    onChange={(selected) => {
                                        field.onChange(selected?.value || 0);
                                    }}
                                    className={`${errors.category ? 'border-error' : ''}`}
                                    placeholder="Chọn thể loại"
                                />
                            )}
                        />
                        {errors.category && (
                            <label className="label">
                                <span className="label-text-alt text-error">{errors.category.message}</span>
                            </label>
                        )}
                    </div>

                    <div className="flex gap-4">
                        <div className="form-control w-full mt-4">
                            <label className="label">
                                <span className="label-text">Giá</span>
                            </label>
                            <input
                                type="number"
                                {...register('price', { valueAsNumber: true })}
                                placeholder="Nhập giá bán"
                                className={`input input-bordered w-full ${errors.price ? 'input-error' : ''}`}
                            />
                            {errors.price && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.price.message}</span>
                                </label>
                            )}
                        </div>

                        <div className="form-control w-full mt-4">
                            <label className="label">
                                <span className="label-text">Số lượng</span>
                            </label>
                            <input
                                type="number"
                                {...register('quantity', { valueAsNumber: true })}
                                placeholder="Nhập số lượng"
                                className={`input input-bordered w-full ${errors.quantity ? 'input-error' : ''}`}
                            />
                            {errors.quantity && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.quantity.message}</span>
                                </label>
                            )}
                        </div>
                    </div>

                    <div className="form-control mt-4">
                        <label className="label">
                            <span className="label-text">Mô tả</span>
                        </label>
                        <textarea
                            {...register('description')}
                            placeholder="Nhập mô tả"
                            className={`textarea textarea-bordered w-full ${errors.description ? 'textarea-error' : ''}`}
                            rows={4}
                        />
                        {errors.description && (
                            <label className="label">
                                <span className="label-text-alt text-error">{errors.description.message}</span>
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
                                bookToEdit ? 'Cập nhật' : 'Tạo'
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
