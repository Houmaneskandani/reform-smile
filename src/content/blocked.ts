import "server-only";

// Kept apart from rules.ts on purpose: rules.ts is also bundled into the website editor's
// browser JavaScript (through keystatic.config.ts), and these hashes must stay on the server.
// Only validate.ts imports this file; scripts/check-built-html.mjs reads the JSON itself and
// fails the build if a hash ever shows up in the browser JavaScript.

import blockedHashes from "./blocked-hashes.json";

/**
 * SHA-256 hashes (hex) of lowercased words that must never appear anywhere in the site.
 * Only the hashes are stored, so the words are never written in the repository.
 */
export const BLOCKED_WORD_SHA256: readonly string[] = blockedHashes.sha256;
