import { ShoppingCart, Star } from 'lucide-react';
import { IBook } from '../../../types/backend';
import { formatPrice } from '../../../common/formatPrice';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import { setCartSum } from '../../../redux/slide/cart.slice';
import { callAddToCartApi } from '../../../services/api';
import { showToast, ToastType } from '../../../common/showToast';

export default function ProductCard(book: IBook) {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const isAuthenticated = useAppSelector((state) => state.account.isAuthenticated);

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            showToast("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!", ToastType.ERROR);
            navigate("/login");
            return;
        }
        try {
            const res = await callAddToCartApi(book.id, 1);
            if (res.data?.data) {
                dispatch(setCartSum(res.data.data.sum));
                showToast("Thêm vào giỏ hàng thành công", ToastType.SUCCESS);
            }
        } catch (error: any) {
            showToast(error.response?.data?.message || "Có lỗi xảy ra", ToastType.ERROR);
        }
    };

    const discountedPrice = book.discount > 0
        ? book.price - (book.price * book.discount / 100)
        : book.price;

    return (
        <Link to={`/product/${book.id}`} className="block h-full">
            <div className="bg-white rounded-2xl border border-[#dff1fb] hover:border-blue-300/80 shadow-[0_2px_12px_-2px_rgba(26,35,126,0.04)] overflow-hidden group cursor-pointer hover-elevation-2 flex flex-col h-full transition-all duration-300">
                {/* Book Cover Container */}
                <div className="relative overflow-hidden bg-slate-50 aspect-[3/4] p-3 flex items-center justify-center">
                    {book.image ? (
                        <img
                            src={`${import.meta.env.VITE_BACKEND_URL}/storage/book/${book.image}`}
                            alt={book.title}
                            className="w-full h-full object-cover rounded-lg shadow-sm transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 text-slate-400">
                            <span className="text-4xl">📚</span>
                        </div>
                    )}

                    {/* Discount Badge */}
                    {book.discount > 0 && (
                        <span className="absolute top-2.5 right-2.5 bg-gradient-to-r from-red-600 to-rose-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                            -{book.discount}%
                        </span>
                    )}

                    {/* Quick Add To Cart Overlay */}
                    <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                handleAddToCart();
                            }}
                            className="w-full flex items-center justify-center gap-1.5 bg-[#1a237e] hover:bg-[#283593] text-white py-2 px-3 rounded-xl font-semibold text-xs transition-all shadow-md active:scale-95 cursor-pointer"
                        >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            Thêm vào giỏ
                        </button>
                    </div>
                </div>

                {/* Book Details */}
                <div className="p-4 flex flex-col flex-grow justify-between gap-2">
                    <div>
                        {/* Category Chip (if available) */}
                        {book.category && (
                            <span className="inline-block bg-[#e3f2fd] text-[#1a237e] text-[10px] font-semibold px-2 py-0.5 rounded-full mb-1.5 truncate max-w-full">
                                {book.category.name}
                            </span>
                        )}

                        {/* Title */}
                        <h3 className="font-headline font-bold text-[#0d1e25] line-clamp-2 text-sm leading-snug group-hover:text-[#1a237e] transition-colors min-h-[2.5rem]">
                            {book.title}
                        </h3>

                        {/* Authors */}
                        <p className="font-body text-xs text-slate-500 truncate mt-0.5">
                            {book.authors && book.authors.length > 0
                                ? book.authors.map((author) => author.name).join(', ')
                                : 'Đang cập nhật'}
                        </p>
                    </div>

                    <div>
                        {/* Rating & Sold count */}
                        <div className="flex items-center gap-1 my-1">
                            <div className="flex items-center text-amber-400">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                                ))}
                            </div>
                            <span className="font-body text-[11px] text-slate-400 ml-1">
                                ({book.sold ?? 0} đã bán)
                            </span>
                        </div>

                        {/* Pricing */}
                        <div className="flex items-baseline gap-2 pt-1 border-t border-slate-100">
                            <span className="font-headline text-base sm:text-lg font-bold text-[#1a237e]">
                                {formatPrice(discountedPrice)}
                            </span>
                            {book.discount > 0 && (
                                <span className="font-body text-xs text-slate-400 line-through">
                                    {formatPrice(book.price)}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}

