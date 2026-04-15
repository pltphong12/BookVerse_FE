import { Link, useLocation, useSearchParams } from 'react-router-dom';
import {
    CheckCircle2,
    XCircle,
    ShoppingBag,
    ArrowRight,
    Home,
    RefreshCw,
    CreditCard,
    Phone,
} from 'lucide-react';

type PaymentStatus = 'success' | 'failure';

export default function PaymentResultPage() {
    const location = useLocation();
    const [searchParams] = useSearchParams();

    // Determine status from the URL path
    const status: PaymentStatus = location.pathname.includes('/payment/success')
        ? 'success'
        : 'failure';

    // Get orderCode from query params: /payment/success?orderCode=BV-xxx
    const orderCode = searchParams.get('orderCode');
    const method = searchParams.get('method');

    const isSuccess = status === 'success';

    return (
        <div className="min-h-[60vh] flex items-center justify-center py-10">
            <div className="max-w-md w-full text-center space-y-6">
                {/* Status Icon */}
                <div className="flex items-center justify-center">
                    <div className="relative">
                        <div
                            className={`w-24 h-24 rounded-full flex items-center justify-center shadow-xl
                                        animate-[bounce_1s_ease-in-out]
                                        ${isSuccess
                                    ? 'bg-gradient-to-br from-green-400 to-emerald-500 shadow-green-200/50'
                                    : 'bg-gradient-to-br from-red-400 to-rose-500 shadow-red-200/50'
                                }`}
                        >
                            {isSuccess ? (
                                <CheckCircle2 className="w-12 h-12 text-white" />
                            ) : (
                                <XCircle className="w-12 h-12 text-white" />
                            )}
                        </div>
                        {/* Pulse ring */}
                        <div
                            className={`absolute inset-0 rounded-full animate-ping
                                        ${isSuccess ? 'bg-green-400/20' : 'bg-red-400/20'}`}
                        />
                    </div>
                </div>

                {/* Title */}
                {
                    method === 'VNPAY' && (
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                {isSuccess
                                    ? 'Thanh toán thành công! 🎉'
                                    : 'Thanh toán thất bại 😔'}
                            </h1>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                {isSuccess
                                    ? 'Cảm ơn bạn đã thanh toán. Đơn hàng của bạn đã được xác nhận và sẽ được xử lý trong thời gian sớm nhất.'
                                    : 'Thanh toán qua VNPay không thành công. Vui lòng thử lại hoặc chọn phương thức thanh toán khác.'}
                            </p>
                        </div>
                    )
                }
                {
                    method === 'COD' && (
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                {isSuccess
                                    ? 'Đặt hàng thành công! 🎉'
                                    : 'Đặt hàng thất bại 😔'}
                            </h1>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                {isSuccess
                                    ? 'Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đã được xác nhận và sẽ được xử lý trong thời gian sớm nhất.'
                                    : 'Đặt hàng thất bại. Vui lòng thử lại hoặc chọn phương thức thanh toán khác.'}
                            </p>
                        </div>
                    )
                }

                {/* Order Code */}
                {orderCode && (
                    <div
                        className={`rounded-2xl p-5 border ${isSuccess
                            ? 'bg-gradient-to-r from-primary-50 to-blue-50 border-primary-100'
                            : 'bg-gradient-to-r from-red-50 to-orange-50 border-red-100'
                            }`}
                    >
                        <p className="text-xs text-gray-500 mb-1">Mã đơn hàng</p>
                        <p
                            className={`text-lg font-bold tracking-wider ${isSuccess ? 'text-primary-600' : 'text-red-600'
                                }`}
                        >
                            {orderCode}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                            {isSuccess
                                ? 'Vui lòng lưu lại mã đơn hàng để theo dõi đơn hàng của bạn'
                                : 'Đơn hàng của bạn đang chờ thanh toán. Vui lòng thử lại.'}
                        </p>
                    </div>
                )}

                {/* Info cards */}
                {isSuccess ? (
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center mx-auto mb-2">
                                <ShoppingBag className="w-4 h-4 text-blue-600" />
                            </div>
                            <p className="text-xs text-gray-500">Đơn hàng đang được</p>
                            <p className="text-sm font-semibold text-gray-800">Xử lý</p>
                        </div>
                        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center mx-auto mb-2">
                                <CreditCard className="w-4 h-4 text-emerald-600" />
                            </div>
                            <p className="text-xs text-gray-500">Thanh toán</p>
                            <p className="text-sm font-semibold text-emerald-600">{method === 'VNPAY' ? 'Đã thanh toán' : 'Thanh toán khi nhận hàng'}</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                            <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center mx-auto mb-2">
                                <CreditCard className="w-4 h-4 text-red-600" />
                            </div>
                            <p className="text-xs text-gray-500">Thanh toán</p>
                            <p className="text-sm font-semibold text-red-600">Thất bại</p>
                        </div>
                        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center mx-auto mb-2">
                                <Phone className="w-4 h-4 text-amber-600" />
                            </div>
                            <p className="text-xs text-gray-500">Cần hỗ trợ?</p>
                            <p className="text-sm font-semibold text-gray-800">Liên hệ</p>
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex flex-col gap-3 pt-2">
                    {isSuccess ? (
                        <>
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
                        </>
                    ) : (
                        <>
                            <Link
                                to="/checkout"
                                className="w-full py-3.5 bg-gradient-to-r from-primary-500 to-primary-600 
                                           text-white font-semibold text-sm rounded-xl
                                           hover:from-primary-600 hover:to-primary-700 
                                           active:scale-[0.98]
                                           shadow-lg shadow-primary-200/50
                                           transition-all duration-200 
                                           flex items-center justify-center gap-2"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Thử thanh toán lại
                            </Link>

                            <Link
                                to="/products"
                                className="w-full py-3 bg-white text-gray-600 font-medium text-sm rounded-xl
                                           border border-gray-200 hover:bg-gray-50
                                           transition-all duration-200
                                           flex items-center justify-center gap-2"
                            >
                                <ShoppingBag className="w-4 h-4" />
                                Tiếp tục mua sắm
                            </Link>

                            <Link
                                to="/"
                                className="w-full py-3 text-gray-400 font-medium text-sm rounded-xl
                                           hover:text-gray-600
                                           transition-all duration-200
                                           flex items-center justify-center gap-2"
                            >
                                <Home className="w-4 h-4" />
                                Về trang chủ
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
