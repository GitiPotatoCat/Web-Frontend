import { Routes } from '@angular/router';

/**
 * Top-level routes. We keep this surface deliberately tiny in step 2 — only
 * the home placeholder. Namespace landings and structure pages are added in
 * later steps. Each route attaches a `data.animation` key so the route-
 * transition trigger can distinguish them.
 */
export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./pages/home-page').then(
        m => m.HomePageComponent,
      ),
    data: { animation: 'home', title: 'Forte — the C# reference' },
  },

  // Catch-all → home for now. Step 8 swaps this for a real 404.
  { path: '**', redirectTo: '' },
];