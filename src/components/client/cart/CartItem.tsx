import { Minus, Plus, Trash2, Loader2 } from 'lucide-react';
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
        <div className={`group bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 p-5 
                        hover:shadow-lg hover:shadow-black/20 hover:border-primary-400/30 
                        transition-all duration-300 ease-out
                        ${isLoading ? 'opacity-70 pointer-events-none' : ''}`}>
            <div className="flex gap-4">
                {/* Book Image */}
                <div className="relative flex-shrink-0 w-24 h-32 rounded-lg overflow-hidden bg-white/5 border border-white/5">
                    {hasDiscount && (
                        <span className="absolute top-1.5 left-1.5 z-10 px-1.5 py-0.5 text-[10px] font-bold 
                                         bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-md shadow-sm">
                            -{discount}%
                        </span>
                    )}
                    {item.book.image ? (
                        <img
                            src={`${import.meta.env.VITE_BACKEND_URL}/storage/book/${item.book.image}`}
                            alt={item.book.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-500/20 to-primary-600/20">
                            <span className="text-3xl">📚</span>
                        </div>
                    )}
                </div>

                {/* Book Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <h3 className="font-semibold text-white line-clamp-2 text-sm leading-snug mb-1 group-hover:text-primary-300 transition-colors">
                                {item.book.title}
                            </h3>
                            <p className="text-xs text-white/50 truncate">{item.book.authors && item.book.authors.length > 0
                                ? item.book.authors.map(author => author.name).join(', ').toUpperCase()
                                : 'UNKNOWN AUTHOR'
                            }</p>
                        </div>
                        <button
                            onClick={() => onRemove(item.id)}
                            disabled={isLoading}
                            className="flex-shrink-0 p-1.5 rounded-lg text-white/40 
                                       hover:text-red-400 hover:bg-white/5 
                                       opacity-0 group-hover:opacity-100
                                       disabled:opacity-50 disabled:cursor-not-allowed
                                       transition-all duration-150"
                            title="Xóa sản phẩm"
                        >
                            {loadingAction === 'remove' ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Trash2 className="w-4 h-4" />
                            )}
                        </button>
                    </div>

                    <div className="flex items-end justify-between mt-3">
                        {/* Price */}
                        <div className="flex flex-col gap-0.5">
                            <span className="text-base font-bold text-primary-300">
                                {formatPrice(discountedPrice)}
                            </span>
                            {hasDiscount && (
                                <span className="text-xs text-white/40 line-through">
                                    {formatPrice(originalPrice)}
                                </span>
                            )}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-0">
                            <button
                                onClick={() => onDecrease(item.id)}
                                disabled={item.quantity <= 1 || isLoading}
                                className="w-8 h-8 flex items-center justify-center rounded-l-lg 
                                           border border-white/10 bg-white/5 text-white/70
                                           hover:bg-white/10 hover:text-primary-300 hover:border-white/20
                                           disabled:opacity-20 disabled:cursor-not-allowed
                                           transition-all duration-150"
                            >
                                {loadingAction === 'decrease' ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                    <Minus className="w-3.5 h-3.5" />
                                )}
                            </button>
                            <div className="w-10 h-8 flex items-center justify-center 
                                           border-y border-white/10 bg-white/10 
                                           text-sm font-semibold text-white">
                                {item.quantity}
                            </div>
                            <button
                                onClick={() => onIncrease(item.id)}
                                disabled={isLoading}
                                className="w-8 h-8 flex items-center justify-center rounded-r-lg 
                                           border border-white/10 bg-white/5 text-white/70
                                           hover:bg-white/10 hover:text-primary-300 hover:border-white/20
                                           disabled:opacity-20 disabled:cursor-not-allowed
                                           transition-all duration-150"
                            >
                                {loadingAction === 'increase' ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                    <Plus className="w-3.5 h-3.5" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
