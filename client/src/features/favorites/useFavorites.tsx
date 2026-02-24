import React from "react";
import { toast } from "sonner";
import { getAllFavorites, getFavorite, removeFavorite, saveFavorite } from "./db";
import { getMealById } from "../../lib/api";

interface FavoritesContextValue {
  favorites: string[];
  isFavorite: (idMeal: string) => boolean;
  toggleFavorite: (idMeal: string) => Promise<void>;
}

const FavoritesContext = React.createContext<FavoritesContextValue | undefined>(
  undefined
);

export function FavoritesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [favorites, setFavorites] = React.useState<string[]>([]);

  React.useEffect(() => {
    getAllFavorites()
      .then((items) => setFavorites(items.map((m) => m.idMeal)))
      .catch((err) => console.error("Failed to load favorites", err));
  }, []);

  const isFavorite = React.useCallback(
    (idMeal: string) => favorites.includes(idMeal),
    [favorites]
  );

  const toggleFavorite = React.useCallback(
    async (idMeal: string) => {
      if (favorites.includes(idMeal)) {
        await removeFavorite(idMeal);
        setFavorites((prev) => prev.filter((id) => id !== idMeal));
        toast("Removed from favorites");
      } else {
        // Try get cached favorite first
        const existing = await getFavorite(idMeal);
        if (existing) {
          await saveFavorite(existing);
          setFavorites((prev) => [...prev, idMeal]);
          toast.success("Saved to favorites");
          return;
        }

        // If not cached, fetch details (online only)
        try {
          const data = await getMealById(idMeal);
          const meal = data.meals?.[0];
          if (!meal) throw new Error("Meal not found");
          await saveFavorite(meal as any);
          setFavorites((prev) => [...prev, idMeal]);
          toast.success("Saved to favorites");
        } catch (err) {
          console.error("Failed to favorite", err);
          toast.error("Could not save favorite (need connection once).");
        }
      }
    },
    [favorites]
  );

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = React.useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}
