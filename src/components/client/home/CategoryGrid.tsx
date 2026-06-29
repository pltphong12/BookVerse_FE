import { Baby, BookOpen, Briefcase, Cpu, Globe, Heart, Lightbulb, Palette } from 'lucide-react';

const categories = [
  { icon: BookOpen, name: 'Văn học', color: 'text-blue-600', bgColor: 'bg-blue-50', hoverBg: 'hover:bg-blue-100', borderColor: 'border-blue-200' },
  { icon: Briefcase, name: 'Kinh tế', color: 'text-emerald-600', bgColor: 'bg-emerald-50', hoverBg: 'hover:bg-emerald-100', borderColor: 'border-emerald-200' },
  { icon: Baby, name: 'Thiếu nhi', color: 'text-pink-600', bgColor: 'bg-pink-50', hoverBg: 'hover:bg-pink-100', borderColor: 'border-pink-200' },
  { icon: Lightbulb, name: 'Kỹ năng', color: 'text-amber-600', bgColor: 'bg-amber-50', hoverBg: 'hover:bg-amber-100', borderColor: 'border-amber-200' },
  { icon: Heart, name: 'Tâm lý', color: 'text-red-600', bgColor: 'bg-red-50', hoverBg: 'hover:bg-red-100', borderColor: 'border-red-200' },
  { icon: Globe, name: 'Ngoại ngữ', color: 'text-violet-600', bgColor: 'bg-violet-50', hoverBg: 'hover:bg-violet-100', borderColor: 'border-violet-200' },
  { icon: Palette, name: 'Nghệ thuật', color: 'text-orange-600', bgColor: 'bg-orange-50', hoverBg: 'hover:bg-orange-100', borderColor: 'border-orange-200' },
  { icon: Cpu, name: 'Công nghệ', color: 'text-cyan-600', bgColor: 'bg-cyan-50', hoverBg: 'hover:bg-cyan-100', borderColor: 'border-cyan-200' },
];

export default function CategoryGrid() {
  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl p-8 shadow-lg shadow-black/10 border border-white/30">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-1.5 h-8 bg-gradient-to-b from-primary-400 to-primary-600 rounded-full" />
        <h2 className="text-2xl font-bold text-gray-800">Danh mục sản phẩm</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {categories.map((category, index) => (
          <button
            key={category.name}
            className={`scroll-animate-scale stagger-${index + 1} flex flex-col items-center gap-3 p-5 rounded-2xl border ${category.borderColor} ${category.bgColor} ${category.hoverBg} transition-all duration-300 hover:scale-105 hover:shadow-md group/cat animate-visible`}
          >
            <div className={`${category.color} p-3.5 rounded-xl transition-transform duration-300 group-hover/cat:scale-110 group-hover/cat:rotate-6`}>
              <category.icon className="w-7 h-7" strokeWidth={1.8} />
            </div>
            <span className={`text-sm font-semibold text-gray-700 group-hover/cat:${category.color} transition-colors`}>
              {category.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
