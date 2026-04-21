import { Star, ShoppingCart, Heart, Share2 } from 'lucide-react';
import { useState } from 'react';
import { IBook } from '../../../../types/backend';
import { formatPrice } from '../../../../common/formatPrice';
import { callAddToCartApi } from '../../../../services/api';
import { showToast, ToastType } from '../../../../common/showToast';
import { useAppDispatch } from '../../../../redux/hook';
import { setCartSum } from '../../../../redux/slide/cart.slice';

interface ProductInfoProps {
    product: IBook;
}

export default function ProductInfo({ product }: ProductInfoProps) {
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const dispatch = useAppDispatch();

    const handleAddToCart = async () => {
        try {
            const res = await callAddToCartApi(product.id, quantity);
            if (res.data?.data) {
                dispatch(setCartSum(res.data.data.sum));
                showToast("Thêm vào giỏ hàng thành công", ToastType.SUCCESS);
            }
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message
                || "Thêm vào giỏ hàng thất bại";
            showToast(errorMessage, ToastType.ERROR);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <div className="flex items-start justify-between mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
                    {product.discount > 0 && (
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                            -{product.discount}%
                        </span>
                    )}
                </div>
                <p className="text-lg text-gray-600">{product.authors.map((author) => author.name).join(', ')}</p>
            </div>

            <div className="flex items-center gap-3">
                <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            className={`w-5 h-5 ${i < 5 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                }`}
                        />
                    ))}
                </div>
                <span className="text-gray-600">({product.sold} đã bán)</span>
            </div>

            <div className="border-y py-6">
                <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-4xl font-bold text-primary-600">
                        {formatPrice(product.discount > 0 ? product.price - (product.price * product.discount / 100) : product.price)}
                    </span>
                    {product.discount > 0 && (
                        <span className="text-xl text-gray-400 line-through">
                            {formatPrice(product.price)}
                        </span>
                    )}
                </div>
                {product.discount > 0 && (
                    <p className="text-sm text-gray-500">Tiết kiệm {formatPrice(product.price - (product.price - (product.price * product.discount / 100)))}</p>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="border rounded-lg p-3">
                    <p className="text-gray-500 mb-1">Nhà cung cấp</p>
                    <p className="font-semibold">{product.supplier?.name}</p>
                </div>
                <div className="border rounded-lg p-3">
                    <p className="text-gray-500 mb-1">Năm xuất bản</p>
                    <p className="font-semibold">{product.publishYear}</p>
                </div>
                <div className="border rounded-lg p-3">
                    <p className="text-gray-500 mb-1">Nhà xuất bản</p>
                    <p className="font-semibold">{product.publisher.name}</p>
                </div>
                <div className="border rounded-lg p-3">
                    <p className="text-gray-500 mb-1">Hình thức bìa</p>
                    <p className="font-semibold">{product.coverFormat}</p>
                </div>
            </div>

            <div className="space-y-3">
                <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">Số lượng</p>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="border border-gray-300 w-10 h-10 rounded-lg flex items-center justify-center hover:border-primary-500 hover:text-primary-500"
                        >
                            -
                        </button>
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                            className="border border-gray-300 w-16 h-10 rounded-lg text-center focus:outline-none focus:border-primary-500"
                        />
                        <button
                            onClick={() => setQuantity(quantity + 1)}
                            className="border border-gray-300 w-10 h-10 rounded-lg flex items-center justify-center hover:border-primary-500 hover:text-primary-500"
                        >
                            +
                        </button>
                        <span className="text-gray-500 text-sm ml-4">120 sản phẩm có sẵn</span>
                    </div>
                </div>

                <div className="flex gap-3 h-14">
                    <button onClick={handleAddToCart} className="flex-1 flex items-center justify-center gap-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors font-semibold text-base hover:shadow-lg">
                        <ShoppingCart className="w-5 h-5 mr-1" />
                        Thêm vào giỏ hàng
                    </button>
                    <button
                        onClick={() => setIsWishlisted(!isWishlisted)}
                        className={`w-14 h-14 flex items-center justify-center rounded-xl border-2 transition-colors ${isWishlisted
                            ? 'bg-red-50 border-red-500 text-red-600'
                            : 'border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-500'
                            }`}
                    >
                        <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-current' : ''}`} />
                    </button>
                    <button className="w-14 h-14 flex items-center justify-center rounded-xl border-2 border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors">
                        <Share2 className="w-6 h-6" />
                    </button>
                </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                <p className="font-semibold text-blue-900">Ưu đãi đặc biệt</p>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>✓ Miễn phí vận chuyển cho đơn hàng từ 300k</li>
                    <li>✓ Đổi trả trong 30 ngày nếu không hài lòng</li>
                    <li>✓ Bảo vệ 100% an toàn thanh toán</li>
                </ul>
            </div>
        </div>
    );
}
