import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster, toast } from "sonner";
import { queryClient } from "./lib/queryClient";
import { ThemeProvider } from "./components/theme-toggle";
import { FavoritesProvider } from "./features/favorites/useFavorites";
import App from "./App";
import "./styles/globals.css";

function OnlineStatusListener() {
  React.useEffect(() => {
    function handleOffline() {
      toast.warning("You are offline. Favorites still work.");
    }
    function handleOnline() {
      toast.success("Back online");
    }
    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);
    if (!navigator.onLine) {
      handleOffline();
    }
    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  return null;
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <FavoritesProvider>
            <OnlineStatusListener />
            <App />
            <Toaster richColors position="top-center" />
          </FavoritesProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>
);
