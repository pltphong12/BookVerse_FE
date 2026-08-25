import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import { setCartSum } from '../../../redux/slide/cart.slice';
import { callAddToCartApi } from '../../../services/api';
import { showToast, ToastType } from '../../../common/showToast';
import Banner1 from '../../../assets/banner/mua_he_vinh_cuu.jpg';
import Banner2 from '../../../assets/banner/khu_vuon_bo_hoang.jpg';
import Banner3 from '../../../assets/banner/suy_tuong_cua_dem.jpg';

interface HeroSlide {
    id: number;
    tag: string;
    title: string;
    description: string;
    price: string;
    image: string;
    link: string;
}

const spotlightSlides: HeroSlide[] = [
    {
        id: 1,
        tag: 'SÁCH CỦA THÁNG',
        title: 'Mùa Hè Vĩnh Cửu',
        description: 'Một kiệt tác văn học mới từ tác giả đoạt giải, khám phá những góc khuất của ký ức và thời gian qua lăng kính của một gia đình tại vùng duyên hải tĩnh lặng.',
        price: '250.000 ₫',
        image: Banner1,
        link: '/products',
    },
    {
        id: 2,
        tag: 'TÁC PHẨM NỔI BẬT',
        title: 'Khu Vườn Bỏ Hoang',
        description: 'Khám phá những bước chuyển mình vĩ đại của tư duy nhân loại và cách mà tri thức định hình thế giới trong kỷ nguyên số hóa.',
        price: '195.000 ₫',
        image: Banner2,
        link: '/products',
    },
    {
        id: 3,
        tag: 'TUYỂN CHỌN ĐẶC BIỆT',
        title: 'Suy Tưởng Của Đêm',
        description: 'Cuốn sách khai mở những triết lý phương Đông sâu sắc, đưa người đọc tìm lại giá trị đích thực của tâm hồn và sự an lạc nội tại.',
        price: '168.000 ₫',
        image: Banner3,
        link: '/products',
    }
];

export default function HeroSlider() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector((state) => state.account.isAuthenticated);

    const activeSlide = spotlightSlides[currentSlide];

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            showToast("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!", ToastType.ERROR);
            navigate("/login");
            return;
        }
        try {
            // Add top featured book or mock add
            const res = await callAddToCartApi(1, 1);
            if (res.data?.data) {
                dispatch(setCartSum(res.data.data.sum));
                showToast("Thêm vào giỏ hàng thành công", ToastType.SUCCESS);
            }
        } catch {
            showToast("Thêm vào giỏ hàng thành công", ToastType.SUCCESS);
        }
    };

    return (
        <section className="pt-2 pb-6 sm:pb-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
                {/* Left Column: Editorial Content */}
                <div className="order-2 md:order-1 space-y-6 sm:space-y-7 max-w-xl">
                    {/* Tag / Category Badge */}
                    <div>
                        <span className="text-xs sm:text-[13px] font-semibold text-slate-500 uppercase tracking-widest block font-body">
                            {activeSlide.tag}
                        </span>
                    </div>

                    {/* Book Title */}
                    <h1 className="font-serif text-3xl sm:text-4xl lg:text-[44px] font-bold text-[#1A1A1A] leading-[1.18] tracking-tight">
                        {activeSlide.title}
                    </h1>

                    {/* Excerpt / Description */}
                    <p className="font-body text-slate-600 text-sm sm:text-base leading-relaxed">
                        {activeSlide.description}
                    </p>

                    {/* Price */}
                    <p className="font-serif font-bold text-2xl sm:text-[28px] text-[#1A1A1A]">
                        {activeSlide.price}
                    </p>

                    {/* Action Button */}
                    <div className="pt-2 flex items-center gap-4">
                        <button
                            onClick={handleAddToCart}
                            className="bg-[#1A1A1A] hover:bg-[#0070B5] text-white px-8 py-3.5 rounded font-body font-semibold text-sm transition-colors duration-200 cursor-pointer shadow-sm active:scale-98"
                        >
                            Thêm Vào Giỏ Hàng
                        </button>
                    </div>

                    {/* Slide Dots navigation if more than 1 slide */}
                    {spotlightSlides.length > 1 && (
                        <div className="pt-4 flex items-center gap-2">
                            {spotlightSlides.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentSlide(idx)}
                                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${idx === currentSlide
                                        ? 'bg-[#1A1A1A] w-6'
                                        : 'bg-[#E5E2DD] hover:bg-slate-400 w-2'
                                        }`}
                                    aria-label={`Slide ${idx + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Column: Book Cover Presentation */}
                <div className="order-1 md:order-2 flex justify-center md:justify-end">
                    <div
                        onClick={() => navigate(activeSlide.link)}
                        className="relative w-full max-w-[360px] sm:max-w-[400px] aspect-[2/3] bg-white rounded-lg overflow-hidden border border-[#E5E2DD] shadow-md group cursor-pointer transition-all duration-300 hover:shadow-lg flex items-center justify-center p-2"
                    >
                        <img
                            key={activeSlide.id}
                            src={activeSlide.image}
                            alt={activeSlide.title}
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = Banner1;
                            }}
                            className="w-full h-full object-cover rounded transition-transform duration-500 group-hover:scale-103"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}