import {
    animate,
    query,
    stagger,
    style,
    transition,
    trigger,
} from '@angular/animations';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import type { Structure } from '../data/types';

import { CalloutComponent } from '../shared/components/callout.component';
import { ChipListComponent } from '../shared/components/chip-list.component';
import { CodeBlockComponent } from '../shared/components/code-block.component';
import { ComparisonTableComponent } from '../shared/components/comparison-table.component';
import { DiagramComponent } from '../shared/components/diagram.component';
import { HeroBlockComponent } from '../shared/components/hero-block.component';
import { MetricCardComponent } from '../shared/components/metric-card.component';
import {
    PageTocComponent,
    type TocEntry,
} from '../shared/components/page-toc';
import { SectionTitleComponent } from '../shared/components/section-title.component';

/**
 * Renders ANY of the 34 documentation pages and exposes a right-rail
 * table-of-contents driven by which optional sections the data file
 * actually populated.
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
        PageTocComponent,
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
    readonly structure = input.required<Structure>();

    /**
     * Builds the TOC entries based on which sections are populated in the
     * current structure. Computed so it recomputes on route navigation
     * (when the input identity changes).
     *
     * Hero is intentionally excluded — TOC entries should be navigational,
     * and clicking "Hero" to scroll to the top of a page already-visible-
     * at-top is a useless interaction. We start at the metrics row instead.
     */
    protected readonly toc = computed<ReadonlyArray<TocEntry>>(() => {
        const s = this.structure();
        const entries: TocEntry[] = [
            { id: 'metrics', label: 'Complexity', eyebrow: 'Cards' },
            { id: 'when-to-use', label: 'When to use', eyebrow: 'Decision' },
        ];
        if (s.callout) entries.push({ id: 'callout', label: this.calloutLabel(s.callout.variant) });
        if (s.diagram) entries.push({ id: 'diagram', label: 'How it works' });
        entries.push({ id: 'examples', label: 'Example' });
        if (s.properties.length) entries.push({ id: 'properties', label: 'Properties' });
        entries.push({ id: 'methods', label: 'Methods' });
        if (s.comparison) entries.push({ id: 'comparison', label: 'vs alternatives' });
        if (s.related.length) entries.push({ id: 'related', label: 'Related' });
        return entries;
    });

    private calloutLabel(v: 'warn' | 'highlight' | 'note'): string {
        switch (v) {
            case 'warn': return 'Watch out';
            case 'highlight': return 'Notable strength';
            case 'note': return 'Design note';
        }
    }
}