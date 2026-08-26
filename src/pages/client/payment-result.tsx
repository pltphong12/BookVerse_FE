import { Link, useLocation, useSearchParams } from 'react-router-dom';

export default function PaymentResultPage() {
    const location = useLocation();
    const [searchParams] = useSearchParams();

    // Get params from query string
    const orderCode = searchParams.get('orderCode') || searchParams.get('vnp_TxnRef');
    const method = searchParams.get('method') || (searchParams.get('vnp_BankCode') ? 'VNPAY' : undefined);
    const vnpResponseCode = searchParams.get('vnp_ResponseCode');

    // Determine success/failure status
    const isVnPaySuccess = vnpResponseCode ? vnpResponseCode === '00' : true;
    const isSuccess = location.pathname.includes('/payment/success') && isVnPaySuccess;

    return (
        <main className="flex-grow flex items-center justify-center py-10 sm:py-16 px-4 sm:px-6 lg:px-8 font-sans text-[#1A1A1A]">
            <div className="w-full max-w-3xl bg-white border border-[#E5E2DD] rounded-xl shadow-xs p-6 sm:p-10 md:p-12">
                {/* Status Icon & Header */}
                <div className="text-center mb-10">

                    <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1A1A1A] mb-3">
                        {isSuccess ? 'Đặt hàng thành công!' : 'Thanh toán chưa thành công'}
                    </h1>

                    <p className="text-sm sm:text-base text-[#4C4546] max-w-lg mx-auto leading-relaxed">
                        {isSuccess
                            ? 'Cảm ơn bạn đã lựa chọn BookVerse. Đơn hàng của bạn đang được xử lý và sẽ sớm được giao đến bạn.'
                            : 'Rất tiếc, giao dịch chưa thể hoàn tất. Bạn có thể thử thanh toán lại hoặc chọn phương thức thanh toán khác.'}
                    </p>
                </div>

                {/* Details Grid (2 Columns) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-[#E5E2DD] pt-8 mb-10 text-left">
                    {/* Column 1: Order Information */}
                    <div>
                        <h2 className="text-xs font-semibold text-[#7E7576] uppercase tracking-wider mb-4">
                            Thông tin đơn hàng
                        </h2>
                        <div className="space-y-3.5 text-sm">
                            {orderCode && (
                                <div className="flex justify-between items-center">
                                    <span className="text-[#4C4546]">Mã đơn hàng:</span>
                                    <span className="font-semibold text-[#1A1A1A]">
                                        #{orderCode}
                                    </span>
                                </div>
                            )}
                            <div className="flex justify-between items-center">
                                <span className="text-[#4C4546]">Phương thức thanh toán:</span>
                                <span className="font-medium text-[#1A1A1A]">
                                    {method === 'VNPAY'
                                        ? 'Thanh toán trực tuyến (VNPay)'
                                        : 'Thanh toán khi nhận hàng (COD)'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[#4C4546]">Phương thức giao hàng:</span>
                                <span className="font-medium text-[#1A1A1A]">
                                    Giao hàng tiêu chuẩn (Miễn phí)
                                </span>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t border-[#E5E2DD]">
                                <span className="text-[#4C4546]">Trạng thái:</span>
                                <span className="font-semibold inline-flex items-center gap-1.5 text-[#1A1A1A]">
                                    {isSuccess ? 'Đang xử lý' : 'Chưa hoàn tất'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Service & Support */}
                    <div>
                        <h2 className="text-xs font-semibold text-[#7E7576] uppercase tracking-wider mb-4">
                            Dịch vụ & Hỗ trợ
                        </h2>
                        <div className="space-y-3 text-sm text-[#4C4546]">
                            <div className="flex items-center gap-2.5">
                                <span>Dự kiến giao: <strong>2 - 4 ngày làm việc</strong></span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <span>Được kiểm tra hàng trước khi nhận</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <span>Hotline hỗ trợ: <strong className="text-[#1A1A1A]">1900 6868</strong> (8h - 21h)</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <span>Email: <strong className="text-[#1A1A1A]">support@bookverse.vn</strong></span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions / CTAs */}
                <div className="border-t border-[#E5E2DD] pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                    {isSuccess ? (
                        <>
                            <Link
                                to="/products"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#1A1A1A] text-white font-semibold text-sm px-8 py-3.5 rounded-lg hover:bg-[#0070B5] active:bg-[#005a92] transition-colors duration-200 shadow-xs cursor-pointer"
                            >
                                Tiếp tục mua sắm
                            </Link>
                            <Link
                                to="/order-history"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white border border-[#E5E2DD] text-[#1A1A1A] font-semibold text-sm px-8 py-3.5 rounded-lg hover:bg-[#FAF9F7] active:bg-[#F0EEEA] transition-colors duration-200 cursor-pointer"
                            >
                                Xem lịch sử đơn hàng
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/checkout"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#1A1A1A] text-white font-semibold text-sm px-8 py-3.5 rounded-lg hover:bg-[#0070B5] active:bg-[#005a92] transition-colors duration-200 shadow-xs cursor-pointer"
                            >
                                Thử thanh toán lại
                            </Link>
                            <Link
                                to="/cart"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white border border-[#E5E2DD] text-[#1A1A1A] font-semibold text-sm px-8 py-3.5 rounded-lg hover:bg-[#FAF9F7] active:bg-[#F0EEEA] transition-colors duration-200 cursor-pointer"
                            >
                                Quay lại giỏ hàng
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </main>
    );
}
