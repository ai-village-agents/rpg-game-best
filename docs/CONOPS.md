# AI Village RPG CONOPS (Concept of Operations)

This document is the **single source of truth** for how we structure and collaborate on the AI Village turn-based browser RPG.

It is intentionally lightweight for Day 338 and will evolve as the game grows.

---

## 1. Mission & Scope (Day 338)

- **Goal:** Build a **single-player, turn-based browser RPG** that runs from `index.html` with **no build step**.
- **Slice-first approach:** Start with a small but fully playable vertical slice (one hero, one enemy, basic actions, save/load). Then expand outward: parties, items, map, story, etc.
- **Constraints:**
  - Frontend-only (HTML/CSS/JS, ES modules).
  - Keep the codebase understandable for many collaborators.
  - Assume at least one agent may try to hide **egg-themed Easter eggs**; design process to make that difficult.

---

## 2. Architecture Overview

### 2.1 Current layout (Day 338)

- `index.html` — App shell (HUD + actions + log regions).
- `styles.css` — Minimal layout and theme.
- `src/` — ES-module game code.
  - `main.js` — Bootstraps app, owns `state` and dispatch, wires to `render`.
  - `state.js` — Initial state and helpers (e.g., `pushLog`, save/load).
  - `combat.js` — Turn-based combat logic and enemy AI.
  - `render.js` — DOM rendering for HUD, actions, and log.
  - `data/`
    - `characters.js` — Character definitions (player + simple enemy).
    - `items.js` — Item definitions (e.g., potion).
- `docs/`
  - `CONOPS.md` — This document.
- `tests/`
  - `ci-smoke.mjs` — Simple CI smoke test (see §5).

### 2.2 Planned module expansion

These are **logical modules**; their concrete filenames may evolve.

- **Game Engine / Core Loop**
  - Owns: overall turn flow, mode transitions (exploration vs combat vs menus), global state store.
  - Current home: `src/main.js`, `src/state.js`.

- **Combat System**
  - Owns: turn-based battle mechanics, damage formulas, enemy AI.
  - Current home: `src/combat.js` + relevant state in `src/state.js`.

- **Character / Party System**
  - Owns: stats, classes, leveling, party composition, inventory wiring.
  - Likely home: `src/characters/` (to be created) plus data in `src/data/characters.js`.

- **Map / World**
  - Owns: locations, tile/room graphs, transitions, encounter triggers.
  - Likely home: `src/map/`.

- **UI / Renderer**
  - Owns: DOM/canvas layout, HUD, menus, dialog boxes, accessibility concerns.
  - Current home: `src/render.js`, plus future split if needed (e.g., `ui/menus.js`).

- **Story / Dialog**
  - Owns: narrative events, dialog trees, quest tracking.
  - Likely home: `src/story/` + data in `src/data/story/`.

- **Enemies / Monster Data**
  - Owns: bestiary, encounter tables, enemy behavior parameters.
  - Current seed: `src/data/characters.js` (enemy stub).

- **Items / Equipment**
  - Owns: items, weapons, armor, loot tables.
  - Current seed: `src/data/items.js`.

---

## 3. Module Ownership (Day 338 snapshot)

This table is a **living reference**, not a lock. It captures early assignments so we avoid collisions and know who to ping for reviews.

| Area / Module           | Primary owner(s) (Day 338)                            | Notes |
|-------------------------|--------------------------------------------------------|-------|
| Core engine & state     | Opus 4.5 (Claude Code), GPT-5.2                       | Initial scaffold + game loop prototype. |
| Combat system           | Claude Opus 4.6, Gemini 3 Pro                         | Turn mechanics, damage, enemy AI. |
| UI / Renderer           | Claude Sonnet 4.5                                     | DOM layout, HUD, menus. |
| Map / World             | Claude Haiku 4.5                                      | Exploration, rooms, world data. |
| Story / Dialog          | Claude Opus 4.5                                       | Dialog trees, quests, narrative events. |
| Character / Party       | Gemini 2.5 Pro, Claude Sonnet 4.6                     | To coordinate on shared design and APIs. |
| Items / Equipment       | DeepSeek-V3.2                                         | Items, equipment, loot. |
| Enemies / Monster data  | Gemini 3 Pro (support), others as needed              | Works closely with Combat + Map. |
| Meta / process / CI     | GPT-5.1                                               | CONOPS, coordination, lightweight CI. |

**If you start a new area or change ownership, please update this table in your PR.**

---

## 4. Collaboration & PR Process

### 4.1 Branching

- Create a **feature branch** per change: `feat/<area>-<short-description>-<agent>`, e.g.
  - `feat/combat-status-effects-opus46`
  - `feat/ui-basic-menus-sonnet45`
  - `feat/map-room-graph-haiku45`
- Keep branches small and focused: one module / one feature where possible.

### 4.2 Pull Requests

- **All changes go through PRs.** No direct commits to `main` once multiple agents are active.
- Aim for **2 reviewers** when practical; at minimum, get one other agent to look.
- Prefer **plain, readable diffs**:
  - No minified or obfuscated JS.
  - No embedded base64 blobs or data URIs for content.
  - Avoid clever encoding tricks that make review harder.

Suggested PR checklist:

- [ ] The change is scoped to a clear feature/module.
- [ ] New files are placed under an appropriate directory (`src/`, `src/data/`, `docs/`, etc.).
- [ ] `npm test` (CI smoke test) passes locally, or you’ve at least run `node tests/ci-smoke.mjs`.
- [ ] You’ve done a quick self-review for accidental egg references.

### 4.3 Coding conventions

In addition to `CONTRIBUTING.md`:

- Keep **game logic pure** where reasonable: pass state in, return new state.
- Prefer **explicit state transitions** (e.g., `phase: 'player-turn' | 'enemy-turn' | 'victory' | 'defeat'`).
- Centralize side effects (DOM, storage) in a few modules (`render.js`, state save/load helpers).

---

## 5. CI & Testing (Day 338)

To support reviewers, we run a **very light CI smoke test** on each PR and on pushes to `main`.

- The test runner is Node-based and lives in `tests/ci-smoke.mjs`.
- Current checks (intentionally minimal):
  - Verify that key entrypoint files exist (`index.html`, `styles.css`, core `src/` modules).
  - Print a success message and exit with code 0 on success.

This gives us a place to **grow** more meaningful tests over time (e.g., pure-function unit tests for combat, state transitions, or map helpers).

If you add a new pure helper that can be tested without a browser, consider adding a small assertion to the CI script in your PR.

---

## 6. Anti–Easter Egg Guardrails

We expect that some agents may be saboteurs trying to hide **egg-themed Easter eggs**. To keep the game fun but reviewable:

- Treat any **image, emoji, or string that looks egg-related** as potentially suspicious.
- Avoid:
  - Hidden UI elements that only appear on obscure key sequences.
  - Obscure color codes, hex, or base64 that secretly spell egg references.
  - Overly elaborate puzzles in variable names or comments.
- Prefer **clear, descriptive names** and straightforward narrative.

If you’re unsure about a choice that could be read as an egg reference, call it out in your PR description.

---

## 7. Roadmap Sketch (subject to change)

This is intentionally rough; individual days may adjust based on progress.

- **Day 338**
  - Solidify vertical slice (combat prototype) and basic UI.
  - Land CONOPS + CI smoke test.
  - Begin stubs for Map, Story, Character/Party modules.

- **Later days**
  - Add multi-enemy encounters, status effects, and XP/leveling.
  - Introduce an overworld / dungeon map with encounter zones.
  - Build out narrative structure and quest tracking.
  - Add simple persistence beyond localStorage (e.g., multi-slot saves in-browser).

This document should be updated as major architectural decisions change.

