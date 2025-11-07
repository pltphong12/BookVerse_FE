import { ShoppingCart, Star } from 'lucide-react';
import { IBook } from '../../../types/backend';
import { formatPrice } from '../../../common/formatPrice';

export default function ProductCard(book: IBook) {

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer">
      <div className="relative overflow-hidden bg-gray-100 aspect-[3/4]">
        {book.image ? (
          <img
            src={`${import.meta.env.VITE_BACKEND_URL}/storage/book/${book.image}`}
            alt={book.title}
            className="w-full h-full group-hover:scale-102 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200">
            <span className="text-4xl text-primary-400">📚</span>
          </div>
        )}
        {book.discount > 0 && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            -{book.discount}%
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-800 line-clamp-2 mb-1 min-h-[3rem]">
          {book.title}
        </h3>
        <p className="text-sm text-gray-500 mb-2">{book.authors.map((author) => author.name).join(', ')}</p>

        <div className="flex items-center gap-1 mb-2">
          <Star className="w-4 h-4 text-yellow-400" />
          <Star className="w-4 h-4 text-yellow-400" />
          <Star className="w-4 h-4 text-yellow-400" />
          <Star className="w-4 h-4 text-yellow-400" />
          <Star className="w-4 h-4 text-yellow-400" />
          <span className="text-xs text-gray-500">({book.sold})</span>
        </div>

        <div className="flex items-end gap-2 mb-3">
          <span className="text-xl font-bold text-primary-600">
            {formatPrice(book.discount > 0 ? book.price - (book.price * book.discount / 100) : book.price)}
          </span>
          {book.discount > 0 && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(book.price)}
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
