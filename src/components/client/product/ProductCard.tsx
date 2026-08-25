import { ShoppingCart } from 'lucide-react';
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

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

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
        <article className="flex flex-col h-full group cursor-pointer">
            <Link to={`/product/${book.id}`} className="block flex-1 flex flex-col">
                {/* Book Cover Container */}
                <div className="w-full aspect-[2/3] mb-3.5 overflow-hidden bg-[#F4F3F1] rounded-sm relative flex items-center justify-center">
                    {book.image ? (
                        <img
                            src={
                                book.image.startsWith('http')
                                    ? book.image
                                    : `${import.meta.env.VITE_BACKEND_URL}/storage/book/${book.image}`
                            }
                            alt={book.title}
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRzN6Adj5aiXn2g67TJhkJD78ell0__t58s3Nys34rfBbW2QRyVvc3q6n8wv-0ik8LMY-olR_dENiTAp3GTLq5qgudZw0Z7Jm4Hf7qu38yzfZ_gOHoGjhCwoOzFnCHP4i2IqMXvZJezzSlJ8W2phkcophPRljguu7Ij-g0TrdiX5ljBG7AxQ52I7wglhl8LLOTBr4IBQTpLU_akOE5c0HnmvMBs5x41QffmyLr2R2RuPW4e_t8Pfs';
                            }}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 shadow-2xs"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center rounded bg-[#F4F3F1] text-slate-400">
                            <span className="text-3xl">📖</span>
                        </div>
                    )}

                    {/* Discount Badge */}
                    {book.discount > 0 && (
                        <span className="absolute top-2.5 right-2.5 bg-[#1A1A1A] text-white text-[10px] font-semibold px-2 py-0.5 rounded-xs shadow-sm">
                            -{book.discount}%
                        </span>
                    )}

                    {/* Quick Add Button on Hover */}
                    <button
                        onClick={handleAddToCart}
                        className="absolute inset-x-3 bottom-3 bg-[#1A1A1A] hover:bg-[#0070B5] text-white py-2 px-3 rounded-xs text-xs font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                        title="Thêm vào giỏ hàng"
                    >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>Thêm vào giỏ</span>
                    </button>
                </div>

                {/* Book Details */}
                <div className="flex flex-col flex-1 justify-between">
                    <div>
                        {/* Title */}
                        <h3 className="font-serif font-bold text-sm sm:text-base text-[#1A1A1A] group-hover:text-[#0070B5] transition-colors leading-snug line-clamp-2 mb-1">
                            {book.title}
                        </h3>

                        {/* Author */}
                        <p className="font-body text-xs text-slate-500 truncate mb-2">
                            {book.authors && book.authors.length > 0
                                ? book.authors.map((author) => author.name).join(', ')
                                : 'Tác giả tuyển chọn'}
                        </p>
                    </div>

                    {/* Pricing */}
                    <div className="mt-auto flex items-baseline gap-2 pt-1">
                        <span className="font-body font-semibold text-sm sm:text-base text-[#1A1A1A]">
                            {formatPrice(discountedPrice)}
                        </span>
                        {book.discount > 0 && (
                            <span className="font-body text-xs text-slate-400 line-through">
                                {formatPrice(book.price)}
                            </span>
                        )}
                    </div>
                </div>
            </Link>
        </article>
    );
}


