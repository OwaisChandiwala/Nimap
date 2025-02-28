import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

export function Navigation() {
  const [location] = useLocation();

  return (
    <nav className="flex h-16 items-center px-4 border-b bg-background">
      <div className="flex items-center space-x-4 lg:space-x-6">
        <Link
          href="/"
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            location === "/" ? "text-primary" : "text-muted-foreground"
          )}
        >
          Products
        </Link>
        <Link
          href="/categories"
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            location === "/categories" ? "text-primary" : "text-muted-foreground"
          )}
        >
          Categories
        </Link>
      </div>
    </nav>
  );
}
