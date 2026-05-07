import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ThemeService } from './core/theme.service';

import { ChildrenOutletContexts, RouterOutlet } from '@angular/router';

import { AppHeaderComponent } from './layout/app-header';
import { AppSidenavComponent } from './layout/app-sidenav';
import { AppFooterComponent } from './layout/app-footer';
import { CommandPaletteComponent } from './layout/command-palette.component';

import { MobileDrawerService } from './core/mobile-drawer.service';

import { routeTransitionAnimation } from './shared/animations/route-transitions';



/**
 * The application shell. It wires together:
 *
 *   <app-header>   sticky glass header at the top
 *   <app-sidenav>  floating dock on the left
 *   <main>         the route outlet, where pages render with a fade-up
 *   <app-footer>   the editorial endmark
 *
 * The route-transition animation is bound via [@routeTransition] on the
 * outlet's host. We pull the current route's animation key from the
 * activatedRouteData so each route gets a stable identity for the trigger.
 */


/**
 * The root component for step 1 is a deliberate sanity check, not a
 * layout — we just want to confirm: tokens load, fonts load, dark mode
 * flips, and the brand wordmark renders. Real layout chrome is step 2.
 */
@Component({
    selector: 'app-ds-root',
    standalone: true, 
    imports: [
        RouterOutlet, 
        AppHeaderComponent, 
        AppSidenavComponent, 
        AppFooterComponent, 
        CommandPaletteComponent,  
    ], 
    templateUrl: './app.html',
    styleUrl: './app.scss', 
    animations: [routeTransitionAnimation], 
    changeDetection: ChangeDetectionStrategy.OnPush, 
})
export class App { 
    protected readonly drawer = inject(MobileDrawerService); 
    
    protected readonly theme = inject(ThemeService);

    cycleTheme(): void {
        this.theme.cycle();
    } 


    constructor(private readonly contexts: ChildrenOutletContexts) { } 

    protected getRouteAnimationKey(): string | null 
    {
        return (
            this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'] 
                ?? 
                null
        );
    }
}