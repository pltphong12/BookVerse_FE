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
            showToast(error.response.data.message, ToastType.ERROR);
        }
    };

    const discountedPrice = book.discount > 0
        ? book.price - (book.price * book.discount / 100)
        : book.price;

    return (
        <Link to={`/product/${book.id}`}>
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden group cursor-pointer card-hover-lift border border-gray-100/80">
                {/* Image Container */}
                <div className="relative overflow-hidden bg-gray-50 aspect-[3/4]">
                    {book.image ? (
                        <img
                            src={`${import.meta.env.VITE_BACKEND_URL}/storage/book/${book.image}`}
                            alt={book.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
                            <span className="text-5xl">📚</span>
                        </div>
                    )}

                    {/* Hover overlay with add-to-cart */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent product-card-overlay">
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleAddToCart();
                                }}
                                className="w-full flex items-center justify-center gap-2 bg-white text-primary-600 px-3 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary-500 hover:text-white transition-all shadow-lg active:scale-95"
                            >
                                <ShoppingCart className="w-4 h-4" />
                                Thêm vào giỏ
                            </button>
                        </div>
                    </div>

                    {/* Discount Badge */}
                    {book.discount > 0 && (
                        <span className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-rose-500 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg shadow-md badge-pulse">
                            -{book.discount}%
                        </span>
                    )}
                </div>

                {/* Card Content */}
                <div className="p-4">
                    <h3 className="font-semibold text-gray-800 line-clamp-2 mb-1.5 min-h-[3rem] text-sm leading-snug group-hover:text-primary-600 transition-colors">
                        {book.title}
                    </h3>
                    <p className="text-xs text-gray-400 mb-2 truncate">
                        {book.authors.map((author) => author.name).join(', ')}
                    </p>

                    {/* Star Rating */}
                    <div className="flex items-center gap-0.5 mb-3">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        ))}
                        <span className="text-xs text-gray-400 ml-1">({book.sold})</span>
                    </div>

                    {/* Price */}
                    <div className="flex items-end gap-2">
                        <span className="text-lg font-bold text-primary-600">
                            {formatPrice(discountedPrice)}
                        </span>
                        {book.discount > 0 && (
                            <span className="text-xs text-gray-400 line-through mb-0.5">
                                {formatPrice(book.price)}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}
