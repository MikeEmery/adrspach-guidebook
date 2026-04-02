"use client";

import { useState, useCallback, useEffect } from "react";

type GalleryImage = {
  id: string;
  url: string;
  type: string;
};

export default function ImageGallery({
  images,
  wallName,
}: {
  images: GalleryImage[];
  wallName: string;
}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const close = useCallback(() => setLightboxIndex(null), []);
  const prev = useCallback(
    () =>
      setLightboxIndex((i) =>
        i !== null ? (i - 1 + images.length) % images.length : null
      ),
    [images.length]
  );
  const next = useCallback(
    () =>
      setLightboxIndex((i) =>
        i !== null ? (i + 1) % images.length : null
      ),
    [images.length]
  );

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [lightboxIndex, close, prev, next]);

  return (
    <>
      {/* Thumbnail grid */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-sm font-medium text-stone-500 uppercase tracking-wide">
            Photos
          </h2>
          <span className="text-xs text-stone-400">
            ({images.length}) — tap to enlarge
          </span>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setLightboxIndex(i)}
              className="relative aspect-[4/3] rounded-lg overflow-hidden border border-stone-200 dark:border-stone-700 hover:border-red-400 dark:hover:border-red-500 hover:shadow-md transition group"
            >
              <img
                src={img.url}
                alt={`${wallName} ${img.type} ${i + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent px-1.5 py-1">
                <span className="text-white text-[10px]">{img.type}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
          onClick={close}
        >
          {/* Close button */}
          <button
            onClick={close}
            className="absolute top-4 right-4 text-white/70 hover:text-white z-10 p-2"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Counter */}
          <div className="absolute top-4 left-4 text-white/70 text-sm">
            {lightboxIndex + 1} / {images.length}
          </div>

          {/* Prev button */}
          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-2 z-10"
            >
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Image */}
          <img
            src={images[lightboxIndex].url}
            alt={`${wallName} ${images[lightboxIndex].type}`}
            className="max-h-[90vh] max-w-[90vw] object-contain rounded"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Next button */}
          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-2 z-10"
            >
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      )}
    </>
  );
}
