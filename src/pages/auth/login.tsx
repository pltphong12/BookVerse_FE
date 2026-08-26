import { AxiosError } from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import Logo from '../../assets/logo_v2_remove_background.png';
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

export const InternalLoginPage: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [rememberMe, setRememberMe] = useState<boolean>(false);
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
            localStorage.setItem('role', res.data.data?.user?.role?.name as string);
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
                showToast(`${error.response?.data?.error || 'Đăng nhập thất bại'}`, ToastType.ERROR);
                setTimeout(() => {
                    setLoading(false);
                }, 1000);
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#FAF9F7] text-[#1A1A1A] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <ToastContainer />

            <div className="sm:mx-auto sm:w-full sm:max-w-[480px]">
                {/* Brand Logo */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-block group focus:outline-none">
                        <img
                            src={Logo}
                            alt="BookVerse"
                            className="mx-auto h-20 sm:h-24 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                    </Link>
                </div>

                {/* Login Card: Tonal layers, clean 1px border */}
                <div className="bg-white py-10 px-6 sm:px-12 border border-[#E5E2DD] shadow-xs">
                    <h2 className="text-center font-serif text-2xl sm:text-3xl font-semibold text-[#1A1A1A] mb-8 tracking-tight">
                        Đăng nhập
                    </h2>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-semibold text-[#1A1A1A] mb-2" htmlFor="email">
                                Email hoặc Tên đăng nhập
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    type="text"
                                    autoComplete="username"
                                    placeholder="name@example.com"
                                    {...register('email')}
                                    className={`ledger-input block w-full appearance-none bg-transparent py-3 px-3 text-[#1A1A1A] placeholder:text-[#7E7576] text-sm ${errors.email ? 'ledger-input-error' : ''
                                        }`}
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1.5 text-xs text-[#BA1A1A] flex items-center gap-1 font-medium">
                                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-semibold text-[#1A1A1A] mb-2" htmlFor="password">
                                Mật khẩu
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    {...register('password')}
                                    className={`ledger-input block w-full appearance-none bg-transparent py-3 px-3 pr-10 text-[#1A1A1A] placeholder:text-[#7E7576] text-sm ${errors.password ? 'ledger-input-error' : ''
                                        }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[#7E7576] hover:text-[#1A1A1A] p-1.5 transition-colors focus:outline-none cursor-pointer"
                                    aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1.5 text-xs text-[#BA1A1A] flex items-center gap-1 font-medium">
                                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* Remember Me & Forgot Password Row */}
                        <div className="flex items-center justify-between pt-1">
                            <label className="flex items-center cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    id="remember-me"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="h-4 w-4 rounded-none border border-[#1A1A1A] text-[#1A1A1A] focus:ring-0 focus:ring-offset-0 bg-transparent cursor-pointer"
                                />
                                <span className="ml-2 text-sm text-[#4C4546]">
                                    Ghi nhớ đăng nhập
                                </span>
                            </label>

                            <Link
                                to="/forgot-password"
                                className="text-sm font-medium text-[#1A1A1A] hover:underline underline-offset-4 decoration-1 transition-colors"
                            >
                                Quên mật khẩu?
                            </Link>
                        </div>

                        {/* Primary Submit Button */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center items-center bg-[#1A1A1A] py-3.5 px-4 text-sm font-semibold text-white hover:bg-[#2F3130] active:bg-[#000000] transition-colors duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Đang xử lý...
                                    </span>
                                ) : (
                                    'Đăng nhập'
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Divider */}
                    <div className="mt-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-[#E5E2DD]" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="bg-white px-4 text-sm text-[#4C4546]">
                                    hoặc tiếp tục với
                                </span>
                            </div>
                        </div>

                        {/* Social Logins */}
                        <div className="mt-6 grid grid-cols-1 gap-3">
                            {/* Google Button */}
                            <button
                                type="button"
                                className="flex w-full items-center justify-center gap-3 border border-[#1A1A1A] bg-transparent py-3 px-4 text-sm font-semibold text-[#1A1A1A] hover:bg-[#F4F3F1] transition-colors duration-200 cursor-pointer"
                                onClick={() => showToast('Chức năng đăng nhập Google đang được phát triển', ToastType.INFO)}
                            >
                                <svg aria-hidden="true" className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24">
                                    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" fill="currentColor" />
                                </svg>
                                Đăng nhập bằng Google
                            </button>

                            {/* Facebook Button */}
                            <button
                                type="button"
                                className="flex w-full items-center justify-center gap-3 border border-[#1A1A1A] bg-transparent py-3 px-4 text-sm font-semibold text-[#1A1A1A] hover:bg-[#F4F3F1] transition-colors duration-200 cursor-pointer"
                                onClick={() => showToast('Chức năng đăng nhập Facebook đang được phát triển', ToastType.INFO)}
                            >
                                <svg aria-hidden="true" className="h-4 w-4 flex-shrink-0 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                                    <path clipRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" fillRule="evenodd" />
                                </svg>
                                Đăng nhập bằng Facebook
                            </button>
                        </div>
                    </div>

                    {/* Sign Up CTA */}
                    <p className="mt-8 text-center text-sm text-[#4C4546]">
                        Chưa có tài khoản?{' '}
                        <Link
                            to="/register"
                            className="font-semibold text-[#1A1A1A] hover:underline underline-offset-4 decoration-1 ml-1"
                        >
                            Đăng ký ngay
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};