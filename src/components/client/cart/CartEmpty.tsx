import { ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CartEmpty() {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
            {/* Animated illustration */}
            <div className="relative mb-8">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-50 to-primary-100 
                                flex items-center justify-center
                                animate-[pulse_3s_ease-in-out_infinite]">
                    <ShoppingBag className="w-14 h-14 text-primary-300" />
                </div>
                {/* Floating particles */}
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary-100 
                                animate-[bounce_2s_ease-in-out_infinite]" />
                <div className="absolute bottom-0 -left-3 w-4 h-4 rounded-full bg-primary-200 
                                animate-[bounce_2.5s_ease-in-out_infinite_0.5s]" />
            </div>

            <h2 className="text-xl font-bold text-gray-800 mb-2">
                Giỏ hàng trống
            </h2>
            <p className="text-sm text-gray-400 mb-8 text-center max-w-sm">
                Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá kho sách phong phú của chúng tôi!
            </p>

            <Link
                to="/products"
                className="px-8 py-3 bg-gradient-to-r from-primary-500 to-primary-600 
                           text-white font-semibold text-sm rounded-xl
                           hover:from-primary-600 hover:to-primary-700 
                           active:scale-[0.98]
                           shadow-lg shadow-primary-200/50
                           transition-all duration-200 
                           flex items-center gap-2"
            >
                <ShoppingBag className="w-4 h-4" />
                Khám phá sách ngay
            </Link>
        </div>
    );
}
