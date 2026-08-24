import { Tag, Truck, ShieldCheck, Headphones } from 'lucide-react';

const features = [
  {
    icon: Truck,
    title: 'Miễn phí vận chuyển',
    description: 'Đơn hàng từ 300.000đ',
  },
  {
    icon: Tag,
    title: 'Ưu đãi & Giảm giá',
    description: 'Tiết kiệm đến 50% mỗi ngày',
  },
  {
    icon: ShieldCheck,
    title: 'Thanh toán an toàn',
    description: 'Bảo mật 100% giao dịch',
  },
  {
    icon: Headphones,
    title: 'Hỗ trợ tận tâm 24/7',
    description: 'Hotline: 0767557431',
  },
];

export default function PromoBanner() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {features.map((feature, index) => (
        <div
          key={index}
          className={`bg-white/95 backdrop-blur-md rounded-2xl p-5 sm:p-6 flex items-center gap-4 border border-[#dff1fb] shadow-[0_2px_12px_-2px_rgba(26,35,126,0.04)] hover-elevation-2 transition-all stagger-${index + 1}`}
        >
          <div className="w-13 h-13 rounded-2xl bg-[#e3f2fd] text-[#1a237e] flex items-center justify-center flex-shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-110">
            <feature.icon className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <h3 className="font-headline font-bold text-[#0d1e25] text-sm sm:text-base mb-0.5">
              {feature.title}
            </h3>
            <p className="font-body text-xs sm:text-sm text-slate-500">
              {feature.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

