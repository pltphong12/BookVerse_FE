import { AxiosError } from 'axios';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Logo from '../../assets/logo.png';
import { showToast, ToastType } from '../../common/showToast';
import { useUser } from '../../components/context/AuthContext';
import { callLoginApi } from '../../services/api';
import { IUser } from '../../types/backend';

const loginSchema = z.object({
    username: z.string().min(2, 'Username is required'),
    password: z.string().min(2, 'Password is required')
});

type LoginFormData = z.infer<typeof loginSchema>;

export const InternalLoginPage = () => {
    const [loading, setLoading] = React.useState<boolean>(false);
    const { setUser } = useUser();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: '',
            password: ''
        }
    });

    const onSubmit = async (data: LoginFormData) => {
        setLoading(true);
        try {
            const res = await callLoginApi(data.username, data.password);
            showToast(`Đăng nhập thành công`, ToastType.SUCCESS);
            localStorage.setItem('access_token', res.data.data?.accessToken as string);
            setUser(res.data.data?.user as IUser);
            setTimeout(() => {
                navigate('/admin');
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
                                filter: 'brightness(0) saturate(100%) invert(20%) sepia(60%) saturate(500%) hue-rotate(180deg)',
                            }}
                        />
                    </div>
                    <div className='py-24 px-10'>
                        <h2 className='text-2xl font-semibold mb-2 text-center'>Đăng nhập</h2>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="mb-4">
                                <div className={`form-control w-full mt-4`}>
                                    <label className="label">
                                        <span className={"label-text text-base-content"}>Tên đăng nhập</span>
                                    </label>
                                    <input
                                        type="text"
                                        {...register('username')}
                                        className={`input input-bordered w-full ${errors.username ? 'input-error' : ''}`}
                                    />
                                    {errors.username && (
                                        <label className="label">
                                            <span className="label-text-alt text-error">{errors.username.message}</span>
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