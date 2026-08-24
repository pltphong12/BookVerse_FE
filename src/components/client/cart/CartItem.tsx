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
            className={`bg-white rounded-xl border border-[#dff1fb] p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center relative transition-shadow hover:shadow-[0_8px_20px_rgba(26,35,126,0.04)] ${
                isLoading ? 'opacity-70 pointer-events-none' : ''
            }`}
        >
            {/* Book Image */}
            <Link
                to={`/product/${item.book.id}`}
                className="relative w-24 h-32 sm:w-28 sm:h-36 flex-shrink-0 rounded-lg overflow-hidden border border-[#dff1fb] bg-[#f4faff] group"
            >
                {hasDiscount && (
                    <span className="absolute top-2 left-2 z-10 px-2 py-0.5 text-[11px] font-bold font-headline bg-red-600 text-white rounded-md shadow-sm">
                        -{discount}%
                    </span>
                )}
                {item.book.image ? (
                    <img
                        src={`${import.meta.env.VITE_BACKEND_URL}/storage/book/${item.book.image}`}
                        alt={item.book.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#e3f2fd]">
                        <span className="text-3xl">📚</span>
                    </div>
                )}
            </Link>

            {/* Book Info & Actions */}
            <div className="flex-grow flex flex-col justify-between h-full w-full min-w-0 pr-8 sm:pr-0">
                <div>
                    <Link
                        to={`/product/${item.book.id}`}
                        className="font-headline font-bold text-base sm:text-lg text-[#0d1e25] line-clamp-2 hover:text-[#1a237e] transition-colors"
                    >
                        {item.book.title}
                    </Link>
                    <p className="font-body text-sm text-slate-500 mt-1 truncate">
                        {item.book.authors && item.book.authors.length > 0
                            ? item.book.authors.map((author) => author.name).join(', ')
                            : 'Chưa rõ tác giả'}
                    </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
                    {/* Price */}
                    <div className="flex items-baseline gap-2">
                        <span className="font-headline font-bold text-base sm:text-lg text-[#1a237e]">
                            {formatPrice(discountedPrice)}
                        </span>
                        {hasDiscount && (
                            <span className="font-body text-xs text-slate-400 line-through">
                                {formatPrice(originalPrice)}
                            </span>
                        )}
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center bg-[#f4faff] rounded-lg border border-[#dff1fb] focus-within:border-[#1a237e] transition-colors">
                        <button
                            onClick={() => onDecrease(item.id)}
                            disabled={item.quantity <= 1 || isLoading}
                            className="p-2 text-slate-600 hover:text-[#1a237e] hover:bg-[#e3f2fd] rounded-l-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                            aria-label="Giảm số lượng"
                        >
                            {loadingAction === 'decrease' ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Minus className="w-4 h-4" />
                            )}
                        </button>
                        <span className="w-10 text-center font-body text-sm font-semibold text-[#0d1e25] select-none">
                            {item.quantity}
                        </span>
                        <button
                            onClick={() => onIncrease(item.id)}
                            disabled={isLoading}
                            className="p-2 text-slate-600 hover:text-[#1a237e] hover:bg-[#e3f2fd] rounded-r-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                            aria-label="Tăng số lượng"
                        >
                            {loadingAction === 'increase' ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Plus className="w-4 h-4" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Remove item button */}
            <button
                onClick={() => onRemove(item.id)}
                disabled={isLoading}
                className="absolute top-4 right-4 sm:relative sm:top-auto sm:right-auto p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                title="Xóa khỏi giỏ hàng"
            >
                {loadingAction === 'remove' ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <Trash2 className="w-5 h-5" />
                )}
            </button>
        </div>
    );
}
