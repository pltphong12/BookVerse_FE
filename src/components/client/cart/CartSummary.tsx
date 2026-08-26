import React, { useState } from 'react';
import { formatPrice } from '../../../common/formatPrice';
import { showToast, ToastType } from '../../../common/showToast';
import { ICartDetail } from '../../../types/backend';

interface CartSummaryProps {
    items: ICartDetail[];
    onCheckout: () => void;
}

export default function CartSummary({ items, onCheckout }: CartSummaryProps) {
    const [couponCode, setCouponCode] = useState('');

    const totalOriginal = items.reduce((sum, item) => sum + item.book.price * item.quantity, 0);
    const totalDiscount = items.reduce((sum, item) => {
        const discount = item.book.discount ?? 0;
        const discountAmount = item.book.price * (discount / 100);
        return sum + discountAmount * item.quantity;
    }, 0);
    const subtotal = totalOriginal - totalDiscount;
    const shippingFee = subtotal >= 300000 || subtotal === 0 ? 0 : 30000;
    const total = subtotal + shippingFee;

    const handleApplyCoupon = (e: React.FormEvent) => {
        e.preventDefault();
        if (!couponCode.trim()) {
            showToast('Vui lòng nhập mã giảm giá', ToastType.WARN);
            return;
        }
        showToast('Mã giảm giá không hợp lệ hoặc đã hết hạn', ToastType.ERROR);
    };

    return (
        <div className="bg-[#FAF9F7] rounded-xl p-6 sticky top-24 border border-[#E5E2DD]">
            {/* Header */}
            <h2 className="font-serif font-bold text-xl text-[#0D1E25] mb-6">
                Tóm tắt đơn hàng
            </h2>

            {/* Price Details */}
            <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm text-[#4C4546]">
                    <span>Tạm tính</span>
                    <span className="font-medium text-[#0D1E25]">{formatPrice(totalOriginal)}</span>
                </div>

                {totalDiscount > 0 && (
                    <div className="flex justify-between text-sm text-[#4C4546]">
                        <span>Giảm giá</span>
                        <span className="font-semibold text-[#BA1A1A]">-{formatPrice(totalDiscount)}</span>
                    </div>
                )}

                <div className="flex justify-between text-sm text-[#4C4546]">
                    <span>Phí vận chuyển</span>
                    <span className="font-medium text-[#0D1E25]">
                        {shippingFee === 0 ? (
                            <span className="text-emerald-700 font-semibold">Miễn phí</span>
                        ) : (
                            formatPrice(shippingFee)
                        )}
                    </span>
                </div>

                {subtotal > 0 && subtotal < 300000 && (
                    <p className="text-xs text-[#0070B5] bg-[#E3F2FD]/50 p-2 rounded-md">
                        💡 Mua thêm {formatPrice(300000 - subtotal)} để được <strong>miễn phí giao hàng</strong>
                    </p>
                )}
            </div>

            {/* Total Row */}
            <div className="border-t border-[#E5E2DD] pt-4 mb-6">
                <div className="flex justify-between items-baseline mb-1">
                    <span className="font-serif font-bold text-lg text-[#0D1E25]">Tổng cộng</span>
                    <span className="font-serif font-bold text-xl text-[#1A1A1A]">{formatPrice(total)}</span>
                </div>
                <p className="text-xs text-[#7E7576]">(Đã bao gồm VAT nếu có)</p>
            </div>

            {/* Coupon input */}
            <form onSubmit={handleApplyCoupon} className="mb-6">
                <label htmlFor="coupon" className="sr-only">Mã giảm giá</label>
                <div className="flex gap-2">
                    <input
                        id="coupon"
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Nhập mã giảm giá..."
                        className="flex-grow bg-white border border-[#E5E2DD] rounded-lg px-3 py-2 text-sm text-[#0D1E25] placeholder:text-[#7E7576] focus:outline-none focus:border-[#1A1A1A] transition-colors"
                    />
                    <button
                        type="submit"
                        className="bg-[#E5E2DD] hover:bg-[#D5D2CD] text-[#1A1A1A] font-medium text-sm px-4 py-2 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                    >
                        Áp dụng
                    </button>
                </div>
            </form>

            {/* Action Buttons */}
            <div>
                <button
                    type="button"
                    onClick={onCheckout}
                    disabled={items.length === 0}
                    className="w-full bg-[#1A1A1A] text-white font-semibold text-sm py-3.5 rounded-lg hover:bg-[#0070B5] active:bg-[#005a92] transition-colors duration-200 shadow-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-center block"
                >
                    Thanh toán ngay
                </button>
            </div>
        </div>
    );
}
