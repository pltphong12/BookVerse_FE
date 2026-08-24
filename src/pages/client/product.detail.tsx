import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
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
        <div className="w-10 h-10 border-3 border-[#e3f2fd] border-t-[#1a237e] rounded-full animate-spin"></div>
        <p className="font-body text-sm text-slate-500">Đang tải thông tin cuốn sách...</p>
      </div>
    );
  }

  if (!product || !product.data?.data) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center bg-white p-8 sm:p-12 rounded-3xl border border-[#dff1fb] shadow-sm max-w-md">
          <div className="text-5xl mb-4">📖</div>
          <h1 className="font-headline text-2xl font-bold text-[#0d1e25] mb-2">Không tìm thấy sách</h1>
          <p className="font-body text-sm text-slate-500 mb-6">
            Cuốn sách này có thể đã ngừng kinh doanh hoặc đường dẫn không còn chính xác.
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-[#1a237e] hover:bg-[#283593] text-white px-6 py-3 rounded-xl font-headline font-semibold text-sm transition-colors shadow-sm cursor-pointer"
          >
            Quay lại trang chủ
          </button>
        </div>
      </div>
    );
  }

  const bookData = product.data.data as IBook;

  return (
    <div className="space-y-8 lg:space-y-12">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb">
        <ol className="flex items-center flex-wrap gap-1.5 text-xs sm:text-sm font-body text-slate-500 font-medium">
          <li>
            <Link to="/" className="flex items-center gap-1 text-slate-500 hover:text-[#1a237e] transition-colors">
              <Home className="w-3.5 h-3.5" />
              <span>Trang chủ</span>
            </Link>
          </li>
          <li>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          </li>
          <li>
            <Link
              to={`/products?category=${bookData.category?.id}`}
              className="text-slate-500 hover:text-[#1a237e] transition-colors"
            >
              {bookData.category?.name || 'Sách'}
            </Link>
          </li>
          <li>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          </li>
          <li aria-current="page" className="text-[#0d1e25] font-semibold line-clamp-1 max-w-[200px] sm:max-w-md">
            {bookData.title}
          </li>
        </ol>
      </nav>

      {/* Product Bento Layout (Left: 5 cols, Right: 7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Cover & Thumbnails */}
        <div className="lg:col-span-5 sticky top-24">
          <ProductImageGallery
            title={bookData.title || ''}
            images={bookData.images || []}
          />
        </div>

        {/* Right Column: Details, Price, Actions, Tabs & Benefits */}
        <div className="lg:col-span-7">
          <ProductInfo product={bookData} />
        </div>
      </div>

      {/* Related Books Section */}
      {relatedBooks.length > 0 && (
        <section className="pt-6 border-t border-[#dff1fb] space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-headline text-xl sm:text-2xl font-extrabold text-[#0d1e25]">
                Sách cùng thể loại
              </h2>
              <p className="font-body text-xs sm:text-sm text-slate-500 mt-1">
                Những tác phẩm chọn lọc khác có thể bạn sẽ yêu thích
              </p>
            </div>
            <Link
              to={`/products?category=${bookData.category?.id}`}
              className="font-headline font-semibold text-xs sm:text-sm text-[#1a237e] hover:underline flex items-center gap-1"
            >
              <span>Xem tất cả</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {relatedBooks
              .filter((b) => b.id !== bookData.id)
              .slice(0, 5)
              .map((book) => (
                <ProductCard key={book.id} {...book} />
              ))}
          </div>
        </section>
      )}

      {/* Reviews Section */}
      <div className="pt-2">
        <ReviewSection />
      </div>
    </div>
  );
}

