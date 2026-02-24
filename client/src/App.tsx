import React from "react";
import { Link, Route, Routes, useLocation, useSearchParams } from "react-router-dom";
import { HomePage } from "./pages/Home";
import { DetailsPage } from "./pages/Details";
import { FavoritesPage } from "./pages/Favorites";
import { ThemeToggle } from "./components/theme-toggle";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { cn } from "./components/ui/utils";
import { Search, Heart } from "lucide-react";

export default function App() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = React.useState(() => searchParams.get("q") ?? "");

  React.useEffect(() => {
    const urlValue = searchParams.get("q") ?? "";
    setSearch((prev) => (prev === urlValue ? prev : urlValue));
  }, [searchParams]);

  const isHome = location.pathname === "/";

  const handleSearchSubmit = React.useCallback(
    (raw: string) => {
      const value = raw.trim();
      setSearch(value);
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (value) {
          next.set("q", value);
        } else {
          next.delete("q");
        }
        return next;
      });
    },
    [setSearchParams]
  );

  return (
    <div className="app-gradient-shell text-foreground">
      <header className="sticky top-0 z-20 border-b border-border/60 bg-background/90 pb-[10px] backdrop-blur supports-[backdrop-filter]:bg-background/70">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 pt-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <Link to="/" className="flex items-center gap-2">
              <img
                src="/icons/pantrypro-logo.png"
                alt="PantryPro logo"
                className="h-8 w-8 rounded-md shadow-sm"
              />
              <div className="flex flex-col leading-tight text-left">
                <span className="font-semibold tracking-tight text-lg">
                  PantryPro
                </span>
                <span className="text-[9px] font-medium tracking-[0.25em] text-muted-foreground uppercase sm:text-[10px]">
                  Where every recipe feels like home
                </span>
              </div>
            </Link>
          </div>
          <div className="hidden items-center gap-3 sm:flex sm:justify-end">
            {isHome && (
              <form
                className="flex items-center gap-2"
                role="search"
                aria-label="Search recipes"
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.currentTarget as HTMLFormElement;
                  const data = new FormData(form);
                  const value = (data.get("q") as string) ?? "";
                  handleSearchSubmit(value);
                }}
              >
                <div className="relative w-56 lg:w-64">
                  <Search className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    name="q"
                    placeholder="Search meals"
                    className="h-9 rounded-full border bg-background/80 pl-8"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <Button
                  type="submit"
                  size="icon"
                  className="shrink-0"
                  aria-label="Search"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </form>
            )}

            <Link to="/favorites" className="hidden md:inline-flex">
              <Button
                size="icon"
                variant="ghost"
                aria-label="View favorites"
              >
                <Heart className="h-4 w-4" />
              </Button>
            </Link>

            <ThemeToggle />
          </div>
        </div>

        {isHome && (
          <div className="mx-auto mt-2 flex max-w-5xl items-center gap-2 px-4 sm:hidden">
            <Link to="/favorites">
              <Button
                size="icon"
                variant="ghost"
                aria-label="View favorites"
              >
                <Heart className="h-4 w-4" />
              </Button>
            </Link>

            <ThemeToggle />

            <form
              className="flex flex-1 items-center gap-2"
              role="search"
              aria-label="Search recipes"
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget as HTMLFormElement;
                const data = new FormData(form);
                const value = (data.get("q") as string) ?? "";
                handleSearchSubmit(value);
              }}
            >
              <div className="relative w-full">
                <Search className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  name="q"
                  placeholder="Search meals"
                  className="h-9 rounded-full border bg-background/80 pl-8"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Button
                type="submit"
                size="icon"
                className="shrink-0"
                aria-label="Search"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>
        )}
      </header>

      <main id="main-content" className="mx-auto max-w-5xl px-4 py-4">
        <section>
          <Routes>
            <Route path="/" element={<HomePage searchQuery={search} />} />
            <Route path="/meal/:id" element={<DetailsPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="*" element={<p>Not found.</p>} />
          </Routes>
        </section>
      </main>
    </div>
  );
}
