import {
  Binary, Brain, Cloud, Code2, Cpu, Database, FileText, Layers, Network, Sigma, Workflow,
  type LucideIcon,
} from "lucide-react";
import raw from "@/data/books.json";

export interface Book {
  id: string;
  title: string;
  subtitle: string;
  authors: string[];
  category: string;
  pages: number;
  sizeMB: number;
  edition: string;
  description: string;
  file: string;
}

export interface Category {
  id: string;
  name: string;
  blurb: string;
  icon: LucideIcon;
  /** Base hue (0-360) used for covers and tints. */
  hue: number;
}

export const categories: Category[] = [
  { id: "algorithms", name: "Algorithms & Data Structures", blurb: "Core techniques for solving problems efficiently.", icon: Binary, hue: 160 },
  { id: "programming", name: "Programming Languages", blurb: "C, Java and the craft of writing good code.", icon: Code2, hue: 18 },
  { id: "software-engineering", name: "Software Engineering", blurb: "Process, requirements, design and quality.", icon: Layers, hue: 215 },
  { id: "systems", name: "Systems & Architecture", blurb: "Operating systems, hardware and digital logic.", icon: Cpu, hue: 245 },
  { id: "networking", name: "Computer Networks", blurb: "How data moves across the Internet.", icon: Network, hue: 185 },
  { id: "databases", name: "Databases", blurb: "Modeling, querying and storing data.", icon: Database, hue: 32 },
  { id: "system-design", name: "System Design", blurb: "Scalable, reliable distributed systems.", icon: Workflow, hue: 285 },
  { id: "devops", name: "DevOps & Cloud", blurb: "Containers, Kubernetes and operations.", icon: Cloud, hue: 205 },
  { id: "ai-ml", name: "AI & Machine Learning", blurb: "Intelligent systems, learning and vision.", icon: Brain, hue: 265 },
  { id: "theory", name: "Theory & Mathematics", blurb: "Computation, discrete math and numerics.", icon: Sigma, hue: 350 },
  { id: "guides", name: "Guides & Cheat Sheets", blurb: "Short references and study guides.", icon: FileText, hue: 75 },
];

export const books: Book[] = raw as Book[];

export const categoryById = (id: string): Category =>
  categories.find((c) => c.id === id) ?? categories[0];

export const bookById = (id: string): Book | undefined => books.find((b) => b.id === id);

/** URL of the PDF, relative to the page so it works from any sub-folder. */
export const pdfUrl = (b: Book) => `${import.meta.env.BASE_URL}resources/${encodeURIComponent(b.file)}`;

export const authorLine = (b: Book, max = 2) =>
  b.authors.length <= max ? b.authors.join(", ") : `${b.authors[0]} et al.`;

/** "Thomas H. Cormen" -> "Cormen" (used for alphabetical author ordering). */
const surname = (name: string) => name.trim().split(/\s+/).slice(-1)[0];
export const authorSortKey = (name: string) => `${surname(name)} ${name}`.toLowerCase();

export const titleSortKey = (b: Book) => b.title.replace(/^(the|a|an)\s+/i, "").toLowerCase();

export const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const searchText = (b: Book) =>
  [b.title, b.subtitle, b.edition, b.authors.join(" "), categoryById(b.category).name, b.description]
    .join(" ")
    .toLowerCase();

export const allAuthors = (): string[] =>
  Array.from(new Set(books.flatMap((b) => b.authors))).sort((a, b) => authorSortKey(a).localeCompare(authorSortKey(b)));

export const stats = {
  books: books.length,
  categories: new Set(books.map((b) => b.category)).size,
  authors: new Set(books.flatMap((b) => b.authors)).size,
  pages: books.reduce((n, b) => n + b.pages, 0),
};

export const FEATURED_IDS = [
  "introduction-to-algorithms",
  "operating-system-concepts",
  "designing-data-intensive-applications",
  "artificial-intelligence-a-modern-approach",
  "clean-code",
  "computer-networking",
];
