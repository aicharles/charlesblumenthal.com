"use client";
import { useState } from "react";

export interface CarouselImage {
  src: string;
  alt: string;
}

export default function Carousel({
  images,
  heightClass = "h-32",
}: {
  images: CarouselImage[];
  heightClass?: string;
}) {
  const [index, setIndex] = useState(0);
  const count = images.length;

  if (count === 0) return null;

  const go = (next: number) => setIndex((next + count) % count);

  return (
    <div className="relative group h-full">
      <img
        key={images[index].src}
        src={images[index].src}
        alt={images[index].alt}
        className={`absolute inset-0 w-full ${heightClass} object-cover rounded-2xl shadow-xs border-2 border-white`}
      />

      {count > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous photo"
            onClick={() => go(index - 1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/85 hover:bg-white text-warm-800 shadow-sm flex items-center justify-center text-base leading-none opacity-0 group-hover:opacity-100 transition-opacity"
          >
            &#8249;
          </button>
          <button
            type="button"
            aria-label="Next photo"
            onClick={() => go(index + 1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/85 hover:bg-white text-warm-800 shadow-sm flex items-center justify-center text-base leading-none opacity-0 group-hover:opacity-100 transition-opacity"
          >
            &#8250;
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((img, i) => (
              <button
                key={img.src}
                type="button"
                aria-label={`Go to photo ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  i === index ? "bg-white" : "bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
