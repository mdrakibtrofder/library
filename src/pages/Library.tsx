import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowDownAZ, LayoutGrid, Search, Users, X } from "lucide-react";
import BookCard from "@/components/BookCard";
import BookRow from "@/components/BookRow";
import {
  allAuthors, authorSortKey, books, categories, searchText, slugify, titleSortKey, type Book,
} from "@/lib/catalog";
import { useReveal } from "@/hooks/use-reveal";

type View = "category" | "title" | "author";

const initials = (name: string) => {
  const parts = name.split(" ").filter(Boolean);
  return (parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : parts[0].slice(0, 2)).toUpperCase();
};

const VIEWS: { id: View; label: string; icon: typeof LayoutGrid }[] = [
  { id: "category", label: "Category", icon: LayoutGrid },
  { id: "title", label: "Title A–Z", icon: ArrowDownAZ },
  { id: "author", label: "Author", icon: Users },
];

const Library = () => {
  const [params, setParams] = useSearchParams();
  const view = (VIEWS.some((v) => v.id === params.get("view")) ? params.get("view") : "category") as View;
  const q = params.get("q") ?? "";
  const cat = params.get("cat") ?? "";

  const update = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    setParams(next, { replace: true });
  };

  const filtered = useMemo(() => {
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    return books.filter(
      (b) => (!cat || b.category === cat) && terms.every((t) => searchText(b).includes(t)),
    );
  }, [q, cat]);

  useReveal(`${view}|${q}|${cat}`);

  const byTitle = useMemo(() => {
    const sorted = [...filtered].sort((a, b) => titleSortKey(a).localeCompare(titleSortKey(b)));
    const groups = new Map<string, Book[]>();
    sorted.forEach((b) => {
      const L = titleSortKey(b)[0]?.toUpperCase() ?? "#";
      const key = /[A-Z]/.test(L) ? L : "#";
      groups.set(key, [...(groups.get(key) ?? []), b]);
    });
    return Array.from(groups.entries());
  }, [filtered]);

  const byAuthor = useMemo(() => {
    const ids = new Set(filtered.map((b) => b.id));
    return allAuthors()
      .map((name) => [name, books.filter((b) => ids.has(b.id) && b.authors.includes(name))] as const)
      .filter(([, list]) => list.length > 0);
  }, [filtered]);

  const byCategory = useMemo(
    () =>
      categories
        .map((c) => [c, filtered.filter((b) => b.category === c.id).sort((a, b) => titleSortKey(a).localeCompare(titleSortKey(b)))] as const)
        .filter(([, list]) => list.length > 0),
    [filtered],
  );

  const letters = useMemo(() => {
    if (view === "title") return byTitle.map(([l]) => l);
    if (view === "author") return Array.from(new Set(byAuthor.map(([n]) => authorSortKey(n)[0].toUpperCase())));
    return [];
  }, [view, byTitle, byAuthor]);

  const jump = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  const activeCat = categories.find((c) => c.id === cat);

  return (
    <div className="px-5 pb-24 pt-28 sm:px-8 md:pt-36">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="reveal mb-10">
          <div className="eyebrow mb-5">
            <span className="text-primary">Library</span>
            <span className="h-px w-8 bg-border" />
            {filtered.length} {filtered.length === 1 ? "book" : "books"}
            {activeCat ? ` · ${activeCat.name}` : ""}
          </div>
          <h1 className="text-4xl font-semibold leading-[1.05] md:text-6xl">
            Browse the <span className="text-gradient">collection.</span>
          </h1>
        </div>

        {/* Controls */}
        <div className="sticky top-[72px] z-30 -mx-5 border-y bg-background/90 px-5 py-4 backdrop-blur-xl sm:-mx-8 sm:px-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="inline-flex w-full rounded-full border bg-card p-1 shadow-sm lg:w-auto" role="tablist" aria-label="Arrange books by">
              {VIEWS.map((v) => (
                <button
                  key={v.id}
                  role="tab"
                  aria-selected={view === v.id}
                  onClick={() => update({ view: v.id })}
                  className={`inline-flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors lg:flex-none ${
                    view === v.id ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <v.icon className="h-4 w-4" /> {v.label}
                </button>
              ))}
            </div>

            <div className="flex flex-1 flex-col gap-3 sm:flex-row lg:max-w-2xl lg:justify-end">
              <label className="flex min-w-0 flex-1 items-center gap-2 rounded-full border bg-card px-4 focus-within:border-primary/50">
                <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                <input
                  value={q}
                  onChange={(e) => update({ q: e.target.value || null })}
                  placeholder="Search title, author or topic…"
                  aria-label="Search books"
                  className="min-w-0 flex-1 bg-transparent py-2.5 text-sm outline-none placeholder:text-muted-foreground/70"
                />
                {q && (
                  <button onClick={() => update({ q: null })} aria-label="Clear search" className="text-muted-foreground hover:text-foreground">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </label>
              <select
                value={cat}
                onChange={(e) => update({ cat: e.target.value || null })}
                aria-label="Filter by category"
                className="rounded-full border bg-card px-4 py-2.5 text-sm outline-none focus:border-primary/50"
              >
                <option value="">All categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {letters.length > 0 && (
            <div className="mx-auto mt-3 flex max-w-7xl gap-1 overflow-x-auto scrollbar-none" aria-label="Jump to letter">
              {letters.map((l) => (
                <button
                  key={l}
                  onClick={() => jump(`${view}-${l}`)}
                  className="h-8 min-w-8 shrink-0 rounded-full border bg-card px-2 font-mono text-xs font-semibold text-muted-foreground hover:border-primary/40 hover:text-primary"
                >
                  {l}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Results */}
        <div className="mt-12">
          {filtered.length === 0 && (
            <div className="surface mx-auto max-w-lg p-10 text-center">
              <p className="font-display text-2xl font-semibold">No books found</p>
              <p className="mt-2 text-muted-foreground">Try a different word, or clear the filters.</p>
              <button onClick={() => setParams({ view }, { replace: true })} className="btn-brand mt-6">
                Clear filters
              </button>
            </div>
          )}

          {view === "category" &&
            byCategory.map(([c, list]) => (
              <section key={c.id} id={`category-${c.id}`} className="mb-16">
                <div className="reveal mb-6 flex items-center gap-4">
                  <span className="icon-tile h-11 w-11 shrink-0">
                    <c.icon className="h-5 w-5 text-primary" />
                  </span>
                  <div className="min-w-0">
                    <h2 className="text-2xl font-semibold md:text-3xl">{c.name}</h2>
                    <p className="text-sm text-muted-foreground">{c.blurb}</p>
                  </div>
                  <span className="chip ml-auto shrink-0">{list.length}</span>
                </div>
                <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                  {list.map((b, i) => (
                    <BookCard key={b.id} book={b} delay={(i % 6) * 50} />
                  ))}
                </div>
              </section>
            ))}

          {view === "title" &&
            byTitle.map(([letter, list]) => (
              <section key={letter} id={`title-${letter}`} className="mb-12 scroll-mt-52">
                <div className="reveal mb-4 flex items-center gap-4">
                  <span className="font-display text-5xl font-semibold text-gradient">{letter}</span>
                  <span className="h-px flex-1 bg-border" />
                </div>
                <div className="grid gap-3">
                  {list.map((b) => (
                    <div key={b.id} className="reveal">
                      <BookRow book={b} />
                    </div>
                  ))}
                </div>
              </section>
            ))}

          {view === "author" &&
            byAuthor.map(([name, list], idx) => {
              const initial = authorSortKey(name)[0].toUpperCase();
              const firstOfLetter = idx === 0 || authorSortKey(byAuthor[idx - 1][0])[0].toUpperCase() !== initial;
              return (
                <section key={name} id={firstOfLetter ? `author-${initial}` : `author-${slugify(name)}`} className="mb-12 scroll-mt-52">
                  <div className="reveal mb-5 flex items-center gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary font-display text-lg font-semibold text-primary-foreground">
                      {initials(name)}
                    </span>
                    <div>
                      <h2 className="text-2xl font-semibold">{name}</h2>
                      <p className="text-sm text-muted-foreground">
                        {list.length} {list.length === 1 ? "book" : "books"}
                      </p>
                    </div>
                    <span className="h-px flex-1 bg-border" />
                  </div>
                  <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                    {list.map((b, i) => (
                      <BookCard key={b.id} book={b} delay={(i % 6) * 50} showCategory />
                    ))}
                  </div>
                </section>
              );
            })}
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Looking for something specific?{" "}
          <Link to="/library" className="font-medium text-primary hover:underline">
            Reset all filters
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Library;
