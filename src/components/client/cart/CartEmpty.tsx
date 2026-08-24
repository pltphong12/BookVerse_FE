import { ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CartEmpty() {
    return (
        <div className="bg-white rounded-2xl border border-[#dff1fb] p-12 sm:p-16 flex flex-col items-center justify-center text-center shadow-sm">
            {/* Empty illustration icon */}
            <div className="w-24 h-24 rounded-full bg-[#e3f2fd] flex items-center justify-center text-[#1a237e] mb-6">
                <ShoppingBag className="w-12 h-12" />
            </div>

            <h2 className="font-headline font-bold text-xl sm:text-2xl text-[#0d1e25] mb-2">
                Giỏ hàng của bạn đang trống
            </h2>
            <p className="font-body text-sm text-slate-500 max-w-md mb-8">
                Có vẻ như bạn chưa chọn cuốn sách nào. Hãy khám phá kho tàng tri thức với hàng ngàn đầu sách hấp dẫn của BookVerse!
            </p>

            <Link
                to="/products"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-[#1a237e] text-white font-headline font-bold text-sm rounded-xl hover:bg-[#283593] transition-all shadow-md shadow-indigo-950/10 cursor-pointer"
            >
                Khám phá sách ngay
            </Link>
        </div>
    );
}
