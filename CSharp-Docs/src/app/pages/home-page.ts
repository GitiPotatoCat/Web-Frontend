import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Step-2 placeholder. The real home page (hero, namespace decks, featured
 * structures) is built in step 4 once we have the data model. Right now it
 * exists so the router has somewhere to render and we can prove the route
 * transition fires on navigation.
 */
@Component({
    selector: 'app-home-page',
    standalone: true,
    templateUrl: './home-page.html',
    styleUrl: './home-page.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent { }