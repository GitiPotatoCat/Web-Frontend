// =============================================================================
// Lightweight C# syntax highlighter
// =============================================================================
// Tokenises a chunk of C# source into an array of { text, kind } objects.
// Designed to be SMALL, not exhaustive — we only need to colour:
//   • keywords (var, new, foreach, if, etc.)
//   • types (PascalCase identifiers — heuristic)
//   • strings ("...", $"...", @"..." — single-line only)
//   • comments (// ... — single-line only)
//   • numbers
//   • punctuation (everything else stays as 'plain')
//
// Multiline strings, raw string literals, interpolation expressions, and
// preprocessor directives are intentionally NOT tokenised — they'd nearly
// double the code size and we control all our examples, so we just don't
// use them. If a future example needs them, extend this — don't reach for
// a 50KB syntax library.
// =============================================================================

export type TokenKind =
    | 'plain'
    | 'keyword'
    | 'type'
    | 'string'
    | 'comment'
    | 'number'
    | 'method'
    | 'punct';

export interface Token {
    readonly kind: TokenKind;
    readonly text: string;
}

// Closed set of C# 14 keywords we actually use in examples. Keep this list
// alphabetised for grep-ability.
const KEYWORDS = new Set([
    'as', 'async', 'await', 'bool', 'break', 'case', 'catch', 'char', 'class',
    'const', 'continue', 'default', 'do', 'double', 'else', 'enum', 'false',
    'finally', 'float', 'for', 'foreach', 'get', 'if', 'in', 'int', 'interface',
    'internal', 'is', 'lock', 'long', 'namespace', 'new', 'null', 'object',
    'out', 'override', 'params', 'private', 'protected', 'public', 'readonly',
    'record', 'ref', 'return', 'sealed', 'set', 'short', 'static', 'string',
    'struct', 'switch', 'this', 'throw', 'true', 'try', 'typeof', 'using',
    'var', 'virtual', 'void', 'while', 'with', 'yield',
]);

/**
 * Tokenise a string of C# source. Returns a flat array of tokens that
 * preserves all characters from the input concatenated in order.
 */
export function highlightCsharp(source: string): ReadonlyArray<Token> {
    const tokens: Token[] = [];
    const len = source.length;
    let i = 0;

    while (i < len) {
        const c = source[i]!;

        // ---- Comment: // to end of line ------------------------------------
        if (c === '/' && source[i + 1] === '/') {
            const start = i;
            while (i < len && source[i] !== '\n') i++;
            tokens.push({ kind: 'comment', text: source.slice(start, i) });
            continue;
        }

        // ---- String: "...", $"...", @"..." ---------------------------------
        if (c === '"' || (c === '$' && source[i + 1] === '"') || (c === '@' && source[i + 1] === '"')) {
            const start = i;
            if (c === '$' || c === '@') i++;
            i++;                                    // consume opening "
            while (i < len && source[i] !== '"') {
                if (source[i] === '\\' && i + 1 < len) i++;  // skip escaped char
                i++;
            }
            i++;                                    // consume closing "
            tokens.push({ kind: 'string', text: source.slice(start, i) });
            continue;
        }

        // ---- Number: digits with optional decimal --------------------------
        if (/[0-9]/.test(c)) {
            const start = i;
            while (i < len && /[0-9_.]/.test(source[i]!)) i++;
            tokens.push({ kind: 'number', text: source.slice(start, i) });
            continue;
        }

        // ---- Identifier / keyword / type / method --------------------------
        if (/[A-Za-z_]/.test(c)) {
            const start = i;
            while (i < len && /[A-Za-z0-9_]/.test(source[i]!)) i++;
            const word = source.slice(start, i);

            let kind: TokenKind;
            if (KEYWORDS.has(word)) kind = 'keyword';
            else if (/^[A-Z]/.test(word)) kind = 'type';
            else if (source[i] === '(') kind = 'method';
            else kind = 'plain';

            tokens.push({ kind, text: word });
            continue;
        }

        // ---- Punctuation / whitespace --------------------------------------
        // Coalesce runs of non-identifier chars into a single punct token to
        // keep the rendered DOM small.
        const start = i;
        while (i < len) {
            const ch = source[i]!;
            if (/[A-Za-z0-9_"@$/]/.test(ch)) break;
            if (ch === '/' && source[i + 1] === '/') break;
            i++;
        }
        tokens.push({ kind: 'punct', text: source.slice(start, i) });
    }

    return tokens;
}