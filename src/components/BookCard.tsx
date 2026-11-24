import { Link } from "react-router-dom";
import { BookOpen, Download } from "lucide-react";
import BookCover from "./BookCover";
import { authorLine, categoryById, pdfUrl, type Book } from "@/lib/catalog";

interface BookCardProps {
  book: Book;
  delay?: number;
  showCategory?: boolean;
}

const BookCard = ({ book, delay = 0, showCategory = false }: BookCardProps) => (
  <article className="reveal group relative flex flex-col" style={{ "--d": `${delay}ms` } as React.CSSProperties}>
    <Link to={`/read/${book.id}`} className="relative block" aria-label={`Read ${book.title}`}>
      <div className="transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1.5 group-hover:[transform:perspective(900px)_translateY(-6px)_rotateY(-4deg)]">
        <BookCover book={book} />
      </div>
      <span className="pointer-events-none absolute inset-x-3 bottom-3 flex items-center justify-center gap-1.5 rounded-full bg-background/95 py-2 text-xs font-semibold text-primary opacity-0 shadow-lg transition-opacity duration-300 group-hover:opacity-100">
        <BookOpen className="h-3.5 w-3.5" /> Read now
      </span>
    </Link>
    <div className="mt-4 flex items-start justify-between gap-2">
      <div className="min-w-0">
        <h3 className="text-[15px] font-semibold leading-snug">
          <Link to={`/read/${book.id}`} className="hover:text-primary">
            {book.title}
          </Link>
        </h3>
        <p className="mt-0.5 truncate text-sm text-muted-foreground">{authorLine(book)}</p>
      </div>
      <a
        href={pdfUrl(book)}
        download
        aria-label={`Download ${book.title}`}
        title="Download PDF"
        className="mt-0.5 shrink-0 rounded-full border bg-card p-1.5 text-muted-foreground transition-colors hover:text-primary"
      >
        <Download className="h-3.5 w-3.5" />
      </a>
    </div>
    <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground/80">
      {showCategory ? `${categoryById(book.category).name} · ` : ""}
      {book.pages} pp · {book.sizeMB} MB
    </p>
  </article>
);

export default BookCard;
