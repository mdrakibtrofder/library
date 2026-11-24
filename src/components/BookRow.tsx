import { Link } from "react-router-dom";
import { ArrowUpRight, Download } from "lucide-react";
import BookCover from "./BookCover";
import { authorLine, categoryById, pdfUrl, type Book } from "@/lib/catalog";

const BookRow = ({ book }: { book: Book }) => {
  const cat = categoryById(book.category);
  return (
    <div className="surface surface-hover flex items-center gap-4 p-3 sm:gap-5 sm:p-4">
      <Link to={`/read/${book.id}`} className="w-14 shrink-0 sm:w-16" aria-label={`Read ${book.title}`}>
        <BookCover book={book} />
      </Link>
      <div className="min-w-0 flex-1">
        <h3 className="text-base font-semibold leading-snug sm:text-lg">
          <Link to={`/read/${book.id}`} className="hover:text-primary">
            {book.title}
          </Link>
          {book.subtitle && <span className="font-normal text-muted-foreground">: {book.subtitle}</span>}
        </h3>
        <p className="mt-0.5 text-sm text-muted-foreground">{authorLine(book, 3)}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="chip">{cat.name}</span>
          <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground/80">
            {book.pages} pp · {book.sizeMB} MB
          </span>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <a
          href={pdfUrl(book)}
          download
          aria-label={`Download ${book.title}`}
          title="Download PDF"
          className="hidden rounded-full border bg-card p-2 text-muted-foreground transition-colors hover:text-primary sm:inline-flex"
        >
          <Download className="h-4 w-4" />
        </a>
        <Link to={`/read/${book.id}`} className="btn-brand !px-4 !py-2">
          Read <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};

export default BookRow;
