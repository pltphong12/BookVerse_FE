import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import { createUser, ICreateUser, resetCreateUser, updateUser, resetUpdateUser } from "../../../redux/slide/user.slice";
import { showToast, ToastType } from "../../../common/showToast";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { IUser, IRole } from "../../../types/backend";
import Select from 'react-select';
import { callUploadSingleFile } from "../../../services/api";

interface UserFormProps {
    load: () => Promise<void>;
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    userToEdit?: IUser | undefined;
    roles: IRole[];
}

const createUserSchema = z.object({
    username: z.string()
        .min(2, 'Tên đăng nhập có ít nhất 2 kí tự')
        .max(50, 'Tên đăng nhập có nhiều nhất 50 kí tự'),
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
        .min(10, 'Số điện thoại có ít nhất 2 kí tự')
        .max(15, 'Số điện thoại có nhiều nhất 50 kí tự')
        .regex(/^[0-9+\-\s()]*$/, ''),
    role: z.object({
        id: z.string()
    }),
    avatar: z.any().optional()
});

type CreateUserFormData = z.infer<typeof createUserSchema>;

export const UserForm: React.FC<UserFormProps> = ({ isModalOpen, setIsModalOpen, load, userToEdit, roles }) => {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const dispatch = useAppDispatch();
    const isCreateUserSuccess = useAppSelector((state) => state.user.isCreateUserSuccess);
    const isCreateUserFailed = useAppSelector((state) => state.user.isCreateUserFailed);
    const isUpdateUserSuccess = useAppSelector((state) => state.user.isUpdateUserSuccess);
    const isUpdateUserFailed = useAppSelector((state) => state.user.isUpdateUserFailed);
    const message = useAppSelector((state) => state.user.message);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
        control
    } = useForm<CreateUserFormData>({
        resolver: zodResolver(createUserSchema),
        defaultValues: {
            username: '',
            password: '',
            fullName: '',
            email: '',
            address: '',
            phone: '',
            role: { id: '1' },
            avatar: undefined
        }
    });

    useEffect(() => {
        if (userToEdit) {
            setValue('username', userToEdit.username);
            setValue('fullName', userToEdit.fullName);
            setValue('email', userToEdit.email);
            setValue('address', userToEdit.address);
            setValue('phone', userToEdit.phone);
            setValue('role.id', userToEdit.role.id.toString());
            setAvatarPreview(`${import.meta.env.VITE_BACKEND_URL}/storage/avatar/${userToEdit.avatar}`);
        } else {
            reset({
                username: '',
                password: '',
                fullName: '',
                email: '',
                address: '',
                phone: '',
                role: { id: '1' },
                avatar: undefined
            });
            setAvatarPreview('')
        }
    }, [userToEdit, setValue, reset, setAvatarPreview]);

    const resetForm = () => {
        reset({
            username: '',
            password: '',
            fullName: '',
            email: '',
            address: '',
            phone: '',
            role: { id: '1' },
            avatar: undefined
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

    const onSubmit = async (data: CreateUserFormData) => {
        setIsSubmitting(true);
        let avatarFileName = userToEdit?.avatar || '';

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
            role: {
                id: Number(data.role.id)
            },
            password: data.password || '',
            avatar: avatarFileName,
        };

        if (userToEdit) {
            dispatch(updateUser({
                id: userToEdit.id,
                data: formData
            }));
        } else {
            dispatch(createUser(formData as ICreateUser));
        }

    };

    const handleClose = () => {
        if (userToEdit !== undefined) {
            setIsModalOpen(false);
        } else {
            setIsModalOpen(false);
            resetForm();
        }
    };

    useEffect(() => {
        if (isCreateUserSuccess || isUpdateUserSuccess) {
            showToast(`${userToEdit ? 'Cập nhật' : 'Tạo'} người dùng thành công`, ToastType.SUCCESS);
            dispatch(userToEdit ? resetUpdateUser() : resetCreateUser());
            load();
            handleClose();
            setIsSubmitting(false);
        }
        if (isCreateUserFailed || isUpdateUserFailed) {
            showToast(`${userToEdit ? 'Cập nhật' : 'Tạo'} người dùng không thành công`, ToastType.ERROR);
            dispatch(userToEdit ? resetUpdateUser() : resetCreateUser());
            setIsSubmitting(false);
        }
    }, [isCreateUserSuccess, isCreateUserFailed, isUpdateUserSuccess, isUpdateUserFailed, dispatch, load, message, userToEdit]);

    return (
        <dialog id="user_modal" className={`modal ${isModalOpen ? 'modal-open' : ''} modal-bottom sm:modal-middle w-full`}>
            <div className="modal-box">
                <h3 className="font-bold text-lg mb-4">{userToEdit ? 'Chỉnh sửa người dùng' : 'Tạo người dùng'}</h3>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-control mt-4">
                        <label className="label">
                            <span className="label-text">Tên đăng nhập</span>
                        </label>
                        <input
                            type="text"
                            {...register('username')}
                            placeholder="Nhập tên đăng nhập"
                            className={`input input-bordered w-full ${errors.username ? 'input-error' : ''}`}
                            disabled={!!userToEdit}
                        />
                        {errors.username && (
                            <label className="label">
                                <span className="label-text-alt text-error">{errors.username.message}</span>
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
                    {!userToEdit && (
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
                                <span className="label-text">Vai trò</span>
                            </label>
                            <Controller
                                name="role.id"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={roles.map(role => ({
                                            value: role.id.toString(),
                                            label: role.name
                                        }))}
                                        value={roles
                                            .filter(role => role.id.toString() === field.value)
                                            .map(role => ({
                                                value: role.id.toString(),
                                                label: role.name
                                            }))[0]}
                                        onChange={(selected) => {
                                            field.onChange(selected?.value || '1');
                                        }}
                                        className={`${errors.role ? 'border-error' : ''}`}
                                        placeholder="Chọn vai trò"
                                    />
                                )}
                            />
                            {errors.role && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.role?.message}</span>
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
                                userToEdit ? 'Cập nhật' : 'Tạo người dùng'
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
