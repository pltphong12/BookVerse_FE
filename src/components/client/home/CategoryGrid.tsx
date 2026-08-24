import { Baby, BookOpen, Briefcase, Cpu, Globe, Heart, Lightbulb, Palette, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const categories = [
  { icon: BookOpen, name: 'Văn học' },
  { icon: Briefcase, name: 'Kinh tế' },
  { icon: Baby, name: 'Thiếu nhi' },
  { icon: Lightbulb, name: 'Kỹ năng' },
  { icon: Heart, name: 'Tâm lý' },
  { icon: Globe, name: 'Ngoại ngữ' },
  { icon: Palette, name: 'Nghệ thuật' },
  { icon: Cpu, name: 'Công nghệ' },
];

export default function CategoryGrid() {
  const navigate = useNavigate();

  const handleCategoryClick = (name: string) => {
    navigate(`/products?search=${encodeURIComponent(name)}`);
  };

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 lg:p-10 shadow-[0_4px_20px_-4px_rgba(26,35,126,0.05)] border border-[#dff1fb]">
      {/* Section Header */}
      <div className="flex justify-between items-end mb-6 sm:mb-8">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-7 bg-[#1a237e] rounded-full" />
          <h2 className="font-headline text-2xl sm:text-3xl font-bold text-[#0d1e25]">
            Khám phá theo Thể loại
          </h2>
        </div>
        <button
          onClick={() => navigate('/products')}
          className="font-headline text-sm sm:text-base text-[#1a237e] hover:text-[#283593] font-semibold flex items-center gap-1 hover:underline cursor-pointer group"
        >
          Xem tất cả
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3.5 sm:gap-4">
        {categories.map((category, index) => (
          <button
            key={category.name}
            onClick={() => handleCategoryClick(category.name)}
            className={`bg-white border border-[#dff1fb] rounded-2xl p-4 sm:p-5 flex flex-col items-center text-center gap-3 hover-elevation-2 cursor-pointer group transition-all stagger-${index + 1}`}
          >
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#e3f2fd] text-[#1a237e] group-hover:bg-[#1a237e] group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm">
              <category.icon className="w-6 h-6 sm:w-7 sm:h-7 stroke-[1.8]" />
            </div>
            <span className="font-headline font-semibold text-xs sm:text-sm text-[#0d1e25] group-hover:text-[#1a237e] transition-colors leading-tight">
              {category.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

