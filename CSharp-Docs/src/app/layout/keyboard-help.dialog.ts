import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

interface ShortcutGroup {
    readonly label: string;
    readonly entries: ReadonlyArray<{
        readonly keys: ReadonlyArray<string>;
        readonly description: string;
    }>;
}

@Component({
    selector: 'forte-keyboard-help',
    standalone: true,
    imports: [MatDialogModule],
    templateUrl: './keyboard-help.dialog.html',
    styleUrl: './keyboard-help.dialog.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KeyboardHelpDialog {
    protected readonly dialogRef = inject(MatDialogRef<KeyboardHelpDialog>);

    protected get isMac(): boolean {
        return typeof navigator !== 'undefined' &&
            /Mac|iPhone|iPad/.test(navigator.platform);
    }

    protected readonly groups: ReadonlyArray<ShortcutGroup> = [
        {
            label: 'Navigation',
            entries: [
                { keys: [this.isMac ? '⌘' : 'Ctrl', 'K'], description: 'Open the command palette' },
                { keys: ['/'], description: 'Focus the command palette' },
                { keys: ['↑', '↓'], description: 'Move between results / TOC entries' },
                { keys: ['↵'], description: 'Open the active result' },
                { keys: ['Esc'], description: 'Close the active overlay' },
            ],
        },
        {
            label: 'On a structure page',
            entries: [
                { keys: ['Tab'], description: 'Move focus through navigation, content, and the TOC' },
                { keys: ['Click'], description: 'Tap a TOC entry to jump to that section' },
            ],
        },
        {
            label: 'Anywhere',
            entries: [
                { keys: [this.isMac ? '⌘' : 'Ctrl', 'K'], description: 'Open Forte from any page' },
                { keys: ['?'], description: 'Open this dialog' },
            ],
        },
    ];

    close(): void { this.dialogRef.close(); }
}