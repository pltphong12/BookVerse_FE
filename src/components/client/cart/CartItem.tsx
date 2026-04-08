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
        <div className={`group bg-white rounded-xl border border-gray-100 p-4 
                        hover:shadow-md hover:border-primary-100 
                        transition-all duration-200 ease-out
                        ${isLoading ? 'opacity-70 pointer-events-none' : ''}`}>
            <div className="flex gap-4">
                {/* Book Image */}
                <div className="relative flex-shrink-0 w-24 h-32 rounded-lg overflow-hidden bg-gray-50 border border-gray-100">
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
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
                            <span className="text-3xl">📚</span>
                        </div>
                    )}
                </div>

                {/* Book Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <h3 className="font-semibold text-gray-800 line-clamp-2 text-sm leading-snug mb-1">
                                {item.book.title}
                            </h3>
                            <p className="text-xs text-gray-400 truncate">{item.book.authors && item.book.authors.length > 0
                                ? item.book.authors.map(author => author.name).join(', ').toUpperCase()
                                : 'UNKNOWN AUTHOR'
                            }</p>
                        </div>
                        <button
                            onClick={() => onRemove(item.id)}
                            disabled={isLoading}
                            className="flex-shrink-0 p-1.5 rounded-lg text-gray-300 
                                       hover:text-red-500 hover:bg-red-50 
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
                            <span className="text-base font-bold text-primary-600">
                                {formatPrice(discountedPrice)}
                            </span>
                            {hasDiscount && (
                                <span className="text-xs text-gray-400 line-through">
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
                                           border border-gray-200 bg-gray-50 text-gray-500
                                           hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200
                                           disabled:opacity-40 disabled:cursor-not-allowed
                                           transition-all duration-150"
                            >
                                {loadingAction === 'decrease' ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                    <Minus className="w-3.5 h-3.5" />
                                )}
                            </button>
                            <div className="w-10 h-8 flex items-center justify-center 
                                           border-y border-gray-200 bg-white 
                                           text-sm font-semibold text-gray-800">
                                {item.quantity}
                            </div>
                            <button
                                onClick={() => onIncrease(item.id)}
                                disabled={isLoading}
                                className="w-8 h-8 flex items-center justify-center rounded-r-lg 
                                           border border-gray-200 bg-gray-50 text-gray-500
                                           hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200
                                           disabled:opacity-40 disabled:cursor-not-allowed
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
