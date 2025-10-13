import { Tag, Truck, Shield, Phone } from 'lucide-react';

const features = [
  {
    icon: Truck,
    title: 'Miễn phí vận chuyển',
    description: 'Cho đơn hàng từ 300k',
  },
  {
    icon: Tag,
    title: 'Giảm giá đến 50%',
    description: 'Hàng ngàn sản phẩm',
  },
  {
    icon: Shield,
    title: 'Bảo mật thanh toán',
    description: '100% an toàn',
  },
  {
    icon: Phone,
    title: 'Hỗ trợ 24/7',
    description: 'Hotline: 1900-1234',
  },
];

export default function PromoBanner() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {features.map((feature, index) => (
        <div
          key={index}
          className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-6 flex items-start gap-4 hover:shadow-md transition-shadow"
        >
          <div className="bg-primary-500 text-white p-3 rounded-lg">
            <feature.icon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 mb-1">{feature.title}</h3>
            <p className="text-sm text-gray-600">{feature.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
