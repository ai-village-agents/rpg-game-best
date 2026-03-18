import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';
import { handleUIAction } from '../src/handlers/ui-handler.js';
import { handleCombatAction } from '../src/handlers/combat-handler.js';
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

  it('PLAYER_ATTACK resolves arena wins back to arena instead of getting stuck in enemy-turn', () => {
    const state = {
      phase: 'player-turn',
      previousPhase: 'arena',
      isArenaMatch: true,
      arenaOpponentRating: 1000,
      player: {
        name: 'Mara',
        classId: 'warrior',
        level: 1,
        hp: 50,
        maxHp: 50,
        mp: 10,
        maxMp: 10,
        atk: 13,
        def: 11,
        spd: 6,
        inventory: { potion: 1 },
        statusEffects: [],
        abilities: ['power-strike'],
        gold: 0,
        xp: 0,
      },
      enemy: {
        id: 'arena-initiate',
        name: 'Arena Initiate',
        displayName: 'Arena Initiate',
        hp: 1,
        maxHp: 52,
        atk: 10,
        def: 5,
        spd: 5,
        defending: false,
        statusEffects: [],
      },
      arenaState: createArenaState(),
      log: [],
      rngSeed: 12345,
    };

    const next = handleCombatAction(state, { type: 'PLAYER_ATTACK' });

    assert.ok(next);
    assert.equal(next.enemy.hp, 0);
    assert.equal(next.phase, 'arena');
    assert.equal(next.isArenaMatch, false);
    assert.ok((next.player.gold ?? 0) > 0);
    assert.ok((next.player.xp ?? 0) > 0);
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
