import { Link } from 'react-router-dom';

export default function CartEmpty() {
    return (
        <div className="bg-white rounded-xl border border-[#E5E2DD] p-12 sm:p-16 flex flex-col items-center justify-center text-center shadow-xs">
            <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#0D1E25] mb-2">
                Giỏ hàng của bạn đang trống
            </h2>
            <p className="text-sm text-[#4C4546] max-w-md mb-8">
                Có vẻ như bạn chưa chọn cuốn sách nào. Hãy khám phá kho tàng tri thức với hàng ngàn đầu sách hấp dẫn của BookVerse!
            </p>

            <Link
                to="/products"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-[#1A1A1A] text-white font-semibold text-sm rounded-lg hover:bg-[#0070B5] active:bg-[#005a92] transition-colors duration-200 shadow-xs cursor-pointer"
            >
                Khám phá sách ngay
            </Link>
        </div>
    );
}
