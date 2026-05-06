import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Editorial footer. The signature row ports the design from the static-
 * site footer: a serif italic line on the left, a fleuron in the middle,
 * author + copyright on the right. The header is a thin gradient hairline
 * with a centred eyebrow label — mirrors the chapter-end metaphor we used
 * before, in our new aesthetic.
 *
 * The current year is computed once at construction; that's fine for a
 * client-rendered SPA — it'll always reflect the user's clock.
 */
@Component({
    selector: 'app-footer',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './app-footer.html',
    styleUrl: './app-footer.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppFooterComponent {
    protected readonly year = new Date().getFullYear();

    protected readonly authorName = 'S Majumder';
    protected readonly authorUrl = 'https://github.com/smajumder';
}