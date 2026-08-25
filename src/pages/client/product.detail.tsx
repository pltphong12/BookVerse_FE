import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { callFetchBookByIdApi, callFetchAllProductsWithPaginationAndFilterApi } from '../../services/api';
import ProductImageGallery from '../../components/client/product/ProductDetail/ProductImageGallery';
import ProductInfo from '../../components/client/product/ProductDetail/ProductInfo';
import { IBook } from '../../types/backend';
import ReviewSection from '../../components/client/product/ProductDetail/ReviewSection';
import ProductCard from '../../components/client/product/ProductCard';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Call api get product by id
  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => callFetchBookByIdApi(parseInt(id || '0')),
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData,
    retry: false,
  });

  const categoryId = product?.data?.data?.category?.id;

  // Call api get related books
  const { data: relatedBooksData } = useQuery({
    queryKey: ['related-books', categoryId],
    queryFn: () =>
      callFetchAllProductsWithPaginationAndFilterApi(
        { categoryId: categoryId ? [categoryId] : undefined },
        1,
        6
      ),
    enabled: !!categoryId,
    refetchOnWindowFocus: false,
  });

  const relatedBooks: IBook[] = relatedBooksData?.data?.data?.result || [];

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-2 border-[#E5E2DD] border-t-[#1A1A1A] rounded-full animate-spin"></div>
        <p className="font-body text-sm text-slate-500">Đang tải thông tin cuốn sách...</p>
      </div>
    );
  }

  if (!product || !product.data?.data) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center bg-white p-8 sm:p-12 rounded-lg border border-[#E5E2DD] shadow-sm max-w-md">
          <div className="text-5xl mb-4">📖</div>
          <h1 className="font-serif text-2xl font-bold text-[#1A1A1A] mb-2">Không tìm thấy sách</h1>
          <p className="font-body text-sm text-slate-500 mb-6">
            Cuốn sách này có thể đã ngừng kinh doanh hoặc đường dẫn không còn chính xác.
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-[#1A1A1A] hover:bg-[#0070B5] text-white px-6 py-3 rounded font-body font-semibold text-sm transition-colors shadow-sm cursor-pointer"
          >
            Quay lại trang chủ
          </button>
        </div>
      </div>
    );
  }

  const bookData = product.data.data as IBook;

  return (
    <div className="space-y-10 lg:space-y-14">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb">
        <ol className="flex items-center flex-wrap gap-1.5 text-xs sm:text-sm font-body text-slate-500">
          <li>
            <Link to="/" className="text-slate-500 hover:text-[#0070B5] transition-colors">
              Trang chủ
            </Link>
          </li>
          <li>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          </li>
          <li>
            <Link
              to={`/products?category=${bookData.category?.id}`}
              className="text-slate-500 hover:text-[#0070B5] transition-colors"
            >
              {bookData.category?.name || 'Sách'}
            </Link>
          </li>
          <li>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          </li>
          <li aria-current="page" className="text-[#1A1A1A] font-semibold line-clamp-1 max-w-[200px] sm:max-w-md">
            {bookData.title}
          </li>
        </ol>
      </nav>

      {/* 2-Column Product Detail Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-14 items-start">
        {/* Left Column: Book Cover & Gallery */}
        <div className="md:col-span-5 lg:col-span-5 md:sticky md:top-24">
          <ProductImageGallery
            title={bookData.title || ''}
            images={bookData.images || []}
          />
        </div>

        {/* Right Column: Details, Price, Actions & Specifications */}
        <div className="md:col-span-7 lg:col-span-7">
          <ProductInfo product={bookData} />
        </div>
      </div>

      {/* Related Books Section (The "Bookshelf") */}
      {relatedBooks.length > 0 && (
        <section className="pt-8 border-t border-[#E5E2DD] space-y-6">
          <div className="flex items-end justify-between border-b border-[#E5E2DD] pb-4">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
                Sách cùng thể loại
              </h2>
            </div>
            <Link
              to={`/products?category=${bookData.category?.id}`}
              className="font-body font-semibold text-sm text-[#0070B5] hover:underline flex items-center gap-1 transition-colors"
            >
              <span>Xem tất cả</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5 lg:gap-6">
            {relatedBooks
              .filter((b) => b.id !== bookData.id)
              .slice(0, 6)
              .map((book) => (
                <ProductCard key={book.id} {...book} />
              ))}
          </div>
        </section>
      )}

      {/* Reviews Section */}
      <div className="pt-4">
        <ReviewSection />
      </div>
    </div>
  );
}
