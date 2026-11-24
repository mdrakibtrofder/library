import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, ArrowDownAZ, BookOpen, Library, Search, Users, X } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import BookCard from "@/components/BookCard";
import BookCover from "@/components/BookCover";
import { FEATURED_IDS, bookById, books, categories, stats } from "@/lib/catalog";
import { useRecent } from "@/hooks/use-recent";

const featured = FEATURED_IDS.map((id) => bookById(id)).filter((b): b is NonNullable<typeof b> => !!b);
const fan = featured.slice(0, 3);

const arrangements = [
  { icon: Library, title: "By category", body: "Shelves grouped by subject — algorithms, systems, networks, AI and more.", to: "/library?view=category" },
  { icon: ArrowDownAZ, title: "By title (A–Z)", body: "Know the book you want? Jump straight to it alphabetically.", to: "/library?view=title" },
  { icon: Users, title: "By author", body: "Follow the writers you trust and see everything they've written.", to: "/library?view=author" },
];

const Home = () => {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const { ids, clear } = useRecent();
  const recent = ids.map((id) => bookById(id)).filter((b): b is NonNullable<typeof b> => !!b);

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    navigate(q.trim() ? `/library?q=${encodeURIComponent(q.trim())}` : "/library");
  };

  const statItems = [
    { value: stats.books, label: "Books" },
    { value: stats.categories, label: "Categories" },
    { value: stats.authors, label: "Authors" },
    { value: stats.pages.toLocaleString(), label: "Pages to read" },
  ];

  const marquee = [...categories, ...categories];

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden px-5 pb-20 pt-32 sm:px-8 md:pb-28 md:pt-40">
        <div aria-hidden className="grid-bg pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_top,black_35%,transparent_75%)]" />
        <div aria-hidden className="pointer-events-none absolute -right-32 -top-32 -z-10 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,hsl(36_88%_55%/0.22),transparent_65%)]" />

        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <span className="eyebrow mb-6 rounded-full border bg-card px-3.5 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Open shelf · free to read
            </span>
            <h1 className="text-5xl font-semibold leading-[1.02] md:text-6xl lg:text-7xl">
              The books that built <span className="text-gradient">computer science.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Explore {stats.books} essential CS books — algorithms, systems, networks, databases, AI and DevOps.
              Browse by category, title or author, then read each one right here.
            </p>

            <form onSubmit={onSearch} className="mt-8 flex max-w-xl items-center gap-2 rounded-full border bg-card p-1.5 shadow-[var(--shadow-soft)] focus-within:border-primary/50">
              <Search className="ml-3.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by title, author or topic…"
                aria-label="Search books"
                className="min-w-0 flex-1 bg-transparent px-1 py-2 text-sm outline-none placeholder:text-muted-foreground/70"
              />
              {q && (
                <button type="button" onClick={() => setQ("")} aria-label="Clear search" className="rounded-full p-1.5 text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              )}
              <button type="submit" className="btn-brand !px-5 !py-2.5">
                Search
              </button>
            </form>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/library" className="btn-brand">
                Browse the library <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/library?view=author" className="btn-ghost">
                <Users className="h-4 w-4" /> By author
              </Link>
            </div>
          </div>

          {/* Cover fan + stats */}
          <div className="relative mx-auto w-full max-w-md">
            <div className="relative mx-auto h-[330px] w-full sm:h-[380px]">
              {fan.map((b, i) => (
                <div
                  key={b.id}
                  className="absolute top-1/2 w-[44%]"
                  style={{
                    left: `${[4, 28, 52][i]}%`,
                    transform: `translateY(-50%) rotate(${[-9, -1, 8][i]}deg)`,
                    zIndex: i === 1 ? 3 : i === 0 ? 1 : 2,
                  }}
                >
                  <div className="animate-float-y" style={{ animationDelay: `${i * 0.8}s` }}>
                    <Link to={`/read/${b.id}`} aria-label={b.title} className="block">
                      <BookCover book={b} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <dl className="surface mt-2 grid grid-cols-2 gap-3 p-4 sm:grid-cols-4">
              {statItems.map((s) => (
                <div key={s.label} className="rounded-xl bg-secondary/70 px-3 py-3 text-center">
                  <dd className="font-display text-2xl font-semibold tabular-nums">{s.value}</dd>
                  <dt className="mt-0.5 text-[11px] uppercase tracking-wider text-muted-foreground">{s.label}</dt>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="overflow-hidden border-y bg-card/70 py-4" aria-hidden>
        <div className="animate-marquee flex w-max gap-10 whitespace-nowrap">
          {marquee.map((c, i) => (
            <span key={`${c.id}-${i}`} className="inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              <c.icon className="h-3.5 w-3.5 text-accent" /> {c.name}
            </span>
          ))}
        </div>
      </div>

      {/* RECENT */}
      {recent.length > 0 && (
        <section className="px-5 pt-20 sm:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6 flex items-end justify-between">
              <h2 className="text-2xl font-semibold md:text-3xl">Continue where you left off</h2>
              <button onClick={clear} className="text-sm text-muted-foreground hover:text-foreground">
                Clear
              </button>
            </div>
            <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {recent.slice(0, 6).map((b, i) => (
                <BookCard key={b.id} book={b} delay={i * 60} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SHELVES */}
      <section id="shelves" className="px-5 py-24 sm:px-8 md:py-32">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            index="01"
            eyebrow="Shelves"
            title={<>Pick a shelf, <span className="text-gradient">start reading.</span></>}
            description="Every book is filed under a subject so you can explore a field end to end."
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c, i) => {
              const count = books.filter((b) => b.category === c.id).length;
              const Icon = c.icon;
              return (
                <Link
                  key={c.id}
                  to={`/library?view=category&cat=${c.id}`}
                  className="reveal surface surface-hover group flex items-start gap-5 p-6"
                  style={{ "--d": `${(i % 3) * 70}ms` } as React.CSSProperties}
                >
                  <span className="icon-tile h-14 w-14 shrink-0">
                    <Icon className="h-6 w-6 text-primary" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-semibold leading-snug">{c.name}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{c.blurb}</p>
                    <p className="mt-3 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-primary">
                      {count} {count === 1 ? "book" : "books"}
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="border-y bg-card/60 px-5 py-24 sm:px-8 md:py-32">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            index="02"
            eyebrow="Featured reads"
            title={<>Start with the <span className="text-gradient">classics.</span></>}
            description="Landmark textbooks that anchor most computer science curricula."
            action={
              <Link to="/library" className="btn-ghost">
                See all {stats.books} books <ArrowRight className="h-4 w-4" />
              </Link>
            }
          />
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
            {featured.map((b, i) => (
              <BookCard key={b.id} book={b} delay={i * 60} />
            ))}
          </div>
        </div>
      </section>

      {/* ARRANGEMENTS */}
      <section className="px-5 py-24 sm:px-8 md:py-32">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            index="03"
            eyebrow="Browse your way"
            title={<>Three ways to <span className="text-gradient">find a book.</span></>}
          />
          <div className="grid gap-5 md:grid-cols-3">
            {arrangements.map((a, i) => (
              <Link
                key={a.title}
                to={a.to}
                className="reveal surface surface-hover group p-7"
                style={{ "--d": `${i * 80}ms` } as React.CSSProperties}
              >
                <span className="icon-tile h-12 w-12">
                  <a.icon className="h-5 w-5 text-primary" />
                </span>
                <h3 className="mt-5 text-xl font-semibold">{a.title}</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">{a.body}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                  Open <BookOpen className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
