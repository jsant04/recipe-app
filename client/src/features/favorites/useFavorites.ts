// Re-export the React hook and provider from the TSX module.
// This keeps import paths like "../features/favorites/useFavorites" working
// while ensuring this .ts file contains no JSX.

export * from "./useFavorites.tsx";
