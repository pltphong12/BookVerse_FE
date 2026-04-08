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
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden sticky top-6">
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
                    <span className="text-gray-500">Tổng sản phẩm</span>
                    <span className="font-medium text-gray-800">
                        {totalItems} sản phẩm
                    </span>
                </div>

                {/* Subtotal */}
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Tạm tính</span>
                    <span className="font-medium text-gray-800">{formatPrice(totalOriginal)}</span>
                </div>

                {/* Discount */}
                {totalDiscount > 0 && (
                    <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1.5 text-gray-500">
                            <Tag className="w-3.5 h-3.5 text-red-400" />
                            Giảm giá
                        </span>
                        <span className="font-medium text-red-500">-{formatPrice(totalDiscount)}</span>
                    </div>
                )}

                {/* Shipping */}
                <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1.5 text-gray-500">
                        <Truck className="w-3.5 h-3.5" />
                        Phí vận chuyển
                    </span>
                    {shippingFee === 0 ? (
                        <span className="font-medium text-green-500">Miễn phí</span>
                    ) : (
                        <span className="font-medium text-gray-800">{formatPrice(shippingFee)}</span>
                    )}
                </div>

                {/* Free shipping progress */}
                {shippingFee > 0 && (
                    <div className="bg-blue-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                            <Truck className="w-4 h-4 text-primary-500" />
                            <span className="text-xs text-primary-700 font-medium">
                                Mua thêm {formatPrice(300000 - subtotal)} để được miễn phí vận chuyển
                            </span>
                        </div>
                        <div className="w-full h-1.5 bg-primary-100 rounded-full overflow-hidden">
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
                        className="flex-1 px-3 py-2.5 bg-gray-50 border border-gray-200 
                                   rounded-xl text-sm text-gray-700
                                   focus:outline-none focus:ring-2 focus:ring-primary-500/20 
                                   focus:border-primary-400 focus:bg-white
                                   transition-all duration-200"
                    />
                    <button className="px-4 py-2.5 bg-gray-100 text-gray-600 text-sm font-medium rounded-xl
                                       hover:bg-primary-50 hover:text-primary-600
                                       transition-colors duration-150">
                        Áp dụng
                    </button>
                </div>

                {/* Divider */}
                <div className="border-t border-dashed border-gray-200" />

                {/* Total */}
                <div className="flex items-center justify-between">
                    <span className="text-base font-semibold text-gray-700">Tổng cộng</span>
                    <span className="text-xl font-bold text-primary-600">{formatPrice(total)}</span>
                </div>

                {/* Checkout button */}
                <button
                    onClick={onCheckout}
                    disabled={items.length === 0}
                    className="w-full py-3.5 bg-gradient-to-r from-primary-500 to-primary-600 
                               text-white font-semibold text-sm rounded-xl
                               hover:from-primary-600 hover:to-primary-700 
                               active:scale-[0.98]
                               disabled:opacity-50 disabled:cursor-not-allowed
                               shadow-lg shadow-primary-200/50
                               transition-all duration-200 
                               flex items-center justify-center gap-2"
                >
                    <CreditCard className="w-5 h-5" />
                    Tiến hành thanh toán
                </button>

                {/* Trust badges */}
                <div className="flex items-center justify-center gap-4 pt-2">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <ShieldCheck className="w-3.5 h-3.5 text-green-400" />
                        Thanh toán an toàn
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Truck className="w-3.5 h-3.5 text-blue-400" />
                        Giao hàng nhanh
                    </div>
                </div>
            </div>
        </div>
    );
}
