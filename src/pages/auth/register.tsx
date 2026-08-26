import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import Logo from '../../assets/logo_v2_remove_background.png';
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

export const RegisterPage: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
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
                showToast(`${error.response?.data?.error || 'Đăng ký thất bại'}`, ToastType.ERROR);
                setTimeout(() => {
                    setLoading(false);
                }, 1000);
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#FAF9F7] text-[#1A1A1A] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <ToastContainer />

            <div className="sm:mx-auto sm:w-full sm:max-w-[540px]">
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

                {/* Register Card: Tonal layers, clean 1px border */}
                <div className="bg-white py-10 px-6 sm:px-12 border border-[#E5E2DD] shadow-xs">
                    <h2 className="text-center font-serif text-2xl sm:text-3xl font-semibold text-[#1A1A1A] mb-2 tracking-tight">
                        Đăng ký tài khoản
                    </h2>
                    <p className="text-center text-sm text-[#4C4546] mb-8">
                        Tạo tài khoản để khám phá hàng ngàn cuốn sách hấp dẫn
                    </p>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-semibold text-[#1A1A1A] mb-2" htmlFor="email">
                                Email
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder="name@example.com"
                                    {...register('email')}
                                    className={`ledger-input block w-full appearance-none bg-transparent py-3 px-3 text-[#1A1A1A] placeholder:text-[#7E7576] text-sm ${
                                        errors.email ? 'ledger-input-error' : ''
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
                                    autoComplete="new-password"
                                    placeholder="Tối thiểu 6 ký tự"
                                    {...register('password')}
                                    className={`ledger-input block w-full appearance-none bg-transparent py-3 px-3 pr-10 text-[#1A1A1A] placeholder:text-[#7E7576] text-sm ${
                                        errors.password ? 'ledger-input-error' : ''
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

                        {/* Two Columns: Full Name and Phone */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-semibold text-[#1A1A1A] mb-2" htmlFor="fullName">
                                    Họ và tên
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="fullName"
                                        type="text"
                                        autoComplete="name"
                                        placeholder="Nguyễn Văn A"
                                        {...register('fullName')}
                                        className={`ledger-input block w-full appearance-none bg-transparent py-3 px-3 text-[#1A1A1A] placeholder:text-[#7E7576] text-sm ${
                                            errors.fullName ? 'ledger-input-error' : ''
                                        }`}
                                    />
                                </div>
                                {errors.fullName && (
                                    <p className="mt-1.5 text-xs text-[#BA1A1A] flex items-center gap-1 font-medium">
                                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                                        {errors.fullName.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-[#1A1A1A] mb-2" htmlFor="phone">
                                    Số điện thoại
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="phone"
                                        type="tel"
                                        autoComplete="tel"
                                        placeholder="0912345678"
                                        {...register('phone')}
                                        className={`ledger-input block w-full appearance-none bg-transparent py-3 px-3 text-[#1A1A1A] placeholder:text-[#7E7576] text-sm ${
                                            errors.phone ? 'ledger-input-error' : ''
                                        }`}
                                    />
                                </div>
                                {errors.phone && (
                                    <p className="mt-1.5 text-xs text-[#BA1A1A] flex items-center gap-1 font-medium">
                                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                                        {errors.phone.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Address Field */}
                        <div>
                            <label className="block text-sm font-semibold text-[#1A1A1A] mb-2" htmlFor="address">
                                Địa chỉ nhận hàng
                            </label>
                            <div className="mt-1">
                                <input
                                    id="address"
                                    type="text"
                                    autoComplete="street-address"
                                    placeholder="Số nhà, tên đường, phường/xã, quận/huyện..."
                                    {...register('address')}
                                    className={`ledger-input block w-full appearance-none bg-transparent py-3 px-3 text-[#1A1A1A] placeholder:text-[#7E7576] text-sm ${
                                        errors.address ? 'ledger-input-error' : ''
                                    }`}
                                />
                            </div>
                            {errors.address && (
                                <p className="mt-1.5 text-xs text-[#BA1A1A] flex items-center gap-1 font-medium">
                                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                                    {errors.address.message}
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="pt-3">
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
                                        Đang tạo tài khoản...
                                    </span>
                                ) : (
                                    'Đăng ký tài khoản'
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Login CTA */}
                    <p className="mt-8 text-center text-sm text-[#4C4546]">
                        Đã có tài khoản?{' '}
                        <Link
                            to="/login"
                            className="font-semibold text-[#1A1A1A] hover:underline underline-offset-4 decoration-1 ml-1"
                        >
                            Đăng nhập ngay
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
