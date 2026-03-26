import { zodResolver } from "@hookform/resolvers/zod";
import { Star, X } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Select from 'react-select';
import { z } from "zod";
import { showToast, ToastType } from "../../../common/showToast";
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import { createBook, ICreateBook, ICreateBookImage, resetCreateBook, resetUpdateBook, updateBook } from "../../../redux/slide/book.slice";
import { IAuthorInBook, ICategoryInBook, IPublisher, ISupplier } from "../../../types/backend";
import { callUploadBatchFiles } from "../../../services/api";

interface ImageItem {
    uid: string;
    file?: File;
    previewUrl: string;
    relativePath?: string;
    primary: boolean;
    sortOrder: number;
}

interface BookFormProps {
    load: () => Promise<void>;
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    bookToEdit?: ICreateBook | undefined;
    publishers: IPublisher[];
    suppliers: ISupplier[];
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
    supplier: z.object({
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
    discount: z.number()
        .min(0, 'Giảm giá phải lớn hơn 0')
        .max(100, 'Giảm giá tối đa 100%'),
    quantity: z.number()
        .min(0, 'Số lượng phải lớn hơn 0')
        .int('Số lượng phải là số nguyên'),
    publishYear: z.number()
        .min(0, "Năm xuất bản phải từ 0 trở lên")
        .max(new Date().getFullYear(), "Năm xuất bản không được vượt quá năm hiện tại")
        .int("Năm xuất bản phải là số nguyên"),
    weight: z.number()
        .min(1, "Trọng lượng phải lớn hơn 0")
        .max(10000, "Trọng lượng không được vượt quá 10kg")
        .int("Trọng lượng phải là số nguyên"),
    dimensions: z.string()
        .min(1, "Kích thước phải lớn hơn 1 kí tự")
        .max(100, "Kích thước không được vượt quá 100 kí tự"),
    numberOfPages: z.number()
        .min(1, "Số trang phải lớn hơn 0")
        .max(10000, "Số trang không được vượt quá 10,000")
        .int("Số trang phải là số nguyên"),
    coverFormat: z.enum(["PAPERBACK", "HARDCOVER"], {
        errorMap: () => ({ message: "Vui lòng chọn định dạng bìa" })
    }),

    description: z.string()
        .min(10, 'Mô tả ít nhất 10 kí tự')
        .max(1000, 'Mô tả tối đa 1000 kí tự'),
});

type CreateBookFormData = z.infer<typeof createBookSchema>;

export const BookForm: React.FC<BookFormProps> = ({ isModalOpen, setIsModalOpen, load, bookToEdit, publishers, authors, categories, suppliers }) => {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [imageItems, setImageItems] = useState<ImageItem[]>([]);
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
            supplier: { id: 0 },
            authors: [],
            category: { id: 0 },
            price: 0,
            discount: 0,
            quantity: 0,
            publishYear: 0,
            weight: 0,
            dimensions: '',
            numberOfPages: 0,
            coverFormat: 'PAPERBACK',
            description: '',
        }
    });

    useEffect(() => {
        if (bookToEdit) {
            setValue('title', bookToEdit.title);
            setValue('publisher', bookToEdit.publisher);
            setValue('supplier', bookToEdit.supplier);
            setValue('authors', bookToEdit.authors.map(author => ({ id: author.id })));
            setValue('category', bookToEdit.category);
            setValue('price', bookToEdit.price);
            setValue('discount', bookToEdit.discount);
            setValue('quantity', bookToEdit.quantity);
            setValue('description', bookToEdit.description);
            setValue('publishYear', bookToEdit.publishYear);
            setValue('weight', bookToEdit.weight);
            setValue('dimensions', bookToEdit.dimensions);
            setValue('numberOfPages', bookToEdit.numberOfPages);
            setValue('coverFormat', bookToEdit.coverFormat === "Bìa mềm" ? "PAPERBACK" : "HARDCOVER");

            if (bookToEdit.images && bookToEdit.images.length > 0) {
                setImageItems(bookToEdit.images.map((img, idx) => ({
                    uid: `existing-${img.relativePath}`,
                    previewUrl: `${import.meta.env.VITE_BACKEND_URL}/storage/book/${img.relativePath}`,
                    relativePath: img.relativePath,
                    primary: img.primary,
                    sortOrder: img.sortOrder ?? idx
                })));
            } else if (bookToEdit.image) {
                setImageItems([{
                    uid: `existing-${bookToEdit.image}`,
                    previewUrl: `${import.meta.env.VITE_BACKEND_URL}/storage/book/${bookToEdit.image}`,
                    relativePath: bookToEdit.image,
                    primary: true,
                    sortOrder: 0
                }]);
            }
        } else {
            reset({
                title: '',
                publisher: { id: 0 },
                supplier: { id: 0 },
                authors: [],
                category: { id: 0 },
                price: 0,
                discount: 0,
                quantity: 0,
                publishYear: 0,
                weight: 0,
                dimensions: '',
                numberOfPages: 0,
                coverFormat: 'PAPERBACK',
                description: '',
            });
            setImageItems([]);
        }
    }, [bookToEdit, setValue, reset]);

    const resetForm = useCallback(() => {
        reset({
            title: '',
            publisher: { id: 0 },
            supplier: { id: 0 },
            authors: [],
            category: { id: 0 },
            price: 0,
            discount: 0,
            quantity: 0,
            publishYear: 0,
            weight: 0,
            dimensions: '',
            numberOfPages: 0,
            coverFormat: 'PAPERBACK',
            description: '',
        });
        setImageItems([]);
        setIsSubmitting(false);
    }, [reset]);

    const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);
            setImageItems(prev => {
                const hasPrimary = prev.some(item => item.primary);
                const newItems: ImageItem[] = newFiles.map((file, index) => ({
                    uid: `${Date.now()}-${index}-${file.name}`,
                    file,
                    previewUrl: URL.createObjectURL(file),
                    primary: !hasPrimary && prev.length === 0 && index === 0,
                    sortOrder: prev.length + index
                }));
                return [...prev, ...newItems];
            });
            e.target.value = '';
        }
    };

    const handleRemoveImage = (uid: string) => {
        setImageItems(prev => {
            const filtered = prev.filter(item => item.uid !== uid);
            if (filtered.length > 0 && !filtered.some(item => item.primary)) {
                filtered[0].primary = true;
            }
            return filtered.map((item, idx) => ({ ...item, sortOrder: idx }));
        });
    };

    const handleSetPrimary = (uid: string) => {
        setImageItems(prev => prev.map(item => ({
            ...item,
            primary: item.uid === uid
        })));
    };

    const onSubmit = async (data: CreateBookFormData) => {
        setIsSubmitting(true);

        if (imageItems.length === 0) {
            showToast("Vui lòng chọn ít nhất 1 ảnh", ToastType.ERROR);
            setIsSubmitting(false);
            return;
        }

        const newFiles = imageItems.filter(item => item.file);
        let uploadedFileNames: string[] = [];

        if (newFiles.length > 0) {
            try {
                const res = await callUploadBatchFiles(
                    newFiles.map(item => item.file!),
                    'book'
                );
                if (res.data?.data) {
                    uploadedFileNames = res.data.data.map(f => f.fileName);
                }
            } catch {
                showToast("Tải ảnh lên không thành công", ToastType.ERROR);
                setIsSubmitting(false);
                return;
            }
        }

        let newFileIndex = 0;
        const images: ICreateBookImage[] = imageItems.map((item, idx) => {
            if (item.file) {
                return {
                    relativePath: uploadedFileNames[newFileIndex++],
                    sortOrder: idx,
                    primary: item.primary
                };
            }
            return {
                relativePath: item.relativePath!,
                sortOrder: idx,
                primary: item.primary
            };
        });

        const primaryImage = images.find(img => img.primary);
        const formData = {
            ...data,
            image: primaryImage?.relativePath || '',
            images
        };

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
            <div className="modal-box min-w-[60%]">
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
                            <span className="label-text">Nhà cung cấp</span>
                        </label>
                        <Controller
                            name="supplier.id"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    options={suppliers.map(supplier => ({
                                        value: supplier.id,
                                        label: supplier.name
                                    }))}
                                    value={suppliers
                                        .filter(supplier => supplier.id === field.value)
                                        .map(supplier => ({
                                            value: supplier.id,
                                            label: supplier.name
                                        }))[0]}
                                    onChange={(selected) => {
                                        field.onChange(selected?.value || 0);
                                    }}
                                    className={`${errors.supplier ? 'border-error' : ''}`}
                                    placeholder="Chọn nhà cung cấp"
                                />
                            )}
                        />
                        {errors.supplier && (
                            <label className="label">
                                <span className="label-text-alt text-error">{errors.supplier.message}</span>
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
                                <span className="label-text">Giảm giá</span>
                            </label>
                            <input
                                type="number"
                                {...register('discount', { valueAsNumber: true })}
                                placeholder="Nhập giảm giá"
                                className={`input input-bordered w-full ${errors.discount ? 'input-error' : ''}`}
                            />

                            {errors.discount && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.discount.message}</span>
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

                    <div className="flex gap-4">
                        <div className="form-control w-full mt-4">
                            <label className="label">
                                <span className="label-text">Năm xuất bản</span>
                            </label>
                            <input
                                type="number"
                                {...register('publishYear', { valueAsNumber: true })}
                                placeholder="Nhập năm xuất bản"
                                className={`input input-bordered w-full ${errors.publishYear ? 'input-error' : ''}`}
                            />
                            {errors.publishYear && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.publishYear.message}</span>
                                </label>
                            )}
                        </div>

                        <div className="form-control w-full mt-4">
                            <label className="label">
                                <span className="label-text">Trọng lượng (gr)</span>
                            </label>
                            <input
                                type="number"
                                {...register('weight', { valueAsNumber: true })}
                                placeholder="Nhập trọng lượng"
                                className={`input input-bordered w-full ${errors.weight ? 'input-error' : ''}`}
                            />

                            {errors.weight && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.weight.message}</span>
                                </label>
                            )}
                        </div>

                        <div className="form-control w-full mt-4">
                            <label className="label">
                                <span className="label-text">Số trang</span>
                            </label>
                            <input
                                type="number"
                                {...register('numberOfPages', { valueAsNumber: true })}
                                placeholder="Nhập số trang"
                                className={`input input-bordered w-full ${errors.numberOfPages ? 'input-error' : ''}`}
                            />
                            {errors.numberOfPages && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.numberOfPages.message}</span>
                                </label>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="form-control w-full mt-4">
                            <label className="label">
                                <span className="label-text">Kích thước</span>
                            </label>
                            <input
                                type="text"
                                {...register('dimensions')}
                                placeholder="Nhập kích thước"
                                className={`input input-bordered w-full ${errors.dimensions ? 'input-error' : ''}`}
                            />
                            {errors.dimensions && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.dimensions.message}</span>
                                </label>
                            )}
                        </div>

                        <div className="form-control w-full mt-4">
                            <label className="label">
                                <span className="label-text">Định dạng bìa</span>
                            </label>
                            <select
                                {...register('coverFormat')}
                                className={`select select-bordered w-full ${errors.coverFormat ? 'select-error' : ''}`}
                            >
                                <option value="PAPERBACK">Bìa Mềm (Paperback)</option>
                                <option value="HARDCOVER">Bìa Cứng (Hardcover)</option>
                            </select>

                            {errors.coverFormat && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.coverFormat.message}</span>
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

                    <div className="form-control mt-4">
                        <label className="label">
                            <span className="label-text">Ảnh sách</span>
                        </label>
                        <div className="flex flex-wrap gap-3 mt-1">
                            {imageItems.map((item) => (
                                <div
                                    key={item.uid}
                                    className={`relative group w-24 h-24 rounded-lg overflow-hidden border-2 ${item.primary ? 'border-yellow-400' : 'border-base-300'}`}
                                >
                                    <img
                                        src={item.previewUrl}
                                        alt="preview"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                                        <button
                                            type="button"
                                            title="Đặt ảnh chính"
                                            className={`btn btn-xs btn-circle ${item.primary ? 'btn-warning' : 'btn-ghost text-white'}`}
                                            onClick={() => handleSetPrimary(item.uid)}
                                        >
                                            <Star size={14} fill={item.primary ? 'currentColor' : 'none'} />
                                        </button>
                                        <button
                                            type="button"
                                            title="Xóa ảnh"
                                            className="btn btn-xs btn-circle btn-error"
                                            onClick={() => handleRemoveImage(item.uid)}
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                    {item.primary && (
                                        <span className="absolute top-0.5 left-0.5 bg-yellow-400 text-black text-[10px] px-1 rounded font-semibold">
                                            Chính
                                        </span>
                                    )}
                                </div>
                            ))}
                            <label className="w-24 h-24 rounded-lg border-2 border-dashed border-base-300 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
                                <span className="text-2xl leading-none">+</span>
                                <span className="text-xs mt-1">Thêm ảnh</span>
                                <input
                                    type="file"
                                    multiple
                                    onChange={handleImagesChange}
                                    accept="image/*"
                                    className="hidden"
                                />
                            </label>
                        </div>
                        {imageItems.length > 0 && (
                            <p className="text-xs text-base-content/50 mt-1">Hover vào ảnh để đặt ảnh chính hoặc xóa. Ảnh có viền vàng là ảnh chính.</p>
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
            </div >
        </dialog >
    );
};
