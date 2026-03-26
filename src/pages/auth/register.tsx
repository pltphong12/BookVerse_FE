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
    email: z.string()
        .email('Email không hợp lệ')
        .min(1, 'Email là bắt buộc'),
    password: z.string()
        .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
        .max(50, 'Mật khẩu không được vượt quá 50 ký tự'),
    fullName: z.string()
        .min(2, 'Họ và tên phải có ít nhất 2 ký tự')
        .max(100, 'Họ và tên không được vượt quá 100 ký tự'),
    address: z.string()
        .min(5, 'Địa chỉ phải có ít nhất 5 ký tự')
        .max(200, 'Địa chỉ không được vượt quá 200 ký tự'),
    phone: z.string()
        .min(10, 'Số điện thoại phải có ít nhất 10 chữ số')
        .max(15, 'Số điện thoại không được vượt quá 15 chữ số')
        .regex(/^[0-9+\-\s()]*$/, 'Số điện thoại chỉ được chứa chữ số và ký tự đặc biệt (+, -, (, ))')
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
            email: '',
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
                data.email,
                data.password,
                data.fullName,
                data.address,
                data.phone
            );
            showToast(`Đăng ký thành công: ${res.data.data?.email}`, ToastType.SUCCESS);
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
                                        <span className="label-text text-base-content">Email</span>
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
