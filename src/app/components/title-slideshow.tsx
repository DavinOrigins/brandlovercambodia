
"use client";

import { useEffect, useState } from "react";

interface TitleSlideShowProps {
  translations: {
    slideshowText: string;
  };
}

export default function TitleSlideShow({ translations }: TitleSlideShowProps) {
  const [repeatCount, setRepeatCount] = useState(12); // Default for large screens

  useEffect(() => {
    const updateRepeatCount = () => {
      const screenWidth = window.innerWidth;
      const textLength = translations.slideshowText.length;
      const baseRepeat = Math.ceil((screenWidth * 2) / (textLength * 24)); // 24px = approx width per char
      setRepeatCount(Math.max(baseRepeat, 8));
    };

    updateRepeatCount();
    window.addEventListener("resize", updateRepeatCount);
    return () => window.removeEventListener("resize", updateRepeatCount);
  }, [translations.slideshowText]);

  const clients = Array(repeatCount).fill(translations.slideshowText);

  return (
    <section className="py-2 bg-[#fcac4c]">
      <div className="overflow-hidden whitespace-nowrap">
        <div className="flex space-x-4 animate-scroll">
          {clients.map((text, idx) => (
            <div
              key={`${text}-${idx}`}
              className="inline-block flex-shrink-0 text-white text-xl px-2"
            >
              {text}
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes scroll {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          display: flex;
          width: max-content;
          min-width: 200%;
          animation: scroll 50s linear infinite;
        }
      `}</style>
    </section>
  );
}
