import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling, withHashLocation, 
  withViewTransitions,
} from '@angular/router';

import { routes } from './app.routes';

/**
 * App-wide providers.
 *
 *   • provideAnimations() — Angular Animations runtime, used for our
 *     route transition trigger and any component-level @triggers we add.
 *
 *   • provideRouter() options:
 *       withComponentInputBinding — lets us bind route params straight to
 *         component inputs (we'll use this for /s/:slug in step 4)
 *       withViewTransitions       — opt-in to the View Transitions API for
 *         routes; gracefully no-ops on browsers without support
 *       withInMemoryScrolling     — restore scroll on back/forward, anchor
 *         scrolling on hash links (used by the right-rail TOC later)
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideRouter(
      routes,
      withComponentInputBinding(), 
      withHashLocation(), 
      withViewTransitions(),
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
      }),
    ),
  ],
};