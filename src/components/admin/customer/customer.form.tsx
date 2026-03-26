import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Select from 'react-select';
import { z } from "zod";
import { showToast, ToastType } from "../../../common/showToast";
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import { createCustomer, ICreateCustomer, resetCreateCustomer, resetUpdateCustomer, updateCustomer } from "../../../redux/slide/customer.slide";
import { callUploadSingleFile } from "../../../services/api";
import { ICustomer } from "../../../types/backend";

interface CustomerFormProps {
    load: () => Promise<void>;
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    customerToEdit?: ICustomer | undefined;
}

const createCustomerSchema = z.object({
    identityCard: z.string()
        .min(10, 'Mã CCCD có ít nhất 10 kí tự')
        .max(12, 'Mã CCCD có nhiều nhất 12 kí tự'),
    password: z.string()
        .optional(),
    fullName: z.string()
        .min(2, 'Họ và tên có ít nhất 2 kí tự')
        .max(100, 'Họ và tên có nhiều nhất 50 kí tự'),
    email: z.string()
        .email('Email không hợp lệ'),
    address: z.string()
        .min(5, 'Địa chỉ có ít nhất 2 kí tự')
        .max(200, 'Địa chỉ có nhiều nhất 50 kí tự'),
    phone: z.string()
        .min(10, 'Số điện thoại có ít nhất 10 kí tự')
        .max(15, 'Số điện thoại có nhiều nhất 50 kí tự')
        .regex(/^[0-9+\-\s()]*$/, ''),
    avatar: z.any().optional(),
    customerLevel: z.string()
        .min(1, 'Loại khách hàng có ít nhất 1 kí tự')
        .max(50, 'Loại khách hàng có nhiều nhất 50 kí tự'),
});

type CreateCustomerFormData = z.infer<typeof createCustomerSchema>;

export const CustomerForm: React.FC<CustomerFormProps> = ({ isModalOpen, setIsModalOpen, load, customerToEdit }) => {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const dispatch = useAppDispatch();
    const isCreateCustomerSuccess = useAppSelector((state) => state.customer.isCreateCustomerSuccess);
    const isCreateCustomerFailed = useAppSelector((state) => state.customer.isCreateCustomerFailed);
    const isUpdateCustomerSuccess = useAppSelector((state) => state.customer.isUpdateCustomerSuccess);
    const isUpdateCustomerFailed = useAppSelector((state) => state.customer.isUpdateCustomerFailed);
    const message = useAppSelector((state) => state.customer.message);
    const customerLevelList = ['BRONZE', 'SILVER', 'GOLD', 'DIAMOND'];

    const {
        register,
        handleSubmit,
        reset,
        control,
        setValue,
        formState: { errors },
    } = useForm<CreateCustomerFormData>({
        resolver: zodResolver(createCustomerSchema),
        defaultValues: {
            password: '',
            fullName: '',
            email: '',
            address: '',
            phone: '',
            avatar: undefined,
            customerLevel: 'BRONZE',
        }
    });

    useEffect(() => {
        if (customerToEdit) {
            setValue('identityCard', customerToEdit.identityCard);
            setValue('fullName', customerToEdit.user.fullName);
            setValue('email', customerToEdit.user.email);
            setValue('address', customerToEdit.user.address);
            setValue('phone', customerToEdit.user.phone);
            if (customerToEdit?.customerLevel === 'Đồng') {
                setValue('customerLevel', 'BRONZE');
            } else if (customerToEdit?.customerLevel === 'Bạc') {
                setValue('customerLevel', 'SILVER');
                } else if (customerToEdit?.customerLevel === 'Vàng') {
                setValue('customerLevel', 'GOLD');
            } else if (customerToEdit?.customerLevel === 'Kim cương') {
                setValue('customerLevel', 'DIAMOND');
            }
            setAvatarPreview(`${import.meta.env.VITE_BACKEND_URL}/storage/avatar/${customerToEdit.user.avatar}`);
        } else {
            reset({
                password: '',
                fullName: '',
                email: '',
                address: '',
                phone: '',
                avatar: undefined,
                customerLevel: 'BRONZE',
            });
            setAvatarPreview('')
        }
    }, [customerToEdit, setValue, reset, setAvatarPreview]);

    const resetForm = () => {
        reset({
            password: '',
            fullName: '',
            email: '',
            address: '',
            phone: '',
            avatar: undefined,
            customerLevel: 'BRONZE',
        });
        setAvatarPreview('');
        setIsSubmitting(false);
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setValue('avatar', file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const onSubmit = async (data: CreateCustomerFormData) => {
        setIsSubmitting(true);
        let avatarFileName = customerToEdit?.user.avatar || '';

        if (data.avatar && typeof data.avatar !== 'string') {
            try {
                const res = await callUploadSingleFile(data.avatar, 'avatar');
                if (res.data) {
                    avatarFileName = res.data.data?.fileName as string;
                }
            } catch (error) {
                showToast("Ảnh đại diện tải lên không thành công", ToastType.ERROR);
                setIsSubmitting(false);
                return;
            }
        }

        const formData = {
            ...data,
            password: data.password || '',
            avatar: avatarFileName,
        };

        if (customerToEdit) {
            dispatch(updateCustomer({
                id: customerToEdit.id,
                data: formData as ICreateCustomer
            }));
        } else {
            dispatch(createCustomer(formData as ICreateCustomer));
        }

    };

    const handleClose = () => {
        if (customerToEdit !== undefined) {
            setIsModalOpen(false);
        } else {
            setIsModalOpen(false);
            resetForm();
        }
    };

    useEffect(() => {
        if (isCreateCustomerSuccess || isUpdateCustomerSuccess) {
            showToast(`${customerToEdit ? 'Cập nhật' : 'Tạo'} khách hàng thành công`, ToastType.SUCCESS);
            dispatch(customerToEdit ? resetUpdateCustomer() : resetCreateCustomer());
            load();
            handleClose();
            setIsSubmitting(false);
        }
        if (isCreateCustomerFailed || isUpdateCustomerFailed) {
            showToast(`${customerToEdit ? 'Cập nhật' : 'Tạo'} khách hàng không thành công`, ToastType.ERROR);
            dispatch(customerToEdit ? resetUpdateCustomer() : resetCreateCustomer());
            setIsSubmitting(false);
        }
    }, [isCreateCustomerSuccess, isCreateCustomerFailed, isUpdateCustomerSuccess, isUpdateCustomerFailed, dispatch, load, message, customerToEdit]);

    return (
        <dialog id="user_modal" className={`modal ${isModalOpen ? 'modal-open' : ''} modal-bottom sm:modal-middle w-full`}>
            <div className="modal-box min-w-[60%]">
                <h3 className="font-bold text-lg mb-4">{customerToEdit ? 'Chỉnh sửa khách hàng' : 'Tạo khách hàng'}</h3>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-control w-full mt-4">
                        <label className="label">
                            <span className="label-text">Mã CCCD</span>
                        </label>
                        <input type="text" {...register('identityCard')} placeholder="Nhập mã CCCD" className={`input input-bordered w-full ${errors.identityCard ? 'input-error' : ''}`} />
                        {errors.identityCard && (
                            <label className="label">
                                <span className="label-text-alt text-error">{errors.identityCard.message}</span>
                            </label>
                        )}
                    </div>
                    <div className="flex gap-4">
                        <div className="form-control w-full mt-4">
                            <label className="label">
                                <span className="label-text">Họ và tên</span>
                            </label>
                            <input type="text" {...register('fullName')} placeholder="Nhập họ và tên" className={`input input-bordered w-full ${errors.fullName ? 'input-error' : ''}`} />
                            {errors.fullName && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.fullName.message}</span>
                                </label>
                            )}
                        </div>
                        <div className="form-control w-full mt-4">
                            <label className="label">
                                <span className="label-text">Địa chỉ</span>
                            </label>
                            <input type="text" {...register('address')} placeholder="Nhập địa chỉ" className={`input input-bordered w-full ${errors.address ? 'input-error' : ''}`} />
                            {errors.address && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.address.message}</span>
                                </label>
                            )}
                        </div>
                    </div>
                    {!customerToEdit && (
                        <div className="form-control w-full mt-4">
                            <label className="label">
                                <span className="label-text">Mật khẩu</span>
                            </label>
                            <input type="password" {...register('password')} placeholder="Nhập mật khẩu" className={`input input-bordered w-full ${errors.password ? 'input-error' : ''}`} />
                            {errors.password && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.password.message}</span>
                                </label>
                            )}
                        </div>
                    )}
                    <div className="form-control w-full mt-4">
                        <label className="label">
                            <span className="label-text">Email</span>
                        </label>
                        <input type="email" {...register('email')} placeholder="Nhập email" className={`input input-bordered w-full ${errors.email ? 'input-error' : ''}`} />
                        {errors.email && (
                            <label className="label">
                                <span className="label-text-alt text-error">{errors.email.message}</span>
                            </label>
                        )}
                    </div>
                    <div className="flex gap-4">
                        <div className="form-control w-full mt-4">
                            <label className="label">
                                <span className="label-text">Số điện thoại</span>
                            </label>
                            <input type="text" {...register('phone')} placeholder="Nhập số điện thoại" className={`input input-bordered w-full ${errors.phone ? 'input-error' : ''}`} />
                            {errors.phone && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.phone.message}</span>
                                </label>
                            )}
                        </div>
                        <div className="form-control w-full mt-4">
                            <label className="label">
                                <span className="label-text">Cấp bậc khách hàng</span>
                            </label>
                            <Controller
                                name="customerLevel"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={customerLevelList.map(customerLevel => ({
                                            value: customerLevel,
                                            label: customerLevel
                                        }))}
                                        value={customerLevelList
                                            .filter(customerLevel => customerLevel === field.value)
                                            .map(customerLevel => ({
                                                value: customerLevel,
                                                label: customerLevel
                                            }))[0]}
                                        onChange={(selected) => {
                                            field.onChange(selected?.value || '');
                                        }}
                                        className={`${errors.customerLevel ? 'border-error' : ''}`}
                                        placeholder="Chọn cấp bậc khách hàng"
                                        menuPortalTarget={document.body}
                                        styles={{
                                            menuPortal: (base) => ({ ...base, zIndex: 1000 })
                                        }}
                                    />
                                )}
                            />
                            {errors.customerLevel && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.customerLevel?.message}</span>
                                </label>
                            )}
                        </div>
                    </div>
                    <div className="form-control mt-4 space-x-2">
                        <label className="label">
                            <span className="label-text">Ảnh đại diện</span>
                        </label>
                        <input
                            type="file"
                            id="avatar-upload"
                            onChange={handleAvatarChange}
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
                        {avatarPreview && (
                            <div className="mt-2">
                                <img src={avatarPreview} alt="Avatar Preview" className="w-24 h-24" />
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
                                customerToEdit ? 'Cập nhật' : 'Tạo khách hàng'
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
