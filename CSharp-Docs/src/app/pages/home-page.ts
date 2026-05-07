import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NAMESPACES } from '../data/namespaces';
import { listStructuresIn } from '../data/structures';

/**
 * The home page. Visual peak is the gradient hero — a Fraunces italic
 * headline and a one-paragraph mission statement. Below it, a five-tile
 * namespace deck. Clicking a tile takes the user to that namespace's
 * landing (built later) — for step 4 we just route to the first authored
 * structure in that namespace as a placeholder behaviour.
 */
@Component({
    selector: 'app-home-page',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './home-page.html',
    styleUrl: './home-page.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {
    protected readonly namespaces = NAMESPACES.map(n => ({
        ...n,
        count: listStructuresIn(n.id).length,
        /** First authored structure in this namespace; falls back to home. */
        firstSlug: listStructuresIn(n.id)[0]?.slug,
    }));
}