import { useState } from "react";

function ArrowIcon({ direction }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      {direction === "right" ? (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 18l-6-6 6-6"
        />
      ) : (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 18l6-6-6-6"
        />
      )}
    </svg>
  );
}

function ProductImageSlider({ images = [], title }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const safeImages =
    images.length > 0
      ? images
      : ["https://via.placeholder.com/800x800?text=Product"];

  const nextImage = () => {
    setCurrentIndex((prev) =>
      prev === safeImages.length - 1 ? 0 : prev + 1
    );
  };

  const previousImage = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? safeImages.length - 1 : prev - 1
    );
  };

  return (
    <div className="relative h-full w-full overflow-hidden rounded-3xl bg-gray-100">
      
      {/* Image */}
      <img
        src={safeImages[currentIndex]}
        alt={title}
        className="h-full w-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10" />

      {/* Previous */}
      {safeImages.length > 1 && (
        <button
          type="button"
          onClick={previousImage}
          className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur transition hover:bg-black/60"
        >
          <ArrowIcon direction="right" />
        </button>
      )}

      {/* Next */}
      {safeImages.length > 1 && (
        <button
          type="button"
          onClick={nextImage}
          className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur transition hover:bg-black/60"
        >
          <ArrowIcon direction="left" />
        </button>
      )}

      {/* Dots */}
      {safeImages.length > 1 && (
        <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
          {safeImages.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "w-6 bg-white"
                  : "w-2 bg-white/50"
              }`}
              aria-label={`تصویر ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Image Counter */}
      {safeImages.length > 1 && (
        <div className="absolute left-4 top-4 rounded-full bg-black/40 px-3 py-1 text-xs text-white backdrop-blur">
          {currentIndex + 1} / {safeImages.length}
        </div>
      )}
    </div>
  );
}

export default ProductImageSlider;