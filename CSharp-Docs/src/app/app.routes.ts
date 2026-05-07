import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

import type { Slug } from './data/slugs';
import { getStructure } from './data/structures';

/**
 * Resolver for /s/:slug. Looks up the slug in the registry and:
 *
 *   • returns { structure: Structure } on hit — Angular passes it through
 *     to the component as a `structure` data field (and via component
 *     input binding, as the `structure` input).
 *
 *   • redirects to /404 on miss, preserving the URL the user typed in
 *     the address bar so they can correct it.
 *
 * Defined inline as a function so we don't need a separate file.
 */
function structureResolver(route: ActivatedRouteSnapshot) {
  const slug = route.paramMap.get('slug') as Slug | null;
  const router = inject(Router);

  if (!slug) {
    router.navigate(['/404']);
    return null;
  }

  const structure = getStructure(slug);
  if (!structure) {
    router.navigate(['/404']);
    return null;
  }

  return structure;
}

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
  {
    path: 's/:slug',
    loadComponent: () =>
      import('./pages/structure-page').then(
        m => m.StructurePageComponent,
      ),
    resolve: { structure: structureResolver },
    data: { animation: 'structure' },
  },
  {
    path: '404',
    loadComponent: () =>
      import('./pages/not-found-page').then(
        m => m.NotFoundPageComponent,
      ),
    data: { animation: '404', title: 'Forte — Not found' },
  },
  { path: '**', redirectTo: '/404' },
];