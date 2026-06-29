import { ShoppingBag, Tag, Truck, ShieldCheck, CreditCard } from 'lucide-react';
import { formatPrice } from '../../../common/formatPrice';
import { ICartDetail } from '../../../types/backend';

interface CartSummaryProps {
    items: ICartDetail[];
    onCheckout: () => void;
}

export default function CartSummary({ items, onCheckout }: CartSummaryProps) {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalOriginal = items.reduce((sum, item) => sum + item.book.price * item.quantity, 0);
    const totalDiscount = items.reduce((sum, item) => {
        const discount = item.book.discount ?? 0;
        const discountAmount = item.book.price * (discount / 100);
        return sum + discountAmount * item.quantity;
    }, 0);
    const subtotal = totalOriginal - totalDiscount;
    const shippingFee = 0;
    const total = subtotal + shippingFee;

    return (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl overflow-hidden sticky top-24">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-5 py-4">
                <div className="flex items-center gap-2.5">
                    <ShoppingBag className="w-5 h-5 text-white/90" />
                    <h3 className="font-bold text-[15px] text-white tracking-wide">Tóm tắt đơn hàng</h3>
                </div>
            </div>

            <div className="p-5 space-y-4">
                {/* Items count */}
                <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">Tổng sản phẩm</span>
                    <span className="font-medium text-white">
                        {totalItems} sản phẩm
                    </span>
                </div>

                {/* Subtotal */}
                <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">Tạm tính</span>
                    <span className="font-medium text-white">{formatPrice(totalOriginal)}</span>
                </div>

                {/* Discount */}
                {totalDiscount > 0 && (
                    <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1.5 text-white/60">
                            <Tag className="w-3.5 h-3.5 text-red-400" />
                            Giảm giá
                        </span>
                        <span className="font-medium text-red-400">-{formatPrice(totalDiscount)}</span>
                    </div>
                )}

                {/* Shipping */}
                <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1.5 text-white/60">
                        <Truck className="w-3.5 h-3.5 text-primary-300" />
                        Phí vận chuyển
                    </span>
                    {shippingFee === 0 ? (
                        <span className="font-medium text-emerald-400">Miễn phí</span>
                    ) : (
                        <span className="font-medium text-white">{formatPrice(shippingFee)}</span>
                    )}
                </div>

                {/* Free shipping progress */}
                {shippingFee > 0 && (
                    <div className="bg-white/5 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                            <Truck className="w-4 h-4 text-primary-300" />
                            <span className="text-xs text-primary-300 font-medium">
                                Mua thêm {formatPrice(300000 - subtotal)} để được miễn phí vận chuyển
                            </span>
                        </div>
                        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-primary-400 to-primary-500 rounded-full transition-all duration-500"
                                style={{ width: `${Math.min(100, (subtotal / 300000) * 100)}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Coupon */}
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Nhập mã giảm giá..."
                        className="flex-1 px-3 py-2.5 bg-white/5 border border-white/10 
                                   rounded-xl text-sm text-white placeholder-white/30
                                   focus:outline-none focus:ring-2 focus:ring-primary-500/20 
                                   focus:border-primary-400 focus:bg-white/10
                                   transition-all duration-200"
                    />
                    <button className="px-4 py-2.5 bg-white/10 text-white text-sm font-medium rounded-xl
                                       hover:bg-primary-500 hover:text-white
                                       transition-colors duration-150">
                        Áp dụng
                    </button>
                </div>

                {/* Divider */}
                <div className="border-t border-dashed border-white/10" />

                {/* Total */}
                <div className="flex items-center justify-between">
                    <span className="text-base font-semibold text-white/80">Tổng cộng</span>
                    <span className="text-xl font-bold text-primary-300">{formatPrice(total)}</span>
                </div>

                {/* Checkout button */}
                <button
                    onClick={onCheckout}
                    disabled={items.length === 0}
                    className="w-full py-3.5 bg-gradient-to-r from-primary-500 to-primary-600 
                               text-white font-semibold text-sm rounded-xl
                               hover:from-primary-600 hover:to-primary-700 
                               hover:scale-[1.02] active:scale-[0.98]
                               disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                               shadow-lg shadow-primary-500/25
                               transition-all duration-200 
                               flex items-center justify-center gap-2 cursor-pointer"
                >
                    <CreditCard className="w-5 h-5" />
                    Tiến hành thanh toán
                </button>

                {/* Trust badges */}
                <div className="flex items-center justify-center gap-4 pt-2">
                    <div className="flex items-center gap-1.5 text-xs text-white/40">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        Thanh toán an toàn
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-white/40">
                        <Truck className="w-3.5 h-3.5 text-blue-400" />
                        Giao hàng nhanh
                    </div>
                </div>
            </div>
        </div>
    );
}
