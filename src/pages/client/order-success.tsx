import { Link, useLocation } from 'react-router-dom';
import { CheckCircle2, ShoppingBag, ArrowRight, Home } from 'lucide-react';

export default function OrderSuccessPage() {
    const location = useLocation();
    const orderCode = location.state?.orderCode;

    return (
        <div className="min-h-[60vh] flex items-center justify-center py-10">
            <div className="max-w-md w-full text-center space-y-6">
                {/* Success Icon */}
                <div className="flex items-center justify-center">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 
                                        flex items-center justify-center shadow-xl shadow-green-200/50
                                        animate-[bounce_1s_ease-in-out]">
                            <CheckCircle2 className="w-12 h-12 text-white" />
                        </div>
                        {/* Pulse ring */}
                        <div className="absolute inset-0 rounded-full bg-green-400/20 animate-ping" />
                    </div>
                </div>

                {/* Title */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Đặt hàng thành công! 🎉
                    </h1>
                    <p className="text-gray-500 text-sm leading-relaxed">
                        Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ xử lý đơn hàng của bạn trong thời gian sớm nhất.
                    </p>
                </div>

                {/* Order Code */}
                {orderCode && (
                    <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-2xl p-5 border border-primary-100">
                        <p className="text-xs text-gray-500 mb-1">Mã đơn hàng</p>
                        <p className="text-lg font-bold text-primary-600 tracking-wider">
                            {orderCode}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                            Vui lòng lưu lại mã đơn hàng để theo dõi đơn hàng của bạn
                        </p>
                    </div>
                )}

                {/* Info cards */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center mx-auto mb-2">
                            <ShoppingBag className="w-4 h-4 text-blue-600" />
                        </div>
                        <p className="text-xs text-gray-500">Đơn hàng đang được</p>
                        <p className="text-sm font-semibold text-gray-800">Xác nhận</p>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center mx-auto mb-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        </div>
                        <p className="text-xs text-gray-500">Dự kiến giao</p>
                        <p className="text-sm font-semibold text-gray-800">3-5 ngày</p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3 pt-2">
                    <Link
                        to="/products"
                        className="w-full py-3.5 bg-gradient-to-r from-primary-500 to-primary-600 
                                   text-white font-semibold text-sm rounded-xl
                                   hover:from-primary-600 hover:to-primary-700 
                                   active:scale-[0.98]
                                   shadow-lg shadow-primary-200/50
                                   transition-all duration-200 
                                   flex items-center justify-center gap-2"
                    >
                        Tiếp tục mua sắm
                        <ArrowRight className="w-4 h-4" />
                    </Link>

                    <Link
                        to="/"
                        className="w-full py-3 bg-white text-gray-600 font-medium text-sm rounded-xl
                                   border border-gray-200 hover:bg-gray-50
                                   transition-all duration-200
                                   flex items-center justify-center gap-2"
                    >
                        <Home className="w-4 h-4" />
                        Về trang chủ
                    </Link>
                </div>
            </div>
        </div>
    );
}
