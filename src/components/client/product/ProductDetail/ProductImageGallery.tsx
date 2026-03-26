import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductImageGalleryProps {
  title: string;
  imageUrl?: string;
}

export default function ProductImageGallery({ title, imageUrl }: ProductImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [imageUrl || '', '', ''];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="space-y-4">
      <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-[3/4]">
        {images[currentImageIndex] ? (
          <img
            src={images[currentImageIndex]}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200">
            <span className="text-6xl text-primary-400">📚</span>
          </div>
        )}

        {images.length > 1 && (
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

      {images.length > 1 && (
        <div className="flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`flex-1 aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                index === currentImageIndex ? 'border-primary-500' : 'border-gray-200'
              }`}
            >
              {_ ? (
                <img src={_} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                  <span className="text-2xl text-primary-400">📚</span>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
