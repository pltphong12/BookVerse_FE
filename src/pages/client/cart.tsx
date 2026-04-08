import { useEffect, useState } from 'react';
import { ChevronRight, ShoppingCart, Trash2 } from 'lucide-react';
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
            console.log(error);
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
            console.log(error);
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
            console.log(error);
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
            console.log(error);
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
        <div className="min-h-[60vh]">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                <Link to="/" className="hover:text-primary-500 transition-colors">
                    Trang chủ
                </Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-gray-800 font-semibold">Giỏ hàng</span>
            </div>

            {/* Page Title */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl 
                                    bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg shadow-primary-200/40">
                        <ShoppingCart className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Giỏ hàng của bạn</h1>
                        <p className="text-sm text-gray-400">
                            {cartItems.length > 0
                                ? `${cartItems.length} sản phẩm trong giỏ hàng`
                                : 'Chưa có sản phẩm nào'}
                        </p>
                    </div>
                </div>
                {cartItems.length > 0 && (
                    <button
                        onClick={handleClearCart}
                        className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-400 
                                   hover:text-red-500 hover:bg-red-50 rounded-lg
                                   transition-all duration-150"
                    >
                        <Trash2 className="w-4 h-4" />
                        Xóa tất cả
                    </button>
                )}
            </div>

            {cartItems.length === 0 ? (
                <CartEmpty />
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-3">
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

                        {/* Continue Shopping */}
                        <div className="pt-4">
                            <Link
                                to="/products"
                                className="inline-flex items-center gap-2 text-sm text-primary-500 
                                           hover:text-primary-600 font-medium transition-colors"
                            >
                                <ChevronRight className="w-4 h-4 rotate-180" />
                                Tiếp tục mua sắm
                            </Link>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <CartSummary items={cartItems} onCheckout={handleCheckout} />
                    </div>
                </div>
            )}
        </div>
    );
}
