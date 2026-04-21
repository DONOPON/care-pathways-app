import { createRouter, createHashHistory } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

// Hash history for maximum stability on GitHub Pages.
// URLs look like https://user.github.io/portal-salud/#/login
// No 404.html trick needed, deep refresh always works.
const hashHistory = createHashHistory();

export const router = createRouter({
  routeTree,
  history: hashHistory,
  defaultPreload: "intent",
  scrollRestoration: true,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
