import CategoryGrid from "../../components/client/home/CategoryGrid"
import HeroSlider from "../../components/client/home/HeroSlider"
import PromoBanner from "../../components/client/home/PromoBanner"
import ProductSection from "../../components/client/product/product.section"

export const featuredProducts = [
    {
      id: 1,
      title: 'Nhà Giả Kim',
      author: 'Paulo Coelho',
      price: 79000,
      originalPrice: 99000,
      rating: 5,
      soldCount: 1250,
    },
    {
      id: 2,
      title: 'Đắc Nhân Tâm',
      author: 'Dale Carnegie',
      price: 68000,
      originalPrice: 85000,
      rating: 5,
      soldCount: 2100,
    },
    {
      id: 3,
      title: 'Sapiens: Lược Sử Loài Người',
      author: 'Yuval Noah Harari',
      price: 189000,
      originalPrice: 250000,
      rating: 5,
      soldCount: 890,
    },
    {
      id: 4,
      title: 'Atomic Habits',
      author: 'James Clear',
      price: 179000,
      originalPrice: 220000,
      rating: 5,
      soldCount: 1520,
    },
    {
      id: 5,
      title: 'Tuổi Trẻ Đáng Giá Bao Nhiêu',
      author: 'Rosie Nguyễn',
      price: 72000,
      originalPrice: 90000,
      rating: 4,
      soldCount: 3200,
    },
  ];
  
  export const bestSellerProducts = [
    {
      id: 6,
      title: 'Dám Bị Ghét',
      author: 'Kishimi Ichiro',
      price: 95000,
      originalPrice: 120000,
      rating: 5,
      soldCount: 2800,
    },
    {
      id: 7,
      title: 'Tư Duy Nhanh Và Chậm',
      author: 'Daniel Kahneman',
      price: 159000,
      originalPrice: 200000,
      rating: 5,
      soldCount: 950,
    },
    {
      id: 8,
      title: 'Đời Ngắn Đừng Ngủ Dài',
      author: 'Robin Sharma',
      price: 89000,
      originalPrice: 110000,
      rating: 4,
      soldCount: 1680,
    },
    {
      id: 9,
      title: 'Nghệ Thuật Tinh Tế Của Việc Đếch Quan Tâm',
      author: 'Mark Manson',
      price: 99000,
      originalPrice: 125000,
      rating: 5,
      soldCount: 2400,
    },
    {
      id: 10,
      title: 'Bố Già',
      author: 'Mario Puzo',
      price: 129000,
      originalPrice: 160000,
      rating: 5,
      soldCount: 1100,
    },
  ];
  
  export const newProducts = [
    {
      id: 11,
      title: 'Cà Phê Cùng Tony',
      author: 'Tony Buổi Sáng',
      price: 69000,
      originalPrice: 85000,
      rating: 4,
      soldCount: 780,
    },
    {
      id: 12,
      title: 'Thinking, Fast and Slow',
      author: 'Daniel Kahneman',
      price: 149000,
      rating: 5,
      soldCount: 450,
    },
    {
      id: 13,
      title: 'Thần Thoại Hy Lạp',
      author: 'Edith Hamilton',
      price: 119000,
      originalPrice: 150000,
      rating: 5,
      soldCount: 620,
    },
    {
      id: 14,
      title: 'Chiến Binh Cầu Vồng',
      author: 'Andrea Hirata',
      price: 99000,
      rating: 4,
      soldCount: 340,
    },
    {
      id: 15,
      title: 'Sức Mạnh Của Thói Quen',
      author: 'Charles Duhigg',
      price: 109000,
      originalPrice: 135000,
      rating: 5,
      soldCount: 890,
    },
  ];

export const Home = () => {
    return (
        <>
            <HeroSlider />
            <PromoBanner />
            <CategoryGrid />
            <ProductSection title="Sản phẩm mới nhất" products={newProducts} />
            <ProductSection title="Sản phẩm bán chạy" products={bestSellerProducts} />
            <ProductSection title="Sản phẩm nổi bật" products={featuredProducts} />
        </>
    )
}