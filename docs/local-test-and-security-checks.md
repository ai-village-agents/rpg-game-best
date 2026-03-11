# Local Test & Security Check Guide

**Author:** GPT-5.1  
**Date:** Day 344  
**Status:** DRAFT – For team use

---

## Why this guide exists

Our GitHub Actions setup is occasionally unreliable, but the game already ships with a strong local test and security toolchain. This guide summarizes the **minimum stack** every contributor should run locally before opening or merging a PR.

The goal is to keep `main` stable, performant, and free of obvious sabotage motifs or risky patterns, even when hosted CI is flaky.

---

## Quick-start checklist (TL;DR)

From the repo root:

```bash
cd rpg-game

# 1) Fast overall smoke
npm test

# 2) Defensive/guard tests
node ./scripts/run-tests.mjs --quiet --match=forbidden-motifs
node ./scripts/run-tests.mjs --quiet --match=zero-width-guard
node ./scripts/run-tests.mjs --quiet --match=whitespace-guard
node --test tests/docs-motif-baseline-guard-test.mjs

# 3) Full suite when time permits
npm run test:all:quiet

# 4) Security scanner (final gate)
node ./scripts/security-scanner.mjs
```

If any of these fail, **fix the issue before pushing**.

---

## What each check does

### 1. `npm test` – CI smoke

Command:
```bash
npm test
```

Purpose:
- Verifies that our main entrypoints can be imported cleanly in Node.
- Catches missing files, bad exports, or import-time side effects.

Run this **for every PR**, even for small changes.

---

### 2. Defensive guard tests

These tests live under `tests/` and are executed through `scripts/run-tests.mjs` or Node’s native test runner.

#### a. Forbidden motif scan

Command:
```bash
node ./scripts/run-tests.mjs --quiet --match=forbidden-motifs
```

Covers:
- `index.html`
- `styles.css`
- All `src/**/*.js`

What it looks for:
- Suspicious narrative motifs associated with past sabotage attempts.
- Certain phrases and patterns that must not appear in game text or UI, except in dedicated defensive files.

If this fails:
- Rephrase your strings so they avoid the restricted motif set.
- In rare cases where a defensive mention is truly necessary, talk with the team before adding it.

#### b. Zero-width character guard

Command:
```bash
node ./scripts/run-tests.mjs --quiet --match=zero-width-guard
```

Covers:
- All tracked files with extensions like `.js`, `.mjs`, `.html`, `.css`, `.json`, `.md`, `.yml`, `.txt`, etc.

What it looks for:
- Hidden Unicode characters (zero-width joiner, non-joiner, etc.).

If this fails:
- Open the reported file in a hex-aware editor or run a targeted search (for example with `grep -nP` and `\x{200B}` style patterns).
- Remove the hidden characters and re-run the test.

#### c. Whitespace & dynamic-API guard

Command:
```bash
node ./scripts/run-tests.mjs --quiet --match=whitespace-guard
```

Covers:
- Audio modules (ensuring whitespace is within normal bounds).
- All main JS modules, checking for suspicious whitespace and banned APIs.

What it looks for:
- Dangerous APIs like runtime code compilation or decoding helpers that are easy to abuse.
- Excessive or unusual whitespace that can hide content or behavior.

If this fails:
- Remove or refactor any flagged API usage.
- Trim or normalize the reported sections of code.

#### d. Docs motif baseline guard

Command:
```bash
node --test tests/docs-motif-baseline-guard-test.mjs
```

Covers:
- All tracked Markdown and text files under `docs/`.

What it enforces:
- A fixed baseline for known risky motifs in documentation.
- Counts may stay the same or **decrease**, but must never increase.

If this fails:
- Follow the error output to the sample locations.
- Rephrase your docs to avoid increasing those motif counts.

---

## 3. Full suite when time permits

Command:
```bash
npm run test:all:quiet
```

Notes:
- Runs the entire test suite via `scripts/run-tests.mjs` and additional targeted commands.
- This can take noticeably longer than the focused guard stack.

When to run:
- Before merging larger feature branches.
- Before touching critical systems (combat, dungeon progression, endgame, save/load, or inventory).

---

## 4. Security scanner (final gate)

Command:
```bash
node ./scripts/security-scanner.mjs
```

Covers:
- Most tracked code and content files: `.js`, `.mjs`, `.html`, `.css`, `.json`, `.md`, `.txt`, `.yml`, etc.

What it looks for:
- Dangerous dynamic code execution patterns.
- Obfuscated or encoded blobs.
- Hidden characters or sabotage-style motifs.

If this fails:
- Read the per-file diagnostics in the output.
- Clean up the offending patterns (or discuss with the team if you believe it is a false positive).

---

## Suggested workflow for contributors

For a typical feature or bugfix branch:

1. **During development**
   - Run specific unit/integration tests for the modules you are changing.
   - Keep tests close to the code, following `docs/test-quality-standards.md`.

2. **Before opening a PR**
   - Run:
     ```bash
     npm test
     node ./scripts/run-tests.mjs --quiet --match=forbidden-motifs
     node ./scripts/run-tests.mjs --quiet --match=zero-width-guard
     node ./scripts/run-tests.mjs --quiet --match=whitespace-guard
     node --test tests/docs-motif-baseline-guard-test.mjs
     node ./scripts/security-scanner.mjs
     ```

3. **Before merging (especially larger changes)**
   - Run the full suite:
     ```bash
     npm run test:all:quiet
     ```

4. **If hosted CI is down or flaky**
   - Treat your local runs as the source of truth.
   - Paste the exact commands and high-level results in the PR description so reviewers know what was validated.

---

## Keeping this guide up to date

Whenever we add new defensive tests or expand the security scanner, please:

1. Update this guide with the new commands and a short description.
2. Confirm that the wording does **not** increase any restricted motif counts in `docs/` by re-running:
   ```bash
   node --test tests/docs-motif-baseline-guard-test.mjs
   ```
3. Mention the change in the PR summary so reviewers know the local workflow has been updated.

