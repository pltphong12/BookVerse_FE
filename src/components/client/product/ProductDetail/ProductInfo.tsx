import { Star, ShoppingCart, Heart, Share2, ShieldCheck, Truck, RotateCcw, Check } from 'lucide-react';
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
    const [activeTab, setActiveTab] = useState<'desc' | 'specs'>('desc');
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

    const handleShare = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            showToast("Đã sao chép liên kết vào bộ nhớ tạm!", ToastType.SUCCESS);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Header: Category, Title, Author & Rating */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex items-center px-3 py-1 bg-[#e3f2fd] text-[#1a237e] font-headline font-semibold text-xs rounded-full">
                        {product.category?.name || 'Sách tổng hợp'}
                    </span>
                    {product.discount > 0 && (
                        <span className="inline-flex items-center px-2.5 py-0.5 bg-red-500 text-white font-headline font-bold text-xs rounded-full">
                            -{product.discount}%
                        </span>
                    )}
                </div>

                <h1 className="font-headline text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0d1e25] leading-tight mb-2 tracking-tight">
                    {product.title}
                </h1>

                <p className="font-body text-sm sm:text-base text-slate-500 mb-3">
                    Tác giả:{' '}
                    <span className="text-[#1a237e] font-semibold">
                        {product.authors && product.authors.length > 0
                            ? product.authors.map((a) => a.name).join(', ')
                            : 'Đang cập nhật'}
                    </span>
                </p>

                <div className="flex items-center gap-3">
                    <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                    </div>
                    <span className="font-body text-xs sm:text-sm text-slate-500 font-medium">
                        5.0 (120 đánh giá) • <strong className="text-slate-700">{product.sold || 0}</strong> đã bán
                    </span>
                </div>
            </div>

            {/* Price & Purchase Actions Card */}
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#dff1fb] shadow-sm flex flex-col gap-6">
                {/* Price section */}
                <div className="flex flex-wrap items-baseline gap-3">
                    <span className="font-headline text-3xl sm:text-4xl font-extrabold text-[#1a237e]">
                        {formatPrice(discountedPrice)}
                    </span>
                    {product.discount > 0 && (
                        <span className="font-body text-lg text-slate-400 line-through">
                            {formatPrice(product.price)}
                        </span>
                    )}
                </div>

                {/* Quantity & Add to cart row */}
                <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                    {/* Quantity Picker */}
                    <div className="flex items-center border border-[#dff1fb] rounded-xl overflow-hidden bg-[#f4faff] h-[48px] shrink-0 self-start sm:self-auto">
                        <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="w-10 h-full hover:bg-[#e3f2fd] text-slate-700 hover:text-[#1a237e] transition-colors flex items-center justify-center font-bold text-base cursor-pointer"
                        >
                            -
                        </button>
                        <input
                            aria-label="Quantity"
                            type="text"
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-12 h-full text-center border-none outline-none font-body font-semibold text-slate-800 bg-transparent text-sm"
                        />
                        <button
                            onClick={() => setQuantity(quantity + 1)}
                            className="w-10 h-full hover:bg-[#e3f2fd] text-slate-700 hover:text-[#1a237e] transition-colors flex items-center justify-center font-bold text-base cursor-pointer"
                        >
                            +
                        </button>
                    </div>

                    {/* Add to Cart button */}
                    <div className="flex flex-1 h-[48px]">
                        <button
                            onClick={() => handleAddToCart(true)}
                            className="w-full bg-[#1a237e] hover:bg-[#283593] text-white font-headline font-bold text-sm h-full rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                        >
                            <ShoppingCart className="w-4 h-4" />
                            <span>Thêm vào giỏ hàng</span>
                        </button>
                    </div>

                    {/* Wishlist & Share icon buttons */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                setIsWishlisted(!isWishlisted);
                                showToast(
                                    !isWishlisted ? "Đã thêm vào danh sách yêu thích" : "Đã bỏ khỏi yêu thích",
                                    ToastType.SUCCESS
                                );
                            }}
                            title="Yêu thích"
                            className={`w-12 h-[48px] rounded-xl border flex items-center justify-center transition-all cursor-pointer ${isWishlisted
                                ? 'bg-rose-50 border-rose-300 text-rose-600'
                                : 'border-[#dff1fb] bg-[#f4faff] text-slate-600 hover:border-[#1a237e] hover:text-[#1a237e]'
                                }`}
                        >
                            <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                        </button>
                        <button
                            onClick={handleShare}
                            title="Chia sẻ"
                            className="w-12 h-[48px] rounded-xl border border-[#dff1fb] bg-[#f4faff] text-slate-600 hover:border-[#1a237e] hover:text-[#1a237e] flex items-center justify-center transition-all cursor-pointer"
                        >
                            {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Share2 className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Stock info */}
                <div className="text-xs font-body text-slate-500">
                    Kho hàng: <strong className="text-slate-700">{product.quantity}</strong> cuốn sách có sẵn
                </div>
            </div>

            {/* Description & Specifications Tabs */}
            <div className="bg-white rounded-2xl border border-[#dff1fb] p-6 sm:p-7 shadow-sm">
                <div className="flex border-b border-slate-100 mb-5 gap-8">
                    <button
                        onClick={() => setActiveTab('desc')}
                        className={`font-headline font-bold text-sm pb-3 cursor-pointer transition-all ${activeTab === 'desc'
                            ? 'text-[#1a237e] border-b-2 border-[#1a237e]'
                            : 'text-slate-400 hover:text-[#1a237e]'
                            }`}
                    >
                        Mô tả cuốn sách
                    </button>
                    <button
                        onClick={() => setActiveTab('specs')}
                        className={`font-headline font-bold text-sm pb-3 cursor-pointer transition-all ${activeTab === 'specs'
                            ? 'text-[#1a237e] border-b-2 border-[#1a237e]'
                            : 'text-slate-400 hover:text-[#1a237e]'
                            }`}
                    >
                        Thông số chi tiết
                    </button>
                </div>

                {activeTab === 'desc' ? (
                    <div className="font-body text-slate-600 text-sm sm:text-base leading-relaxed space-y-4">
                        {product.description ? (
                            product.description.split('\n').map((paragraph, index) => (
                                <p key={index}>{paragraph}</p>
                            ))
                        ) : (
                            <p className="italic text-slate-400">Chưa có mô tả chi tiết cho cuốn sách này.</p>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3.5 gap-x-8 text-sm font-body">
                        <div className="flex justify-between py-2 border-b border-slate-100">
                            <span className="text-slate-400">Tác giả</span>
                            <span className="font-semibold text-slate-800">{product.authors?.map((a) => a.name).join(', ') || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-100">
                            <span className="text-slate-400">Nhà xuất bản</span>
                            <span className="font-semibold text-slate-800">{product.publisher?.name || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-100">
                            <span className="text-slate-400">Năm xuất bản</span>
                            <span className="font-semibold text-slate-800">{product.publishYear || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-100">
                            <span className="text-slate-400">Nhà cung cấp</span>
                            <span className="font-semibold text-slate-800">{product.supplier?.name || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-100">
                            <span className="text-slate-400">Số trang</span>
                            <span className="font-semibold text-slate-800">{product.numberOfPages ? `${product.numberOfPages} trang` : 'N/A'}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-100">
                            <span className="text-slate-400">Hình thức bìa</span>
                            <span className="font-semibold text-slate-800">{product.coverFormat || 'Bìa mềm'}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-100">
                            <span className="text-slate-400">Kích thước</span>
                            <span className="font-semibold text-slate-800">{product.dimensions || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-100">
                            <span className="text-slate-400">Trọng lượng</span>
                            <span className="font-semibold text-slate-800">{product.weight ? `${product.weight} g` : 'N/A'}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Special Benefits Strip */}
            <div className="bg-[#f4faff] border border-[#dff1fb] rounded-2xl p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-body text-slate-600">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#e3f2fd] text-[#1a237e] flex items-center justify-center shrink-0">
                        <Truck className="w-4 h-4" />
                    </div>
                    <span>Miễn phí vận chuyển từ <strong>300k</strong></span>
                </div>
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#e3f2fd] text-[#1a237e] flex items-center justify-center shrink-0">
                        <RotateCcw className="w-4 h-4" />
                    </div>
                    <span>Đổi trả trong <strong>30 ngày</strong></span>
                </div>
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#e3f2fd] text-[#1a237e] flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-4 h-4" />
                    </div>
                    <span>100% Sách chuẩn chính hãng</span>
                </div>
            </div>
        </div>
    );
}

