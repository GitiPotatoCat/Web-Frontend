import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import type { CodeBlock } from '../../data/types';
import { highlightCsharp, type Token } from '../utils/highlight-csharp';

/**
 * Code block with:
 *   • optional caption above (rendered as eyebrow)
 *   • syntax-highlighted source via the C# tokeniser
 *   • copy-to-clipboard button in the top-right that flashes "Copied" briefly
 *   • horizontal scroll on overflow (no wrap — code wrapping is destructive)
 *   • language badge in the corner ("C# 14")
 *
 * The tokens are computed once when `data` changes — for a pure input we
 * just call highlightCsharp() directly inside a getter; OnPush + signals
 * means it only re-runs when the input identity changes.
 */
@Component({
    selector: 'forte-code-block',
    standalone: true,
    template: `
    <figure class="code-block">
      <header class="code-header">
        @if (data().caption) {
          <p class="code-caption eyebrow">{{ data().caption }}</p>
        } @else {
          <span></span>
        }
        <div class="code-meta">
          <span class="code-lang">C# 14</span>
          <button
            type="button"
            class="code-copy"
            (click)="copy()"
            [attr.aria-label]="copied() ? 'Copied to clipboard' : 'Copy code'"
            [title]="copied() ? 'Copied' : 'Copy'">
            <span class="material-symbols-rounded">
              {{ copied() ? 'check' : 'content_copy' }}
            </span>
            <span class="code-copy-label">{{ copied() ? 'Copied' : 'Copy' }}</span>
          </button>
        </div>
      </header>

      <pre class="code-pre"><code class="code-source">@for (t of tokens(); track $index) {<span [class]="'tok-' + t.kind">{{ t.text }}</span>}</code></pre>
    </figure>
  `,
    styles: [`
    :host { display: block; }

    .code-block {
      margin: 0;
      background: var(--bg-code);
      border-radius: var(--r-lg);
      overflow: hidden;
      border: 0.5px solid color-mix(in srgb, var(--bg-code) 80%, var(--border));
    }

    .code-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px var(--space-4) 8px;
      border-bottom: 0.5px solid color-mix(in srgb, white 8%, var(--bg-code));
    }
    .code-caption {
      color: rgba(255, 255, 255, 0.55);
      letter-spacing: 0.10em;
    }

    .code-meta {
      display: inline-flex;
      align-items: center;
      gap: var(--space-3);
    }
    .code-lang {
      font: var(--font-mono-meta);
      color: rgba(255, 255, 255, 0.4);
    }
    .code-copy {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 8px;
      font: var(--font-mono-meta);
      color: rgba(255, 255, 255, 0.6);
      background: rgba(255, 255, 255, 0.06);
      border: 0.5px solid rgba(255, 255, 255, 0.10);
      border-radius: var(--r-sm);
      cursor: pointer;
      transition:
        background var(--dur-fast) var(--ease-standard),
        color var(--dur-fast) var(--ease-standard);
    }
    .code-copy:hover {
      background: rgba(255, 255, 255, 0.12);
      color: rgba(255, 255, 255, 0.9);
    }
    .code-copy .material-symbols-rounded { font-size: 14px; }
    @media (max-width: 480px) { .code-copy-label { display: none; } }

    .code-pre {
      margin: 0;
      padding: var(--space-5) var(--space-6);
      overflow-x: auto;
      white-space: pre;
    }

    .code-source {
      font: var(--font-code);
      line-height: 1.75;
      color: #E0E2F2;
    }

    /* Token colours — tuned for the dark code surface, NOT theme-aware on
       purpose: code reads better against a stable dark backdrop regardless
       of the surrounding page mode. */
    .tok-keyword { color: #C792EA; }
    .tok-type    { color: #82AAFF; }
    .tok-string  { color: #C3E88D; }
    .tok-number  { color: #F78C6C; }
    .tok-comment { color: #6B7393; font-style: italic; }
    .tok-method  { color: #82B1FF; }
    .tok-plain   { color: #E0E2F2; }
    .tok-punct   { color: #89DDFF; opacity: 0.85; }
  `],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeBlockComponent {
    readonly data = input.required<CodeBlock>();
    protected readonly copied = signal(false);

    /** Tokenised source — recomputed when `data` identity changes. */
    protected tokens(): ReadonlyArray<Token> {
        return highlightCsharp(this.data().source);
    }

    protected async copy(): Promise<void> {
        try {
            await navigator.clipboard.writeText(this.data().source);
            this.copied.set(true);
            setTimeout(() => this.copied.set(false), 1500);
        } catch {
            // Clipboard API not available; silently no-op. Could fall back to
            // execCommand('copy') but it's deprecated and fails in iframes too.
        }
    }
}