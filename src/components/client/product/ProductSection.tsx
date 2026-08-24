import { IBook } from '../../../types/backend';
import ProductCard from './ProductCard';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProductSectionProps {
    title: string;
    products: IBook[];
}

export default function ProductSection({ title, products }: ProductSectionProps) {
    const navigate = useNavigate();

    return (
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 lg:p-10 shadow-[0_4px_20px_-4px_rgba(26,35,126,0.05)] border border-[#dff1fb]">
            {/* Section Header */}
            <div className="flex justify-between items-end mb-6 sm:mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-7 bg-[#1a237e] rounded-full" />
                    <h2 className="font-headline text-2xl sm:text-3xl font-bold text-[#0d1e25]">
                        {title}
                    </h2>
                </div>
                <button
                    onClick={() => navigate('/products')}
                    className="font-headline text-sm sm:text-base text-[#1a237e] hover:text-[#283593] font-semibold flex items-center gap-1 hover:underline cursor-pointer group"
                >
                    Xem tất cả
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
                {products && products.length > 0 ? (
                    products.map((product, index) => (
                        <div key={product.id} className={`stagger-${index + 1}`}>
                            <ProductCard {...product} />
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-8 text-center text-slate-400 font-body">
                        Đang cập nhật danh sách sách...
                    </div>
                )}
            </div>
        </div>
    );
}

