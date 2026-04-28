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

    // Reusable input field renderer
    const renderField = (
        name: keyof RegisterFormData,
        label: string,
        placeholder: string,
        type: string = 'text'
    ) => (
        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                {label}
            </label>
            <input
                type={type}
                {...register(name)}
                placeholder={placeholder}
                className={`w-full px-4 py-3 rounded-xl border bg-white/60 backdrop-blur-sm text-gray-800 placeholder-gray-400 text-sm transition-all duration-200 outline-none
                    ${errors[name]
                        ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                        : 'border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 hover:border-gray-300'
                    }`}
            />
            {errors[name] && (
                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors[name]?.message}
                </p>
            )}
        </div>
    );

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-200 p-4">
            {/* Decorative blobs */}
            <div className="fixed top-[-120px] left-[-120px] w-[400px] h-[400px] bg-blue-300/30 rounded-full blur-3xl pointer-events-none" />
            <div className="fixed bottom-[-100px] right-[-100px] w-[350px] h-[350px] bg-purple-300/30 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 w-full max-w-5xl mx-auto">
                <div className="grid md:grid-cols-2 grid-cols-1 bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/40">
                    {/* Left - Logo Section */}
                    <div className="flex items-center justify-center bg-gradient-to-br from-primary-500/10 to-primary-600/10 p-10 md:p-16">
                        <div className="text-center">
                            <img
                                src={Logo}
                                alt="Bookverse Logo"
                                className="w-auto h-auto max-w-[280px] mx-auto drop-shadow-lg"
                                style={{
                                    filter: 'brightness(0) saturate(100%) invert(39%) sepia(57%) saturate(2000%) hue-rotate(200deg) brightness(96%) contrast(94%)',
                                }}
                            />
                            <p className="mt-4 text-gray-500 text-sm font-medium tracking-wide">
                                Tạo tài khoản để bắt đầu hành trình
                            </p>
                        </div>
                    </div>

                    {/* Right - Form Section */}
                    <div className="flex flex-col justify-center py-10 px-8 md:px-12">
                        <div className="mb-6">
                            <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Đăng ký</h2>
                            <p className="mt-2 text-gray-500 text-sm">Tạo tài khoản mới để khám phá</p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            {renderField('email', 'Email', 'Nhập email', 'email')}
                            {renderField('password', 'Mật khẩu', 'Nhập mật khẩu', 'password')}

                            {/* Two columns for name and phone */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {renderField('fullName', 'Họ và tên', 'Nhập họ và tên')}
                                {renderField('phone', 'Số điện thoại', 'Nhập số điện thoại')}
                            </div>

                            {renderField('address', 'Địa chỉ', 'Nhập địa chỉ')}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full py-3 px-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30 hover:from-primary-600 hover:to-primary-700 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-lg flex items-center justify-center gap-2 mt-2"
                                disabled={loading}
                            >
                                {loading ? (
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                ) : 'Đăng ký'}
                            </button>

                            {/* Login Link */}
                            <div className="text-center text-sm text-gray-500 pt-1">
                                Đã có tài khoản?{' '}
                                <Link to="/login">
                                    <span className="text-primary-600 font-semibold hover:text-primary-700 hover:underline transition-colors duration-200 cursor-pointer">
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
