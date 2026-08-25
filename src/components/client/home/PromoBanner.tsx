import { Truck, ShieldCheck, RefreshCw, Gift } from 'lucide-react';

const features = [
  {
    icon: Truck,
    title: 'Miễn phí giao hàng',
    description: 'Cho đơn hàng từ 300.000 ₫',
  },
  {
    icon: ShieldCheck,
    title: 'Sách thật 100%',
    description: 'Từ các NXB uy tín hàng đầu',
  },
  {
    icon: RefreshCw,
    title: 'Đổi trả dễ dàng',
    description: 'Miễn phí trong vòng 7 ngày',
  },
  {
    icon: Gift,
    title: 'Bọc sách & Quà tặng',
    description: 'Đóng gói trang trọng, cẩn thận',
  },
];

export default function PromoBanner() {
  return (
    <section className="bg-white rounded-2xl border border-[#E5E2DD] p-6 sm:p-8 shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-[#E5E2DD]">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`flex items-center gap-4 ${index > 0 ? 'pt-4 sm:pt-0 sm:pl-6' : ''}`}
          >
            <div className="w-11 h-11 rounded-full bg-[#FAF9F7] border border-[#E5E2DD] text-[#1A1A1A] flex items-center justify-center flex-shrink-0">
              <feature.icon className="w-5 h-5 stroke-[1.8]" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-[#1A1A1A] text-sm leading-snug">
                {feature.title}
              </h3>
              <p className="font-body text-xs text-slate-500 mt-0.5">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}


