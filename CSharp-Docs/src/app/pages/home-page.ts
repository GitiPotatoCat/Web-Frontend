import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NAMESPACES } from '../data/namespaces';
import { listStructuresIn } from '../data/structures';
import { PageMetaService } from '../core/page-meta.service';

@Component({
    selector: 'app-home-page',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './home-page.html',
    styleUrl: './home-page.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {
    private readonly pageMeta = inject(PageMetaService);

    protected readonly namespaces = NAMESPACES.map(n => ({
        ...n,
        count: listStructuresIn(n.id).length,
        firstSlug: listStructuresIn(n.id)[0]?.slug,
    }));

    constructor() {
        this.pageMeta.setForHome();
    }
}