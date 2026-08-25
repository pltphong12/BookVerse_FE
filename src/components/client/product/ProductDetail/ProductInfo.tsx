import { Star, ShoppingCart, Heart, Share2, Check, Zap } from 'lucide-react';
import { useState } from 'react';
import { IBook } from '../../../../types/backend';
import { formatPrice } from '../../../../common/formatPrice';
import { callAddToCartApi } from '../../../../services/api';
import { showToast, ToastType } from '../../../../common/showToast';
import { useAppDispatch, useAppSelector } from '../../../../redux/hook';
import { setCartSum } from '../../../../redux/slide/cart.slice';
import { useNavigate } from 'react-router-dom';

interface ProductInfoProps {
    product: IBook;
}

export default function ProductInfo({ product }: ProductInfoProps) {
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [copied, setCopied] = useState(false);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const isAuthenticated = useAppSelector((state) => state.account.isAuthenticated);

    const discountedPrice = product.discount > 0
        ? product.price - (product.price * product.discount) / 100
        : product.price;

    const handleAddToCart = async (showNotification = true) => {
        if (!isAuthenticated) {
            showToast("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!", ToastType.ERROR);
            navigate("/login");
            return false;
        }
        try {
            const res = await callAddToCartApi(product.id, quantity);
            if (res.data?.data) {
                dispatch(setCartSum(res.data.data.sum));
                if (showNotification) {
                    showToast("Đã thêm vào giỏ hàng thành công", ToastType.SUCCESS);
                }
                return true;
            }
            return false;
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || "Thêm vào giỏ hàng thất bại";
            showToast(errorMessage, ToastType.ERROR);
            return false;
        }
    };

    const handleBuyNow = async () => {
        const added = await handleAddToCart(false);
        if (added) {
            navigate('/cart');
        }
    };

    const handleShare = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            showToast("Đã sao chép liên kết vào bộ nhớ tạm!", ToastType.SUCCESS);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const authorsText = product.authors && product.authors.length > 0
        ? product.authors.map((a) => a.name).join(', ')
        : 'Đang cập nhật';

    return (
        <div className="flex flex-col gap-6">
            {/* Header: Title, Author & Category */}
            <div>
                <h1 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#1A1A1A] leading-tight mb-2">
                    {product.title}
                </h1>

                <p className="font-body text-base text-slate-600">
                    bởi{' '}
                    <span className="text-[#0070B5] font-medium hover:underline cursor-pointer">
                        {authorsText}
                    </span>
                    {product.category?.name && (
                        <span className="text-slate-400 text-sm ml-3">
                            • Thể loại: <strong className="text-slate-700 font-semibold">{product.category.name}</strong>
                        </span>
                    )}
                </p>
            </div>

            {/* Rating Stars & Sold Count */}
            <div className="flex items-center gap-3">
                <div className="flex text-[#B8860B]">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                </div>
                <span className="font-body text-xs sm:text-sm text-slate-500">
                    (5.0/5 từ 128 đánh giá) • <strong className="text-[#1A1A1A] font-semibold">{product.sold || 0}</strong> đã bán
                </span>
            </div>

            {/* Price section */}
            <div className="flex items-baseline gap-4 py-1">
                <span className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1A1A]">
                    {formatPrice(discountedPrice)}
                </span>
                {product.discount > 0 && (
                    <>
                        <span className="font-body text-lg text-slate-400 line-through">
                            {formatPrice(product.price)}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 bg-red-600 text-white font-body font-bold text-xs rounded">
                            -{product.discount}%
                        </span>
                    </>
                )}
            </div>

            {/* Excerpt / Description */}
            {product.description && (
                <div className="font-body text-slate-700 text-sm sm:text-base leading-relaxed max-w-3xl border-y border-[#E5E2DD] py-4">
                    <p className="line-clamp-4">
                        {product.description}
                    </p>
                </div>
            )}

            {/* Quantity Picker & Action Buttons */}
            <div className="space-y-4 pt-1">
                <div className="flex flex-wrap items-center gap-4">
                    {/* Quantity Picker */}
                    <div className="flex items-center border border-[#E5E2DD] rounded bg-white h-[44px]">
                        <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="w-10 h-full hover:bg-[#FAF9F7] text-slate-700 transition-colors flex items-center justify-center font-bold text-base cursor-pointer"
                        >
                            -
                        </button>
                        <input
                            aria-label="Quantity"
                            type="text"
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-12 h-full text-center border-none outline-none font-body font-semibold text-[#1A1A1A] bg-transparent text-sm"
                        />
                        <button
                            onClick={() => setQuantity(quantity + 1)}
                            className="w-10 h-full hover:bg-[#FAF9F7] text-slate-700 transition-colors flex items-center justify-center font-bold text-base cursor-pointer"
                        >
                            +
                        </button>
                    </div>

                    <span className="text-xs font-body text-slate-500">
                        {product.quantity > 0 ? (
                            <span>Còn lại: <strong className="text-slate-700 font-semibold">{product.quantity}</strong> cuốn</span>
                        ) : (
                            <span className="text-red-500 font-semibold">Tạm hết hàng</span>
                        )}
                    </span>
                </div>

                {/* Main Action Buttons */}
                <div className="flex flex-wrap items-center gap-3">
                    <button
                        onClick={() => handleAddToCart(true)}
                        disabled={product.quantity <= 0}
                        className="bg-[#1A1A1A] hover:bg-[#0070B5] disabled:opacity-50 text-white font-body font-semibold text-sm py-3.5 px-8 rounded transition-colors duration-200 flex items-center gap-2 cursor-pointer shadow-sm active:scale-98"
                    >
                        <ShoppingCart className="w-4 h-4" />
                        <span>Thêm vào giỏ hàng</span>
                    </button>

                    <button
                        onClick={handleBuyNow}
                        disabled={product.quantity <= 0}
                        className="border border-[#1A1A1A] text-[#1A1A1A] bg-transparent hover:bg-white/80 disabled:opacity-50 font-body font-semibold text-sm py-3.5 px-8 rounded transition-colors duration-200 flex items-center gap-2 cursor-pointer active:scale-98"
                    >
                        <Zap className="w-4 h-4" />
                        <span>Mua ngay</span>
                    </button>

                    {/* Wishlist & Share icon buttons */}
                    <button
                        onClick={() => {
                            setIsWishlisted(!isWishlisted);
                            showToast(
                                !isWishlisted ? "Đã thêm vào danh sách yêu thích" : "Đã bỏ khỏi yêu thích",
                                ToastType.SUCCESS
                            );
                        }}
                        title="Yêu thích"
                        className={`w-11 h-[44px] rounded border border-[#E5E2DD] flex items-center justify-center transition-colors cursor-pointer ${
                            isWishlisted
                                ? 'bg-rose-50 border-rose-300 text-rose-600'
                                : 'bg-white text-slate-600 hover:text-[#1A1A1A] hover:border-slate-400'
                        }`}
                    >
                        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                    </button>

                    <button
                        onClick={handleShare}
                        title="Chia sẻ"
                        className="w-11 h-[44px] rounded border border-[#E5E2DD] bg-white text-slate-600 hover:text-[#1A1A1A] hover:border-slate-400 flex items-center justify-center transition-colors cursor-pointer"
                    >
                        {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            {/* Detailed Specs Section (Phong cách Waterstones Stitch) */}
            <div className="mt-4 pt-6 border-t border-[#E5E2DD]">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1A1A1A] mb-4">
                    Thông tin chi tiết
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-8 text-sm font-body">
                    <div className="flex justify-between items-center py-2.5 border-b border-[#E5E2DD]">
                        <span className="text-slate-500">Mã sách / ID</span>
                        <span className="font-medium text-[#1A1A1A]">#{product.id}</span>
                    </div>
                    <div className="flex justify-between items-center py-2.5 border-b border-[#E5E2DD]">
                        <span className="text-slate-500">Nhà xuất bản</span>
                        <span className="font-medium text-[#1A1A1A]">{product.publisher?.name || 'Đang cập nhật'}</span>
                    </div>
                    <div className="flex justify-between items-center py-2.5 border-b border-[#E5E2DD]">
                        <span className="text-slate-500">Năm xuất bản</span>
                        <span className="font-medium text-[#1A1A1A]">{product.publishYear || 'Đang cập nhật'}</span>
                    </div>
                    <div className="flex justify-between items-center py-2.5 border-b border-[#E5E2DD]">
                        <span className="text-slate-500">Nhà cung cấp</span>
                        <span className="font-medium text-[#1A1A1A]">{product.supplier?.name || 'Đang cập nhật'}</span>
                    </div>
                    <div className="flex justify-between items-center py-2.5 border-b border-[#E5E2DD]">
                        <span className="text-slate-500">Số trang</span>
                        <span className="font-medium text-[#1A1A1A]">{product.numberOfPages ? `${product.numberOfPages} trang` : 'Đang cập nhật'}</span>
                    </div>
                    <div className="flex justify-between items-center py-2.5 border-b border-[#E5E2DD]">
                        <span className="text-slate-500">Loại bìa</span>
                        <span className="font-medium text-[#1A1A1A]">{product.coverFormat || 'Bìa mềm'}</span>
                    </div>
                    <div className="flex justify-between items-center py-2.5 border-b border-[#E5E2DD]">
                        <span className="text-slate-500">Kích thước</span>
                        <span className="font-medium text-[#1A1A1A]">{product.dimensions || 'Đang cập nhật'}</span>
                    </div>
                    <div className="flex justify-between items-center py-2.5 border-b border-[#E5E2DD]">
                        <span className="text-slate-500">Trọng lượng</span>
                        <span className="font-medium text-[#1A1A1A]">{product.weight ? `${product.weight} g` : 'Đang cập nhật'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
