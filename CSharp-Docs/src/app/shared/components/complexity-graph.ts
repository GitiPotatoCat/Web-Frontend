import {
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
} from '@angular/core';
import type { Complexity } from '../../data/types';

/** Five base shapes the renderer knows how to draw. */
type Shape = 'flat' | 'log' | 'linear' | 'nlogn' | 'quadratic';

/**
 * Tiny inline SVG sparkline that depicts the SHAPE of a complexity class.
 * Renders inside metric cards next to the algebraic notation, giving
 * readers a second, visual channel for the cost.
 *
 * The curve is computed on the fly from a closed set of 5 shapes. Each of
 * the eight Complexity unions maps to one of the shapes — variants like
 * "O(1) amortized" or "O(n) worst-case" reuse their base shape because
 * the asymptotic VISUAL is what matters, not the qualifier.
 *
 * The path is animated in via stroke-dasharray on first paint — the line
 * appears to draw itself in 600ms.
 */
@Component({
    selector: 'forte-complexity-graph',
    standalone: true,
    templateUrl: './complexity-graph.html',
    styleUrl: './complexity-graph.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComplexityGraphComponent {
    readonly complexity = input.required<Complexity>();

    /** The base shape we'll draw — derived from the complexity input. */
    protected readonly shape = computed<Shape>(() => mapToShape(this.complexity()));

    /** SVG path data — recomputed only when the shape actually changes. */
    protected readonly path = computed<string>(() => buildPath(this.shape()));

    /** Approximate path length, used so the dasharray covers the full draw. */
    protected readonly pathLength = computed<number>(() =>
        estimatePathLength(this.shape()),
    );
}

// ---- Shape derivation ------------------------------------------------------

function mapToShape(c: Complexity): Shape {
    switch (c) {
        case 'O(1)':
        case 'O(1) amortized': return 'flat';
        case 'O(log n)':
        case 'O(log n) amortized': return 'log';
        case 'O(k)':
        case 'O(n)':
        case 'O(n) worst-case': return 'linear';
        case 'O(n log n)': return 'nlogn';
        case 'O(n²)': return 'quadratic';
    }
}

// ---- Curve sampling --------------------------------------------------------

const W = 100;          // viewBox width
const H = 40;           // viewBox height
const PAD_TOP = 4;      // top padding so the curve doesn't clip

/**
 * Sample 32 (x, y) points along the curve and emit an SVG path string.
 * y is mapped from the curve's range to [PAD_TOP, H] inverted (SVG y grows
 * downward, but we want growth to feel "upward").
 */
function buildPath(shape: Shape): string {
    const SAMPLES = 32;
    const points: Array<[number, number]> = [];
    for (let i = 0; i < SAMPLES; i++) {
        const t = i / (SAMPLES - 1);                      // 0..1
        const x = t * W;
        const yNormalized = curveValue(shape, t);         // 0..1
        const y = H - PAD_TOP - yNormalized * (H - PAD_TOP - 2);
        points.push([x, y]);
    }
    // SVG path: M then L L L ...
    return points
        .map(([x, y], i) => (i === 0 ? `M ${x.toFixed(2)} ${y.toFixed(2)}` : `L ${x.toFixed(2)} ${y.toFixed(2)}`))
        .join(' ');
}

/** Returns curve y in [0, 1] for input t in [0, 1]. */
function curveValue(shape: Shape, t: number): number {
    switch (shape) {
        case 'flat': return 0.08;                              // small constant
        case 'log': return 0.1 + Math.log(1 + t * 9) / Math.log(10) * 0.65;
        case 'linear': return 0.05 + t * 0.85;
        case 'nlogn': return 0.05 + t * (0.4 + Math.log(1 + t * 9) / Math.log(10) * 0.55);
        case 'quadratic': return 0.05 + t * t * 0.95;
    }
}

/**
 * A loose upper bound on the path's actual length, used as the
 * stroke-dasharray. We don't need it exact — anything ≥ true length will
 * make the draw-on-entry animation work.
 */
function estimatePathLength(shape: Shape): number {
    switch (shape) {
        case 'flat': return 105;
        case 'log': return 115;
        case 'linear': return 125;
        case 'nlogn': return 130;
        case 'quadratic': return 145;
    }
}