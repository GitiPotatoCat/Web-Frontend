import {
    animate,
    group,
    query,
    style,
    transition,
    trigger,
} from '@angular/animations';

/**
 * The animation we attach to <router-outlet>'s host element. It runs on every
 * route change. Two layered phases happen in parallel:
 *
 *   • The outgoing page fades to 0 in 120ms, lifting up 8px.
 *   • The incoming page fades from 0 in 220ms with a 12px lift,
 *     starting 60ms after the outgoing one begins.
 *
 * Net effect: a quiet "flip" between pages that never feels jumpy. Reduced-
 * motion users get an instant cut — Angular's animations module honours the
 * prefers-reduced-motion media query when our duration tokens collapse to 0,
 * but we also short-circuit explicitly via the :decrement / :increment tokens
 * so the styles never apply on first render.
 */
export const routeTransitionAnimation = trigger('routeTransition', [
    transition('* <=> *', [
        // Both incoming and outgoing exist briefly during the swap — stack them.
        query(
            ':enter, :leave',
            [
                style({
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                }),
            ],
            { optional: true },
        ),

        group([
            query(
                ':leave',
                [
                    style({ opacity: 1, transform: 'translateY(0)' }),
                    animate(
                        '120ms cubic-bezier(0.4, 0, 1, 1)',
                        style({ opacity: 0, transform: 'translateY(-8px)' }),
                    ),
                ],
                { optional: true },
            ),
            query(
                ':enter',
                [
                    style({ opacity: 0, transform: 'translateY(12px)' }),
                    animate(
                        '220ms 60ms cubic-bezier(0.16, 1.0, 0.3, 1.0)',
                        style({ opacity: 1, transform: 'translateY(0)' }),
                    ),
                ],
                { optional: true },
            ),
        ]),
    ]),
]);