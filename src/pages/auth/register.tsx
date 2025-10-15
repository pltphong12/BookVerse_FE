import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Logo from '../../assets/logo.png';
import { callRegisterApi } from '../../services/api';
import { showToast, ToastType } from '../../common/showToast';
import { AxiosError } from 'axios';

const registerSchema = z.object({
    username: z.string()
        .min(2, 'Username must be at least 2 characters')
        .max(50, 'Username must be less than 50 characters'),
    password: z.string()
        .min(6, 'Password must be at least 6 characters')
        .max(50, 'Password must be less than 50 characters'),
    fullName: z.string()
        .min(2, 'Full name must be at least 2 characters')
        .max(100, 'Full name must be less than 100 characters'),
    address: z.string()
        .min(5, 'Address must be at least 5 characters')
        .max(200, 'Address must be less than 200 characters'),
    phone: z.string()
        .min(10, 'Phone number must be at least 10 digits')
        .max(15, 'Phone number must be less than 15 digits')
        .regex(/^[0-9+\-\s()]*$/, 'Phone number can only contain digits, spaces, and special characters (+, -, (, ))')
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterPage = () => {
    const [loading, setLoading] = React.useState<boolean>(false);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            username: '',
            password: '',
            fullName: '',
            address: '',
            phone: ''
        }
    });

    const onSubmit = async (data: RegisterFormData) => {
        setLoading(true);
        try {
            const res = await callRegisterApi(
                data.username,
                data.password,
                data.fullName,
                data.address,
                data.phone
            );
            showToast(`Register successfully username: ${res.data.data?.username}`, ToastType.SUCCESS);
            setTimeout(() => {
                navigate('/login');
                setLoading(false);
            }, 1000);
        } catch (error) {
            if (error instanceof AxiosError) {
                showToast(`${error.response?.data?.error}`, ToastType.ERROR);
                setTimeout(() => {
                    setLoading(false);
                }, 1000);
            }
        }
    };

    return (
        <div className="min-h-screen bg-base-200 flex items-center bg-gradient-to-br from-blue-300 to-purple-400">
            <div className="card mx-auto w-10/12 shadow-xl">
                <div className="grid md:grid-cols-2 grid-cols-1 bg-base-100 rounded-xl">
                    <div className=''>
                        <img
                            src={Logo}
                            alt="Bookverse Logo"
                            style={{
                                width: 'auto',
                                height: 'auto',
                                objectFit: 'contain',
                                filter: 'brightness(0) saturate(100%) invert(39%) sepia(57%) saturate(2000%) hue-rotate(200deg) brightness(96%) contrast(94%)',
                            }}
                        />
                    </div>
                    <div className='py-24 px-10'>
                        <h2 className='text-2xl font-semibold mb-2 text-center'>Đăng ký</h2>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="mb-4">
                                <div className="form-control w-full mt-4">
                                    <label className="label">
                                        <span className="label-text text-base-content">Tên đăng nhập</span>
                                    </label>
                                    <input
                                        type="text"
                                        {...register('username')}
                                        placeholder="Nhập tên đăng nhập"
                                        className={`input input-bordered w-full ${errors.username ? 'input-error' : ''}`}
                                    />
                                    {errors.username && (
                                        <label className="label">
                                            <span className="label-text-alt text-error">{errors.username.message}</span>
                                        </label>
                                    )}
                                </div>

                                <div className="form-control w-full mt-4">
                                    <label className="label">
                                        <span className="label-text text-base-content">Mật khẩu</span>
                                    </label>
                                    <input
                                        type="password"
                                        {...register('password')}
                                        placeholder="Nhập mật khẩu"
                                        className={`input input-bordered w-full ${errors.password ? 'input-error' : ''}`}
                                    />
                                    {errors.password && (
                                        <label className="label">
                                            <span className="label-text-alt text-error">{errors.password.message}</span>
                                        </label>
                                    )}
                                </div>

                                <div className="form-control w-full mt-4">
                                    <label className="label">
                                        <span className="label-text text-base-content">Họ và tên</span>
                                    </label>
                                    <input
                                        type="text"
                                        {...register('fullName')}
                                        placeholder="Nhập họ và tên"
                                        className={`input input-bordered w-full ${errors.fullName ? 'input-error' : ''}`}
                                    />
                                    {errors.fullName && (
                                        <label className="label">
                                            <span className="label-text-alt text-error">{errors.fullName.message}</span>
                                        </label>
                                    )}
                                </div>

                                <div className="form-control w-full mt-4">
                                    <label className="label">
                                        <span className="label-text text-base-content">Địa chỉ</span>
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

                                <div className="form-control w-full mt-4">
                                    <label className="label">
                                        <span className="label-text text-base-content">Số điện thoại</span>
                                    </label>
                                    <input
                                        type="text"
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
                            </div>

                            <button
                                type="submit"
                                className="btn mt-2 w-full btn-primary"
                                disabled={loading}
                            >
                                {loading ? <span className="loading loading-spinner loading-l"></span> : 'Đăng ký'}
                            </button>

                            <div className='text-center mt-4'>
                                Nếu bạn đã có tài khoản! {' '}
                                <Link to="/login">
                                    <span className="inline-block hover:text-primary hover:underline hover:cursor-pointer transition duration-200 text-primary">
                                        Đăng nhập
                                    </span>
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
