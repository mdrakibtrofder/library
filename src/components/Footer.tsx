import { Link } from "react-router-dom";
import { ArrowUp, Github } from "lucide-react";
import Logo from "./Logo";
import { categories, stats } from "@/lib/catalog";

const Footer = () => (
  <footer className="relative overflow-hidden border-t bg-card">
    <div className="absolute inset-x-0 top-0 h-1 bg-brand" />
    <div className="mx-auto max-w-7xl px-5 pb-8 pt-16 sm:px-8">
      <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr]">
        <div>
          <Logo size={40} />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
            An open shelf of {stats.books} computer science books across {stats.categories} categories — browse by
            category, title or author, and read right in your browser.
          </p>
          <div className="mt-6 flex gap-2">
            <a
              href="https://github.com/mdrakibtrofder"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="flex h-10 w-10 items-center justify-center rounded-full border transition-colors hover:border-primary/40 hover:text-primary"
            >
              <Github className="h-4 w-4" />
            </a>
            <a
              href="https://riresearchlab.github.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center rounded-full border px-4 text-sm font-medium transition-colors hover:border-primary/40 hover:text-primary"
            >
              RI Research Lab
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          <div>
            <h4 className="eyebrow mb-4 !text-foreground">Browse</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                ["All books", "/library"],
                ["By category", "/library?view=category"],
                ["Titles A–Z", "/library?view=title"],
                ["By author", "/library?view=author"],
              ].map(([label, to]) => (
                <li key={label}>
                  <Link to={to} className="text-muted-foreground transition-colors hover:text-primary">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-1 sm:col-span-2">
            <h4 className="eyebrow mb-4 !text-foreground">Shelves</h4>
            <ul className="grid gap-x-6 gap-y-2.5 text-sm sm:grid-cols-2">
              {categories.map((c) => (
                <li key={c.id}>
                  <Link
                    to={`/library?view=category&cat=${c.id}`}
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
        <p>© {new Date().getFullYear()} RI Library. Books remain the property of their respective authors and publishers.</p>
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="inline-flex items-center gap-1.5 font-medium hover:text-primary"
        >
          Back to top <ArrowUp className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  </footer>
);

export default Footer;
