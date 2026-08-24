import { useQuery } from "@tanstack/react-query";
import CategoryGrid from "../../components/client/home/CategoryGrid";
import HeroSlider from "../../components/client/home/HeroSlider";
import PromoBanner from "../../components/client/home/PromoBanner";
import ProductSection from "../../components/client/product/ProductSection";
import { callFetchTop5LatestBooksApi } from "../../services/api";
import { useEffect, useRef, useState, useCallback } from "react";
import { IBook } from "../../types/backend";
import { Mail, Send, CheckCircle2 } from "lucide-react";
import { showToast, ToastType } from "../../common/showToast";

// Custom hook for scroll-triggered animations
function useScrollAnimation() {
    const observerRef = useRef<IntersectionObserver | null>(null);

    const observe = useCallback((element: HTMLElement | null) => {
        if (!element) return;

        if (!observerRef.current) {
            observerRef.current = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('animate-visible');
                            observerRef.current?.unobserve(entry.target);
                        }
                    });
                },
                { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
            );
        }

        observerRef.current.observe(element);
    }, []);

    useEffect(() => {
        return () => {
            observerRef.current?.disconnect();
        };
    }, []);

    return observe;
}

// Animated section wrapper
function ScrollAnimateSection({
    children,
    className = 'scroll-animate',
    observe
}: {
    children: React.ReactNode;
    className?: string;
    observe: (el: HTMLElement | null) => void;
}) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        observe(ref.current);
    }, [observe]);

    return (
        <div ref={ref} className={className}>
            {children}
        </div>
    );
}

// Loading skeleton for product sections
function ProductSectionSkeleton() {
    return (
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 lg:p-10 shadow-[0_4px_20px_-4px_rgba(26,35,126,0.05)] border border-[#dff1fb]">
            <div className="flex items-center justify-between mb-8">
                <div className="skeleton-shimmer h-8 w-48 rounded-xl"></div>
                <div className="skeleton-shimmer h-6 w-24 rounded-lg"></div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="space-y-3 bg-white p-4 rounded-2xl border border-slate-100">
                        <div className="skeleton-shimmer aspect-[3/4] rounded-xl w-full"></div>
                        <div className="skeleton-shimmer h-4 w-3/4 rounded"></div>
                        <div className="skeleton-shimmer h-3 w-1/2 rounded"></div>
                        <div className="skeleton-shimmer h-5 w-1/3 rounded"></div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Newsletter signup section from Stitch design
function NewsletterSection() {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email.trim()) {
            setIsSubmitted(true);
            showToast("Cảm ơn bạn đã đăng ký nhận tin từ BookVerse!", ToastType.SUCCESS);
            setEmail('');
        }
    };

    return (
        <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-[#dff1fb] p-8 sm:p-12 text-center flex flex-col items-center shadow-[0_4px_24px_-4px_rgba(26,35,126,0.06)] relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#e3f2fd] rounded-bl-full opacity-40 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#e3f2fd] rounded-tr-full opacity-40 pointer-events-none" />

            <div className="w-16 h-16 rounded-2xl bg-[#e3f2fd] text-[#1a237e] flex items-center justify-center mb-5 shadow-sm">
                <Mail className="w-8 h-8 stroke-[1.8]" />
            </div>

            <h2 className="font-headline text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0d1e25] mb-2 tracking-tight">
                Nhận Đề Xuất Sách Mỗi Tuần
            </h2>

            <p className="font-body text-slate-600 max-w-lg mb-6 text-sm sm:text-base leading-relaxed">
                Tham gia góc nhỏ của chúng tôi trên internet. Đăng ký để nhận các đề xuất được chọn lọc, các cuộc phỏng vấn tác giả và ưu đãi văn học độc quyền.
            </p>

            {isSubmitted ? (
                <div className="flex items-center gap-2 text-[#1a237e] bg-[#e3f2fd] px-6 py-3.5 rounded-xl font-headline font-semibold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Bạn đã đăng ký thành công! Hãy kiểm tra hộp thư nhé.</span>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-md relative z-10">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Địa chỉ email của bạn..."
                        required
                        className="flex-grow bg-[#f4faff] border border-slate-200 focus:border-[#1a237e] focus:bg-white rounded-xl px-4 py-3 font-body text-sm text-[#0d1e25] outline-none transition-colors shadow-sm"
                    />
                    <button
                        type="submit"
                        className="flex items-center justify-center gap-2 bg-[#1a237e] hover:bg-[#283593] text-white font-headline font-semibold text-sm px-6 py-3 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95 whitespace-nowrap cursor-pointer"
                    >
                        <span>Đăng ký</span>
                        <Send className="w-3.5 h-3.5" />
                    </button>
                </form>
            )}

            <p className="font-body text-xs text-slate-400 mt-4">
                Không có thư rác, chỉ có sách hay. Hủy đăng ký bất cứ lúc nào.
            </p>
        </div>
    );
}

export const Home = () => {
    const [top5LatestBooksData, setTop5LatestBooksData] = useState<IBook[]>([]);
    const { data: top5LatestBooks, isPending: isPendingTop5LatestBooks } = useQuery({
        queryKey: ['top5LatestBooks'],
        queryFn: callFetchTop5LatestBooksApi,
        refetchOnWindowFocus: false,
        placeholderData: (previousData) => previousData,
        retry: false
    });

    const observe = useScrollAnimation();

    useEffect(() => {
        if (top5LatestBooks?.data.data) {
            setTop5LatestBooksData(top5LatestBooks.data.data);
        }
    }, [top5LatestBooks]);

    return (
        <div className="space-y-8 sm:space-y-12">
            {/* Hero Section */}
            <HeroSlider />

            {/* Promo Features Banner */}
            <ScrollAnimateSection observe={observe}>
                <PromoBanner />
            </ScrollAnimateSection>

            {/* Category Grid */}
            <ScrollAnimateSection observe={observe}>
                <CategoryGrid />
            </ScrollAnimateSection>

            {/* Product Sections */}
            <ScrollAnimateSection observe={observe}>
                {isPendingTop5LatestBooks ? (
                    <ProductSectionSkeleton />
                ) : (
                    <ProductSection title="Sách Mới Về" products={top5LatestBooksData} />
                )}
            </ScrollAnimateSection>

            {/* Newsletter Section */}
            <ScrollAnimateSection observe={observe}>
                <NewsletterSection />
            </ScrollAnimateSection>
        </div>
    );
};