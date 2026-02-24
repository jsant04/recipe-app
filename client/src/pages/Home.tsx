import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  searchMeals,
  getCategories,
  getMealsByCategory,
  getRandomMeal,
  type MealSummary,
  type Category,
} from "../lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Skeleton } from "../components/ui/skeleton";
import { Link, useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { useFavorites } from "../features/favorites/useFavorites";

interface HomePageProps {
  searchQuery: string;
}

function MealCard({ meal }: { meal: MealSummary }) {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(meal.idMeal);

  return (
    <Card
      className="group flex flex-col overflow-hidden cursor-pointer border-border/60 bg-card/90 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg"
      onClick={() => navigate(`/meal/${meal.idMeal}`)}
      role="button"
      tabIndex={0}
    >
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        {meal.strMealThumb ? (
          <img
            src={meal.strMealThumb}
            alt={meal.strMeal}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
            No image
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 bg-background/80"
          aria-pressed={active}
          aria-label={active ? "Remove from favorites" : "Add to favorites"}
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(meal.idMeal);
          }}
        >
          <Heart
            className={
              "h-4 w-4" + (active ? " fill-red-500 text-red-500" : " text-foreground")
            }
          />
        </Button>
      </div>
      <CardHeader>
        <CardTitle className="line-clamp-2 text-base">{meal.strMeal}</CardTitle>
        <div className="flex flex-wrap gap-1 text-xs text-muted-foreground">
          {meal.strCategory && <Badge>{meal.strCategory}</Badge>}
          {meal.strArea && <Badge variant="outline">{meal.strArea}</Badge>}
        </div>
      </CardHeader>
      <CardContent className="mt-auto flex items-center justify-between gap-2 pt-0">
        <span className="text-xs text-muted-foreground">View full recipe</span>
        <Button asChild size="sm" variant="outline">
          <Link to={`/meal/${meal.idMeal}`}>View recipe</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function MealSkeleton() {
  return (
    <Card>
      <Skeleton className="aspect-video w-full" />
      <CardHeader>
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="mt-2 h-3 w-1/3" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-24" />
      </CardContent>
    </Card>
  );
}

export function HomePage({ searchQuery }: HomePageProps) {
  const [activeCategory, setActiveCategory] = React.useState<string | null>(null);

  const categoriesQuery = useQuery<{ categories: Category[] | null }>({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });

  const mealsQuery = useQuery<{ meals: MealSummary[] | null }>({
    queryKey: ["meals", { searchQuery, activeCategory }],
    queryFn: async () => {
      if (activeCategory) {
        return getMealsByCategory(activeCategory);
      }
      if (!searchQuery) {
        // Default browse: show a random featured meal
        const data = await getRandomMeal();
        const meals =
          data.meals?.map((meal) => ({
            idMeal: meal.idMeal,
            strMeal: meal.strMeal,
            strMealThumb: meal.strMealThumb ?? null,
            strCategory: meal.strCategory,
            strArea: meal.strArea,
          })) ?? null;
        return { meals };
      }
      return searchMeals(searchQuery);
    },
  });

  const meals = mealsQuery.data?.meals ?? [];

  return (
    <div className="space-y-6" aria-label="Browse recipes">
      <section aria-label="Results" className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">Meals</h2>
        </div>

        {mealsQuery.isLoading && (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <MealSkeleton key={i} />
            ))}
          </div>
        )}

        {!mealsQuery.isLoading && meals.length === 0 && (
          <p className="text-sm text-muted-foreground">
            {searchQuery || activeCategory
              ? "No meals found. Try a different search or category."
              : "Start by searching for a meal or choosing a category."}
          </p>
        )}

        {meals.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {meals.map((meal) => (
              <MealCard key={meal.idMeal} meal={meal} />
            ))}
          </div>
        )}
      </section>

      <section aria-label="Categories" className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-muted-foreground">Categories</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveCategory(null)}
            aria-pressed={activeCategory === null}
          >
            All
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {categoriesQuery.isLoading &&
            Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-7 w-16 rounded-full" />
            ))}
          {categoriesQuery.data?.categories?.map((c) => (
            <Button
              key={c.idCategory}
              variant={activeCategory === c.strCategory ? "default" : "outline"}
              size="sm"
              className="rounded-full"
              onClick={() => setActiveCategory(c.strCategory)}
              aria-pressed={activeCategory === c.strCategory}
            >
              {c.strCategory}
            </Button>
          ))}
        </div>
      </section>
    </div>
  );
}
