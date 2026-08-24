import { Link, useLocation, useSearchParams } from 'react-router-dom';
import {
    CheckCircle2,
    XCircle,
    ShoppingBag,
    Phone,
    PackageCheck,
    Truck,
    RefreshCw,
    ShieldCheck,
    Receipt,
} from 'lucide-react';

type PaymentStatus = 'success' | 'failure';

export default function PaymentResultPage() {
    const location = useLocation();
    const [searchParams] = useSearchParams();

    // Determine status from the URL path
    const status: PaymentStatus = location.pathname.includes('/payment/success')
        ? 'success'
        : 'failure';

    // Get orderCode and payment method from query params
    const orderCode = searchParams.get('orderCode');
    const method = searchParams.get('method');

    const isSuccess = status === 'success';

    return (
        <main className="flex-grow flex items-center justify-center py-12 sm:py-20 px-4 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
                <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-[#e3f2fd] blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[30vw] h-[30vw] rounded-full bg-[#959efd] opacity-20 blur-[80px]" />
            </div>

            <div className="relative z-10 w-full max-w-2xl bg-white border border-[#dff1fb] rounded-2xl shadow-sm p-6 sm:p-12 flex flex-col items-center text-center">
                {/* Status Icon */}
                <div
                    className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 transition-all ${
                        isSuccess
                            ? 'bg-[#e3f2fd] text-[#1a237e]'
                            : 'bg-rose-50 text-rose-600 border border-rose-200'
                    }`}
                >
                    {isSuccess ? (
                        <CheckCircle2 className="w-14 h-14 stroke-[2.2]" />
                    ) : (
                        <XCircle className="w-14 h-14 stroke-[2.2]" />
                    )}
                </div>

                {/* Headline */}
                <h1 className="font-headline font-bold text-2xl sm:text-3xl text-[#0d1e25] mb-2">
                    {isSuccess ? 'Đặt hàng thành công!' : 'Thanh toán chưa thành công'}
                </h1>

                {/* Subheadline */}
                <p className="font-body text-sm sm:text-base text-slate-500 mb-8 max-w-md leading-relaxed">
                    {isSuccess
                        ? 'Cảm ơn bạn đã mua sắm tại BookVerse. Đơn hàng của bạn đang được xử lý và đóng gói.'
                        : 'Rất tiếc, giao dịch chưa thể hoàn tất. Bạn có thể thử thanh toán lại hoặc chọn phương thức thanh toán khác.'}
                </p>

                {/* Details Card (Bento Layout matching Stitch) */}
                <div className="w-full bg-[#f4faff] border border-[#dff1fb] rounded-xl p-5 sm:p-6 text-left mb-8 flex flex-col md:flex-row gap-6">
                    {/* Order Summary Column */}
                    <div className="flex-1 border-b md:border-b-0 md:border-r border-[#dff1fb] pb-5 md:pb-0 md:pr-6 space-y-3">
                        <h2 className="font-headline font-bold text-xs text-slate-400 uppercase tracking-wider">
                            Chi tiết đơn hàng
                        </h2>
                        <div className="space-y-2 text-sm font-body">
                            {orderCode && (
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-500">Mã đơn hàng:</span>
                                    <span className="font-headline font-bold text-[#0d1e25]">
                                        #{orderCode}
                                    </span>
                                </div>
                            )}
                            <div className="flex justify-between items-center">
                                <span className="text-slate-500">Dự kiến giao:</span>
                                <span className="font-semibold text-slate-800">
                                    2 - 4 ngày làm việc
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-500">Thanh toán:</span>
                                <span className="font-semibold text-slate-800">
                                    {method === 'VNPAY' ? 'VNPAY Online' : 'COD khi nhận hàng'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t border-slate-200/60">
                                <span className="text-slate-500">Trạng thái:</span>
                                <span className="font-headline font-bold text-[#1a237e] inline-flex items-center gap-1">
                                    <PackageCheck className="w-4 h-4" />
                                    {isSuccess ? 'Đang xử lý' : 'Chưa hoàn tất'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Shipping / Support Info Column */}
                    <div className="flex-1 md:pl-2 space-y-3">
                        <h2 className="font-headline font-bold text-xs text-slate-400 uppercase tracking-wider">
                            Dịch vụ & Hỗ trợ
                        </h2>
                        <div className="space-y-2.5 text-xs sm:text-sm font-body text-slate-600">
                            <div className="flex items-center gap-2">
                                <Truck className="w-4 h-4 text-[#1a237e] shrink-0" />
                                <span>Giao hàng tiêu chuẩn toàn quốc</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                                <span>Được đồng kiểm tra khi nhận hàng</span>
                            </div>
                            <div className="flex items-center gap-2 pt-1">
                                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                                <span className="text-slate-500">
                                    Hotline hỗ trợ: <strong className="text-slate-800">1900 6868</strong>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    {isSuccess ? (
                        <>
                            <Link
                                to="/products"
                                className="inline-flex items-center justify-center gap-2 bg-[#1a237e] hover:bg-[#283593] text-white font-headline font-bold text-sm px-8 py-3.5 rounded-xl shadow-md shadow-indigo-950/10 transition-all cursor-pointer"
                            >
                                <ShoppingBag className="w-4 h-4" />
                                Tiếp tục mua sắm
                            </Link>
                            <Link
                                to="/order-history"
                                className="inline-flex items-center justify-center gap-2 bg-[#e3f2fd] text-[#1a237e] hover:bg-blue-100 font-headline font-bold text-sm px-8 py-3.5 rounded-xl transition-all cursor-pointer"
                            >
                                <Receipt className="w-4 h-4" />
                                Xem lịch sử đơn hàng
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/checkout"
                                className="inline-flex items-center justify-center gap-2 bg-[#1a237e] hover:bg-[#283593] text-white font-headline font-bold text-sm px-8 py-3.5 rounded-xl shadow-md shadow-indigo-950/10 transition-all cursor-pointer"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Thử thanh toán lại
                            </Link>
                            <Link
                                to="/cart"
                                className="inline-flex items-center justify-center gap-2 bg-[#e3f2fd] text-[#1a237e] hover:bg-blue-100 font-headline font-bold text-sm px-8 py-3.5 rounded-xl transition-all cursor-pointer"
                            >
                                <ShoppingBag className="w-4 h-4" />
                                Quay lại giỏ hàng
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </main>
    );
}
