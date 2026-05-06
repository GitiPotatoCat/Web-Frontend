import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../core/theme.service';

/**
 * Top-level glass header. Three zones:
 *
 *   • Brand — clickable wordmark linking home.
 *   • Search trigger — a fake button that opens the command palette
 *     (wired up in step 5). Right now it just visually exists.
 *   • Actions — theme cycler, plus a help affordance kept disabled for now.
 *
 * The header is `position: sticky` and `top: 0` so it never leaves the
 * viewport. Glass styling comes from the global .glass mixin via the
 * `glass-strong` utility class.
 */
@Component({
    selector: 'app-header',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './app-header.html',
    styleUrl: './app-header.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppHeaderComponent {
    protected readonly theme = inject(ThemeService);

    /** Returns the icon name for the current theme — used in the toggle. */
    protected themeIcon(): string {
        switch (this.theme.resolved()) {
            case 'dark': return 'dark_mode';
            case 'light': return 'light_mode';
        }
    }

    /** Mac users see ⌘K, everyone else sees Ctrl K. Pure cosmetic detail. */
    protected get isMac(): boolean {
        return typeof navigator !== 'undefined' &&
            /Mac|iPhone|iPad/.test(navigator.platform);
    }

    cycleTheme(): void { this.theme.cycle(); }

    /** Stub for step 5. Logs a hint so the trigger feels alive in step 2. */
    openCommandPalette(): void {
        console.info('[Forte] Command palette arrives in step 5.');
    }
}