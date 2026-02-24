import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getMealById, type MealDetail } from "../lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Skeleton } from "../components/ui/skeleton";
import { useFavorites } from "../features/favorites/useFavorites";
import { Heart, ExternalLink, Search } from "lucide-react";

function MealDetailsSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="aspect-video w-full" />
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
}

export function DetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [searchText, setSearchText] = React.useState("");

  const query = useQuery<{ meals: MealDetail[] | null }>({
    queryKey: ["meal", id],
    enabled: Boolean(id),
    queryFn: () => getMealById(id as string),
  });

  if (!id) return <p>Missing meal id.</p>;

  if (query.isLoading) {
    return <MealDetailsSkeleton />;
  }

  if (query.isError || !query.data?.meals?.[0]) {
    return <p>Could not load meal details.</p>;
  }

  const meal = query.data.meals[0];
  const favorite = isFavorite(meal.idMeal);

  const ingredients: { ingredient: string; measure: string }[] = [];
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}` as keyof MealDetail] as string | null;
    const meas = meal[`strMeasure${i}` as keyof MealDetail] as string | null;
    if (ing && ing.trim()) {
      ingredients.push({ ingredient: ing, measure: meas || "" });
    }
  }

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = searchText.trim();
    navigate({ pathname: "/", search: value ? `?q=${encodeURIComponent(value)}` : "" });
  };

  return (
    <article className="mx-auto max-w-3xl space-y-4" aria-label={meal.strMeal}>
      <form
        onSubmit={handleSearchSubmit}
        className="mb-4 flex w-full max-w-md items-center gap-2 rounded-lg border bg-background/80 px-3 py-2 shadow-sm"
        role="search"
        aria-label="Search recipes"
      >
        <div className="relative w-full">
          <Search className="pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            name="q"
            placeholder="Search meals"
            className="border-0 bg-transparent pl-6 shadow-none focus-visible:ring-0"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
      </form>
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {meal.strMeal}
          </h1>
          <div className="mt-1 flex flex-wrap gap-2 text-sm text-muted-foreground">
            {meal.strCategory && <Badge>{meal.strCategory}</Badge>}
            {meal.strArea && <Badge variant="outline">{meal.strArea}</Badge>}
            {meal.strTags &&
              meal.strTags
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean)
                .map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
          </div>
        </div>
        <Button
          variant={favorite ? "default" : "outline"}
          size="icon"
          onClick={() => toggleFavorite(meal.idMeal)}
          aria-pressed={favorite}
          aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            className={
              "h-4 w-4" +
              (favorite ? " fill-red-500 text-red-500" : " text-foreground")
            }
          />
        </Button>
      </header>

      {meal.strMealThumb && (
        <div className="overflow-hidden rounded-xl border bg-black/40">
          <img
            src={meal.strMealThumb}
            alt={meal.strMeal}
            className="max-h-[480px] w-full object-cover md:max-h-[560px]"
          />
        </div>
      )}

      <section aria-label="Ingredients" className="grid gap-4 md:grid-cols-[minmax(0,1.2fr)_minmax(0,2fr)]">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Ingredients</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1 text-sm">
              {ingredients.map((item) => (
                <li key={item.ingredient} className="flex justify-between gap-2">
                  <span>{item.ingredient}</span>
                  <span className="text-muted-foreground">{item.measure}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-line text-sm leading-relaxed">
              {meal.strInstructions}
            </p>
          </CardContent>
        </Card>
      </section>

      {meal.strYoutube && (
        <section aria-label="Video" className="space-y-2">
          <h2 className="text-sm font-semibold">Video</h2>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="inline-flex items-center gap-1"
          >
            <a href={meal.strYoutube} target="_blank" rel="noreferrer">
              Watch on YouTube
              <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
        </section>
      )}
    </article>
  );
}
