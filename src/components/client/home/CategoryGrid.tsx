import {
  Baby, BookOpen, Briefcase, Cpu, Globe, Heart, Lightbulb, Palette, ArrowRight,
  GraduationCap, Landmark, Sparkles, Compass, Bookmark, Library, LucideIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { callFetchAllCategoriesApi } from '../../../services/api';
import { ICategoryInBook } from '../../../types/backend';

// Helper to resolve category icons based on keywords
const getCategoryIcon = (name: string, index: number): LucideIcon => {
  const lower = (name || '').toLowerCase();
  if (lower.includes('văn học') || lower.includes('tiểu thuyết') || lower.includes('truyện')) return BookOpen;
  if (lower.includes('kinh tế') || lower.includes('kinh doanh') || lower.includes('tài chính') || lower.includes('quản trị')) return Briefcase;
  if (lower.includes('thiếu nhi') || lower.includes('trẻ')) return Baby;
  if (lower.includes('kỹ năng') || lower.includes('tư duy') || lower.includes('phát triển')) return Lightbulb;
  if (lower.includes('tâm lý') || lower.includes('tình cảm') || lower.includes('sống đẹp') || lower.includes('sức khỏe')) return Heart;
  if (lower.includes('ngoại ngữ') || lower.includes('tiếng') || lower.includes('du lịch') || lower.includes('địa lý')) return Globe;
  if (lower.includes('nghệ thuật') || lower.includes('hội họa') || lower.includes('thiết kế') || lower.includes('âm nhạc')) return Palette;
  if (lower.includes('công nghệ') || lower.includes('tin học') || lower.includes('khoa học') || lower.includes('lập trình') || lower.includes('it')) return Cpu;
  if (lower.includes('lịch sử') || lower.includes('chính trị') || lower.includes('văn hóa')) return Landmark;
  if (lower.includes('giáo dục') || lower.includes('học tập') || lower.includes('sách giáo khoa') || lower.includes('tham khảo')) return GraduationCap;

  const fallbackIcons = [BookOpen, Lightbulb, Compass, Bookmark, Library, Sparkles, Globe, Heart];
  return fallbackIcons[index % fallbackIcons.length];
};

export default function CategoryGrid() {
  const navigate = useNavigate();

  const { data: categories = [], isLoading } = useQuery<ICategoryInBook[]>({
    queryKey: ['all-categories'],
    queryFn: async () => {
      const res = await callFetchAllCategoriesApi();
      return res.data?.data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const handleCategoryClick = (categoryId: number) => {
    navigate(`/products?category=${categoryId}`);
  };

  return (
    <section className="bg-white rounded-2xl border border-[#E5E2DD] p-6 sm:p-8 lg:p-10 shadow-sm">
      {/* Section Header */}
      <div className="flex justify-between items-end mb-6 sm:mb-8 pb-4 border-b border-[#E5E2DD]">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#0070B5] block mb-1">
            Tuyển tập đa dạng
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
            Khám phá theo Thể loại
          </h2>
        </div>
        <button
          onClick={() => navigate('/products')}
          className="text-xs sm:text-sm font-medium text-[#0070B5] hover:text-[#005a92] hover:underline flex items-center gap-1 cursor-pointer transition-colors group"
        >
          <span>Xem tất cả danh mục</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* Categories Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="bg-[#FAF9F7] border border-[#E5E2DD] rounded-xl p-4 flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full skeleton-shimmer shrink-0" />
              <div className="w-20 h-4 rounded skeleton-shimmer" />
            </div>
          ))}
        </div>
      ) : categories.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((category, index) => {
            const Icon = getCategoryIcon(category.name, index);
            return (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className="bg-[#FAF9F7] hover:bg-white border border-[#E5E2DD] hover:border-[#1A1A1A] rounded-xl p-3.5 sm:p-4 flex items-center gap-3 transition-all duration-200 cursor-pointer group text-left hover:shadow-sm"
              >
                <div className="w-10 h-10 rounded-full bg-white group-hover:bg-[#1A1A1A] group-hover:text-white text-[#1A1A1A] border border-[#E5E2DD] group-hover:border-[#1A1A1A] flex items-center justify-center shrink-0 transition-colors duration-200 shadow-2xs">
                  <Icon className="w-4 h-4 stroke-[1.8]" />
                </div>
                <span className="font-serif font-bold text-xs sm:text-sm text-[#1A1A1A] group-hover:text-[#0070B5] transition-colors leading-snug line-clamp-2">
                  {category.name}
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-slate-400 text-sm font-body">
          Chưa có thể loại nào
        </div>
      )}
    </section>
  );
}



