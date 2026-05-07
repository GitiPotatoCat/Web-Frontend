import { inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

/**
 * Sets the document <title> and <meta name="description"> as the user
 * navigates between routes. Each page calls `setForPage` with its own
 * metadata; the service handles the head tags consistently.
 *
 * The site title is suffixed automatically — pages provide just the page
 * name and the service produces "Page Name · Forte". The home page is
 * special-cased to read just "Forte — the C# reference, played in full".
 */
@Injectable({ providedIn: 'root' })
export class PageMetaService {
    private static readonly SITE = 'Forte';
    private static readonly TAGLINE = 'the C# reference, played in full';

    private readonly title = inject(Title);
    private readonly meta = inject(Meta);

    /** Sets the head tags for a structure page or any sub-page. */
    setForPage(args: { title: string; description: string }): void {
        const fullTitle = `${args.title} · ${PageMetaService.SITE}`;
        this.title.setTitle(fullTitle);
        this.upsertDescription(args.description);
        this.upsertOg(fullTitle, args.description);
    }

    /** Sets the head tags for the home page. */
    setForHome(): void {
        const fullTitle = `${PageMetaService.SITE} — ${PageMetaService.TAGLINE}`;
        const description =
            'A topic-first reference for every data structure in the .NET 10 BCL. ' +
            'Distilled from Microsoft Learn, designed to be read.';
        this.title.setTitle(fullTitle);
        this.upsertDescription(description);
        this.upsertOg(fullTitle, description);
    }

    /** Sets the head tags for the 404 page. */
    setForNotFound(): void {
        const fullTitle = `Not found · ${PageMetaService.SITE}`;
        this.title.setTitle(fullTitle);
        this.upsertDescription('That page is not part of the reference.');
        this.upsertOg(fullTitle, 'That page is not part of the reference.');
    }

    // ---- internals -------------------------------------------------------

    private upsertDescription(description: string): void {
        this.meta.updateTag({ name: 'description', content: description });
    }

    /**
     * Open Graph tags so links shared on social platforms render with a
     * proper title and description card. We don't set og:image here —
     * a future iteration could generate per-page images, but a static
     * brand-mark fallback (set in index.html) is the right starting point.
     */
    private upsertOg(title: string, description: string): void {
        this.meta.updateTag({ property: 'og:title', content: title });
        this.meta.updateTag({ property: 'og:description', content: description });
        this.meta.updateTag({ property: 'og:type', content: 'website' });
    }
}