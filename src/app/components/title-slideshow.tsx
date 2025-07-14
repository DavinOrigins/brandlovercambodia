"use client";

interface TitleSlideShowProps {
  translations: {
    slideshowText: string;
  };
}

export default function TitleSlideShow({ translations }: TitleSlideShowProps) {
  const clients = Array(8).fill({ name: translations.slideshowText }); // repeat it 8 times for smooth scrolling

  return (
    <section className="py-2 bg-[#fcac4c]">
      <div className="overflow-hidden whitespace-nowrap">
        <div className="flex space-x-4 animate-scroll">
          {clients.map((client, idx) => (
            <div
              key={`${client.name}-${idx}`}
              className="inline-block flex-shrink-0 text-white text-xl font-bold px-2"
            >
              {client.name}
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
