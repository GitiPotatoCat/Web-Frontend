import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-not-found-page',
    standalone: true,
    imports: [RouterLink],
    template: `
    <section class="nf">
      <p class="eyebrow">Error 404 · structure not found</p>
      <h1 class="fr-display-l text-grad-brand">Off the staff.</h1>
      <p class="nf-lead">
        That page isn't part of the reference. Either the URL is wrong, or
        the structure hasn't been authored yet — Forte is being written in
        the open and not every page exists yet.
      </p>
      <div class="nf-actions">
        <a class="nf-cta" routerLink="/">
          <span class="material-symbols-rounded">home</span>
          Back to home
        </a>
      </div>
    </section>
  `,
    styles: [`
    :host { display: block; padding: var(--space-16) var(--space-6); }
    .nf { max-width: var(--content-max); margin: 0 auto; }
    .nf h1 { margin: var(--space-2) 0 var(--space-5); max-width: 14ch; }
    .nf-lead {
      font: var(--font-body); font-size: 15px; color: var(--fg-muted);
      max-width: 56ch; margin: 0 0 var(--space-8);
    }
    .nf-cta {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 10px 16px;
      background: var(--grad-brand);
      color: var(--fg-on-grad);
      border-radius: var(--r-pill);
      font: 500 14px/1 'Geist', system-ui, sans-serif;
      text-decoration: none;
      box-shadow: var(--shadow-2);
      transition: transform var(--dur-base) var(--ease-emphasis), box-shadow var(--dur-base);
    }
    .nf-cta:hover { transform: translateY(-1px); box-shadow: var(--shadow-pop); }
    .nf-cta .material-symbols-rounded { font-size: 18px; }
  `],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundPageComponent { }