import { useQuery } from "@tanstack/react-query";
import HeroSlider from "../../components/client/home/HeroSlider";
import ProductSection from "../../components/client/product/ProductSection";
import { callFetchAllProductsWithPaginationAndFilterApi, callFetchTop5LatestBooksApi } from "../../services/api";
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

// Loading skeleton for 6 product cards
function ProductSectionSkeleton() {
    return (
        <div className="py-2">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#E5E2DD]">
                <div className="skeleton-shimmer h-8 w-48 rounded"></div>
                <div className="skeleton-shimmer h-5 w-20 rounded"></div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5 lg:gap-6">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="space-y-3">
                        <div className="skeleton-shimmer aspect-[2/3] rounded w-full"></div>
                        <div className="skeleton-shimmer h-4 w-3/4 rounded"></div>
                        <div className="skeleton-shimmer h-3 w-1/2 rounded"></div>
                        <div className="skeleton-shimmer h-5 w-1/3 rounded"></div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export const Home = () => {
    const [latestBooksData, setLatestBooksData] = useState<IBook[]>([]);
    const { data: latestBooks, isPending: isPendingLatestBooks } = useQuery<IBook[]>({
        queryKey: ['latest6Books'],
        queryFn: async () => {
            try {
                const res = await callFetchAllProductsWithPaginationAndFilterApi({}, 1, 6);
                if (res.data?.data?.result && res.data.data.result.length > 0) {
                    return res.data.data.result;
                }
            } catch {
                // Fallback to top-5-latest if pagination search endpoint fails
            }
            try {
                const fallbackRes = await callFetchTop5LatestBooksApi();
                return fallbackRes.data?.data ?? [];
            } catch {
                return [];
            }
        },
        refetchOnWindowFocus: false,
        retry: false
    });

    const observe = useScrollAnimation();

    useEffect(() => {
        if (latestBooks) {
            setLatestBooksData(latestBooks);
        }
    }, [latestBooks]);

    return (
        <div className="space-y-12 sm:space-y-18">
            {/* 1. Hero Section: Sách Của Tháng */}
            <HeroSlider />

            {/* 2. Section: Sách mới phát hành (6 quyển) */}
            <ScrollAnimateSection observe={observe}>
                {isPendingLatestBooks ? (
                    <ProductSectionSkeleton />
                ) : (
                    <ProductSection
                        title="Sách mới phát hành"
                        products={latestBooksData}
                    />
                )}
            </ScrollAnimateSection>
        </div>
    );
};