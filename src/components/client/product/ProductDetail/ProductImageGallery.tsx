import { useState } from 'react';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { IBookImage } from '../../../../types/backend';

interface ProductImageGalleryProps {
    title: string;
    images: IBookImage[];
}

const getBookImageUrl = (pathOrName: string) => {
    const filename = pathOrName.includes('/') ? pathOrName.split('/').pop() : pathOrName;
    return `${import.meta.env.VITE_BACKEND_URL}/storage/book/${filename}`;
};

const MAX_THUMBNAILS = 4;

export default function ProductImageGallery({ title, images }: ProductImageGalleryProps) {
    const sorted = [...images].sort((a, b) => a.sortOrder - b.sortOrder);
    const primaryIndex = sorted.findIndex((img) => img.primary);
    const [currentImageIndex, setCurrentImageIndex] = useState(primaryIndex >= 0 ? primaryIndex : 0);
    const remaining = sorted.length - MAX_THUMBNAILS;

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % sorted.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + sorted.length) % sorted.length);
    };

    if (sorted.length === 0) {
        return (
            <div className="aspect-[3/4] rounded-2xl bg-[#e3f2fd] border border-[#dff1fb] flex flex-col items-center justify-center text-[#1a237e] p-6 shadow-sm">
                <BookOpen className="w-16 h-16 opacity-60 mb-2" />
                <span className="font-headline font-semibold text-sm">Chưa có hình ảnh</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {/* Main Showcase Image Card */}
            <div className="relative bg-white border border-[#dff1fb] rounded-2xl p-6 sm:p-8 flex justify-center items-center shadow-sm overflow-hidden group">
                <div className="w-full aspect-[3/4] max-h-[460px] flex items-center justify-center">
                    <img
                        src={getBookImageUrl(sorted[currentImageIndex].relativePath)}
                        alt={title}
                        className="w-full h-full object-contain rounded-xl drop-shadow-md transition-transform duration-300 group-hover:scale-[1.02]"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 300 400%22><rect fill=%22%23f3f4f6%22 width=%22300%22 height=%22400%22/><text x=%22150%22 y=%22200%22 text-anchor=%22middle%22 fill=%22%239ca3af%22 font-size=%2224%22>📖</text></svg>';
                        }}
                    />
                </div>

                {sorted.length > 1 && (
                    <>
                        <button
                            onClick={prevImage}
                            aria-label="Previous image"
                            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-[#1a237e] text-[#1a237e] hover:text-white p-2.5 rounded-full shadow-md transition-all duration-200 cursor-pointer opacity-0 group-hover:opacity-100"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={nextImage}
                            aria-label="Next image"
                            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-[#1a237e] text-[#1a237e] hover:text-white p-2.5 rounded-full shadow-md transition-all duration-200 cursor-pointer opacity-0 group-hover:opacity-100"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </>
                )}
            </div>

            {/* Thumbnail Strip */}
            {sorted.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {sorted.slice(0, MAX_THUMBNAILS).map((img, index) => (
                        <button
                            key={img.id}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-20 h-20 shrink-0 rounded-xl overflow-hidden border-2 bg-white p-1 transition-all cursor-pointer ${
                                index === currentImageIndex
                                    ? 'border-[#1a237e] ring-2 ring-[#e3f2fd] opacity-100 shadow-sm'
                                    : 'border-[#dff1fb] opacity-60 hover:opacity-100 hover:border-slate-300'
                            }`}
                        >
                            <img
                                src={getBookImageUrl(img.relativePath)}
                                alt={`${title} - ${index + 1}`}
                                className="w-full h-full object-contain"
                            />
                        </button>
                    ))}
                    {remaining > 0 && (
                        <button
                            onClick={() => setCurrentImageIndex(MAX_THUMBNAILS)}
                            className={`w-20 h-20 shrink-0 rounded-xl overflow-hidden border-2 bg-white p-1 transition-all relative cursor-pointer ${
                                currentImageIndex >= MAX_THUMBNAILS
                                    ? 'border-[#1a237e] ring-2 ring-[#e3f2fd] opacity-100'
                                    : 'border-[#dff1fb] opacity-75 hover:opacity-100'
                            }`}
                        >
                            <img
                                src={getBookImageUrl(sorted[MAX_THUMBNAILS].relativePath)}
                                alt={`${title} - ${MAX_THUMBNAILS + 1}`}
                                className="w-full h-full object-contain"
                            />
                            <div className="absolute inset-0 bg-[#0d1e25]/70 rounded-lg flex items-center justify-center">
                                <span className="text-white font-headline text-xs font-bold">+{remaining}</span>
                            </div>
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

