import { useEffect, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Banner1 from '../../../assets/banner/banner_1.png';
import Banner2 from '../../../assets/banner/banner_2.png';
import Banner3 from '../../../assets/banner/banner_3.png';
import Banner4 from '../../../assets/banner/banner_4.png';

const slides = [
    {
        id: 1,
        title: 'Sách mới 2024',
        subtitle: 'Khám phá những đầu sách hot nhất vừa cập bến',
        tag: 'Mới phát hành',
        image: Banner1,
        link: '/products',
    },
    {
        id: 2,
        title: 'Giảm giá đến 50%',
        subtitle: 'Ưu đãi ngập tràn cho độc giả yêu sách',
        tag: 'Siêu sale',
        image: Banner2,
        link: '/products',
    },
    {
        id: 3,
        title: 'Miễn phí vận chuyển',
        subtitle: 'Giao hàng tận nơi cho đơn hàng từ 300.000đ',
        tag: 'Freeship toàn quốc',
        image: Banner3,
        link: '/products',
    },
    {
        id: 4,
        title: 'Best Seller Vũ Trụ Sách',
        subtitle: 'Những tuyệt tác được cộng đồng yêu thích nhất',
        tag: 'Bán chạy nhất',
        image: Banner4,
        link: '/products',
    },
];

export default function HeroSlider() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [textKey, setTextKey] = useState(0);
    const navigate = useNavigate();

    const goToSlide = useCallback((index: number) => {
        setCurrentSlide(index);
        setTextKey((prev) => prev + 1);
    }, []);

    const goNext = useCallback(() => {
        goToSlide((currentSlide + 1) % slides.length);
    }, [currentSlide, goToSlide]);

    const goPrev = useCallback(() => {
        goToSlide((currentSlide - 1 + slides.length) % slides.length);
    }, [currentSlide, goToSlide]);

    useEffect(() => {
        const timer = setInterval(() => {
            goToSlide((currentSlide + 1) % slides.length);
        }, 5500);
        return () => clearInterval(timer);
    }, [currentSlide, goToSlide]);

    return (
        <div className="w-full">
            {/* Stitch Editorial Hero Container */}
            <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-[#dff1fb] p-6 sm:p-8 lg:p-10 shadow-[0_4px_24px_-4px_rgba(26,35,126,0.06)] relative overflow-hidden">
                {/* Ambient Decorative Glows */}
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#e3f2fd] rounded-full blur-3xl opacity-70 pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-blue-100/50 rounded-full blur-3xl opacity-50 pointer-events-none" />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center relative z-10">
                    {/* Left Column: Editorial Hero Intro */}
                    <div className="lg:col-span-5 flex flex-col gap-4 sm:gap-5 text-left">

                        <h1 className="font-headline text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-[#0d1e25] leading-[1.18] tracking-tight">
                            Tìm Chuyến Phiêu Lưu Tiếp Theo Của Bạn.
                        </h1>

                        <p className="font-body text-slate-600 text-sm sm:text-base leading-relaxed">
                            Khám phá hàng triệu cuốn sách, từ những tác phẩm kinh điển vượt thời gian đến những kiệt tác hiện đại, tất cả đều trong một không gian tĩnh lặng, được tuyển chọn kỹ lưỡng dành cho những người yêu sách thực sự.
                        </p>

                        {/* Call to Action Buttons */}
                        <div className="flex flex-wrap items-center gap-3 pt-2">
                            <button
                                onClick={() => navigate('/products')}
                                className="flex items-center gap-2 bg-[#1a237e] hover:bg-[#283593] text-white font-semibold text-sm sm:text-base px-6 py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95 cursor-pointer"
                            >
                                <BookOpen className="w-4 h-4" />
                                Khám phá danh mục
                            </button>
                            <button
                                onClick={() => navigate('/products')}
                                className="flex items-center gap-2 bg-[#e3f2fd] hover:bg-[#d6e5ef] text-[#1a237e] font-semibold text-sm sm:text-base px-5 py-3.5 rounded-xl transition-all border border-blue-200/80 active:scale-95 cursor-pointer"
                            >
                                Xem ưu đãi
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Hero Visual Slider / Showcase */}
                    <div className="lg:col-span-7 w-full">
                        <div className="relative rounded-2xl overflow-hidden shadow-lg border border-[#dff1fb] group/slider h-[280px] sm:h-[340px] md:h-[380px] bg-slate-100">
                            {/* Slides */}
                            {slides.map((slide, index) => (
                                <div
                                    key={slide.id}
                                    className={`absolute inset-0 transition-all duration-700 ease-in-out ${index === currentSlide
                                            ? 'opacity-100 scale-100 z-10'
                                            : 'opacity-0 scale-105 z-0'
                                        }`}
                                >
                                    <img
                                        src={slide.image}
                                        alt={slide.title}
                                        className="w-full h-full object-cover"
                                    />
                                    {/* Gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />

                                    {/* Text content with fly-in animation */}
                                    {index === currentSlide && (
                                        <div className="absolute inset-0 flex items-end pb-8 sm:pb-10 px-6 sm:px-8">
                                            <div className="max-w-md" key={textKey}>
                                                <span className="hero-text-enter inline-block px-2.5 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-white text-xs font-semibold uppercase tracking-wider mb-2">
                                                    {slide.tag}
                                                </span>
                                                <h3 className="hero-text-enter-delay-1 font-headline text-2xl sm:text-3xl font-bold text-white mb-1.5 drop-shadow-md">
                                                    {slide.title}
                                                </h3>
                                                <p className="hero-text-enter-delay-2 font-body text-xs sm:text-sm text-white/90 mb-4 line-clamp-2 drop-shadow">
                                                    {slide.subtitle}
                                                </p>
                                                <button
                                                    onClick={() => navigate(slide.link)}
                                                    className="hero-text-enter-delay-2 flex items-center gap-1.5 bg-[#1a237e] hover:bg-[#283593] text-white px-5 py-2.5 rounded-lg transition-all font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg cursor-pointer"
                                                >
                                                    Xem chi tiết
                                                    <ArrowRight className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* Navigation Arrows */}
                            <button
                                onClick={goPrev}
                                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-white/30 backdrop-blur-md hover:bg-white/60 text-white p-2.5 rounded-full opacity-0 group-hover/slider:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95 shadow cursor-pointer"
                                aria-label="Previous slide"
                            >
                                <ChevronLeft className="w-5 h-5 text-white" />
                            </button>
                            <button
                                onClick={goNext}
                                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-white/30 backdrop-blur-md hover:bg-white/60 text-white p-2.5 rounded-full opacity-0 group-hover/slider:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95 shadow cursor-pointer"
                                aria-label="Next slide"
                            >
                                <ChevronRight className="w-5 h-5 text-white" />
                            </button>

                            {/* Indicator Dots */}
                            <div className="absolute bottom-4 right-6 flex gap-2 z-20">
                                {slides.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => goToSlide(index)}
                                        className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${index === currentSlide
                                                ? 'bg-white w-8 shadow-md'
                                                : 'bg-white/40 w-2 hover:bg-white/70'
                                            }`}
                                        aria-label={`Go to slide ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}