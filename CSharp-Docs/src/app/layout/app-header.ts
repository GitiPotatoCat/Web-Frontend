import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CommandPaletteService } from '../core/command-palette.service';
import { MobileDrawerService } from '../core/mobile-drawer.service';
import { ThemeService } from '../core/theme.service';

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
    protected readonly palette = inject(CommandPaletteService);
    protected readonly drawer = inject(MobileDrawerService);

    protected themeIcon(): string {
        switch (this.theme.resolved()) {
            case 'dark': return 'dark_mode';
            case 'light': return 'light_mode';
        }
    }

    protected get isMac(): boolean {
        return typeof navigator !== 'undefined' &&
            /Mac|iPhone|iPad/.test(navigator.platform);
    }

    cycleTheme(): void { this.theme.cycle(); }
    openCommandPalette(): void { this.palette.open(); }
    toggleDrawer(): void { this.drawer.toggle(); }
}