import { IBook } from '../../../types/backend';
import ProductCard from './ProductCard';
import { ChevronRight } from 'lucide-react';

interface ProductSectionProps {
    title: string;
    products: IBook[];
}

export default function ProductSection({ title, products }: ProductSectionProps) {
    return (
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-lg shadow-black/10 border border-white/30 overflow-hidden">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-8 bg-gradient-to-b from-primary-400 to-primary-600 rounded-full" />
                    <h2 className="text-2xl font-bold gradient-text">{title}</h2>
                </div>
                <button className="group/btn flex items-center gap-1.5 text-primary-500 hover:text-primary-700 font-semibold transition-colors px-4 py-2 rounded-lg hover:bg-primary-50">
                    Xem tất cả
                    <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover/btn:translate-x-1" />
                </button>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
                {products.map((product, index) => (
                    <div key={product.id} className={`stagger-${index + 1}`}>
                        <ProductCard {...product} />
                    </div>
                ))}
            </div>
        </div>
    );
}
