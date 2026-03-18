import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';
import { handleUIAction } from '../src/handlers/ui-handler.js';
import { createArenaState } from '../src/arena-tournament-system.js';

describe('Arena match UI handler regression', () => {
  it('START_ARENA_MATCH normalizes opponent stats for combat', () => {
    const state = {
      phase: 'arena',
      previousPhase: 'exploration',
      player: {
        name: 'Mara',
        level: 1,
        hp: 50,
        maxHp: 50,
        atk: 13,
        def: 11,
        spd: 6,
        inventory: { potion: 1 },
        statusEffects: [],
      },
      arenaState: createArenaState(),
      log: [],
      rngSeed: 12345,
    };

    const next = handleUIAction(state, { type: 'START_ARENA_MATCH' });

    assert.ok(next);
    assert.strictEqual(next.phase, 'player-turn');
    assert.strictEqual(next.isArenaMatch, true);
    assert.ok(next.enemy);
    assert.equal(typeof next.enemy.hp, 'number');
    assert.equal(typeof next.enemy.maxHp, 'number');
    assert.equal(typeof next.enemy.atk, 'number');
    assert.equal(typeof next.enemy.def, 'number');
    assert.equal(typeof next.enemy.spd, 'number');
    assert.ok(Number.isFinite(next.enemy.atk));
    assert.ok(Number.isFinite(next.enemy.def));
    assert.ok(Number.isFinite(next.enemy.spd));
    assert.ok(next.enemy.atk > 0);
    assert.ok(next.enemy.maxHp >= next.enemy.hp);
    assert.equal(next.enemy.displayName, next.enemy.name);
  });
});
