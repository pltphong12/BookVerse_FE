import { IBook } from '../../../types/backend';
import ProductCard from './ProductCard';
import { useNavigate } from 'react-router-dom';

interface ProductSectionProps {
    title: string;
    subtitle?: string;
    products: IBook[];
}

const defaultShowcaseBooks: IBook[] = [
    {
        id: 101,
        title: 'Suy Tưởng Của Đêm',
        price: 185000,
        discount: 0,
        sold: 24,
        quantity: 50,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRzN6Adj5aiXn2g67TJhkJD78ell0__t58s3Nys34rfBbW2QRyVvc3q6n8wv-0ik8LMY-olR_dENiTAp3GTLq5qgudZw0Z7Jm4Hf7qu38yzfZ_gOHoGjhCwoOzFnCHP4i2IqMXvZJezzSlJ8W2phkcophPRljguu7Ij-g0TrdiX5ljBG7AxQ52I7wglhl8LLOTBr4IBQTpLU_akOE5c0HnmvMBs5x41QffmyLr2R2RuPW4e_t8Pfs',
        authors: [{ id: 1, name: 'Trần Quang' }],
        category: { id: 1, name: 'Văn học' }
    } as unknown as IBook,
    {
        id: 102,
        title: 'Khu Vườn Bỏ Hoang',
        price: 210000,
        discount: 0,
        sold: 18,
        quantity: 40,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOC1zcLstrq5hrRigvffD0Ts34i9qwbfX2TKziP9xuxb1Jy8GT7hzCaJsogQU3IrUvBUbo5r5uyGessLFZ9G6EDDXoBIGr-32cSBbaWy1JxS5yAxa2Id_sC5bwvg8mU5A1eKbBZENBg98lR35yTzOkxpXuQCnLIdrmveIPk0F2NgHUb6M_jjbM8nZZMm3gPz2QhkD-GAT3voXTlx1bwiVIV9JAqIwZBFV28TglvYlxeo4tsxV1ODg',
        authors: [{ id: 2, name: 'Lê Minh Thu' }],
        category: { id: 2, name: 'Tiểu thuyết' }
    } as unknown as IBook,
    {
        id: 103,
        title: 'Tuyển Tập Thơ Hiện Đại',
        price: 350000,
        discount: 0,
        sold: 35,
        quantity: 60,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_YOHNfL-xZNQNw2yWZQm7e99kGKSDaFg3LVndSlwAtWM2vC5A-U4Wumr2HGi6G-5dBGJtj20stIV_z79XZn9Zj34VdNVVS-0CCLzhtFd_FmnXLmsXX3TFGc2OqbuS_AxGC-W5MF8WzwwGm_VPc34Z7aG-2fscICK_hRy3-Ghaei9NxflQmHT4p-x4mvBt0hVgB80NMy0GcazoyolPwwsJ0NQfxW_jiZ3OiZ6-10oclxpBkGBZVHA',
        authors: [{ id: 3, name: 'Nhiều Tác Giả' }],
        category: { id: 3, name: 'Thơ ca' }
    } as unknown as IBook,
    {
        id: 104,
        title: 'Tiếng Vọng Thành Phố',
        price: 160000,
        discount: 0,
        sold: 42,
        quantity: 80,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJ2R1SbT3CTnI1cdv3vaZfYeJhgw02tQuSo3CtQ3xhZoIkXKSwZFBmnOnHGOs7EZH3kydgE0HThIh5gToYp8gDtz6GB60CH9IaJtEIwauUKoD5FTHdGGu6jHA2QSFRdUt_CWkZjvN06f1mPBVwK9-CnQlu-kYyWrUX8wBXnYUQQhWoiY3yiK7lWMgnjX7Tfp61AMyjd8WDXUuOKn8vRcoJZvggUAc2tIFd8ZRqPwy-X-gnDu8OoFQ',
        authors: [{ id: 4, name: 'Nguyễn Bảo' }],
        category: { id: 4, name: 'Triết học' }
    } as unknown as IBook,
    {
        id: 105,
        title: 'Hành Tinh Của Những Giấc Mơ',
        price: 225000,
        discount: 10,
        sold: 58,
        quantity: 75,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_az_hSeUe_CzcF3D4oUycZixsFykNDADouKqsLNNRmhvX1L4SBZl-fIh-x-bWoBRgbdXrpDwHb1rNDv78FI1uN4NhBFx-ibKlXqurfis-EbdvVl2R0m732f3vBCPVw-xkvHw39ux1RZIXr67Fsn5a_Zdk24J5ZQ8ifwev4wm0JjZw_JwSGtEkkOZaOQCIe6C8wpoDof5IOiK88ms23ShmNa87DY9KJqHp8Jb_5YoyCYGpHJNq5AI',
        authors: [{ id: 5, name: 'Hoàng Yến' }],
        category: { id: 5, name: 'Khoa học' }
    } as unknown as IBook,
    {
        id: 106,
        title: 'Ký Ức Những Mùa Đông',
        price: 195000,
        discount: 0,
        sold: 29,
        quantity: 45,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOC1zcLstrq5hrRigvffD0Ts34i9qwbfX2TKziP9xuxb1Jy8GT7hzCaJsogQU3IrUvBUbo5r5uyGessLFZ9G6EDDXoBIGr-32cSBbaWy1JxS5yAxa2Id_sC5bwvg8mU5A1eKbBZENBg98lR35yTzOkxpXuQCnLIdrmveIPk0F2NgHUb6M_jjbM8nZZMm3gPz2QhkD-GAT3voXTlx1bwiVIV9JAqIwZBFV28TglvYlxeo4tsxV1ODg',
        authors: [{ id: 6, name: 'Vũ Thanh' }],
        category: { id: 6, name: 'Tản văn' }
    } as unknown as IBook,
];

export default function ProductSection({ title, products }: ProductSectionProps) {
    const navigate = useNavigate();

    const displayProducts = products && products.length > 0
        ? products.slice(0, 6)
        : defaultShowcaseBooks;

    return (
        <section className="py-2">
            {/* Section Header with Bookshelf Line */}
            <div className="flex justify-between items-end mb-8 border-b border-[#E5E2DD] pb-4">
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
                    {title}
                </h2>
                <button
                    onClick={() => navigate('/products')}
                    className="text-sm font-body font-semibold text-[#0070B5] hover:underline cursor-pointer transition-colors"
                >
                    Xem tất cả
                </button>
            </div>

            {/* 6-column Product Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5 lg:gap-6 pb-4">
                {displayProducts.map((product) => (
                    <div key={product.id}>
                        <ProductCard {...product} />
                    </div>
                ))}
            </div>
        </section>
    );
}


