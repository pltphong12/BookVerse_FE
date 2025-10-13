import { ShoppingCart, Star } from 'lucide-react';

interface ProductCardProps {
  title: string;
  author: string;
  price: number;
  originalPrice?: number;
  rating: number;
  soldCount: number;
  imageUrl?: string;
}

export default function ProductCard({
  title,
  author,
  price,
  originalPrice,
  rating,
  soldCount,
  imageUrl,
}: ProductCardProps) {
  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer">
      <div className="relative overflow-hidden bg-gray-100 aspect-[3/4]">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200">
            <span className="text-4xl text-primary-400">📚</span>
          </div>
        )}
        {discount > 0 && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            -{discount}%
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-800 line-clamp-2 mb-1 min-h-[3rem]">
          {title}
        </h3>
        <p className="text-sm text-gray-500 mb-2">{author}</p>

        <div className="flex items-center gap-1 mb-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">({soldCount})</span>
        </div>

        <div className="flex items-end gap-2 mb-3">
          <span className="text-xl font-bold text-primary-600">
            {price.toLocaleString('vi-VN')}đ
          </span>
          {originalPrice && (
            <span className="text-sm text-gray-400 line-through">
              {originalPrice.toLocaleString('vi-VN')}đ
            </span>
          )}
        </div>

        <button className="w-full btn btn-primary btn-sm">
          <ShoppingCart className="w-4 h-4" />
          Thêm vào giỏ
        </button>
      </div>
    </div>
  );
}
