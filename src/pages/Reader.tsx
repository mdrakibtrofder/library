import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Download, ExternalLink, Info, Maximize2, X } from "lucide-react";
import BookCover from "@/components/BookCover";
import BookCard from "@/components/BookCard";
import Logo from "@/components/Logo";
import NotFound from "./NotFound";
import { authorLine, bookById, books, categoryById, pdfUrl, titleSortKey } from "@/lib/catalog";
import { rememberBook } from "@/hooks/use-recent";
import { useReveal } from "@/hooks/use-reveal";

const Reader = () => {
  const { id = "" } = useParams();
  const book = bookById(id);
  const [panel, setPanel] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
    if (book) {
      rememberBook(book.id);
      document.title = `${book.title} — RI Library`;
    }
    return () => {
      document.title = "RI Library — Computer Science Books, Free to Read";
    };
  }, [book]);

  const related = useMemo(() => {
    if (!book) return [];
    const same = books
      .filter((b) => b.id !== book.id && (b.category === book.category || b.authors.some((a) => book.authors.includes(a))))
      .sort((a, b) => titleSortKey(a).localeCompare(titleSortKey(b)));
    return same.slice(0, 6);
  }, [book]);

  useReveal(id);

  if (!book) return <NotFound />;

  const cat = categoryById(book.category);
  const url = pdfUrl(book);
  const shelf = books.filter((b) => b.category === book.category).sort((a, b) => titleSortKey(a).localeCompare(titleSortKey(b)));
  const pos = shelf.findIndex((b) => b.id === book.id);
  const prev = shelf[pos - 1];
  const next = shelf[pos + 1];

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Top bar */}
      <header className="z-40 border-b bg-background/90 backdrop-blur-xl">
        <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
          <Link to="/" className="hidden shrink-0 sm:block" aria-label="RI Library home">
            <Logo size={32} showText={false} />
          </Link>
          <Link
            to={`/library?view=category&cat=${book.category}`}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border bg-card px-3 py-1.5 text-sm font-medium hover:border-primary/40"
          >
            <ArrowLeft className="h-4 w-4" /> <span className="hidden sm:inline">Library</span>
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-display text-base font-semibold leading-tight sm:text-lg">
              {book.title}
              {book.subtitle && <span className="hidden font-normal text-muted-foreground md:inline">: {book.subtitle}</span>}
            </h1>
            <p className="truncate text-xs text-muted-foreground">{authorLine(book, 3)}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={() => setPanel((p) => !p)}
              aria-pressed={panel}
              className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-2 text-sm font-medium hover:border-primary/40"
            >
              <Info className="h-4 w-4" /> <span className="hidden md:inline">Details</span>
            </button>
            <a href={url} target="_blank" rel="noopener noreferrer" className="hidden items-center gap-1.5 rounded-full border bg-card px-3 py-2 text-sm font-medium hover:border-primary/40 sm:inline-flex">
              <Maximize2 className="h-4 w-4" /> <span className="hidden md:inline">Full screen</span>
            </a>
            <a href={url} download className="btn-brand !px-4 !py-2">
              <Download className="h-4 w-4" /> <span className="hidden sm:inline">Download</span>
            </a>
          </div>
        </div>
      </header>

      <div className="relative flex min-h-0 flex-1">
        {/* Viewer */}
        <div className="relative min-w-0 flex-1 bg-[hsl(40_20%_88%)]">
          {!loaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
              <div className="w-28">
                <BookCover book={book} />
              </div>
              <p className="text-sm text-muted-foreground">Opening {book.title}… ({book.sizeMB} MB)</p>
            </div>
          )}
          <iframe
            key={book.id}
            title={book.title}
            src={`${url}#view=FitH`}
            onLoad={() => setLoaded(true)}
            className="h-full w-full border-0"
          />
          {/* Fallback for browsers that cannot show PDFs inline (many phones) */}
          <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center px-4 md:hidden">
            <a href={url} target="_blank" rel="noopener noreferrer" className="btn-brand pointer-events-auto !py-2.5 shadow-xl">
              <ExternalLink className="h-4 w-4" /> Open in reader
            </a>
          </div>
        </div>

        {/* Details panel */}
        {panel && (
          <aside className="absolute inset-y-0 right-0 z-30 w-full max-w-sm overflow-y-auto border-l bg-background shadow-2xl md:static md:shadow-none">
            <div className="flex items-center justify-between border-b px-5 py-3">
              <p className="eyebrow">About this book</p>
              <button onClick={() => setPanel(false)} aria-label="Close details" className="rounded-full p-1.5 hover:bg-secondary">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-6 p-5">
              <div className="mx-auto w-40">
                <BookCover book={book} />
              </div>
              <div>
                <h2 className="text-2xl font-semibold leading-tight">{book.title}</h2>
                {book.subtitle && <p className="mt-1 text-muted-foreground">{book.subtitle}</p>}
              </div>
              <p className="leading-relaxed text-muted-foreground">{book.description}</p>
              <dl className="divide-y rounded-2xl border text-sm">
                {[
                  ["Author", book.authors.join(", ")],
                  ["Category", cat.name],
                  ["Edition", book.edition || "—"],
                  ["Pages", String(book.pages)],
                  ["File size", `${book.sizeMB} MB`],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 px-4 py-2.5">
                    <dt className="text-muted-foreground">{k}</dt>
                    <dd className="text-right font-medium">{v}</dd>
                  </div>
                ))}
              </dl>

              <div className="flex gap-2">
                {prev ? (
                  <Link to={`/read/${prev.id}`} className="btn-ghost flex-1 !px-3 !py-2.5" title={prev.title}>
                    <ArrowLeft className="h-4 w-4" /> Prev
                  </Link>
                ) : (
                  <span className="flex-1" />
                )}
                {next && (
                  <Link to={`/read/${next.id}`} className="btn-ghost flex-1 !px-3 !py-2.5" title={next.title}>
                    Next <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
              <p className="text-center text-xs text-muted-foreground">
                Prev / next move along the <span className="font-medium">{cat.name}</span> shelf.
              </p>

              {related.length > 0 && (
                <div>
                  <h3 className="mb-4 font-display text-lg font-semibold">More like this</h3>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-8">
                    {related.slice(0, 4).map((b) => (
                      <BookCard key={b.id} book={b} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

export default Reader;
