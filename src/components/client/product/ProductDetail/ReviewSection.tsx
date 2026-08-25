import { Star, ThumbsUp, MessageSquarePlus, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

interface Review {
    id: number;
    author: string;
    rating: number;
    date: string;
    title: string;
    content: string;
    helpful: number;
    verified: boolean;
}

const mockReviews: Review[] = [
    {
        id: 1,
        author: 'Nguyễn Văn A',
        rating: 5,
        date: '10/03/2024',
        title: 'Cuốn sách tuyệt vời ngoài mong đợi!',
        content:
            'Mình rất thích cuốn sách này. Nội dung sâu sắc, hành văn mạch lạc và lôi cuốn từ đầu đến cuối. Đóng gói rất cẩn thận, bìa cứng cáp và giao hàng cực nhanh.',
        helpful: 24,
        verified: true,
    },
    {
        id: 2,
        author: 'Trần Thị B',
        rating: 5,
        date: '08/03/2024',
        title: 'Chất lượng sách xuất sắc',
        content:
            'Chất lượng giấy in tốt, chữ rõ nét không bị lóa mắt. Tác giả truyền tải thông điệp rất thực tế, bổ ích cho người đọc.',
        helpful: 15,
        verified: true,
    },
    {
        id: 3,
        author: 'Phạm Minh C',
        rating: 4,
        date: '01/03/2024',
        title: 'Cuốn sách mở mang tư duy',
        content:
            'Một cuốn sách thật sự đáng đọc trong năm nay. Những ý tưởng được trình bày một cách khoa học và hệ thống.',
        helpful: 42,
        verified: true,
    },
];

export default function ReviewSection() {
    const [helpfulReviews, setHelpfulReviews] = useState<Set<number>>(new Set());

    const toggleHelpful = (reviewId: number) => {
        const newSet = new Set(helpfulReviews);
        if (newSet.has(reviewId)) {
            newSet.delete(reviewId);
        } else {
            newSet.add(reviewId);
        }
        setHelpfulReviews(newSet);
    };

    const averageRating = (
        mockReviews.reduce((sum, r) => sum + r.rating, 0) / mockReviews.length
    ).toFixed(1);

    return (
        <section className="bg-white rounded-lg border border-[#E5E2DD] p-6 sm:p-8 shadow-sm space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E2DD] pb-5">
                <div>
                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1A1A1A]">
                        Đánh giá từ độc giả
                    </h2>
                    <p className="font-body text-xs sm:text-sm text-slate-500 mt-1">
                        Tổng hợp nhận xét và đánh giá trải nghiệm đọc thực tế
                    </p>
                </div>
                <button className="flex items-center gap-2 bg-[#1A1A1A] hover:bg-[#0070B5] text-white px-5 py-2.5 rounded font-body font-semibold text-xs sm:text-sm transition-colors shadow-sm cursor-pointer self-start sm:self-auto">
                    <MessageSquarePlus className="w-4 h-4" />
                    <span>Viết đánh giá</span>
                </button>
            </div>

            {/* Score Overview Bento */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-[#FAF9F7] border border-[#E5E2DD] rounded-lg p-6">
                <div className="md:col-span-4 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-[#E5E2DD] pb-5 md:pb-0 md:pr-6">
                    <div className="font-serif text-5xl font-bold text-[#1A1A1A] tracking-tight">
                        {averageRating}
                    </div>
                    <div className="flex text-[#B8860B] my-2">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`w-5 h-5 ${
                                    i < Math.round(parseFloat(averageRating))
                                        ? 'fill-current'
                                        : 'text-slate-300'
                                }`}
                            />
                        ))}
                    </div>
                    <p className="font-body text-xs text-slate-500 font-medium">
                        Dựa trên {mockReviews.length} lượt nhận xét
                    </p>
                </div>

                <div className="md:col-span-8 flex flex-col justify-center space-y-2.5">
                    {[5, 4, 3, 2, 1].map((stars) => {
                        const count = mockReviews.filter((r) => r.rating === stars).length;
                        const percentage = (count / mockReviews.length) * 100;
                        return (
                            <div key={stars} className="flex items-center gap-3 text-xs font-body">
                                <span className="font-semibold text-slate-700 w-8 flex items-center gap-1">
                                    {stars} <Star className="w-3 h-3 fill-[#B8860B] text-[#B8860B] inline" />
                                </span>
                                <div className="flex-1 bg-[#E5E2DD] rounded-full h-2 overflow-hidden">
                                    <div
                                        className="bg-[#1A1A1A] h-full rounded-full transition-all duration-500"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                                <span className="text-slate-400 w-10 text-right font-medium">{count}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Individual Reviews List */}
            <div className="space-y-4">
                {mockReviews.map((review) => (
                    <div
                        key={review.id}
                        className="bg-white border border-[#E5E2DD] rounded-lg p-5 sm:p-6 space-y-3 hover:border-slate-400 transition-colors"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#FAF9F7] border border-[#E5E2DD] text-[#1A1A1A] font-serif font-bold text-sm flex items-center justify-center shadow-inner shrink-0">
                                    {review.author.charAt(0)}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-body font-semibold text-sm text-[#1A1A1A]">
                                            {review.author}
                                        </h4>
                                        {review.verified && (
                                            <span className="inline-flex items-center gap-1 text-[11px] font-body font-medium text-[#0070B5] bg-[#E3F2FD] px-2 py-0.5 rounded-full">
                                                <CheckCircle2 className="w-3 h-3" />
                                                Đã mua hàng
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-xs font-body text-slate-400">
                                        {review.date}
                                    </span>
                                </div>
                            </div>

                            <div className="flex text-[#B8860B]">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-4 h-4 ${
                                            i < review.rating ? 'fill-current' : 'text-slate-200'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>

                        <div>
                            <h5 className="font-serif font-bold text-sm text-[#1A1A1A] mb-1">
                                {review.title}
                            </h5>
                            <p className="font-body text-sm text-slate-600 leading-relaxed">
                                {review.content}
                            </p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-[#FAF9F7] text-xs font-body text-slate-400">
                            <span>Đánh giá hữu ích?</span>
                            <button
                                onClick={() => toggleHelpful(review.id)}
                                className={`flex items-center gap-1.5 px-3 py-1 rounded transition-colors cursor-pointer border ${
                                    helpfulReviews.has(review.id)
                                        ? 'bg-[#FAF9F7] border-[#1A1A1A] text-[#1A1A1A] font-semibold'
                                        : 'border-[#E5E2DD] text-slate-500 hover:text-[#1A1A1A]'
                                }`}
                            >
                                <ThumbsUp className="w-3.5 h-3.5" />
                                <span>Hữu ích ({review.helpful + (helpfulReviews.has(review.id) ? 1 : 0)})</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
