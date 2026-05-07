import {
    animate,
    query,
    stagger,
    style,
    transition,
    trigger,
} from '@angular/animations';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import type { Structure } from '../data/types';

import { CalloutComponent } from '../shared/components/callout.component';
import { ChipListComponent } from '../shared/components/chip-list.component';
import { CodeBlockComponent } from '../shared/components/code-block.component'; 
import { ComparisonTableComponent } from '../shared/components/comparison-table.component'; 
import { DiagramComponent } from '../shared/components/diagram.component'; 
import { HeroBlockComponent } from '../shared/components/hero-block.component'; 
import { MetricCardComponent } from '../shared/components/metric-card.component'; 
import { SectionTitleComponent } from '../shared/components/section-title.component'; 

/**
 * Renders ANY of the 34 documentation pages. Receives the `Structure`
 * via input binding from the route resolver (see app.routes.ts).
 *
 * Stagger animation:
 *   On entry, each top-level section fades up with a 60ms delay between
 *   siblings. Total entrance time is bounded so the page never feels slow
 *   even on a 12-section structure.
 */
@Component({
    selector: 'app-structure-page',
    standalone: true,
    imports: [
        HeroBlockComponent,
        MetricCardComponent,
        CalloutComponent,
        DiagramComponent,
        CodeBlockComponent,
        ComparisonTableComponent,
        ChipListComponent,
        SectionTitleComponent,
    ],
    templateUrl: './structure-page.html',
    styleUrl: './structure-page.scss',
    animations: [
        trigger('staggerIn', [
            transition(':enter', [
                query('.stagger', [
                    style({ opacity: 0, transform: 'translateY(12px)' }),
                    stagger(60, [
                        animate(
                            '320ms cubic-bezier(0.16, 1.0, 0.3, 1.0)',
                            style({ opacity: 1, transform: 'translateY(0)' }),
                        ),
                    ]),
                ], { optional: true }),
            ]),
        ]),
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StructurePageComponent {
    /**
     * Bound by the router via `withComponentInputBinding()`. The route's
     * resolver produces the `Structure` and passes it as a route data field
     * named `structure`; same-name input binding picks it up.
     */
    readonly structure = input.required<Structure>();
}