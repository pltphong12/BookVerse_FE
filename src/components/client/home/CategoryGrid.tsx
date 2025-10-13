import { BookOpen, Briefcase, Baby, Lightbulb, Heart, Globe, Palette, Cpu } from 'lucide-react';

const categories = [
  { icon: BookOpen, name: 'Văn học', color: 'bg-blue-100 text-blue-600' },
  { icon: Briefcase, name: 'Kinh tế', color: 'bg-green-100 text-green-600' },
  { icon: Baby, name: 'Thiếu nhi', color: 'bg-pink-100 text-pink-600' },
  { icon: Lightbulb, name: 'Kỹ năng', color: 'bg-yellow-100 text-yellow-600' },
  { icon: Heart, name: 'Tâm lý', color: 'bg-red-100 text-red-600' },
  { icon: Globe, name: 'Ngoại ngữ', color: 'bg-purple-100 text-purple-600' },
  { icon: Palette, name: 'Nghệ thuật', color: 'bg-orange-100 text-orange-600' },
  { icon: Cpu, name: 'Công nghệ', color: 'bg-cyan-100 text-cyan-600' },
];

export default function CategoryGrid() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Danh mục sản phẩm</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {categories.map((category) => (
          <button
            key={category.name}
            className="flex flex-col items-center gap-3 p-4 rounded-lg hover:shadow-md transition-all"
          >
            <div className={`${category.color} p-4 rounded-full`}>
              <category.icon className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium text-gray-700">{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
