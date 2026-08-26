import { useEffect, useState } from 'react';
import { ChevronRight, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import CartItem from '../../components/client/cart/CartItem';
import CartSummary from '../../components/client/cart/CartSummary';
import CartEmpty from '../../components/client/cart/CartEmpty';
import { ICartDetail } from '../../types/backend';
import {
    callFetchCartApi,
    callIncreaseQuantityApi,
    callDecreaseQuantityApi,
    callRemoveFromCartApi,
} from '../../services/api';
import { setCartSum } from '../../redux/slide/cart.slice';

export default function CartPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [cartItems, setCartItems] = useState<ICartDetail[]>([]);
    const [loadingItems, setLoadingItems] = useState<Record<number, string | null>>({});

    const fetchCartItems = async () => {
        try {
            const res = await callFetchCartApi();
            if (res.status === 200) {
                const cart = res.data.data;
                setCartItems(cart?.cartDetails || []);
                dispatch(setCartSum(cart?.sum ?? 0));
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
        }
    };

    useEffect(() => {
        fetchCartItems();
    }, []);

    const setItemLoading = (bookId: number, action: string | null) => {
        setLoadingItems((prev) => ({ ...prev, [bookId]: action }));
    };

    const handleIncrease = async (bookId: number) => {
        setItemLoading(bookId, 'increase');
        try {
            const res = await callIncreaseQuantityApi(bookId);
            if (res.status === 200) {
                const cart = res.data.data;
                setCartItems(cart?.cartDetails || []);
                dispatch(setCartSum(cart?.sum ?? 0));
            }
        } catch (error) {
            console.error('Error increasing quantity:', error);
        } finally {
            setItemLoading(bookId, null);
        }
    };

    const handleDecrease = async (bookId: number) => {
        setItemLoading(bookId, 'decrease');
        try {
            const res = await callDecreaseQuantityApi(bookId);
            if (res.status === 200) {
                const cart = res.data.data;
                setCartItems(cart?.cartDetails || []);
                dispatch(setCartSum(cart?.sum ?? 0));
            }
        } catch (error) {
            console.error('Error decreasing quantity:', error);
        } finally {
            setItemLoading(bookId, null);
        }
    };

    const handleRemoveItem = async (bookId: number) => {
        setItemLoading(bookId, 'remove');
        try {
            const res = await callRemoveFromCartApi(bookId);
            if (res.status === 200) {
                const cart = res.data.data;
                setCartItems(cart?.cartDetails || []);
                dispatch(setCartSum(cart?.sum ?? 0));
            }
        } catch (error) {
            console.error('Error removing item:', error);
        } finally {
            setItemLoading(bookId, null);
        }
    };

    const handleClearCart = () => {
        setCartItems([]);
    };

    const handleCheckout = () => {
        navigate('/checkout');
    };

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 py-6 sm:py-10">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs sm:text-sm text-[#7E7576] mb-6">
                <Link to="/" className="hover:text-[#0070B5] transition-colors">
                    Trang chủ
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-[#CFC4C5]" />
                <span className="text-[#1A1A1A] font-semibold">Giỏ hàng</span>
            </div>

            {/* Page Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#0D1E25] tracking-tight">
                        Giỏ hàng của bạn
                    </h1>
                    <p className="text-sm text-[#4C4546] mt-1">
                        {cartItems.length > 0
                            ? `Bạn đang có ${cartItems.length} sản phẩm trong giỏ hàng`
                            : 'Chưa có sản phẩm nào trong giỏ hàng'}
                    </p>
                </div>
                {cartItems.length > 0 && (
                    <button
                        type="button"
                        onClick={handleClearCart}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-[#7E7576] hover:text-[#BA1A1A] hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    >
                        <Trash2 className="w-4 h-4" />
                        Xóa tất cả
                    </button>
                )}
            </div>

            {cartItems.length === 0 ? (
                <CartEmpty />
            ) : (
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    {/* Cart Items List */}
                    <div className="w-full lg:w-2/3 space-y-4">
                        {cartItems.map((item) => (
                            <CartItem
                                key={item.id}
                                item={item}
                                onIncrease={handleIncrease}
                                onDecrease={handleDecrease}
                                onRemove={handleRemoveItem}
                                loadingAction={loadingItems[item.book.id] || null}
                            />
                        ))}
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="w-full lg:w-1/3">
                        <CartSummary items={cartItems} onCheckout={handleCheckout} />
                    </div>
                </div>
            )}
        </div>
    );
}
