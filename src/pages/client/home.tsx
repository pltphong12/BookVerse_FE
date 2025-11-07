import { useQuery } from "@tanstack/react-query";
import CategoryGrid from "../../components/client/home/CategoryGrid"
import HeroSlider from "../../components/client/home/HeroSlider"
import PromoBanner from "../../components/client/home/PromoBanner"
import ProductSection from "../../components/client/product/product.section"
import { callFetchTop5LatestBooksApi } from "../../services/api";
import { useEffect, useState } from "react";
import { IBook } from "../../types/backend";

export const Home = () => {
    const [top5LatestBooksData, setTop5LatestBooksData] = useState<IBook[]>([])
    const { data: top5LatestBooks, isPending: isPendingTop5LatestBooks} = useQuery({
        queryKey: ['top5LatestBooks'],
        queryFn: callFetchTop5LatestBooksApi,
        refetchOnWindowFocus: false,
        placeholderData: (previousData) => previousData,
        retry: false
    })

    useEffect(() => {
        if (top5LatestBooks?.data.data) {
          setTop5LatestBooksData(top5LatestBooks.data.data)
        }
    }, [top5LatestBooks])

    return (
        <>
            <HeroSlider />
            <PromoBanner />
            <CategoryGrid />
            {isPendingTop5LatestBooks ? <div>Đang tải...</div> : <ProductSection title="Sản phẩm mới nhất" products={top5LatestBooksData} />}
            <ProductSection title="Sản phẩm bán chạy" products={top5LatestBooksData} />
            <ProductSection title="Sản phẩm nổi bật" products={top5LatestBooksData} />
        </>
    )
}