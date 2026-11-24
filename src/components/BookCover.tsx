import type { CSSProperties } from "react";
import { categoryById, type Book } from "@/lib/catalog";

interface BookCoverProps {
  book: Book;
  className?: string;
}

/**
 * Uniform typographic cover. Colour comes from the book's category so a
 * shelf reads as a set; type scales with the cover width (container units).
 */
const BookCover = ({ book, className = "" }: BookCoverProps) => {
  const cat = categoryById(book.category);
  const h = cat.hue;
  const len = book.title.length;
  const titleSize = len > 36 ? 8.6 : len > 24 ? 10 : len > 14 ? 12 : 14.5;

  const style: CSSProperties = {
    containerType: "inline-size",
    background: `linear-gradient(155deg, hsl(${h} 48% 30%) 0%, hsl(${(h + 18) % 360} 52% 19%) 100%)`,
  };

  return (
    <div
      className={`relative aspect-[3/4] w-full select-none overflow-hidden rounded-[6px] shadow-[0_10px_24px_-12px_rgba(20,30,25,0.55)] ring-1 ring-black/10 ${className}`}
      style={style}
      role="img"
      aria-label={`Cover of ${book.title}`}
    >
      {/* spine */}
      <div className="absolute inset-y-0 left-0 w-[7%]" style={{ background: `hsl(${h} 50% 14% / 0.55)` }} />
      <div className="absolute inset-y-0 left-[7%] w-px bg-white/20" />
      {/* soft light + pattern */}
      <div className="absolute inset-0 opacity-[0.16] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:12px_12px]" />
      <div className="absolute -right-[18%] -top-[12%] h-[62%] w-[62%] rounded-full" style={{ background: `hsl(${(h + 30) % 360} 70% 60% / 0.22)` }} />

      <div className="relative flex h-full flex-col justify-between pb-[9%] pl-[16%] pr-[9%] pt-[10%] text-[#fbf6e9]">
        <span className="font-mono uppercase tracking-[0.16em] text-[#f2c45a]" style={{ fontSize: "4.3cqw" }}>
          {cat.name.split(" & ")[0]}
        </span>
        <div>
          <h3
            className="font-display font-semibold leading-[1.08] text-[#fbf6e9]"
            style={{ fontSize: `${titleSize}cqw` }}
          >
            {book.title}
          </h3>
          {book.subtitle && (
            <p className="mt-[4%] leading-snug text-[#fbf6e9]/75" style={{ fontSize: "5cqw" }}>
              {book.subtitle.length > 44 ? `${book.subtitle.slice(0, 42)}…` : book.subtitle}
            </p>
          )}
        </div>
        <div>
          <div className="mb-[5%] h-[2px] w-[22%] rounded bg-[#f2c45a]" />
          <p className="font-medium leading-tight text-[#fbf6e9]/90" style={{ fontSize: "5.2cqw" }}>
            {book.authors.length > 2 ? `${book.authors[0]} et al.` : book.authors.join(" · ")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookCover;
