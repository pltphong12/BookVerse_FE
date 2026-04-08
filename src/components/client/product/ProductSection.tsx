import { IBook } from '../../../types/backend';
import ProductCard from './ProductCard';
import { ChevronRight } from 'lucide-react';

interface ProductSectionProps {
    title: string;
    products: IBook[];
}

export default function ProductSection({ title, products }: ProductSectionProps) {
    return (
        <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
                <button className="flex items-center gap-1 text-primary-500 hover:text-primary-600 font-medium">
                    Xem tất cả
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {products.map((product) => (
                    <ProductCard key={product.id} {...product} />
                ))}
            </div>
        </div>
    );
}
