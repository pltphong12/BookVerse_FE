import { Tag, Truck, Shield, Phone } from 'lucide-react';

const features = [
  {
    icon: Truck,
    title: 'Miễn phí vận chuyển',
    description: 'Cho đơn hàng từ 300k',
    gradient: 'from-blue-500 to-blue-600',
    bgLight: 'bg-blue-50',
    iconBg: 'bg-blue-500',
  },
  {
    icon: Tag,
    title: 'Giảm giá đến 50%',
    description: 'Hàng ngàn sản phẩm',
    gradient: 'from-emerald-500 to-emerald-600',
    bgLight: 'bg-emerald-50',
    iconBg: 'bg-emerald-500',
  },
  {
    icon: Shield,
    title: 'Bảo mật thanh toán',
    description: '100% an toàn',
    gradient: 'from-amber-500 to-amber-600',
    bgLight: 'bg-amber-50',
    iconBg: 'bg-amber-500',
  },
  {
    icon: Phone,
    title: 'Hỗ trợ 24/7',
    description: 'Hotline: 1900-1234',
    gradient: 'from-purple-500 to-purple-600',
    bgLight: 'bg-purple-50',
    iconBg: 'bg-purple-500',
  },
];

export default function PromoBanner() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {features.map((feature, index) => (
        <div
          key={index}
          className={`relative bg-white/90 backdrop-blur-md rounded-2xl p-6 flex items-start gap-4 card-hover-lift cursor-default overflow-hidden border border-white/30 shadow-lg shadow-black/10 stagger-${index + 1}`}
        >
          {/* Decorative gradient accent line at top */}
          <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.gradient} rounded-t-2xl`} />

          <div className={`${feature.iconBg} text-white p-3.5 rounded-xl shadow-lg icon-hover-pulse flex-shrink-0`}>
            <feature.icon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 mb-1 text-base">{feature.title}</h3>
            <p className="text-sm text-gray-500">{feature.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
