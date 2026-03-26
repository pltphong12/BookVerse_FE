import { IBook } from "../../../../types/backend";


interface ProductDescriptionProps {
  product: IBook;
}

export default function ProductDescription({ product }: ProductDescriptionProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Mô tả sản phẩm</h3>
          <p className="text-gray-700 leading-relaxed">{product.description}</p>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Thông tin chi tiết</h3>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Tác giả</span>
              <span className="font-semibold text-gray-900">{product.authors.map((author) => author.name).join(', ')}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Nhà xuất bản</span>
              <span className="font-semibold text-gray-900">{product.publisher.name}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Năm xuất bản</span>
              <span className="font-semibold text-gray-900">{product.publishYear}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Trọng lượng (gr)</span>
              <span className="font-semibold text-gray-900">{product.weight}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Kích thước bao bì</span>
              <span className="font-semibold text-gray-900">{product.dimensions}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Số trang</span>
              <span className="font-semibold text-gray-900">{product.numberOfPages} trang</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Hình thức bìa</span>
              <span className="font-semibold text-gray-900">{product.coverFormat}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Danh mục</span>
              <span className="font-semibold text-gray-900">{product.category.name}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
