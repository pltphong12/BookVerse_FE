import { AxiosError } from 'axios';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Logo from '../../assets/logo.png';
import { showToast, ToastType } from '../../common/showToast';
import { callLoginApi } from '../../services/api';
import { IUser } from '../../types/backend';
import { useAppDispatch } from '../../redux/hook';
import { setAccount } from '../../redux/slide/account.slide';

const loginSchema = z.object({
    email: z.string().email('Email không hợp lệ').min(1, 'Email là bắt buộc'),
    password: z.string().min(1, 'Mật khẩu là bắt buộc')
});

type LoginFormData = z.infer<typeof loginSchema>;

export const InternalLoginPage = () => {
    const [loading, setLoading] = React.useState<boolean>(false);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    });

    const onSubmit = async (data: LoginFormData) => {
        setLoading(true);
        try {
            const res = await callLoginApi(data.email, data.password);
            showToast(`Đăng nhập thành công`, ToastType.SUCCESS);
            localStorage.setItem('access_token', res.data.data?.accessToken as string);
            dispatch(setAccount(res.data.data?.user as IUser));
            if (res.data.data?.user?.role?.name === 'CUSTOMER') {
                setTimeout(() => {
                    navigate('/');
                    setLoading(false);
                }, 1000);
            } else {
                setTimeout(() => {
                    navigate('/admin');
                    setLoading(false);
                }, 1000);
            }
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
            <div className="card mx-auto w-full max-w-5xl shadow-xl">
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
                        <h2 className='text-2xl font-semibold mb-2 text-center'>Đăng nhập</h2>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="mb-4">
                                <div className={`form-control w-full mt-4`}>
                                    <label className="label">
                                        <span className={"label-text text-base-content"}>Email</span>
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
                                <div className={`form-control w-full mt-4`}>
                                    <label className="label">
                                        <span className={"label-text text-base-content"}>Mật khẩu</span>
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
                            </div>

                            <div className='text-right text-primary'>
                                <Link to="/forgot-password">
                                    <span className="text-sm inline-block hover:text-primary hover:underline hover:cursor-pointer transition duration-200">
                                        Quên mật khẩu
                                    </span>
                                </Link>
                            </div>

                            <button
                                type="submit"
                                className="btn mt-2 w-full btn-primary flex justify-center items-center"
                                disabled={loading}
                            >
                                {!loading ? "Đăng nhập" : <span className="loading loading-spinner loading-l"></span>}
                            </button>

                            <div className='text-center mt-4'>
                                Nếu bạn chưa có tài khoản! {" "}
                                <Link to="/register">
                                    <span className="inline-block hover:text-primary hover:underline hover:cursor-pointer transition duration-200 text-primary">
                                        Đăng ký
                                    </span>
                                </Link>
                            </div>
                            <ToastContainer />
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};