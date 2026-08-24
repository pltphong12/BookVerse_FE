import { Link } from 'react-router-dom';
import { formatPrice } from '../../../common/formatPrice';
import { ICartDetail } from '../../../types/backend';

interface CartSummaryProps {
    items: ICartDetail[];
    onCheckout: () => void;
}

export default function CartSummary({ items, onCheckout }: CartSummaryProps) {
    const totalOriginal = items.reduce((sum, item) => sum + item.book.price * item.quantity, 0);
    const totalDiscount = items.reduce((sum, item) => {
        const discount = item.book.discount ?? 0;
        const discountAmount = item.book.price * (discount / 100);
        return sum + discountAmount * item.quantity;
    }, 0);
    const subtotal = totalOriginal - totalDiscount;
    const shippingFee = 0; // Standard free shipping or 30000
    const total = subtotal + shippingFee;

    return (
        <div className="bg-[#f4faff] rounded-xl p-6 sticky top-24 border border-[#dff1fb]">
            {/* Header */}
            <h2 className="font-headline font-bold text-lg sm:text-xl text-[#0d1e25] mb-6">
                Tóm tắt đơn hàng
            </h2>

            {/* Price Details */}
            <div className="space-y-3 mb-6">
                <div className="flex justify-between font-body text-sm text-slate-600">
                    <span>Tạm tính</span>
                    <span className="font-semibold text-slate-800">{formatPrice(totalOriginal)}</span>
                </div>

                {totalDiscount > 0 && (
                    <div className="flex justify-between font-body text-sm text-slate-600">
                        <span>Giảm giá</span>
                        <span className="font-semibold text-red-600">-{formatPrice(totalDiscount)}</span>
                    </div>
                )}

                <div className="flex justify-between font-body text-sm text-slate-600">
                    <span>Phí vận chuyển</span>
                    <span className="font-semibold text-emerald-600">
                        {shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}
                    </span>
                </div>
            </div>

            {/* Total Row */}
            <div className="border-t border-[#dff1fb] pt-4 mb-6">
                <div className="flex justify-between items-baseline font-headline font-bold text-lg sm:text-xl text-[#0d1e25] mb-1">
                    <span>Tổng cộng</span>
                    <span className="text-[#1a237e]">{formatPrice(total)}</span>
                </div>
                <p className="font-body text-xs text-slate-400">(Đã bao gồm VAT nếu có)</p>
            </div>

            {/* Coupon input */}
            <div className="mb-6">
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Nhập mã giảm giá..."
                        className="flex-grow bg-white border border-[#dff1fb] rounded-lg px-3 py-2 font-body text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#1a237e] transition-colors"
                    />
                    <button
                        type="button"
                        className="bg-[#e3f2fd] text-[#1a237e] font-headline font-bold text-sm px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors whitespace-nowrap cursor-pointer"
                    >
                        Áp dụng
                    </button>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
                <button
                    onClick={onCheckout}
                    disabled={items.length === 0}
                    className="w-full bg-[#1a237e] text-white font-headline font-bold text-sm py-3.5 rounded-lg hover:bg-[#283593] transition-all shadow-md shadow-indigo-950/10 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-center"
                >
                    Thanh toán ngay
                </button>
                <Link
                    to="/products"
                    className="w-full bg-transparent border border-[#1a237e] text-[#1a237e] font-headline font-bold text-sm py-3 rounded-lg hover:bg-[#e3f2fd]/50 transition-colors text-center block cursor-pointer"
                >
                    Tiếp tục mua sắm
                </Link>
            </div>
        </div>
    );
}
