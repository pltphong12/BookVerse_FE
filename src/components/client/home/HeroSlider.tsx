import { useEffect, useState } from 'react';
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

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);


    return (
        <div className="carousel rounded-box w-full h-96 relative overflow-hidden">
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`carousel-item w-full absolute inset-0 transition-opacity duration-500 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                        }`}
                >
                    <img
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center">
                        <div className="container mx-auto px-4 h-full flex flex-col justify-center text-white">
                            <h2 className="text-5xl font-bold text-white mb-4">{slide.title}</h2>
                            <p className="text-2xl text-white mb-6">{slide.subtitle}</p>
                            <button className="btn btn-primary w-fit">Khám phá ngay</button>
                        </div>
                    </div>
                </div>
            ))}

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all ${index === currentSlide ? 'bg-primary-600 w-8' : 'bg-white/60'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}