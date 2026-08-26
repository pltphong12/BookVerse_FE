import { Minus, Plus, Trash2, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../../../common/formatPrice';
import { ICartDetail } from '../../../types/backend';

interface CartItemProps {
    item: ICartDetail;
    onIncrease: (bookId: number) => void;
    onDecrease: (bookId: number) => void;
    onRemove: (bookId: number) => void;
    loadingAction?: string | null; // 'increase' | 'decrease' | 'remove' | null
}

export default function CartItem({ item, onIncrease, onDecrease, onRemove, loadingAction }: CartItemProps) {
    const discount = item.book.discount ?? 0;
    const originalPrice = item.book.price;
    const discountedPrice = discount > 0 ? originalPrice * (1 - discount / 100) : originalPrice;
    const hasDiscount = discount > 0;
    const isLoading = !!loadingAction;

    return (
        <div
            className={`bg-white rounded-xl border border-[#E5E2DD] p-4 sm:p-6 flex flex-col md:flex-row gap-4 sm:gap-6 items-start md:items-center relative transition-shadow hover:shadow-[0_8px_20px_rgba(26,35,126,0.04)] ${
                isLoading ? 'opacity-70 pointer-events-none' : ''
            }`}
        >
            {/* Book Image */}
            <Link
                to={`/product/${item.book.id}`}
                className="relative w-24 h-32 md:w-32 md:h-40 flex-shrink-0 rounded-lg overflow-hidden border border-[#E5E2DD] bg-[#FAF9F7] group"
            >
                {hasDiscount && (
                    <span className="absolute top-2 left-2 z-10 px-2 py-0.5 text-[11px] font-bold bg-[#BA1A1A] text-white rounded-sm shadow-xs">
                        -{discount}%
                    </span>
                )}
                {item.book.image ? (
                    <img
                        src={`${import.meta.env.VITE_BACKENDURL || import.meta.env.VITE_BACKEND_URL}/storage/book/${item.book.image}`}
                        alt={item.book.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#E3F2FD]">
                        <span className="text-3xl">📚</span>
                    </div>
                )}
            </Link>

            {/* Book Info & Actions */}
            <div className="flex-grow flex flex-col justify-between h-full w-full min-w-0 pr-8 md:pr-0">
                <div>
                    <Link
                        to={`/product/${item.book.id}`}
                        className="font-serif font-bold text-base sm:text-lg md:text-xl text-[#0D1E25] line-clamp-2 hover:text-[#0070B5] transition-colors"
                    >
                        {item.book.title}
                    </Link>
                    <p className="text-sm text-[#4C4546] mt-1 truncate">
                        {item.book.authors && item.book.authors.length > 0
                            ? item.book.authors.map((author) => author.name).join(', ')
                            : 'Chưa rõ tác giả'}
                    </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 mt-4 sm:mt-6">
                    {/* Price */}
                    <div className="flex items-baseline gap-2">
                        <span className="font-bold text-base sm:text-lg text-[#1A1A1A]">
                            {formatPrice(discountedPrice)}
                        </span>
                        {hasDiscount && (
                            <span className="text-xs text-[#7E7576] line-through">
                                {formatPrice(originalPrice)}
                            </span>
                        )}
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center bg-[#F4F3F1] rounded-lg border border-transparent focus-within:border-[#1A1A1A] transition-colors">
                        <button
                            type="button"
                            onClick={() => onDecrease(item.id)}
                            disabled={item.quantity <= 1 || isLoading}
                            className="p-2 text-[#4C4546] hover:text-[#1A1A1A] rounded-l-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                            aria-label="Giảm số lượng"
                        >
                            {loadingAction === 'decrease' ? (
                                <Loader2 className="w-4 h-4 animate-spin text-[#1A1A1A]" />
                            ) : (
                                <Minus className="w-4 h-4" />
                            )}
                        </button>
                        <input
                            aria-label="Số lượng"
                            type="text"
                            readOnly
                            value={item.quantity}
                            className="w-12 text-center bg-transparent border-none text-sm font-semibold text-[#0D1E25] focus:outline-none focus:ring-0 p-0 select-none"
                        />
                        <button
                            type="button"
                            onClick={() => onIncrease(item.id)}
                            disabled={isLoading}
                            className="p-2 text-[#4C4546] hover:text-[#1A1A1A] rounded-r-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                            aria-label="Tăng số lượng"
                        >
                            {loadingAction === 'increase' ? (
                                <Loader2 className="w-4 h-4 animate-spin text-[#1A1A1A]" />
                            ) : (
                                <Plus className="w-4 h-4" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Remove item button */}
            <button
                type="button"
                onClick={() => onRemove(item.id)}
                disabled={isLoading}
                className="absolute top-4 right-4 md:relative md:top-auto md:right-auto p-2 text-[#7E7576] hover:text-[#BA1A1A] hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                title="Xóa khỏi giỏ hàng"
                aria-label="Xóa sản phẩm"
            >
                {loadingAction === 'remove' ? (
                    <Loader2 className="w-5 h-5 animate-spin text-[#BA1A1A]" />
                ) : (
                    <Trash2 className="w-5 h-5" />
                )}
            </button>
        </div>
    );
}
