import { Star, ThumbsUp } from 'lucide-react';
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
        date: '2024-03-10',
        title: 'Cuốn sách tuyệt vời!',
        content:
            'Mình rất thích cuốn sách này. Nội dung rất hay, dễ hiểu và áp dụng được vào đời sống thực tế. Giao hàng nhanh, tình trạng sách tốt.',
        helpful: 24,
        verified: true,
    },
    {
        id: 2,
        author: 'Trần Thị B',
        rating: 4,
        date: '2024-03-08',
        title: 'Hay nhưng hơi dài',
        content:
            'Cuốn sách có nội dung rất hay nhưng phần sau hơi dài dòng. Tổng thể vẫn đáng để đọc. Bìa sách đẹp, in ấn chất lượng.',
        helpful: 15,
        verified: true,
    },
    {
        id: 3,
        author: 'Phạm Minh C',
        rating: 5,
        date: '2024-03-01',
        title: 'Cuốn sách đã thay đổi cách suy nghĩ của tôi',
        content:
            'Một cuốn sách thật sự hay. Những ý tưởng được trình bày một cách rõ ràng và logic. Tôi đã gợi ý cuốn sách này cho rất nhiều bạn.',
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
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-8">
            <h3 className="text-2xl font-bold text-gray-900">Đánh giá sản phẩm</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center justify-center border rounded-lg p-6">
                    <div className="text-4xl font-bold text-gray-900 mb-2">{averageRating}</div>
                    <div className="flex gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`w-5 h-5 ${i < Math.round(parseFloat(averageRating))
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                            />
                        ))}
                    </div>
                    <p className="text-gray-600">{mockReviews.length} đánh giá</p>
                </div>

                <div className="md:col-span-2 space-y-2">
                    {[5, 4, 3, 2, 1].map((stars) => {
                        const count = mockReviews.filter((r) => r.rating === stars).length;
                        const percentage = (count / mockReviews.length) * 100;
                        return (
                            <div key={stars} className="flex items-center gap-2">
                                <span className="text-sm text-gray-600 w-8">{stars}★</span>
                                <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                                    <div
                                        className="bg-yellow-400 h-full"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                                <span className="text-sm text-gray-600 w-12">{count}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            <button className="border-2 border-primary-500 text-primary-500 px-6 py-2.5 rounded-xl hover:bg-primary-50 transition-colors font-semibold text-base w-full md:w-auto">Viết đánh giá</button>

            <div className="space-y-4">
                <h4 className="font-bold text-gray-900">Đánh giá chi tiết</h4>
                {mockReviews.map((review) => (
                    <div key={review.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-gray-900">{review.author}</span>
                                    {review.verified && (
                                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                            Đã xác minh
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-500">{review.date}</p>
                            </div>
                            <div className="flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-4 h-4 ${i < review.rating
                                                ? 'fill-yellow-400 text-yellow-400'
                                                : 'text-gray-300'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>

                        <div>
                            <h5 className="font-semibold text-gray-900 mb-1">{review.title}</h5>
                            <p className="text-gray-700 text-sm">{review.content}</p>
                        </div>

                        <button
                            onClick={() => toggleHelpful(review.id)}
                            className={`flex items-center gap-2 text-sm px-3 py-1 rounded-full transition-colors ${helpfulReviews.has(review.id)
                                    ? 'bg-primary-100 text-primary-600'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <ThumbsUp className="w-4 h-4" />
                            Hữu ích ({review.helpful + (helpfulReviews.has(review.id) ? 1 : 0)})
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
