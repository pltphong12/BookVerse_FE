import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
            <div className="aspect-[3/4] rounded-lg bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                <span className="text-6xl text-primary-400">📚</span>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-[3/4] p-4">
                <img
                    src={getBookImageUrl(sorted[currentImageIndex].relativePath)}
                    alt={title}
                    className="w-full h-full object-contain"
                />

                {sorted.length > 1 && (
                    <>
                        <button
                            onClick={prevImage}
                            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition-all"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition-all"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </>
                )}
            </div>

            {sorted.length > 1 && (
                <div className="flex gap-2">
                    {sorted.slice(0, MAX_THUMBNAILS).map((img, index) => (
                        <button
                            key={img.id}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`flex-1 aspect-video rounded-lg overflow-hidden border-2 transition-all ${index === currentImageIndex ? 'border-primary-500' : 'border-gray-200'
                                }`}
                        >
                            <img
                                src={getBookImageUrl(img.relativePath)}
                                alt={`${title} - ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </button>
                    ))}
                    {remaining > 0 && (
                        <button
                            onClick={() => setCurrentImageIndex(MAX_THUMBNAILS)}
                            className={`flex-1 aspect-video rounded-lg overflow-hidden border-2 transition-all relative ${currentImageIndex >= MAX_THUMBNAILS ? 'border-primary-500' : 'border-gray-200'
                                }`}
                        >
                            <img
                                src={getBookImageUrl(sorted[MAX_THUMBNAILS].relativePath)}
                                alt={`${title} - ${MAX_THUMBNAILS + 1}`}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                <span className="text-white text-lg font-bold">+{remaining}</span>
                            </div>
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
