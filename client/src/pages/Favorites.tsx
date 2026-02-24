import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllFavorites } from "../features/favorites/db";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Skeleton } from "../components/ui/skeleton";
import { Link, useNavigate } from "react-router-dom";
import { HeartOff } from "lucide-react";
import { useFavorites } from "../features/favorites/useFavorites";

function FavoriteSkeleton() {
  return (
    <Card>
      <Skeleton className="aspect-video w-full" />
      <CardHeader>
        <Skeleton className="h-4 w-3/4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-24" />
      </CardContent>
    </Card>
  );
}

export function FavoritesPage() {
  const navigate = useNavigate();
  const { toggleFavorite } = useFavorites();

  const { data, isLoading } = useQuery({
    queryKey: ["favorites", "list"],
    queryFn: () => getAllFavorites(),
  });

  const meals = data ?? [];

  return (
    <section className="space-y-4" aria-label="Favorite meals">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Favorites</h1>
          <p className="text-sm text-muted-foreground">
            Saved meals are available even when youre offline.
          </p>
        </div>
      </header>

      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <FavoriteSkeleton key={i} />
          ))}
        </div>
      )}

      {!isLoading && meals.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border bg-card p-6 text-center text-sm text-muted-foreground">
          <HeartOff className="h-8 w-8" />
          <p>No favorites yet. Add some recipes to access them offline.</p>
        </div>
      )}

      {meals.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {meals.map((meal) => (
            <Card
              key={meal.idMeal}
              className="group flex flex-col overflow-hidden cursor-pointer border-border/60 bg-card/90 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg"
              onClick={() => navigate(`/meal/${meal.idMeal}`)}
              role="button"
              tabIndex={0}
            >
              {meal.strMealThumb && (
                <img
                  src={meal.strMealThumb}
                  alt={meal.strMeal}
                  loading="lazy"
                  className="aspect-video w-full object-cover"
                />
              )}
              <CardHeader>
                <CardTitle className="line-clamp-2 text-base">
                  {meal.strMeal}
                </CardTitle>
                <div className="flex flex-wrap gap-1 text-xs text-muted-foreground">
                  {meal.strCategory && <Badge>{meal.strCategory}</Badge>}
                  {meal.strArea && <Badge variant="outline">{meal.strArea}</Badge>}
                </div>
              </CardHeader>
              <CardContent className="mt-auto flex items-center justify-between gap-2 pt-0">
                <Button asChild size="sm" variant="outline">
                  <Link to={`/meal/${meal.idMeal}`}>View recipe</Link>
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label="Remove from favorites"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(meal.idMeal);
                  }}
                >
                  <HeartOff className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
