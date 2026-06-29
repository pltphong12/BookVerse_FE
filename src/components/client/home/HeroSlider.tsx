import { useEffect, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Banner1 from '../../../assets/banner/banner_1.png'
import Banner2 from '../../../assets/banner/banner_2.png'
import Banner3 from '../../../assets/banner/banner_3.png'
import Banner4 from '../../../assets/banner/banner_4.png'

const slides = [
    {
        id: 1,
        title: 'Sách mới 2024',
        subtitle: 'Khám phá những đầu sách hot nhất',
        image: Banner1,
        bgColor: 'bg-gradient-to-r from-primary-100 to-primary-200',
    },
    {
        id: 2,
        title: 'Giảm giá đến 50%',
        subtitle: 'Đừng bỏ lỡ cơ hội tuyệt vời',
        image: Banner2,
        bgColor: 'bg-gradient-to-r from-blue-100 to-blue-200',
    },
    {
        id: 3,
        title: 'Miễn phí vận chuyển',
        subtitle: 'Cho đơn hàng từ 300.000đ',
        image: Banner3,
        bgColor: 'bg-gradient-to-r from-cyan-100 to-cyan-200',
    },
    {
        id: 4,
        title: 'Best Seller',
        subtitle: 'Những cuốn sách được yêu thích nhất',
        image: Banner4,
        bgColor: 'bg-gradient-to-r from-purple-100 to-purple-200',
    },
];

export default function HeroSlider() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [textKey, setTextKey] = useState(0); // forces re-mount for text animation

    const goToSlide = useCallback((index: number) => {
        setCurrentSlide(index);
        setTextKey((prev) => prev + 1); // trigger text re-animation
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
        }, 5000);
        return () => clearInterval(timer);
    }, [currentSlide, goToSlide]);

    return (
        <div className="relative rounded-2xl overflow-hidden shadow-xl group/slider" style={{ height: '460px' }}>
            {/* Slides */}
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                        index === currentSlide
                            ? 'opacity-100 scale-100'
                            : 'opacity-0 scale-105'
                    }`}
                >
                    <img
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-full object-cover"
                    />
                    {/* Gradient overlay - darker at bottom for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />

                    {/* Text content with fly-in animation */}
                    {index === currentSlide && (
                        <div className="absolute inset-0 flex items-end pb-20 sm:items-center sm:pb-0">
                            <div className="container mx-auto px-8 lg:px-16" key={textKey}>
                                <h2 className="hero-text-enter text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4 drop-shadow-lg">
                                    {slide.title}
                                </h2>
                                <p className="hero-text-enter-delay-1 text-lg sm:text-2xl text-white/90 mb-8 max-w-xl drop-shadow-md">
                                    {slide.subtitle}
                                </p>
                                <button className="hero-text-enter-delay-2 bg-primary-500 text-white px-8 py-3.5 rounded-xl hover:bg-primary-600 transition-all font-semibold text-base shadow-lg hover:shadow-xl hover:scale-105 active:scale-95">
                                    Khám phá ngay
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ))}

            {/* Navigation Arrows */}
            <button
                onClick={goPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 backdrop-blur-md text-white p-3 rounded-full opacity-0 group-hover/slider:opacity-100 transition-all duration-300 hover:bg-white/40 hover:scale-110 active:scale-95"
                aria-label="Previous slide"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>
            <button
                onClick={goNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 backdrop-blur-md text-white p-3 rounded-full opacity-0 group-hover/slider:opacity-100 transition-all duration-300 hover:bg-white/40 hover:scale-110 active:scale-95"
                aria-label="Next slide"
            >
                <ChevronRight className="w-6 h-6" />
            </button>

            {/* Indicator Dots */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2.5 z-10">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`h-2.5 rounded-full transition-all duration-500 ${
                            index === currentSlide
                                ? 'bg-white w-10 shadow-lg'
                                : 'bg-white/40 w-2.5 hover:bg-white/70'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}