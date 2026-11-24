import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const NotFound = () => (
  <div className="flex min-h-screen items-center justify-center bg-background px-6 text-center">
    <div>
      <p className="eyebrow justify-center">Error 404</p>
      <h1 className="mt-4 text-5xl font-semibold md:text-6xl">
        This page isn't on <span className="text-gradient">our shelves.</span>
      </h1>
      <p className="mx-auto mt-5 max-w-md text-lg text-muted-foreground">
        The book or page you're looking for may have been moved or never existed.
      </p>
      <Link to="/library" className="btn-brand mt-8">
        Browse the library <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  </div>
);

export default NotFound;
