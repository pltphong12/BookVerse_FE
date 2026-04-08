import { useParams, useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { callFetchBookByIdApi } from '../../services/api';
import ProductImageGallery from '../../components/client/product/ProductDetail/ProductImageGallery';
import ProductInfo from '../../components/client/product/ProductDetail/ProductInfo';
import { IBook } from '../../types/backend';
import ProductDescription from '../../components/client/product/ProductDetail/ProductDescription';
import ReviewSection from '../../components/client/product/ProductDetail/ReviewSection';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // Call api get product by id
  const { data: product } = useQuery({
    queryKey: ['product', id],
    queryFn: () => callFetchBookByIdApi(parseInt(id || '0')),
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData,
    retry: false
  });

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Sản phẩm không tìm thấy</h1>
          <button
            onClick={() => navigate('/')}
            className="btn btn-primary"
          >
            Quay lại trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <button onClick={() => navigate('/')} className="hover:text-primary-500">
            Trang chủ
          </button>
          <ChevronRight className="w-4 h-4" />
          <span>{product.data.data?.category.name}</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-semibold line-clamp-1">{product.data.data?.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-1">
            <ProductImageGallery title={product.data.data?.title || ''} images={product.data.data?.images || []} />
          </div>

          <div className="lg:col-span-2">
            <ProductInfo product={product.data.data as IBook} />
          </div>
        </div>

        <div className="space-y-8 mb-12">
          <ProductDescription product={product.data.data as IBook} />
          <ReviewSection />
        </div>
      </div>
    </div>
  );
}
