import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ArrowUpRight, Menu, X } from "lucide-react";
import Logo from "./Logo";

const links = [
  { label: "Home", to: "/" },
  { label: "Categories", to: "/library?view=category" },
  { label: "Titles A–Z", to: "/library?view=title" },
  { label: "Authors", to: "/library?view=author" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname, search } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname, search]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (to: string) => {
    const [p, q] = to.split("?");
    if (p === "/") return pathname === "/";
    if (pathname !== p) return false;
    return !q || search.includes(q);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || open ? "border-b border-border/70 bg-background/85 backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link to="/" aria-label="RI Library — home">
          <Logo size={36} />
        </Link>

        <div className="hidden items-center gap-1 rounded-full border bg-card/80 p-1 shadow-sm backdrop-blur lg:flex">
          {links.map((l) => (
            <NavLink
              key={l.label}
              to={l.to}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                isActive(l.to) ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden lg:flex">
          <Link to="/library" className="btn-brand !px-5 !py-2.5">
            Browse all books <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full border bg-card lg:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="border-t bg-background lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-5 py-4 sm:px-8">
            {links.map((l) => (
              <NavLink
                key={l.label}
                to={l.to}
                className={`rounded-xl px-4 py-3 text-base font-medium ${
                  isActive(l.to) ? "bg-secondary text-foreground" : "text-muted-foreground"
                }`}
              >
                {l.label}
              </NavLink>
            ))}
            <Link to="/library" className="btn-brand mt-3">
              Browse all books <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
