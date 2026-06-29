import { useQuery } from "@tanstack/react-query";
import CategoryGrid from "../../components/client/home/CategoryGrid"
import HeroSlider from "../../components/client/home/HeroSlider"
import PromoBanner from "../../components/client/home/PromoBanner"
import ProductSection from "../../components/client/product/ProductSection"
import { callFetchTop5LatestBooksApi } from "../../services/api";
import { useEffect, useRef, useState, useCallback } from "react";
import { IBook } from "../../types/backend";

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
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-lg shadow-black/10 border border-white/30">
            <div className="flex items-center justify-between mb-6">
                <div className="skeleton-shimmer h-8 w-48"></div>
                <div className="skeleton-shimmer h-6 w-24"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="space-y-3">
                        <div className="skeleton-shimmer aspect-[3/4] rounded-lg"></div>
                        <div className="skeleton-shimmer h-4 w-full"></div>
                        <div className="skeleton-shimmer h-4 w-3/4"></div>
                        <div className="skeleton-shimmer h-6 w-1/2"></div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export const Home = () => {
    const [top5LatestBooksData, setTop5LatestBooksData] = useState<IBook[]>([])
    const { data: top5LatestBooks, isPending: isPendingTop5LatestBooks} = useQuery({
        queryKey: ['top5LatestBooks'],
        queryFn: callFetchTop5LatestBooksApi,
        refetchOnWindowFocus: false,
        placeholderData: (previousData) => previousData,
        retry: false
    })

    const observe = useScrollAnimation();

    useEffect(() => {
        if (top5LatestBooks?.data.data) {
          setTop5LatestBooksData(top5LatestBooks.data.data)
        }
    }, [top5LatestBooks])

    return (
        <div className="space-y-10">
            {/* Hero Slider - no scroll animation needed, it's at the top */}
            <HeroSlider />

            {/* Promo Banner with scroll animation */}
            <ScrollAnimateSection observe={observe}>
                <PromoBanner />
            </ScrollAnimateSection>

            {/* Category Grid */}
            <ScrollAnimateSection observe={observe}>
                <CategoryGrid />
            </ScrollAnimateSection>

            {/* Decorative divider */}
            <div className="section-divider mx-auto w-1/3"></div>

            {/* Product Sections with stagger */}
            <ScrollAnimateSection observe={observe}>
                {isPendingTop5LatestBooks ? (
                    <ProductSectionSkeleton />
                ) : (
                    <ProductSection title="Sản phẩm mới nhất" products={top5LatestBooksData} />
                )}
            </ScrollAnimateSection>

            <ScrollAnimateSection observe={observe}>
                <ProductSection title="Sản phẩm bán chạy" products={top5LatestBooksData} />
            </ScrollAnimateSection>

            <ScrollAnimateSection observe={observe}>
                <ProductSection title="Sản phẩm nổi bật" products={top5LatestBooksData} />
            </ScrollAnimateSection>
        </div>
    )
}