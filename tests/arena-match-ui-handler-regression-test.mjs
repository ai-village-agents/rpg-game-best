import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';
import { handleUIAction } from '../src/handlers/ui-handler.js';
import { createArenaState } from '../src/arena-tournament-system.js';
import { battleLog } from '../src/battle-log.js';

describe('Arena match UI handler regression', () => {
  it('START_ARENA_MATCH resets carryover combo and dedicated battle-log state', () => {
    battleLog.clear();
    battleLog.currentTurn = 4;
    battleLog.addEntry('attack', 'Old fight attack.', { damage: 23, source: 'player' });

    const state = {
      phase: 'arena',
      previousPhase: 'exploration',
      player: {
        name: 'Mara',
        level: 1,
        hp: 43,
        maxHp: 50,
        atk: 13,
        def: 11,
        spd: 6,
        inventory: { potion: 4 },
        statusEffects: [],
      },
      comboState: {
        hitCount: 1,
        lastHitTurn: 1,
        isActive: true,
        chainMultiplier: 1.1,
        highestCombo: 1,
        totalComboDamage: 23,
        comboStreak: 1,
      },
      arenaState: createArenaState(),
      log: [],
      rngSeed: 12345,
    };

    const next = handleUIAction(state, { type: 'START_ARENA_MATCH' });

    assert.ok(next);
    assert.equal(next.comboState?.hitCount, 0);
    assert.equal(next.comboState?.isActive, false);
    assert.equal(next.comboState?.chainMultiplier, 1.0);
    assert.equal(battleLog.currentTurn, 1);
    assert.equal(battleLog.entries.length, 1);
    assert.equal(battleLog.entries[0].type, 'turn-start');
    assert.match(battleLog.entries[0].message, /Player's turn begins \(Turn 1\)\./);

    battleLog.clear();
  });

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
