

"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ProductCarouselProps {
  images: string[];
  translations: {
    noImages: string;
    prevImage: string;
    nextImage: string;
  };
}

type Direction = 1 | -1;

function ProductCarousel({ images, translations }: ProductCarouselProps) {
  const [[currentImage, direction], setCurrentImage] = useState<[number, Direction]>([0, 1]);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const minSwipeDistance = 50;

  const paginate = (newDirection: Direction) => {
    setCurrentImage(([prevIndex]) => {
      let nextIndex = prevIndex + newDirection;
      if (nextIndex < 0) nextIndex = images.length - 1;
      if (nextIndex >= images.length) nextIndex = 0;
      return [nextIndex, newDirection];
    });
  };

  const nextImage = () => paginate(1);
  const prevImage = () => paginate(-1);

  // Swipe handlers
  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.changedTouches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    touchEndX.current = e.changedTouches[0].clientX;
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const distance = touchStartX.current - touchEndX.current;
      if (distance > minSwipeDistance) {
        nextImage();
      } else if (distance < -minSwipeDistance) {
        prevImage();
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
  }

  if (images.length === 0) {
    return (
      <div className="aspect-[4/3] flex items-center justify-center text-gray-500">
        {translations.noImages}
      </div>
    );
  }

  // Animation variants for sliding left/right
  const variants = {
    enter: (direction: Direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      position: "absolute" as const,
    }),
    center: {
      x: 0,
      opacity: 1,
      position: "relative" as const,
    },
    exit: (direction: Direction) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
      position: "absolute" as const,
    }),
  };

  return (
    <div className="relative group h-full">
      <div
        className="aspect-[4/3] overflow-hidden rounded-lg h-full relative"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <AnimatePresence custom={direction} initial={false}>
          <motion.div
            key={currentImage}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full h-full"
          >
            <Image
              src={images[currentImage]}
              alt={`Product image ${currentImage + 1}`}
              width={400}
              height={300}
              className="w-full h-full object-cover select-none"
              draggable={false}
              priority
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {images.length > 1 && (
        <>
          <button
            className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white text-gray-600 hover:text-orange-600 rounded-md p-2 border border-gray-200"
            onClick={prevImage}
            aria-label={translations.prevImage}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white text-gray-600 hover:text-orange-600 rounded-md p-2 border border-gray-200"
            onClick={nextImage}
            aria-label={translations.nextImage}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors cursor-pointer ${
                  index === currentImage ? "bg-white" : "bg-white/50"
                }`}
                onClick={() => setCurrentImage([index, index > currentImage ? 1 : -1])}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default ProductCarousel;


